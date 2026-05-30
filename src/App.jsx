import React, { useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Calendar, MapPin, Clock } from 'lucide-react';
import Layout from './components/Layout'; 

// =========================================
// COMPONENT: Parallax Floating Dust
// =========================================
const FloatingDust = ({ scrollYProgress }) => {
  // Generate 25 random particles scattered across the massive 300vh section
  const particles = useMemo(() => {
    return [...Array(25)].map((_, i) => ({
      id: i,
      size: Math.random() * 6 + 2, // random size between 2px and 8px
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      // Randomize parallax distance: some go up slowly, some go down fast
      yOffset: Math.random() * 400 - 200, 
      opacity: Math.random() * 0.5 + 0.1,
      blur: Math.random() * 3 + 1,
    }));
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {particles.map((p) => {
        // Map the global scroll progress to the particle's specific Y offset
        const y = useTransform(scrollYProgress, [0, 1], [0, p.yOffset]);
        
        return (
          <motion.div
            key={p.id}
            style={{ 
              y, 
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
// COMPONENT: Scroll-Drawn Jharokha SVG
// =========================================
const JharokhaFrame = ({ scrollYProgress }) => {
  // Wait until the user scrolls past the video hero (approx 15% of the page) 
  // before we start drawing the lines. Finish drawing by 85%.
  const drawProgress = useTransform(scrollYProgress, [0.15, 0.85], [0, 1]);
  const frameOpacity = useTransform(scrollYProgress, [0.1, 0.2], [0, 1]);

  return (
    <motion.svg 
      viewBox="0 0 100 100" 
      preserveAspectRatio="none"
      className="fixed inset-0 w-full h-full pointer-events-none z-10 p-4 md:p-6"
      style={{ opacity: frameOpacity }}
    >
      {/* 
        vectorEffect="non-scaling-stroke" ensures the lines don't get fat or distorted 
        on different screen sizes even though we are stretching the viewBox 
      */}
      
      {/* Outer Simple Box */}
      <motion.rect 
        x="0" y="0" width="100" height="100" 
        fill="none" stroke="#A98C66" strokeWidth="1" 
        vectorEffect="non-scaling-stroke" 
        style={{ pathLength: drawProgress }} 
        className="opacity-30" 
      />

      {/* Inner Elegant Jharokha Arch */}
      <motion.path 
        d="M 4 100 L 4 20 C 4 20, 15 20, 20 15 C 25 10, 35 4, 50 4 C 65 4, 75 10, 80 15 C 85 20, 96 20, 96 20 L 96 100" 
        fill="none" stroke="#A98C66" strokeWidth="1.5" 
        vectorEffect="non-scaling-stroke" 
        style={{ pathLength: drawProgress }} 
        className="opacity-50" 
      />
    </motion.svg>
  );
};


// =========================================
// MAIN APP COMPONENT
// =========================================
export default function App() {
  // Track scroll position of the entire window
  const { scrollYProgress } = useScroll();

  return (
    <Layout>
      
      <JharokhaFrame scrollYProgress={scrollYProgress} />
      
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
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="hero-glass-box px-8 py-10 flex flex-col items-center justify-center w-full max-w-md pointer-events-auto"
          >
            <span className="text-xs md:text-sm uppercase tracking-[0.3em] font-serif text-white mb-4 text-center">
              We Are Getting Engaged
            </span>
            
            <div className="flex items-center w-full max-w-[200px] mb-6 opacity-60">
              <div className="h-[1px] flex-grow bg-white"></div>
              <span className="px-4 text-white text-sm leading-none">✧</span>
              <div className="h-[1px] flex-grow bg-white"></div>
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-vibes-custom text-white drop-shadow-sm flex items-center justify-center gap-4 w-full leading-none">
              <span>Rohan</span>
              <span className="text-3xl md:text-4xl font-vibes-custom opacity-70 font-light">&</span>
              <span>Manasi</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* 2. CONTENT AREA (Sandstone Background) */}
      <div className="w-full bg-sandstone-texture relative z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
        
        {/* SCROLL 1: Invocation & Host */}
        <section className="relative z-20 w-full min-h-[100dvh] flex flex-col items-center justify-center p-4 md:p-8">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.4 }}
            className="px-8 py-12 flex flex-col items-center justify-center w-full max-w-md text-center"
          >
            <div className="text-petrol font-serif text-xl md:text-2xl mb-8 tracking-widest opacity-90">
              || ॐ श्री पार्श्वनाथाय नमः ||
            </div>
            
            <p className="text-base md:text-lg text-petrol font-light mb-10 italic opacity-80">
              With the blessings of our elders,
            </p>
            
            <h2 className="text-3xl md:text-4xl font-serif text-petrol mb-6">
              Mrs. Tanuja Rajesh Shah
            </h2>
            
            <p className="text-sm md:text-base text-petrol uppercase tracking-[0.2em] opacity-80">
              cordially invites you to the
            </p>
          </motion.div>
        </section>

        {/* SCROLL 2: Event & Names */}
        <section className="relative z-20 w-full min-h-[100dvh] flex flex-col items-center justify-center p-4 md:p-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.4 }}
            className="px-8 py-12 flex flex-col items-center justify-center w-full max-w-lg text-center"
          >
            <h2 className="text-4xl md:text-5xl font-serif text-petrol tracking-[0.15em] mb-6 leading-relaxed">
              GOL DHANA <br/>
              <span className="text-2xl md:text-3xl">& ENGAGEMENT</span>
            </h2>
            
            <div className="flex items-center w-full max-w-[280px] mb-10 opacity-60">
              <div className="h-[1px] flex-grow bg-petrol"></div>
              <span className="px-4 text-petrol text-xs md:text-sm uppercase tracking-[0.2em] text-center leading-relaxed">
                celebrating the <br/> union of
              </span>
              <div className="h-[1px] flex-grow bg-petrol"></div>
            </div>

            <h3 className="text-7xl md:text-8xl lg:text-9xl font-vibes-custom text-petrol flex items-center justify-center gap-4 w-full leading-none">
              <span>Rohan</span>
              <span className="text-4xl md:text-5xl font-vibes-custom opacity-50 font-light">&</span>
              <span>Manasi</span>
            </h3>
          </motion.div>
        </section>

        {/* SCROLL 3: Details Section */}
        <section className="relative z-20 w-full min-h-[100dvh] flex flex-col items-center justify-center p-4 md:p-8 pb-24">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.3 }}
            className="w-full max-w-4xl mx-auto"
          >
            <div className="light-glass-box flex flex-col md:flex-row gap-8 items-start p-8 md:p-12 shadow-xl border border-white/20 bg-white/40">
              
              <div className="flex-1 space-y-6">
                <h2 className="text-3xl font-serif text-petrol">A New Chapter Begins</h2>
                <p className="text-lg text-slate-800 leading-relaxed font-light">
                  We invite you to join us as we step into a new chapter, surrounded by the warmth of alabaster arches and shifting spring flora.
                </p>
                <div className="pt-2">
                  <span className="text-xs uppercase tracking-[0.3em] font-medium text-petrol opacity-80">
                    Blessings Only
                  </span>
                </div>
              </div>
              
              <div className="flex-1 flex flex-col gap-4 text-slate-700 font-medium md:pt-2 w-full">
                <div className="flex items-center gap-4 bg-white/60 p-5 rounded-xl border border-white/50 shadow-sm">
                  <Calendar className="w-6 h-6 text-petrol flex-shrink-0" />
                  <span>Sunday, 21st June 2026 <br/><span className="text-sm font-light text-slate-500 flex items-center gap-1 mt-1"><Clock className="w-3 h-3"/> Starts at 10:00 AM</span></span>
                </div>
                <div className="flex items-center gap-4 bg-white/60 p-5 rounded-xl border border-white/50 shadow-sm">
                  <MapPin className="w-6 h-6 text-petrol flex-shrink-0" />
                  <span>Hotel Tip Top International <br/><span className="text-sm font-light text-slate-500 mt-1 block">Pune[cite: 2]</span></span>
                </div>
              </div>

            </div>
          </motion.div>
        </section>

      </div>
    </Layout>
  );
}