import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import Layout from './components/Layout'; 
import borderScrollImage from './assets/images/Borderscroll.png';
import bhagwanImage from './assets/images/bhagwan.png'; // Added bhagwan image import

// =========================================
// COMPONENT: Parallax Floating Dust
// =========================================
const FloatingDust = ({ scrollYProgress }) => {
  const particles = useMemo(() => {
    return [...Array(25)].map((_, i) => ({
      id: i,
      size: Math.random() * 6 + 2, 
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      yOffset: Math.random() * 400 - 200, 
      opacity: Math.random() * 0.5 + 0.1,
      blur: Math.random() * 3 + 1,
    }));
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {particles.map((p) => {
        return (
          <motion.div
            key={p.id}
            style={{ 
              left: p.left, 
              top: p.top, 
              width: p.size, 
              height: p.size,
              opacity: p.opacity,
              filter: `blur(${p.blur}px)`
            }}
            className="absolute rounded-full bg-[#A98C66]"
          />
        );
      })}
    </div>
  );
};

// =========================================
// MAIN APP COMPONENT
// =========================================
export default function App() {
  return (
    <Layout>
      
      {/* 1. HERO SECTION (Video Background) */}
      <section className="relative w-full h-[100dvh] overflow-hidden flex flex-col items-center justify-center bg-black">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-80"
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>

        <div className="relative z-10 flex flex-col items-center justify-center p-4 w-full">
          {/* Initial load animation is kept for the hero only, so it fades in nicely on page load */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="hero-glass-box px-8 py-10 flex flex-col items-center justify-center w-full max-w-md pointer-events-auto"
          >
            <span className="text-xs md:text-sm uppercase tracking-[0.3em] font-sans text-white mb-4 text-center">
              We Are Getting Engaged
            </span>
            
            <div className="flex items-center w-full max-w-[200px] mb-6 opacity-60">
              <div className="h-[1px] flex-grow bg-white"></div>
              <span className="px-4 text-white text-sm leading-none">✧</span>
              <div className="h-[1px] flex-grow bg-white"></div>
            </div>

            {/* Forced single line with flex-nowrap and whitespace-nowrap */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-vibes-custom text-white drop-shadow-sm flex flex-row flex-nowrap items-center justify-center gap-2 md:gap-4 w-full leading-none whitespace-nowrap">
              <span>Rohan</span>
              <span className="text-3xl md:text-4xl font-vibes-custom opacity-70 font-light">&</span>
              <span>Manasi</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* 2. CONTENT AREA (Sandstone Background) */}
      <div className="w-full bg-sandstone-texture relative z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.2)] overflow-hidden">

        {/* --- RIGHT BORDER (Static Full Height) --- */}
        <div 
          className="absolute top-0 right-0 md:-right-2 w-12 md:w-16 lg:w-20 h-full z-10 pointer-events-none mix-blend-multiply opacity-70"
          style={{
            backgroundImage: `url(${borderScrollImage})`,
            backgroundRepeat: 'repeat-y',
            backgroundSize: '100% auto',
            backgroundPosition: 'top right'
          }}
        />
        
        {/* --- LEFT BORDER (Static Full Height) --- */}
        <div 
          className="absolute top-0 left-0 md:-left-2 w-12 md:w-16 lg:w-20 h-full z-10 pointer-events-none mix-blend-multiply opacity-70 scale-x-[-1]"
          style={{
            backgroundImage: `url(${borderScrollImage})`,
            backgroundRepeat: 'repeat-y',
            backgroundSize: '100% auto',
            backgroundPosition: 'top right'
          }}
        />
        
        {/* CONTINUOUS SCROLL CONTENT (Static Text - No scroll animations) */}
        <section className="relative z-20 w-full flex flex-col items-center justify-start px-12 py-24 md:px-24 gap-32 pb-40">
          
          {/* SECTION 1: Invitee and Salutations */}
          <div className="flex flex-col items-center justify-center w-full max-w-md text-center">

            <div className="text-petrol font-serif text-xl md:text-2xl mb-8 tracking-widest opacity-90">
              || ॐ श्री पार्श्वनाथाय नमः ||
            </div>
            
            <p className="text-sm md:text-base text-petrol font-serif italic mb-10 opacity-80">
              With the blessings of our elders,
            </p>
            
            <h2 className="text-2xl md:text-3xl font-serif text-petrol mb-6 font-semibold">
              Mrs. Tanuja Rajesh Shah
            </h2>
            
            <p className="text-xs md:text-sm text-petrol font-sans uppercase tracking-[0.2em] opacity-80">
              cordially invites you to the
            </p>
          </div>

          {/* SECTION 2: Bridegroom Section */}
          <div className="flex flex-col items-center justify-center w-full max-w-2xl text-center">
            
            <h3 className="text-2xl md:text-3xl font-serif text-petrol mb-6 tracking-widest font-semibold uppercase">
              Gol Dhana & Engagement
            </h3>

            <p className="text-xs md:text-sm font-sans uppercase tracking-[0.3em] text-petrol opacity-70 mb-10">
              celebrating the union of
            </p>
            
            {/* Forced single line names to match hero consistency */}
            <h2 className="text-5xl sm:text-6xl md:text-8xl font-vibes-custom text-petrol flex flex-row flex-nowrap items-center justify-center gap-3 md:gap-4 w-full leading-none whitespace-nowrap">
              <span>Rohan</span>
              <span className="text-3xl md:text-5xl opacity-40 font-light">&</span>
              <span>Manasi</span>
            </h2>
          </div>

          {/* SECTION 3: Details */}
          <div className="flex flex-col items-center justify-center w-full max-w-md text-center">
            
            <p className="text-sm md:text-base font-sans text-petrol uppercase tracking-[0.2em] font-medium opacity-90 mb-2">
              Sunday, 21st June 2026
            </p>
            
            <p className="text-xs md:text-sm font-sans text-petrol uppercase tracking-[0.2em] opacity-80 mb-10">
              10:00 AM onwards
            </p>


            <p className="text-xs md:text-sm font-sans text-petrol uppercase tracking-[0.2em] opacity-80 mb-10">
              Marigold Banquets 'N' Conventions
            </p>

            <p className="text-xs md:text-sm font-sans text-petrol uppercase tracking-[0.3em] font-semibold opacity-90">
              Blessings Only
            </p>
          </div>

        </section>
      </div>
    </Layout>
  );
}