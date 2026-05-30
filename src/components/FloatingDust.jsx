import React, { useRef, useEffect } from 'react';

export const FloatingDust = ({ scrollYProgress }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const particles = Array.from({ length: 60 }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight * 3,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 0.5 + 0.2,
    }));

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#FFD700"; // Solid Gold
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#FFD700";
      
      particles.forEach(p => {
        // Move particles based on scroll
        const scrollPos = window.scrollY * 0.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y - scrollPos, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }
    draw();
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-10 w-full h-full pointer-events-none" />;
};