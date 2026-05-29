import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, MapPin } from 'lucide-react';
// 1. Change the import to Layout
import Layout from './components/Layout'; 

export default function App() {
  return (
    // 2. Wrap your content in Layout
    <Layout>
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-left w-full">
        
        {/* Left Column: Typography & Details */}
        <div className="flex-1 space-y-6">
          <span className="text-xs uppercase tracking-[0.3em] text-slate-500 block font-sans">
            Save The Date
          </span>
          <h1 className="text-4xl md:text-5xl font-bold font-serif tracking-tight text-petrol">
            A Daytime Garden Celebration
          </h1>
          <p className="text-lg text-slate-700 leading-relaxed max-w-lg font-light">
            We invite you to join us as we step into a new chapter, surrounded by the warmth of alabaster arches and shifting spring flora.
          </p>
          
          <div className="flex flex-col gap-3 pt-4 text-slate-600 font-medium">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-petrol" />
              <span>October 24, 2026</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-petrol" />
              <span>The Rajput Gardens, Virtual Experience</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive/Visual Element */}
        <div className="flex-1 flex justify-center items-center w-full min-h-[250px] bg-white/20 rounded-xl border border-white/40 shadow-inner">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ 
              repeat: Infinity, 
              duration: 8, 
              ease: "linear" 
            }}
            className="p-4 bg-petrol rounded-full shadow-lg text-white"
          >
            <Sparkles className="w-10 h-10" />
          </motion.div>
        </div>
        
      </div>
    </Layout>
  );
}