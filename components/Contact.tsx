'use client';

import React from 'react';
import { motion } from 'motion/react';

const Contact = () => {
  return (
    <section id="contact" className="py-24 md:py-40 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div>
          <span className="text-brand-green/40 uppercase tracking-widest text-xs mb-4 block font-bold">
            05 / Get in touch
          </span>
          <h2 className="text-5xl md:text-7xl font-serif text-brand-green leading-tight mb-8">
            Let&apos;s build your <span className="italic">legacy together.</span>
          </h2>
          <p className="text-brand-green/60 text-lg mb-12 max-w-md">
            Whether you&apos;re a brand looking for impact or an athlete aiming for the next level, we&apos;re here to help.
          </p>
          <div className="space-y-4">
            <p className="text-brand-green font-serif text-2xl">hello@twenty4studios.com</p>
            <p className="text-brand-green/60 uppercase tracking-widest text-xs font-bold">+44 (0) 20 7946 0000</p>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-brand-sand p-8 md:p-12 rounded-3xl"
        >
          <form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-brand-green/40">Name</label>
                <input type="text" className="w-full bg-transparent border-b border-brand-green/20 py-2 focus:border-brand-green outline-none transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-brand-green/40">Email</label>
                <input type="email" className="w-full bg-transparent border-b border-brand-green/20 py-2 focus:border-brand-green outline-none transition-colors" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-brand-green/40">Subject</label>
              <select className="w-full bg-transparent border-b border-brand-green/20 py-2 focus:border-brand-green outline-none transition-colors appearance-none">
                <option>New Project</option>
                <option>Talent Inquiry</option>
                <option>Partnership</option>
                <option>Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-brand-green/40">Message</label>
              <textarea rows={4} className="w-full bg-transparent border-b border-brand-green/20 py-2 focus:border-brand-green outline-none transition-colors resize-none"></textarea>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-brand-green text-brand-sand py-4 rounded-3xl uppercase tracking-widest text-xs font-bold"
            >
              Send Message
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
