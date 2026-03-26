'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

const About = () => {
  return (
    <section id="about" className="py-24 md:py-40 px-6 md:px-12 bg-brand-sand">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-brand-green/40 uppercase tracking-widest text-xs mb-4 block font-bold">
            01 / Who we are
          </span>
          <h2 className="text-4xl md:text-6xl font-serif text-brand-green leading-tight mb-8">
            An editorial approach to <span className="italic">athletic excellence.</span>
          </h2>
          <div className="space-y-6 text-brand-green/70 text-lg leading-relaxed max-w-lg">
            <p>
              Twenty4 Studios is more than a branding agency. We are a creative collective dedicated to elevating the narrative of modern athletes.
            </p>
            <p>
              By blending high-fashion aesthetics with cutting-edge technology, we create digital experiences that resonate with a global audience.
            </p>
          </div>
          <motion.div 
            className="mt-12"
            whileHover={{ x: 10 }}
          >
            <a href="#" className="flex items-center gap-4 text-brand-green font-bold uppercase tracking-widest text-xs">
              Our Philosophy <ArrowRight size={16} />
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl shadow-2xl"
        >
          <Image 
            src="https://picsum.photos/seed/studio-vibe/800/1000"
            alt="Studio Vibe"
            fill
            className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default About;
