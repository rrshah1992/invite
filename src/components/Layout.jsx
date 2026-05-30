import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import CanvasReveal from './CanvasReveal';
import SvgArchway from './SvgArchway';
import LiquidButton from './LiquidButton'; // 1. Import the new button
import coverImageDesktop from '../assets/images/coverimage-desktop.png';
import coverImageMobile from '../assets/images/coverimage-mobile_woframe.png';

export default function Layout({ children }) {
  const [revealData, setRevealData] = useState({ isRevealed: false, x: 0, y: 0 });

  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth < 768
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeImage = isMobile ? coverImageMobile : coverImageDesktop;

  const handleReveal = (e) => {
    if (revealData.isRevealed) return; 
    setRevealData({ isRevealed: true, x: e.clientX, y: e.clientY });
  };

  return (
    <div 
      className="fixed inset-0 w-full h-full overflow-hidden overscroll-none bg-alabaster cursor-pointer"
      onClick={handleReveal}
    >
      
      {/* 1. Main Content Payload */}
      <main className="absolute inset-0 z-10 w-full h-full flex flex-col items-center justify-center p-6 pointer-events-none">
        <SvgArchway />
        <motion.div 
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ 
            opacity: revealData.isRevealed ? 1 : 0, 
            y: revealData.isRevealed ? 0 : 40,
            scale: revealData.isRevealed ? 1 : 0.95
          }}
          transition={{ delay: 0.8, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="light-glass-box p-8 md:p-12 max-w-4xl w-full text-center z-20 relative pointer-events-auto"
        >
          {children}
        </motion.div>
      </main>

      {/* 2. The Static Background Image (Restored) */}
      <AnimatePresence>
        {!revealData.isRevealed && (
          <motion.img 
            key="bg-image"
            src={activeImage}
            alt="Rangoli Cover"
            exit={{ 
              opacity: 0, 
              filter: "blur(20px)",
              transition: { duration: 1.5, ease: "easeInOut" } 
            }}
            className="absolute inset-0 w-full h-full object-cover z-30 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* 3. The Canvas Reveal Layer */}
      <div className="absolute inset-0 z-40 pointer-events-none">
        <CanvasReveal 
          triggerWave={revealData.isRevealed} 
          clickPos={{ x: revealData.x, y: revealData.y }} 
          imageSrc={activeImage}
        />
      </div>

      {/* 4. The Liquid Glass Button */}
      <AnimatePresence>
        {!revealData.isRevealed && (
          <motion.div 
            key="reveal-button"
            exit={{ 
              opacity: 0, 
              scale: 0.9,
              transition: { duration: 0.8, ease: "easeOut" } 
            }}
            // Added pointer-events-auto so the button hover state captures the mouse
            className="absolute top-[79%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-auto"
          >
            <LiquidButton imageSrc={activeImage} onClick={handleReveal}>
              Tap to join us!
            </LiquidButton>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}