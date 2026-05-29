import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

const PARTICLE_COUNT = 150;
const PARTICLE_COLORS = ['#D4AF37', '#D9A0A0', '#D6C1A7']; // Gold, Rose, Sandstone

export default function Reveal({ children }) {
  const [isRevealed, setIsRevealed] = useState(false);
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);

  // Initialize canvas and draw initial static particles
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Generate loose cluster in the center
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }).map(() => {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 80; // Spread of the initial cluster
      
      return {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        size: Math.random() * 3 + 1.5,
        color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
        alpha: 1,
        // Base radial velocity for when the scatter triggers
        vx: Math.cos(angle) * (Math.random() * 5 + 2),
        vy: Math.sin(angle) * (Math.random() * 5 + 2),
      };
    });

    // Draw initial static state
    drawParticles(ctx, canvas);
  }, []);

  const drawParticles = (ctx, canvas) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particlesRef.current.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  };

  // The animation loop for the scatter physics
  const animateParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let isActive = false;

    particlesRef.current.forEach(p => {
      // Apply velocity
      p.x += p.vx;
      p.y += p.vy;
      
      // Fade out
      p.alpha -= 0.015;
      if (p.alpha < 0) p.alpha = 0;
      
      if (p.alpha > 0) isActive = true;
    });

    drawParticles(ctx, canvas);

    if (isActive) {
      animationRef.current = requestAnimationFrame(animateParticles);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  // Handle Resize
  useEffect(() => {
    initCanvas();
    const handleResize = () => {
      if (!isRevealed) initCanvas();
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [initCanvas, isRevealed]);

  // Handle Interaction
  const handleReveal = () => {
    if (isRevealed) return;
    setIsRevealed(true);
    animationRef.current = requestAnimationFrame(animateParticles);
  };

  return (
    <div 
      className="relative w-screen h-screen overflow-hidden bg-slate-50 cursor-pointer" 
      onClick={handleReveal}
    >
      {/* Layer 1 (Bottom): The actual content / Invitation payload.
        Utilizes the exact master CSS class required. 
      */}
      <div className="absolute inset-0 flex items-center justify-center z-10 p-6">
        <div className="light-glass-box w-full max-w-3xl p-12 text-center">
          {children || <h2 className="text-2xl font-serif">Your Invitation Awaits</h2>}
        </div>
      </div>

      {/* Layer 2 (Middle): The Framer Motion Cover Image */}
      <motion.img
        src="src\assets\images\coverimage.png" // Swap with your actual image path
        alt="Cover Reveal"
        className="absolute inset-0 w-full h-full object-cover z-20 pointer-events-none"
        initial={{ opacity: 1, filter: "blur(0px)" }}
        animate={{ 
          opacity: isRevealed ? 0 : 1, 
          filter: isRevealed ? "blur(20px)" : "blur(0px)" 
        }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />

      {/* Layer 3 (Top): The Canvas Particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-30 pointer-events-none"
      />
    </div>
  );
}