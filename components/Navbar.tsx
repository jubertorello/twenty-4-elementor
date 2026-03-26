'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Talent', href: '#talent' },
    { name: 'Team', href: '#team' },
  ];

  return (
    <div className="fixed top-0 left-0 w-full z-50 px-4 md:px-8 py-4 md:py-6 pointer-events-none">
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`max-w-7xl mx-auto w-full pointer-events-auto transition-all duration-500 rounded-3xl flex items-center justify-between px-6 md:px-10 py-3 md:py-4 border shadow-sm ${
          isScrolled 
            ? 'bg-white/90 backdrop-blur-md border-brand-green/10 shadow-xl' 
            : 'bg-white/10 backdrop-blur-sm border-white/20'
        }`}
      >
        {/* Logo */}
        <div className="relative h-8 w-40 md:h-10 md:w-48 transition-opacity duration-500">
          <Image
            src={isScrolled 
              ? "https://res.cloudinary.com/djqtkbyez/image/upload/v1774551593/Twenty4_Long_Black-cropped_u1gkti.svg" 
              : "https://res.cloudinary.com/djqtkbyez/image/upload/v1773914212/Twenty4_Long_White-cropped_au6yl4.svg"
            }
            alt="Twenty4 Studios Logo"
            fill
            className="object-contain"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 items-center">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`text-[11px] uppercase tracking-[0.2em] font-bold transition-colors duration-500 hover:opacity-50 ${
                isScrolled ? 'text-brand-green' : 'text-white'
              }`}
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex items-center gap-4">
          <button className={`hidden lg:block text-[11px] uppercase tracking-[0.2em] font-bold transition-colors duration-500 ${isScrolled ? 'text-brand-green/60' : 'text-white/60'}`}>
            ES | EN
          </button>
          <a 
            href="#contact"
            className={`hidden md:inline-flex px-6 py-2.5 rounded-3xl text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-500 ${
              isScrolled 
                ? 'bg-brand-green text-brand-sand hover:bg-brand-green/90' 
                : 'bg-white text-brand-green hover:bg-brand-sand'
            }`}
          >
            Contactar
          </a>
          
          {/* Mobile Toggle */}
          <button 
            className={`md:hidden transition-colors duration-500 ${isScrolled ? 'text-brand-green' : 'text-white'}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute top-full left-0 w-full mt-4 bg-white rounded-3xl p-8 shadow-2xl flex flex-col space-y-6 md:hidden border border-brand-green/10"
            >
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-serif italic text-brand-green border-b border-brand-green/5 pb-2"
                >
                  {link.name}
                </a>
              ))}
              <div className="flex flex-col gap-6 pt-4">
                <a 
                  href="#contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="bg-brand-green text-brand-sand px-8 py-4 rounded-3xl text-center text-[12px] uppercase tracking-[0.2em] font-bold shadow-lg"
                >
                  Contactar
                </a>
                <div className="flex gap-4 items-center justify-center">
                  <button className="text-[11px] uppercase tracking-[0.2em] font-bold text-brand-green">ES</button>
                  <span className="text-brand-green/20">|</span>
                  <button className="text-[11px] uppercase tracking-[0.2em] font-bold text-brand-green/40">EN</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
};

export default Navbar;
