'use client';

import React from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';

const Talent = () => {
  const talents = [
    { name: 'Elena Rossi', sport: 'Tennis', img: 'https://picsum.photos/seed/t1/600/800' },
    { name: 'Marcus Chen', sport: 'Basketball', img: 'https://picsum.photos/seed/t2/600/800' },
    { name: 'Sarah Jenkins', sport: 'Athletics', img: 'https://picsum.photos/seed/t3/600/800' },
  ];

  return (
    <section id="talent" className="py-24 md:py-40 px-6 md:px-12 bg-brand-green text-brand-sand overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <span className="text-brand-sand/40 uppercase tracking-widest text-xs mb-4 block font-bold">
            03 / Our Talent
          </span>
          <h2 className="text-5xl md:text-8xl font-serif italic mb-6">The Elite Collective</h2>
          <p className="text-brand-sand/60 max-w-xl mx-auto text-lg font-light">
            We represent a new generation of athletes who understand the power of personal branding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {talents.map((talent, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="group"
            >
              <div className="relative aspect-[3/4] mb-8 overflow-hidden rounded-3xl">
                <Image 
                  src={talent.img}
                  alt={talent.name}
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-brand-green/20 mix-blend-multiply" />
              </div>
              <h3 className="text-3xl font-serif mb-2">{talent.name}</h3>
              <p className="text-brand-sand/40 uppercase tracking-[0.2em] text-[10px] font-bold">{talent.sport}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Talent;
