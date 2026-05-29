import { useEffect, useRef } from 'react';

// 1. Accept the new clickPos prop
export default function CanvasReveal({ triggerWave, clickPos, imageSrc }) {
  const canvasRef = useRef(null);
  const waveRef = useRef(false);
  
  // 2. Create a ref to store the coordinates (default to center just in case)
  const clickRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  useEffect(() => {
    waveRef.current = triggerWave;
  }, [triggerWave]);

  // 3. Update the coordinates when the user clicks
  useEffect(() => {
    if (clickPos && (clickPos.x !== 0 || clickPos.y !== 0)) {
      clickRef.current = clickPos;
    }
  }, [clickPos]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let animationFrameId;
    let particles = [];

    const initRangoliFromImage = () => {
      particles = []; 
      const hiddenCanvas = document.createElement('canvas');
      const hiddenCtx = hiddenCanvas.getContext('2d');
      hiddenCanvas.width = canvas.width;
      hiddenCanvas.height = canvas.height;

      const img = new Image();
      img.src = imageSrc;
      
      img.onload = () => {
        const scale = Math.max(hiddenCanvas.width / img.width, hiddenCanvas.height / img.height);
        const drawWidth = img.width * scale;
        const drawHeight = img.height * scale;
        const offsetX = (hiddenCanvas.width - drawWidth) / 2;
        const offsetY = (hiddenCanvas.height - drawHeight) / 2;

        hiddenCtx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        const imgData = hiddenCtx.getImageData(0, 0, hiddenCanvas.width, hiddenCanvas.height).data;

        const gap = 6; 
        
        // NEW: Find the exact center of the screen
        const centerX = hiddenCanvas.width / 2;
        const centerY = hiddenCanvas.height / 2;
        // NEW: Define how large the "particle zone" circle should be. 
        // Math.min(centerX, centerY) gets the smallest dimension, and * 0.75 makes the circle take up 75% of that space.
        // Decrease to 0.6 if it's still hitting the borders!
        const allowedRadius = Math.min(centerX, centerY) * 0.75; 
        
        for (let y = 0; y < hiddenCanvas.height; y += gap) {
          for (let x = 0; x < hiddenCanvas.width; x += gap) {
            
            // NEW: Calculate how far this specific pixel is from the center of the screen
            const distX = x - centerX;
            const distY = y - centerY;
            const distanceFromCenter = Math.sqrt(distX * distX + distY * distY);

            const index = (y * hiddenCanvas.width + x) * 4;
            const r = imgData[index];
            const g = imgData[index + 1];
            const b = imgData[index + 2];
            const brightness = (r + g + b) / 3;
            
            // NEW: We only spawn a particle if the pixel is dark AND it is inside our allowed radius!
            if (brightness < 230 && distanceFromCenter < allowedRadius) { 
              particles.push({
                x: x,
                y: y,
                baseX: x,
                baseY: y,
                vx: 0,
                vy: 0,
                color: `rgb(${r},${g},${b})`,
                alpha: Math.random() * 0.5 + 0.5,
                size: Math.random() * 1.5 + 1
              });
            }
          }
        }
      };
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initRangoliFromImage();
    };

    window.addEventListener('resize', resize);
    resize(); 

    let waveTime = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
    // Calculate a dynamic speed based on the screen width
      if (waveRef.current) {
        const isMobile = canvas.width < 768;
        waveTime += isMobile ? 0.2 : 0.6; // Half speed on mobile!
      }

      // 4. Set the epicenter directly to the user's click coordinates!
      const epicenter = clickRef.current;

      particles.forEach(p => {
        if (waveRef.current) {
          const dx = p.x - epicenter.x;
          const dy = p.y - epicenter.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          const waveRadius = waveTime * 45; 
          if (Math.abs(dist - waveRadius) < 60) {
             p.vx += (dx / dist) * (Math.random() * 4.5 + 3); 
             p.vy += (dy / dist) * (Math.random() * 4.5 + 3);
          }
          
          p.vx += dy * 0.002;
          p.vy -= dx * 0.002;
        } else {
          p.x = p.baseX + Math.sin(Date.now() * 0.001 + p.baseY * 0.01) * 1.5;
          p.y = p.baseY + Math.cos(Date.now() * 0.001 + p.baseX * 0.01) * 1.5;
        }
        
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.92; 
        p.vy *= 0.92;

        ctx.globalAlpha = waveRef.current ? Math.max(0, p.alpha - waveTime * 0.015) : p.alpha;
        ctx.fillStyle = p.color;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };
    
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [imageSrc]); 

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full touch-none"
    />
  );
}