import { useEffect, useRef } from 'react';

export default function CanvasReveal({ triggerWave }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    
    // Set canvas dimensions
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initRangoli();
    };
    
    // Simplified Particle Setup
    const initRangoli = () => {
      particles = [];
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      // Generate particles in a geometric/polar pattern here
      for (let i = 0; i < 500; i++) {
        const angle = i * 0.1;
        const radius = 100 + (i * 0.5);
        particles.push({
          x: cx + Math.cos(angle) * radius,
          y: cy + Math.sin(angle) * radius,
          baseX: cx + Math.cos(angle) * radius,
          baseY: cy + Math.sin(angle) * radius,
          vx: 0,
          vy: 0
        });
      }
    };

    let waveActive = false;
    let waveTime = 0;
    let epicenter = { x: 0, y: 0 };

    const handleInteraction = (e) => {
      if (waveActive) return;
      waveActive = true;
      epicenter.x = e.clientX || (e.touches && e.touches[0].clientX);
      epicenter.y = e.clientY || (e.touches && e.touches[0].clientY);
    };

    window.addEventListener('resize', resize);
    canvas.addEventListener('click', handleInteraction);
    resize();

    // Render Loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (waveActive) {
        waveTime += 0.2;
      }

      ctx.fillStyle = 'rgba(217, 160, 160, 0.8)'; // Faded rose

      particles.forEach(p => {
        if (waveActive) {
          const dx = p.x - epicenter.x;
          const dy = p.y - epicenter.y;
          const r = Math.sqrt(dx * dx + dy * dy);
          
          // Wave Mechanics Application
          const k = 0.05; // wave number
          const omega = 1; // angular frequency
          
          // Applying outward force based on wave phase
          const waveForce = Math.max(0, Math.cos(k * r - omega * waveTime));
          
          // Sweep outwards
          if (r < waveTime * 50) { 
            p.vx += (dx / r) * waveForce * 5;
            p.vy += (dy / r) * waveForce * 5;
          }
        }
        
        // Apply velocity & friction
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.92; 
        p.vy *= 0.92;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };
    
    render();

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('click', handleInteraction);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full touch-none"
    />
  );
}