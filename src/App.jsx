import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';
import Layout from './components/Layout'; 

export default function App() {
  return (
    <Layout>
      {/* 1. Edge-to-Edge Video Hero */}
      <div className="relative w-full">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-auto object-cover block"
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Elegant Glass Pill Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 z-10 pointer-events-none">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            // Replaced the large light-glass-box with the tight button-style glass
            className="bg-white/20 backdrop-blur-md shadow-[0_8px_32px_0_rgba(0,0,0,0.25)] border border-white/30 px-10 py-8 rounded-[2.5rem] flex flex-col items-center"
          >
            {/* Top Text */}
            <span className="text-sm md:text-base uppercase tracking-[0.25em] font-serif text-petrol mb-3">
              We Are Getting Engaged
            </span>
            
            {/* Horizontal Decorative Divider */}
            <div className="flex items-center w-full max-w-[240px] mb-4 opacity-60">
              <div className="h-[1px] flex-grow bg-petrol"></div>
              <span className="px-3 text-petrol text-lg leading-none">✧</span>
              <div className="h-[1px] flex-grow bg-petrol"></div>
            </div>

            {/* Cursive Names */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-vibes text-petrol drop-shadow-sm flex items-center gap-3">
              <span>Rohan</span>
              <span className="text-3xl md:text-4xl font-serif opacity-70">&</span>
              <span>Mansi</span>
            </h1>
          </motion.div>
        </div>
      </div>

      {/* 2. Details Section */}
      <div className="w-full max-w-4xl mx-auto px-4 md:px-8 -mt-12 md:-mt-24 relative z-20 pb-20">
        <div className="light-glass-box flex flex-col md:flex-row gap-8 items-start p-8 md:p-12">
          
          <div className="flex-1 space-y-4">
            <h2 className="text-3xl font-serif text-petrol">A New Chapter Begins</h2>
            <p className="text-lg text-slate-700 leading-relaxed font-light">
              We invite you to join us as we step into a new chapter, surrounded by the warmth of alabaster arches and shifting spring flora.
            </p>
          </div>
          
          <div className="flex-1 flex flex-col gap-4 text-slate-600 font-medium md:pt-2 w-full">
            <div className="flex items-center gap-4 bg-white/50 p-4 rounded-lg border border-white/40">
              <Calendar className="w-6 h-6 text-petrol flex-shrink-0" />
              <span>October 24, 2026 <br/><span className="text-sm font-light text-slate-500">Starts at 4:00 PM</span></span>
            </div>
            <div className="flex items-center gap-4 bg-white/50 p-4 rounded-lg border border-white/40">
              <MapPin className="w-6 h-6 text-petrol flex-shrink-0" />
              <span>The Rajput Gardens <br/><span className="text-sm font-light text-slate-500">Virtual & In-Person Experience</span></span>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}