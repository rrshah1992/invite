import React, { useRef, useMemo, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Layout from './components/Layout'; 
import borderScrollImage from './assets/images/Borderscroll.png';
import { Calendar, MapPin, Volume2, VolumeX } from 'lucide-react';

// Import Door Assets
import doorFrameImg from './assets/images/doorframe.png';
import doorLeftImg from './assets/images/doorleft.png';
import doorRightImg from './assets/images/doorright.png';
import toranImg from './assets/images/toran.png';
import peacockImg from './assets/images/peacock.png';
import bgMusic from './assets/music.mp3';

// =========================================
// COMPONENT: Falling Emojis
// =========================================
const FallingEmojis = () => {
  const emojis = ['🌸', '🌺', '🌼', '🌷', '🏵️'];
  
  const particles = useMemo(() => {
    // Reduced from 25 to 12
    return [...Array(12)].map((_, i) => ({
      id: i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      left: `${Math.random() * 100}%`,
      delay: Math.random() * -20, 
      duration: Math.random() * 15 + 15, // Slightly slower fall
      size: 1, // Fixed, smaller size
      drift: Math.random() * 40 - 20, 
    }));
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          animate={{ 
            y: ['-10vh', '110vh'], 
            x: [0, p.drift, -p.drift, 0],
            rotate: [0, 360] 
          }}
          transition={{
            y: { duration: p.duration, repeat: Infinity, ease: "linear", delay: p.delay },
            x: { duration: p.duration * 0.8, repeat: Infinity, ease: "easeInOut", delay: p.delay },
            rotate: { duration: p.duration, repeat: Infinity, ease: "linear", delay: p.delay }
          }}
          style={{
            position: 'absolute',
            left: p.left,
            top: 0,
            fontSize: `${p.size}rem`,
            opacity: 0.8, // Much less bright
            filter: 'saturate(0.6)' // Desaturates the loud emoji colors slightly
          }}
        >
          {p.emoji}
        </motion.div>
      ))}
    </div>
  );
};

// =========================================
// COMPONENT: Floating Audio Player
// =========================================
const FloatingAudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Set volume a bit lower so it's pleasant background noise
    audio.volume = 0.4;

    const playAudio = () => {
      audio.play().then(() => {
        setIsPlaying(true);
        // Once it successfully plays, remove these invisible click listeners
        document.removeEventListener('click', playAudio);
        document.removeEventListener('touchstart', playAudio);
      }).catch(() => {
        // Browser blocked autoplay; it will wait for the next click
      });
    };

    // Attempt to play immediately
    playAudio();

    // If blocked, wait for the user's first click anywhere on the page
    document.addEventListener('click', playAudio);
    document.addEventListener('touchstart', playAudio);

    return () => {
      document.removeEventListener('click', playAudio);
      document.removeEventListener('touchstart', playAudio);
    };
  }, []);

  const togglePlay = (e) => {
    e.stopPropagation(); // Prevents this click from triggering other page elements
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      {/* Hidden Audio Element */}
      <audio ref={audioRef} src={bgMusic} loop />

      {/* Floating Mute/Unmute Button - Bottom Left */}
      <button
        onClick={togglePlay}
        className="fixed bottom-6 left-6 z-50 p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-petrol shadow-lg transition-transform hover:scale-110"
        aria-label="Toggle Music"
      >
        {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </button>
    </>
  );
};

