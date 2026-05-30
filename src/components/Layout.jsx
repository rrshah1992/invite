import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import CanvasReveal from './CanvasReveal';
import LiquidButton from './LiquidButton'; 
import coverImageDesktop from '../assets/images/coverimage-desktop.png';
import coverImageMobile from '../assets/images/coverimage-mobile_withframe.png';

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
      // FIX: If revealed, let the document flow naturally so the window scrolls. If not, lock it.
      className={`w-full min-h-screen bg-alabaster ${!revealData.isRevealed ? 'fixed inset-0 overflow-hidden overscroll-none cursor-pointer' : ''}`}
      onClick={handleReveal}
    >
      
      {/* 1. Main Content Payload */}
      <main className={`relative z-10 w-full ${!revealData.isRevealed ? 'h-screen pointer-events-none overflow-hidden flex items-center justify-center' : ''}`}>
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ 
            opacity: revealData.isRevealed ? 1 : 0, 
            y: revealData.isRevealed ? 0 : 40
          }}
          transition={{ delay: 0.8, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="w-full min-h-screen pointer-events-auto flex flex-col"
        >
          {children}
        </motion.div>
      </main>

      {/* 2. The Static Background Image */}
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
            className="fixed inset-0 w-full h-full object-cover z-30 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* 3. The Canvas Reveal Layer */}
      <div className="fixed inset-0 z-40 pointer-events-none">
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
            className="fixed top-[79%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-auto"
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