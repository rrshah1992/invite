import React, { useRef, useEffect } from 'react';

const vsSource = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

// Updated Fragment Shader for a visible, static "Thick Lens" effect
const fsSource = `
  precision highp float;

  uniform vec3 iResolution;     
  uniform sampler2D iChannel0;  
  uniform vec4 u_rect;          
  uniform vec2 u_windowRes;     
  uniform vec2 u_imageRes;      

  void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 localUV = fragCoord / iResolution.xy;

    // Calculate background positioning
    float screenY = u_windowRes.y - u_rect.y - u_rect.w + fragCoord.y;
    vec2 screenCoord = vec2(u_rect.x + fragCoord.x, screenY);

    float scaleX = u_windowRes.x / u_imageRes.x;
    float scaleY = u_windowRes.y / u_imageRes.y;
    float maxScale = max(scaleX, scaleY);

    vec2 scaledImageRes = u_imageRes * maxScale;
    vec2 offset = (scaledImageRes - u_windowRes) / 2.0;
    vec2 globalUV = (screenCoord + offset) / scaledImageRes;

    // --- THICK GLASS LENS MATH ---
    // Find the vector pointing from the center of the button to the current pixel
    vec2 toCenter = localUV - vec2(0.5);
    
    // The further from the center, the stronger the distortion (creates a bevel effect)
    float distSq = dot(toCenter, toCenter); 
    
    // Distortion vector: pushes pixels inward strongly at the edges, zero in the center
    float glassThickness = 0.1; // Increase this to make the refraction even more aggressive
    vec2 glassDistortion = toCenter * distSq * glassThickness;
    vec2 finalUV = globalUV - glassDistortion;

    // --- DYNAMIC CHROMATIC ABERRATION ---
    // Tie the RGB split to the distortion itself. Center is clear, edges have a rainbow split.
    float splitStrength = 0.3;
    float r = texture2D(iChannel0, finalUV - glassDistortion * splitStrength).r;
    float g = texture2D(iChannel0, finalUV).g;
    float b = texture2D(iChannel0, finalUV + glassDistortion * splitStrength).b;
    vec4 color = vec4(r, g, b, 1.0);

    // --- 3D LIGHTING CUES ---
    // Add a bright internal reflection (specular highlight) near the top/edges
    float highlight = smoothstep(0.2, 0.5, localUV.y) * distSq;
    color.rgb += highlight * 0.3;

    // Darken the extreme edges slightly to define the physical boundary of the glass
    float edgeShadow = smoothstep(0.2, 0.3, distSq);
    color.rgb -= edgeShadow * 0.2;

    fragColor = color;
  }

  void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
  }
`;

export default function LiquidButton({ imageSrc, children, onClick }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const gl = canvas.getContext("webgl2", { alpha: false }) || canvas.getContext("webgl", { alpha: false });
    if (!gl) return;

    let animationFrameId;
    let imageNativeSize = [1000, 1000]; 

    const createShader = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const vs = createShader(gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl.FRAGMENT_SHADER, fsSource);
    const program = gl.createProgram();

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uniforms = {
      resolution: gl.getUniformLocation(program, "iResolution"),
      texture: gl.getUniformLocation(program, "iChannel0"),
      rect: gl.getUniformLocation(program, "u_rect"),
      windowRes: gl.getUniformLocation(program, "u_windowRes"),
      imageRes: gl.getUniformLocation(program, "u_imageRes"),
    };

    const texture = gl.createTexture();
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      imageNativeSize = [img.naturalWidth, img.naturalHeight];
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    };
    img.src = imageSrc;
    
    const render = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);

      gl.uniform3f(uniforms.resolution, canvas.width, canvas.height, 1.0);
      gl.uniform4f(uniforms.rect, rect.left * dpr, rect.top * dpr, rect.width * dpr, rect.height * dpr);
      gl.uniform2f(uniforms.windowRes, window.innerWidth * dpr, window.innerHeight * dpr);
      gl.uniform2f(uniforms.imageRes, imageNativeSize[0], imageNativeSize[1]);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(uniforms.texture, 0);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      gl.deleteProgram(program);
    };
  }, [imageSrc]);

  return (
    <button
      ref={containerRef}
      onClick={onClick}
      className="relative overflow-hidden border border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] px-12 py-4 rounded-full group transition-transform hover:scale-105 active:scale-95"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
      
      <span className="relative z-50 text-white tracking-[0.2em] text-base font-medium whitespace-nowrap drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
        {children}
      </span>
    </button>
  );
}