// =========================================
// COMPONENT: Door Reveal Section
// =========================================
const DoorRevealSection = () => {
  const containerRef = useRef(null);
  
  // Track scroll exactly from when this section hits the top, until it ends
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // ANIMATION TIMELINE (0.0 to 1.0 represents the scroll duration)
  // 1. Doors Swing Outward (0.0 -> 0.45)
  // Negative degrees swing the left door towards you, positive for the right door.
  const leftDoorRotate = useTransform(scrollYProgress, [0, 0.45], [0, -80]);
  const rightDoorRotate = useTransform(scrollYProgress, [0, 0.45], [0, 80]);
  
  // 2. The Whole Set (Doors + Frame) Zooms out of the viewport (0.45 -> 0.90)
  const setScale = useTransform(scrollYProgress, [0.45, 0.90], [1, 25]);
  
  // 3. The Whole Set Fades Away to ensure it's gone cleanly (0.85 -> 1.0)
  const setOpacity = useTransform(scrollYProgress, [0.85, 1], [1, 0]);

  return (
    // FIX: Changed to h-[250vh]. This gives the page 2.5 screens of extra length
    // to keep scrolling through while the animation finishes.
    <div ref={containerRef} className="relative w-full h-[180vh]">
      
      {/* This holds everything perfectly in the center of the screen while you scroll */}
      <div className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden">

        {/* ==================================================== */}
        {/* TEXT UNDERNEATH (Stays static, never disappears)     */}
        {/* ==================================================== */}
        <div className="absolute inset-0 flex flex-col items-center justify-center w-full max-w-2xl mx-auto text-center z-0 px-4">
          <h3 className="text-2xl md:text-3xl font-serif text-petrol mb-6 tracking-widest font-semibold uppercase">
            Gol Dhana & Engagement
          </h3>
          <p className="text-xs md:text-sm font-sans uppercase tracking-[0.3em] text-petrol opacity-70 mb-10">
            celebrating the union of
          </p>
          <h2 className="text-5xl sm:text-6xl md:text-8xl font-vibes-custom text-petrol flex flex-row flex-nowrap items-center justify-center gap-3 md:gap-4 w-full leading-none whitespace-nowrap">
            <span>Rohan</span>
            <span className="text-3xl md:text-5xl opacity-40 font-light">&</span>
            <span>Manasi</span>
          </h2>
        </div>

        {/* ==================================================== */}
        {/* THE FRAME & DOORS (The set that zooms out)           */}
        {/* ==================================================== */}
        <motion.div
          className="absolute inset-0 z-10 flex items-center justify-center origin-center will-change-transform"
          style={{ 
            scale: setScale, 
            opacity: setOpacity, 
            perspective: "1200px" 
          }}
        >
          {/* Sizing of the Frame wrapper */}
          <div className="relative w-[85vw] max-w-[360px] aspect-[0.6] flex items-center justify-center mx-auto scale-95">
            
            {/* THE FRAME: Placed at z-20 so it sits on top of the door edges */}
            <img
              src={doorFrameImg}
              className="absolute inset-0 w-full h-full object-fill z-0 drop-shadow-2xl pointer-events-none"
              alt="Door Frame"
            />
            
            {/* THE DOORS: Placed at z-10 so they tuck perfectly BEHIND the frame walls */}
            <div 
              className="absolute top-[6%] bottom-[4%] left-[6%] right-[6%] z-10 flex"
              style={{ perspective: "1200px" }}
            >
              {/* Left Door */}
              <motion.img
                src={doorLeftImg}
                className="w-1/2 h-full object-fill origin-left"
                style={{ rotateY: leftDoorRotate }}
                alt="Left Door"
              />
              {/* Right Door */}
              <motion.img
                src={doorRightImg}
                className="w-1/2 h-full object-fill origin-right"
                style={{ rotateY: rightDoorRotate }}
                alt="Right Door"
              />
            </div>
            
          </div>
        </motion.div>

      </div>
    </div>
  );
};

