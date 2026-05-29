import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import CanvasReveal from './CanvasReveal';
import SvgArchway from './SvgArchway';

export default function Layout({ children }) {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden overscroll-none touch-none bg-alabaster">
      {/* Background Cinematic Media */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="w-full h-full object-cover opacity-60"
        >
          <source src="/media/garden-ambient.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-alabaster/30 to-sage/40 mix-blend-overlay" />
      </div>

      {/* Interactive Reveal Gate */}
        <AnimatePresence>
        {!isRevealed && (
            <motion.div 
            key="reveal-layer"
            initial={{ opacity: 1 }}
            // ADDED: A 0.5s delay so the wave has time to visually travel before fading starts
            exit={{ opacity: 0, transition: { duration: 1.5, delay: 0.5, ease: "easeInOut" } }}
            className="absolute inset-0 z-50 flex items-center justify-center cursor-pointer bg-alabaster/40 backdrop-blur-sm"
            onClick={() => setIsRevealed(true)}
            >
            <CanvasReveal triggerWave={isRevealed} />
            </motion.div>
        )}
        </AnimatePresence>

        {/* Main Content Payload */}
        <main className="relative z-10 w-full h-full flex flex-col items-center justify-center p-6">
        <SvgArchway />
        <motion.div 
            // ADDED: A slight scale effect and custom easing for a premium feel
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ 
            opacity: isRevealed ? 1 : 0, 
            y: isRevealed ? 0 : 40,
            scale: isRevealed ? 1 : 0.95
            }}
            // ADDED: Delay of 1.2s so it waits for the wave to clear the center
            transition={{ delay: 1.2, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="light-glass-box p-8 md:p-12 max-w-4xl w-full text-center z-20 relative"
        >
            {children}
        </motion.div>
        </main>
    </div>
  );
}