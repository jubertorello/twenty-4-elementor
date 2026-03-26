'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);

  return (
    <section className="relative h-[100vh] w-full p-3">
      <div className="relative h-full w-full overflow-hidden rounded-3xl shadow-2xl bg-black">
        {/* Background Video */}
        <motion.div style={{ y: y1 }} className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-70"
          >
            <source src="https://res.cloudinary.com/djqtkbyez/video/upload/v1773939713/AQPCIeYYjm6mufKklZburDD_JGfhW50-ZZlITu1c9R2sfca0oBhFQnv-VdHtUB6NcKynYNeRQPb8xlrf-Q9mbA6X_arypeo.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/30 z-10" />
        </motion.div>

        <div className="relative z-20 h-full flex items-center justify-center text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-7xl"
          >
            <h1 className="text-white text-5xl md:text-8xl lg:text-[8.5rem] font-serif leading-[0.85] mb-10 text-balance tracking-tighter">
              Sports Content <br />
              <span>& Brand Partnerships</span>
            </h1>
            <p className="text-brand-sand/80 text-lg md:text-2xl font-light max-w-3xl mx-auto text-balance leading-relaxed italic">
              Connecting the world of elite sports with high-end editorial branding.
            </p>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-brand-sand/30 flex flex-col items-center gap-3"
        >
          <span className="text-[9px] uppercase tracking-[0.3em] font-bold">Discover More</span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-brand-sand/30 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