// =========================================
// MAIN APP COMPONENT
// =========================================
export default function App() {
  return (
    <Layout>
      
      {/* BACKGROUND MUSIC PLAYER */}
      <FloatingAudioPlayer />

      {/* 1. HERO SECTION */}
      <section className="relative z-40 w-full h-[100dvh] overflow-hidden flex flex-col items-center justify-center bg-black">
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
            <span className="text-xs md:text-sm uppercase tracking-[0.3em] font-sans text-white mb-4 text-center">
              We Are Getting Engaged
            </span>
            
            <div className="flex items-center w-full max-w-[200px] mb-6 opacity-60">
              <div className="h-[1px] flex-grow bg-white"></div>
              <span className="px-4 text-white text-sm leading-none">✧</span>
              <div className="h-[1px] flex-grow bg-white"></div>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-vibes-custom text-white drop-shadow-sm flex flex-row flex-nowrap items-center justify-center gap-2 md:gap-4 w-full leading-none whitespace-nowrap">
              <span>Rohan</span>
              <span className="text-3xl md:text-4xl font-vibes-custom opacity-70 font-light">&</span>
              <span>Manasi</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* 2. CONTENT AREA */}
      <div className="w-full bg-sandstone-texture relative z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">

      {/* FALLING EMOJIS LAYER */}
      {/* z-30 places it perfectly over the page content, but it stays trapped inside the Sandstone div so it never overlaps the video */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        <div className="sticky top-0 w-full h-screen">
          <FallingEmojis />
        </div>
      </div>

      {/* BORDERS (Made Sticky so they lock to the screen and don't scroll up) */}
        <div className="absolute top-0 right-0 md:-right-2 w-12 md:w-16 lg:w-20 h-full z-10 pointer-events-none">
          <div 
            className="sticky top-0 w-full h-screen mix-blend-multiply opacity-70"
            style={{ backgroundImage: `url(${borderScrollImage})`, backgroundRepeat: 'repeat-y', backgroundSize: '100% auto', backgroundPosition: 'top right' }}
          />
        </div>
        <div className="absolute top-0 left-0 md:-left-2 w-12 md:w-16 lg:w-20 h-full z-10 pointer-events-none scale-x-[-1]">
          <div 
            className="sticky top-0 w-full h-screen mix-blend-multiply opacity-70"
            style={{ backgroundImage: `url(${borderScrollImage})`, backgroundRepeat: 'repeat-y', backgroundSize: '100% auto', backgroundPosition: 'top right' }}
          />
        </div>
        
        {/* SECTION 1: Salutations */}
        <section className="relative z-20 w-full flex flex-col items-center justify-start px-12 pt-24 md:px-24 pb-4">
          
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
            <p className="text-sm md:text-base text-petrol font-serif italic mb-10 opacity-80">
              cordially invites you to the
            </p>
          </div>
        </section>

        {/* Toran */}
        <div className="relative w-full flex justify-center z-30 pointer-events-none overflow-visible -mt-0">
          <motion.img 
            src={toranImg} 
            alt="Toran Decor" 
            className="w-[110vw] max-w-[500px] h-auto object-contain origin-top"
            animate={{ 
              // Slighly irregular, haphazard back-and-forth tilt degrees
              rotate: [0, -1, 2, -2, 1, -1, 0],
              x: [0, -4, 3, -5, 4, -2, 0]
            }}
            transition={{
              duration: 7,            // Time taken to complete one full erratic cycle
              repeat: Infinity,       // Loops forever
              ease: "easeInOut",
              repeatType: "mirror"    // Reverses back smoothly to prevent snapping
            }}
          />
        </div>

        {/* SECTION 2: DOORS */}
        <DoorRevealSection />
        {/* SECTION 2: peacock */}
        <div className="relative w-full flex justify-start pl-[15%] md:pl-[20%] z-30 pointer-events-none overflow-visible -mt-24 mb-8">
          <motion.img 
            src={peacockImg} 
            alt="Peacock" 
            // origin-bottom keeps its feet planted while the body sways
            className="w-[30vw] max-w-[200px] h-auto object-contain origin-bottom opacity-90"
            animate={{ 
              // A subtle, haphazard shifting of weight and slight bobbing
              rotate: [0, -5, -2, -7, -3, -5, -3],
              x: [0, 3, -2, 4, -3, 1, 0],
              y: [0, -2, 1, -3, 0, -1, 0]
            }}
            transition={{
              duration: 8,            // Slow, organic movement
              repeat: Infinity,       
              ease: "easeInOut",
              repeatType: "mirror"    
            }}
          />
        </div>

        {/* SECTION 3: Details */}
        <section className="relative z-20 w-full flex flex-col items-center justify-start px-12 pt-0 pb-40 md:px-24">
          <div className="flex flex-col items-center justify-center w-full max-w-md text-center">
            
            {/* THE DATE & TIME */}
            <p className="text-sm md:text-base font-sans text-petrol uppercase tracking-[0.2em] font-medium opacity-90 mb-2">
              Sunday, 21st June 2026
            </p>
            <p className="text-xs md:text-sm font-sans text-petrol uppercase tracking-[0.2em] opacity-80 mb-6">
              10:00 AM onwards
            </p>

            {/* ADD TO CALENDAR BUTTON */}
            <a 
              href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Rohan+%26+Manasi+Engagement&dates=20260621T043000Z/20260621T103000Z&details=Join+us+for+the+Gol+Dhana+%26+Engagement+ceremony&location=Marigold+Banquets+and+Conventions"
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-2.5 mb-12 border border-petrol/30 rounded-full text-petrol text-xs uppercase tracking-[0.15em] hover:bg-petrol hover:text-white transition-colors"
            >
              <Calendar size={16} />
              Add to Calendar
            </a>

            {/* THE LOCATION */}
            <p className="text-xs md:text-sm font-sans text-petrol uppercase tracking-[0.2em] opacity-80 mb-6">
              Marigold Banquets 'N' Conventions
            </p>

            {/* VIEW ON MAP BUTTON */}
            <a 
              href="https://maps.app.goo.gl/q5Zr3ATGFGM4zGj97"
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-2.5 mb-12 border border-petrol/30 rounded-full text-petrol text-xs uppercase tracking-[0.15em] hover:bg-petrol hover:text-white transition-colors"
            >
              <MapPin size={16} />
              View on Map
            </a>

            {/* A clean visual separator before the final note */}
            <div className="w-full max-w-[150px] h-[1px] bg-petrol/20 mb-8"></div>

            <p className="text-xs md:text-sm font-sans text-petrol uppercase tracking-[0.3em] font-semibold opacity-90">
              Blessings Only
            </p>
            
          </div>
        </section>

      </div>
    </Layout>
  );
}