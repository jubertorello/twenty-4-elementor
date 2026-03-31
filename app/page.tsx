'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, Variants, useInView } from 'motion/react';
import { Menu, X, ArrowRight, Instagram, Twitter, Linkedin, ArrowUpRight, ChevronRight } from 'lucide-react';
import Image from 'next/image';

// --- Components ---

const LoadingScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden"
    >
      <div className="relative w-64 h-24 md:w-96 md:h-32">
        <motion.div
          initial={{ scale: 0.1, opacity: 0, filter: "blur(20px)" }}
          animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
          transition={{ 
            duration: 2, 
            ease: [0.22, 1, 0.36, 1], // Custom cubic-bezier for smooth zoom
          }}
          className="relative w-full h-full"
        >
          <Image
            src="https://res.cloudinary.com/djqtkbyez/image/upload/v1773912109/Twenty4_Short_White_qhrgmr.svg"
            alt="Twenty4 Studios Logo"
            fill
            className="object-contain"
            priority
          />
        </motion.div>
      </div>
      
      {/* Subtle background glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.2, scale: 1.5 }}
        transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
        className="absolute w-[500px] h-[500px] bg-brand-green/20 rounded-full blur-[120px] pointer-events-none"
      />
    </motion.div>
  );
};

const Navbar = ({ hide }: { hide?: boolean }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState<'ES' | 'EN'>('ES');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Projects', href: '#projects' },
    { name: 'Talents', href: '#talents' },
    { name: 'About Us', href: '#team' },
  ];

  return (
    <div className={`fixed top-0 left-0 w-full z-50 px-4 lg:px-8 py-4 lg:py-6 pointer-events-none transition-all duration-700 ${hide ? 'opacity-0 -translate-y-full' : 'opacity-100 translate-y-0'}`}>
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`max-w-7xl mx-auto w-full pointer-events-auto transition-all duration-500 rounded-[1.125rem] flex items-center justify-between px-6 lg:px-10 py-3 lg:py-4 border shadow-sm ${
          isScrolled 
            ? 'bg-white/10 backdrop-blur-md border-white/20 shadow-xl' 
            : 'bg-white/10 backdrop-blur-sm border-white/20'
        }`}
      >
        {/* Logo */}
        <a href="#hero" className="relative h-8 w-40 lg:h-10 lg:w-48 transition-opacity duration-500 hover:opacity-80">
          <Image
            src="https://res.cloudinary.com/djqtkbyez/image/upload/v1773914212/Twenty4_Long_White-cropped_au6yl4.svg"
            alt="Twenty4 Studios Logo"
            fill
            className="object-contain"
            referrerPolicy="no-referrer"
          />
        </a>

        {/* Desktop Menu */}
        <div className="hidden lg:flex space-x-8 items-center">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-[0.75rem] uppercase tracking-[0.2em] font-bold transition-colors duration-500 hover:opacity-50 text-white"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 text-[0.75rem] uppercase tracking-[0.2em] font-bold transition-colors duration-500 text-white/60">
            <button 
              onClick={() => setLanguage('ES')}
              className={`hover:opacity-100 transition-opacity pointer-events-auto ${language === 'ES' ? 'text-white opacity-100' : 'opacity-40'}`}
            >
              ES
            </button>
            <span className="opacity-20">|</span>
            <button 
              onClick={() => setLanguage('EN')}
              className={`hover:opacity-100 transition-opacity pointer-events-auto ${language === 'EN' ? 'text-white opacity-100' : 'opacity-40'}`}
            >
              EN
            </button>
          </div>
          <a 
            href="#contact"
            className="hidden lg:inline-flex px-6 py-2.5 rounded-lg text-[0.75rem] uppercase tracking-[0.2em] font-bold transition-all duration-500 bg-white text-brand-green hover:bg-brand-sand"
          >
            Contactar
          </a>
          
          {/* Mobile Toggle */}
          <button 
            className="lg:hidden transition-colors duration-500 text-white"
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
              className="absolute top-full left-0 w-full mt-4 bg-white rounded-[1.125rem] p-8 shadow-2xl flex flex-col space-y-6 lg:hidden border border-brand-green/10"
            >
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[1rem] font-serif italic text-brand-green border-b border-brand-green/5 pb-2"
                >
                  {link.name}
                </a>
              ))}
              <div className="flex flex-col gap-6 pt-4">
                <a 
                  href="#contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="bg-brand-green text-brand-sand px-8 py-4 rounded-lg text-center text-[1rem] uppercase tracking-[0.2em] font-bold shadow-lg"
                >
                  Contactar
                </a>
                <div className="flex gap-4 items-center justify-center">
                  <button 
                    onClick={() => setLanguage('ES')}
                    className={`text-[1rem] uppercase tracking-[0.2em] font-bold transition-opacity ${language === 'ES' ? 'text-brand-green opacity-100' : 'text-brand-green/40'}`}
                  >
                    ES
                  </button>
                  <span className="text-brand-green/20">|</span>
                  <button 
                    onClick={() => setLanguage('EN')}
                    className={`text-[1rem] uppercase tracking-[0.2em] font-bold transition-opacity ${language === 'EN' ? 'text-brand-green opacity-100' : 'text-brand-green/40'}`}
                  >
                    EN
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
};

const Hero = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Section 1 Logic: Scale up on enter, scale down on exit
  const scale = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0.5, 1, 1, 0.5]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [100, 0, 0, -100]);

  const line1 = "Sports Content".split(" ");
  const line2 = "& Brand Partnerships".split(" ");

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const wordVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 10,
      filter: "blur(8px)",
      color: "rgba(255, 255, 255, 0)"
    },
    visible: { 
      opacity: 1, 
      y: 0,
      filter: "blur(0px)",
      color: "rgba(255, 255, 255, 1)",
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
  };

  return (
    <section id="hero" ref={sectionRef} className="relative h-[100vh] w-full p-3 bg-brand-green">
      <motion.div 
        style={{ scale, opacity, y }}
        className="relative h-full w-full overflow-hidden rounded-[1.125rem] shadow-2xl bg-brand-green"
      >
        {/* Background Video Embed */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <iframe
            src="https://talentfinder.cloud/embed/xwprl4mwl98f?autoplay=yes&loop=yes&kiosk=yes&fill=yes"
            className="absolute top-1/2 left-1/2 w-[100vw] h-[100vh] min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover opacity-70 pointer-events-none"
            allow="autoplay; fullscreen"
            style={{ border: 'none' }}
          />
        </div>

        <div className="relative z-20 h-full flex items-center justify-center text-center px-6">
          <div className="max-w-7xl">
            <motion.h1 
              variants={container}
              initial="hidden"
              animate="visible"
              className="text-white text-4xl md:text-7xl lg:text-[6rem] font-serif font-black leading-[0.85] mb-10 text-balance tracking-tighter"
            >
              <div className="flex flex-wrap justify-center gap-x-[0.2em]">
                {line1.map((word, i) => (
                  <motion.span key={i} variants={wordVariants} className="inline-block">
                    {word}
                  </motion.span>
                ))}
              </div>
              <div className="flex flex-wrap justify-center gap-x-[0.2em]">
                {line2.map((word, i) => (
                  <motion.span key={i} variants={wordVariants} className="inline-block">
                    {word}
                  </motion.span>
                ))}
              </div>
            </motion.h1>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-brand-sand/30 flex flex-col items-center gap-3"
        >
          <span className="text-[9px] md:text-[11px] uppercase tracking-[0.3em] font-bold">Discover More</span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-brand-sand/30 to-transparent" />
        </motion.div>
      </motion.div>
      
      {/* Bottom Gradient Transition to Black */}
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-black to-transparent pointer-events-none z-40" />
    </section>
  );
};

const BrandShowcase = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Section 2 Logic: Opacity and Y translation
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [-100, 0, 0, 100]);

  const topRow = [
    'https://res.cloudinary.com/djqtkbyez/image/upload/v1774774203/588626340_17937020454117098_1616832114950864925_n_poa6a8.jpg',
    'https://res.cloudinary.com/djqtkbyez/image/upload/v1773939249/531600444_17921122038117098_5360922844406571590_n_xyddjc.jpg',
    'https://res.cloudinary.com/djqtkbyez/image/upload/v1773939096/479487334_17895797886117098_1135703105300039762_n_m9g8ha.jpg',
    'https://res.cloudinary.com/djqtkbyez/image/upload/v1773938918/475271473_17893917237117098_3840431804277799553_n_gewozi.jpg',
    'https://res.cloudinary.com/djqtkbyez/image/upload/v1774773890/655970916_17956930692117098_2415210670614176645_n_zedqh4.jpg',
  ];

  const bottomRow = [
    'https://res.cloudinary.com/djqtkbyez/image/upload/v1774774204/625562433_17945187636117098_3562246760192146692_n_bmfydx.jpg',
    'https://res.cloudinary.com/djqtkbyez/image/upload/v1774773890/654026590_17956035957117098_5856671028597925931_n_unocse.jpg',
    'https://res.cloudinary.com/djqtkbyez/image/upload/v1773938918/625013552_17943968889117098_1308860520742695209_n_z7m4kq.jpg',
    'https://res.cloudinary.com/djqtkbyez/image/upload/v1774774175/655511938_17956930713117098_1078108901050426995_n_b6yzqw.jpg',
    'https://res.cloudinary.com/djqtkbyez/image/upload/v1774774174/655199745_17956930731117098_1449537988951363301_n_e4xbis.jpg',
  ];

  const text = "Where Athletes Become Icons";
  const words = text.split(" ");

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const wordVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 10,
      filter: "blur(8px)",
      color: "rgba(255, 255, 255, 0)"
    },
    visible: { 
      opacity: 1, 
      y: 0,
      filter: "blur(0px)",
      color: "rgba(255, 255, 255, 1)",
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
  };

  const sectionVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const rowVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 1, 
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.1
      }
    }
  };

  const imageVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-40 overflow-hidden bg-transparent min-h-screen flex flex-col justify-center gap-6 lg:gap-12">
      <motion.div 
        style={{ opacity, y }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
        className="w-full flex flex-col gap-6 lg:gap-12"
      >
        {/* Top Row - Infinite Scroll Right to Left */}
        <div className="w-full overflow-hidden py-8 lg:py-12">
          <motion.div 
            variants={rowVariants}
            animate={{ x: ["0%", "-50%"] }}
            transition={{ 
              x: {
                duration: 40, 
                repeat: Infinity, 
                ease: "linear" 
              },
              default: { duration: 1 }
            }}
            className="flex gap-4 lg:gap-8 px-4 w-max"
          >
            {[...topRow, ...topRow].map((src, i) => (
              <div 
                key={`top-${i}`} 
                className={`flex-shrink-0 ${i % 2 === 0 ? 'translate-y-4 lg:translate-y-8' : '-translate-y-4 lg:-translate-y-8'}`}
              >
                <motion.div
                  variants={imageVariants}
                  className="relative w-44 h-32 lg:w-80 lg:h-56 rounded-[1.125rem] overflow-hidden shadow-2xl border border-brand-green/5 grayscale hover:grayscale-0 transition-all duration-500"
                >
                  <Image
                    src={src}
                    alt="Showcase"
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Central Content */}
        <div className="relative z-20 text-center px-6 max-w-7xl mx-auto">
          <motion.h2 
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            className="text-2xl md:text-4xl lg:text-[3.125rem] font-serif font-bold text-white leading-[0.95] tracking-tighter flex flex-wrap justify-center gap-x-[0.3em]"
          >
            {words.map((word, i) => (
              <motion.span key={i} variants={wordVariants} className="inline-block">
                {word}
              </motion.span>
            ))}
          </motion.h2>
        </div>

        {/* Bottom Row - Infinite Scroll Left to Right */}
        <div className="w-full overflow-hidden py-8 lg:py-12">
          <motion.div 
            variants={rowVariants}
            animate={{ x: ["-50%", "0%"] }}
            transition={{ 
              x: {
                duration: 40, 
                repeat: Infinity, 
                ease: "linear" 
              },
              default: { duration: 1 }
            }}
            className="flex gap-4 lg:gap-8 px-4 w-max"
          >
            {[...bottomRow, ...bottomRow].map((src, i) => (
              <div 
                key={`bottom-${i}`} 
                className={`flex-shrink-0 ${i % 2 === 0 ? '-translate-y-4 lg:-translate-y-8' : 'translate-y-4 lg:translate-y-8'}`}
              >
                <motion.div
                  variants={imageVariants}
                  className="relative w-44 h-32 lg:w-80 lg:h-56 rounded-[1.125rem] overflow-hidden shadow-2xl border border-brand-green/5 grayscale hover:grayscale-0 transition-all duration-500"
                >
                  <Image
                    src={src}
                    alt="Showcase"
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

const Projects = () => {
  const projects = [
    {
      title: 'BARO',
      category: 'Netflix Documentation',
      description: 'The story of a man who changed German rap forever. A deep dive into the life and legacy of an icon.',
      img: 'https://res.cloudinary.com/djqtkbyez/image/upload/v1774773890/654026590_17956035957117098_5856671028597925931_n_unocse.jpg',
      year: '2024',
      videoUrl: 'https://player.vimeo.com/progressive_redirect/playback/1102574741/rendition/2160p/file.mp4?loc=external&log_user=0&signature=cbfdb8d1762b90739e851c2faca190fb0dea5c608d86e3e24e0261f36fa7332e',
      isVideoEmbed: false
    },
    {
      title: 'YouTube Festival',
      category: 'Event Production',
      description: 'Together with Google, we explored how generative AI is reshaping brand storytelling at the YouTube Festival 2024.',
      img: 'https://res.cloudinary.com/djqtkbyez/image/upload/v1773939096/479487334_17895797886117098_1135703105300039762_n_m9g8ha.jpg',
      year: '2024',
      videoUrl: 'https://player.vimeo.com/progressive_redirect/playback/1109107424/rendition/1080p/file.mp4?loc=external&log_user=0&signature=d14d2b21294c474b4a376647b638c254d4f99ea2a56e8e1b747746d512808c6d',
      isVideoEmbed: false
    },
    {
      title: 'OpenAI in Germany',
      category: 'Tech Showcase',
      description: 'OpenAI\'s arrival in Germany became a space for artistic exploration with two immersive pieces produced by TWENTY4.',
      img: 'https://res.cloudinary.com/djqtkbyez/image/upload/v1774795013/525533485_17919021303117098_6405116482587988328_n_pz9zch.jpg',
      year: '2023',
      videoUrl: 'https://talentfinder.cloud/embed/7hma475c3nrk?autoplay=yes&loop=yes&kiosk=yes&fill=yes',
      isVideoEmbed: true
    },
    {
      title: 'Sundance 2024',
      category: 'Film Festival',
      description: 'The rise, the trends, and what\'s next for indie cinema. A cinematic journey through the world\'s premier film festival.',
      img: 'https://res.cloudinary.com/djqtkbyez/image/upload/v1773938918/475271473_17893917237117098_3840431804277799553_n_gewozi.jpg',
      year: '2024',
      videoUrl: 'https://talentfinder.cloud/embed/d8ay25a4mwdd?autoplay=yes&loop=yes&kiosk=yes&fill=yes',
      isVideoEmbed: true
    },
    {
      title: 'Vattenfall Solar',
      category: 'Documentary',
      description: 'How can an energy company credibly position itself as a pioneer of a fossil-free future? Telling real stories.',
      img: 'https://res.cloudinary.com/djqtkbyez/image/upload/v1774774174/655199745_17956930731117098_1449537988951363301_n_e4xbis.jpg',
      year: '2023',
      videoUrl: 'https://player.vimeo.com/progressive_redirect/playback/1102574741/rendition/2160p/file.mp4?loc=external&log_user=0&signature=cbfdb8d1762b90739e851c2faca190fb0dea5c608d86e3e24e0261f36fa7332e',
      isVideoEmbed: false
    }
  ];

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const title = "Selected Work";
  const words = title.split(" ");

  const titleContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const wordVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 10,
      filter: "blur(8px)",
      color: "rgba(255, 255, 255, 0)"
    },
    visible: { 
      opacity: 1, 
      y: 0,
      filter: "blur(0px)",
      color: "rgba(255, 255, 255, 1)",
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
  };

  return (
    <section id="projects" className="py-24 lg:py-40 px-6 lg:px-12 bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="mb-32 lg:mb-48 text-left flex flex-col items-start">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-white/40 uppercase tracking-[0.3em] text-xs md:text-sm mb-6 block font-bold"
          >
            02 / PROJECTS
          </motion.span>
          <motion.h2 
            variants={titleContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            className="text-4xl md:text-6xl lg:text-[4.5rem] font-serif font-black text-white leading-[0.8] tracking-tighter flex flex-wrap gap-x-[0.3em]"
          >
            {words.map((word, i) => (
              <motion.span key={i} variants={wordVariants} className="inline-block">
                {word}
              </motion.span>
            ))}
          </motion.h2>
        </div>

        <div className="space-y-32 lg:space-y-64">
          {projects.map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-24 items-center`}
            >
              {/* Image Container */}
              <div 
                className="w-full lg:w-3/5"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="relative aspect-[4/5] lg:aspect-[16/10] overflow-hidden rounded-[1.125rem] group bg-black">
                  <Image
                    src={project.img}
                    alt={project.title}
                    fill
                    className={`object-cover transition-all duration-700 ${hoveredIndex === i ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Video Overlay */}
                  <div className={`absolute inset-0 transition-opacity duration-500 ${hoveredIndex === i ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    {hoveredIndex === i && (
                      project.isVideoEmbed ? (
                        <iframe
                          src={project.videoUrl}
                          className="w-full h-full object-cover"
                          allow="autoplay; fullscreen"
                          style={{ border: 'none' }}
                        />
                      ) : (
                        <video
                          src={project.videoUrl}
                          autoPlay
                          muted
                          loop
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      )
                    )}
                  </div>

                  <div className={`absolute inset-0 bg-black/10 transition-opacity duration-500 ${hoveredIndex === i ? 'opacity-0' : 'opacity-100'}`} />
                </div>
              </div>

              {/* Text Content */}
              <div className="w-full lg:w-2/5 space-y-6 lg:space-y-8">
                <div className="space-y-2">
                  <p className="text-xs md:text-sm uppercase tracking-widest font-bold text-white/40">
                    {project.category}
                  </p>
                  <h3 className="text-4xl md:text-5xl lg:text-[3.125rem] font-serif font-black text-white leading-tight">
                    {project.title}
                  </h3>
                </div>
                
                <p className="text-white/70 text-lg md:text-xl leading-relaxed max-w-md">
                  {project.description}
                </p>

                <div className="pt-4">
                  <button className="group flex items-center gap-4 text-white font-bold uppercase tracking-widest text-xs md:text-sm">
                    <span>View Case Study</span>
                    <div className="w-10 h-[1px] bg-white/30 group-hover:w-16 transition-all duration-500" />
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Talents = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(0);

  const talents = [
    { 
      name: 'Juan Lebrón', 
      tag: 'Padel', 
      img: 'https://res.cloudinary.com/djqtkbyez/image/upload/v1774783981/656067117_18464630485103231_6128771137241890857_n_rfok3q.jpg',
      description: 'Representing the peak of modern tennis with a focus on precision and power.'
    },
    { 
      name: 'Coki Nieto', 
      tag: 'Padel', 
      img: 'https://res.cloudinary.com/djqtkbyez/image/upload/v1773938919/509099364_17913543999117098_66790166839734862_n_zqfkgr.jpg',
      description: 'A dynamic force on the court, redefining the role of the modern point guard.'
    },
    { 
      name: 'Jon Sanz', 
      tag: 'Padel', 
      img: 'https://res.cloudinary.com/djqtkbyez/image/upload/v1773938918/514705923_17915526867117098_2707657693738721723_n_wi9n8z.jpg',
      description: 'Breaking records and barriers in world-class sprinting competitions.'
    },
    { 
      name: 'Claudia Fernandez', 
      tag: 'Padel', 
      img: 'https://res.cloudinary.com/djqtkbyez/image/upload/v1774783833/582862944_17933448663117098_1238044410887099727_n_dc4g1w.jpg',
      description: 'Olympic gold medalist with a passion for aquatic excellence.'
    },
    { 
      name: 'Sofia Araujo', 
      tag: 'Padel', 
      img: 'https://res.cloudinary.com/djqtkbyez/image/upload/v1774784855/657222434_18574609390034562_3547455622250560859_n_enefcy.jpg',
      description: 'Artistic gymnast known for her grace and technical mastery.'
    },
    { 
      name: 'Jairo Bautista', 
      tag: 'Futbol', 
      img: 'https://res.cloudinary.com/djqtkbyez/image/upload/v1773938918/625013552_17943968889117098_1308860520742695209_n_z7m4kq.jpg',
      description: 'Rising star in Formula racing with exceptional track vision and speed.'
    }
  ];

  const services = [
    {
      number: '01',
      title: 'SOCIAL MEDIA & CONTENT CREATION',
      description: 'Creación de contenido de alta calidad, desde reels hasta documentales, capturando la esencia de cada talento.'
    },
    {
      number: '02',
      title: 'BRANDING & CREATIVITIES',
      description: 'Planificación y ejecución de calendarios editoriales para maximizar el impacto en redes sociales.'
    },
    {
      number: '03',
      title: 'DIGITAL STRATEGY',
      description: 'Desarrollo de la identidad visual y narrativa para conectar con audiencias globales.'
    }
  ];

  const title = "Built For Impact";
  const words = title.split(" ");

  const titleContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const wordVariantsTitle: Variants = {
    hidden: { 
      opacity: 0, 
      y: 10,
      filter: "blur(8px)",
      color: "rgba(255, 255, 255, 0)"
    },
    visible: { 
      opacity: 1, 
      y: 0,
      filter: "blur(0px)",
      color: "rgba(255, 255, 255, 1)",
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
  };

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section id="talents" className="py-24 lg:py-40 px-6 lg:px-12 bg-black text-white overflow-hidden w-full">
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex flex-col items-start mb-20 gap-4">
          <motion.span variants={itemVariants} className="text-white uppercase tracking-widest text-xs md:text-sm block font-bold">
            03 / TALENTS
          </motion.span>
          <motion.h2 
            variants={titleContainer}
            className="text-4xl md:text-6xl lg:text-[4.5rem] font-black font-serif max-w-3xl leading-[1.05] flex flex-wrap gap-x-[0.3em]"
          >
            {words.map((word, i) => (
              <motion.span key={i} variants={wordVariantsTitle} className="inline-block">
                {word}
              </motion.span>
            ))}
          </motion.h2>
        </div>

        {/* Expanding Gallery */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-4 h-auto lg:h-[650px] mb-32">
          {talents.map((talent, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`relative overflow-hidden rounded-[0.5rem] cursor-pointer transition-all duration-700 ease-[0.22, 1, 0.36, 1] w-full h-[500px] lg:h-full group ${
                hoveredIndex === i ? 'lg:flex-[4]' : 'lg:flex-1'
              }`}
            >
              <Image 
                src={talent.img}
                alt={talent.name}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className={`absolute inset-0 bg-gradient-to-t from-black via-brand-green/20 to-transparent transition-opacity duration-500 ${hoveredIndex === i ? 'opacity-100' : 'opacity-60 lg:opacity-40'}`} />
              
              {/* Content Overlay */}
              <div className="absolute inset-0 p-8 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                </div>
                
                <div className={`space-y-4 transition-all duration-500 ${hoveredIndex === i ? 'opacity-100 translate-y-0' : 'lg:opacity-0 lg:translate-y-10'}`}>
                  <div className="overflow-hidden">
                    <motion.h3 
                      className="text-3xl md:text-4xl lg:text-5xl font-serif text-white uppercase leading-tight"
                    >
                      {talent.name}
                    </motion.h3>
                  </div>
                  
                  {/* Mobile & Desktop Info */}
                  <a 
                    href="https://www.instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-white/80 hover:text-white transition-colors w-fit group/link"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-[0.2em] font-bold">VIEW ON INSTAGRAM</span>
                    </div>
                    <div className="w-8 h-[1px] bg-white/30 group-hover/link:w-12 transition-all duration-500" />
                    <ChevronRight className="w-4 h-4" />
                  </a>

                  {/* Desktop Hover Info (Optional additional details) */}
                  <AnimatePresence>
                    {hoveredIndex === i && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4 }}
                        className="hidden lg:block"
                      >
                        <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">
                          Professional Athlete
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-24">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="space-y-6"
            >
              <div className="text-white font-serif text-5xl font-bold">
                {service.number}
              </div>
              <h3 className="text-2xl md:text-3xl font-serif leading-tight font-black">{service.title}</h3>
              <p className="text-white text-sm md:text-base leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};



const AboutUs = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const features = [
    {
      title: "Branding & Strategy",
      description: "Elevamos la identidad de cada atleta a través de una narrativa visual única y una estrategia de marca impecable.",
      image: "https://res.cloudinary.com/djqtkbyez/image/upload/v1774773890/653060378_17956036014117098_6147440382387293_n_vqfcrn.jpg"
    },
    {
      title: "Content Creation",
      description: "Producción de contenido premium que captura la esencia del deporte y la moda con una estética editorial.",
      image: "https://res.cloudinary.com/djqtkbyez/image/upload/v1774773890/654031290_17956035993117098_4433731200775056854_n_rp4pvn.jpg"
    },
    {
      title: "Digital Presence",
      description: "Maximizamos el impacto digital con estrategias innovadoras y una gestión de redes sociales de alto nivel.",
      image: "https://res.cloudinary.com/djqtkbyez/image/upload/v1774860454/654596267_17956035960117098_3415009189650686711_n_v0xekc.jpg"
    }
  ];

  const title = "Driven By Passion";
  const wordsTitle = title.split(" ");

  const titleContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const wordVariantsTitle: Variants = {
    hidden: { 
      opacity: 0, 
      y: 10,
      filter: "blur(8px)",
      color: "rgba(255, 255, 255, 0)"
    },
    visible: { 
      opacity: 1, 
      y: 0,
      filter: "blur(0px)",
      color: "rgba(255, 255, 255, 1)",
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
  };

  return (
    <section id="team" className="relative py-24 lg:py-40 px-6 lg:px-12 overflow-hidden min-h-[800px]">
      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Header Section - Now separated and styled like Projects */}
        <div className="mb-20 lg:mb-32 text-left flex flex-col items-start">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-white/40 uppercase tracking-[0.3em] text-xs md:text-sm mb-6 block font-bold"
          >
            04 / ABOUT US
          </motion.span>
          <motion.h2 
            variants={titleContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            className="text-4xl md:text-6xl lg:text-[4.5rem] font-serif font-black text-white leading-[0.8] tracking-tighter flex flex-wrap gap-x-[0.3em]"
          >
            {wordsTitle.map((word, i) => (
              <motion.span key={i} variants={wordVariantsTitle} className="inline-block">
                {word}
              </motion.span>
            ))}
          </motion.h2>
        </div>

        {/* Centered Statement */}
        <div className="mb-32 text-center max-w-5xl mx-auto">
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.04,
                  delayChildren: 0.2,
                },
              },
            }}
            className="text-white/70 text-lg md:text-xl leading-relaxed text-white tracking-tight italic font-serif flex flex-wrap justify-center gap-x-[0.3em]"
          >
            {"Nuestra visión es elevar el potencial de cada talento a través de una narrativa visual única y una estrategia de marca impecable. Born in 2019 to help athletes and brands find authentic, genuine ways to enhance their narratives and express who they are.".split(" ").map((word, i) => (
              <motion.span
                key={i}
                variants={{
                  hidden: { 
                    opacity: 0, 
                    y: 8,
                    filter: "blur(12px)",
                    scale: 0.98
                  },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    filter: "blur(0px)",
                    scale: 1,
                    transition: {
                      duration: 0.8,
                      ease: [0.22, 1, 0.36, 1]
                    }
                  },
                }}
                className="inline-block"
              >
                {word}
              </motion.span>
            ))}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left: Interactive List */}
          <div className="space-y-12">
            <div className="flex flex-col gap-8">
              {features.map((feature, i) => (
                <button
                  key={i}
                  onMouseEnter={() => setActiveIndex(i)}
                  className="text-left group"
                >
                  <h3 className={`text-4xl md:text-5xl lg:text-[3.125rem] font-serif transition-all duration-500 ${
                    activeIndex === i ? 'text-white' : 'text-white/20 hover:text-white/40'
                  }`}>
                    {feature.title}
                  </h3>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Featured Card */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative aspect-[4/3] lg:aspect-[1.2/1] rounded-[2rem] overflow-hidden shadow-2xl group"
              >
                <Image 
                  src={features[activeIndex].image}
                  alt={features[activeIndex].title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* UI-like Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                <div className="absolute bottom-8 left-8 right-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-2"
                  >
                    <h4 className="text-2xl font-serif font-bold text-white">
                      {features[activeIndex].title}
                    </h4>
                    <p className="text-white/70 text-sm max-w-sm leading-relaxed">
                      {features[activeIndex].description}
                    </p>
                  </motion.div>
                </div>

                {/* Decorative UI elements */}
                <div className="absolute top-6 right-6 flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-white/20" />
                  <div className="w-2 h-2 rounded-full bg-white/20" />
                  <div className="w-2 h-2 rounded-full bg-white/40" />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Floating elements to mimic the UI feel of the reference image */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 w-32 h-32 bg-brand-green backdrop-blur-xl border border-white/10 rounded-2xl hidden lg:block overflow-hidden shadow-xl"
            >
              <Image
                src="https://res.cloudinary.com/djqtkbyez/image/upload/v1773912109/Twenty4_Short_White_qhrgmr.svg"
                alt="Twenty4 Studio Logo"
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const title = "Get In Touch.";
  const words = title.split(" ");

  const titleContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const wordVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 10,
      filter: "blur(8px)",
      color: "rgba(255, 255, 255, 0)"
    },
    visible: { 
      opacity: 1, 
      y: 0,
      filter: "blur(0px)",
      color: "rgba(255, 255, 255, 1)",
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
  };

  return (
    <section id="contact" className="relative py-24 lg:py-40 px-6 lg:px-12 text-white overflow-hidden">
      {/* Background with Blur */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 opacity-40">
          <Image 
            src="https://res.cloudinary.com/djqtkbyez/image/upload/v1774860454/654596267_17956035960117098_3415009189650686711_n_v0xekc.jpg"
            alt="Contact Background"
            fill
            className="object-cover blur-2xl scale-110"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
      {/* Top Gradient Transition from Black */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-black to-transparent pointer-events-none z-10" />
      
      {/* Bottom Gradient Transition to Footer Green */}
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-brand-green to-transparent pointer-events-none z-10" />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 relative z-20">
        <div>
          <span className="text-brand-sand/40 uppercase tracking-widest text-xs md:text-sm mb-4 block font-bold">
            05 / Contact 
          </span>
          <motion.h2 
            variants={titleContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            className="text-5xl md:text-6xl lg:text-[4.5rem] font-serif font-black text-brand-sand leading-tight mb-8 flex flex-wrap gap-x-[0.3em]"
          >
            {words.map((word, i) => (
              <motion.span 
                key={i} 
                variants={wordVariants} 
              >
                {word}
              </motion.span>
            ))}
          </motion.h2>
          <p className="text-brand-sand/60 text-lg mb-12 max-w-md">
            Reach out, drop a line, or just say hey — we’re here to connect, create, and turn bold ideas into reality
          </p>
          <div className="space-y-4">
            <p className="text-brand-sand font-serif text-2xl md:text-3xl">hello@twenty4studios.com</p>
            <p className="text-brand-sand/60 uppercase tracking-widest text-xs md:text-sm font-bold">+44 (0) 20 7946 0000</p>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/5 backdrop-blur-md border border-white/10 p-8 lg:p-12 rounded-[1.125rem]"
        >
          <form className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] md:text-[12px] uppercase tracking-widest font-bold text-white/40">Name</label>
                <input type="text" className="w-full bg-transparent border-b border-white/20 py-2 focus:border-white outline-none transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] md:text-[12px] uppercase tracking-widest font-bold text-white/40">Email</label>
                <input type="email" className="w-full bg-transparent border-b border-white/20 py-2 focus:border-white outline-none transition-colors" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] md:text-[12px] uppercase tracking-widest font-bold text-white/40">Subject</label>
              <select className="w-full bg-transparent border-b border-white/20 py-2 focus:border-white outline-none transition-colors appearance-none">
                <option className="bg-black">New Project</option>
                <option className="bg-black">Talent Inquiry</option>
                <option className="bg-black">Partnership</option>
                <option className="bg-black">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] md:text-[12px] uppercase tracking-widest font-bold text-white/40">Message</label>
              <textarea rows={4} className="w-full bg-transparent border-b border-white/20 py-2 focus:border-white outline-none transition-colors resize-none"></textarea>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-white text-brand-green py-4 rounded-lg uppercase tracking-widest text-xs font-bold"
            >
              Send Message
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

const Footer = ({ footerRef }: { footerRef: React.RefObject<HTMLDivElement | null> }) => {
  return (
    <footer ref={footerRef} className="bg-brand-green p-3 min-h-[600px] flex flex-col">
      <div className="bg-brand-sand rounded-[1.125rem] flex-grow flex flex-col p-8 lg:p-16 relative overflow-hidden">
        {/* Large Logo Background/Top */}
        <div className="w-full px-4 md:px-8 lg:px-0 mb-8 lg:mb-12">
          <div className="relative h-[15vh] md:h-[25vh] lg:h-[35vh] xl:h-[45vh] w-full">
            <Image
              src="https://res.cloudinary.com/djqtkbyez/image/upload/v1774858243/Twenty4_Long_Green-cropped_enulok.svg"
              alt="Twenty4 Studios Logo"
              fill
              className="object-contain object-center"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        <div className="mt-auto space-y-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <p className="text-brand-green text-xl md:text-2xl lg:text-3xl font-serif leading-relaxed">
              we help brand and athletes find that <span className="text-brand-green text-xl md:text-2xl lg:text-3xl font-serif font-black" >.thing</span>
            </p>
            <div className="flex space-x-6 text-brand-green">
              <a href="#" className="hover:opacity-50 transition-opacity"><Instagram size={24} /></a>
              <a href="#" className="hover:opacity-50 transition-opacity"><Twitter size={24} /></a>
              <a href="#" className="hover:opacity-50 transition-opacity"><Linkedin size={24} /></a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 lg:justify-items-start">
            <div>
              <h5 className="text-[10px] uppercase tracking-widest font-bold mb-6 text-brand-green/40">Navigation</h5>
              <ul className="space-y-4 text-sm text-brand-green font-bold uppercase tracking-wider">
                <li><a href="#hero" className="hover:opacity-50 transition-opacity">Studio</a></li>
                <li><a href="#projects" className="hover:opacity-50 transition-opacity">Projects</a></li>
                <li><a href="#talents" className="hover:opacity-50 transition-opacity">Talents</a></li>
                <li><a href="#contact" className="hover:opacity-50 transition-opacity">Contact</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-[10px] uppercase tracking-widest font-bold mb-6 text-brand-green/40">Legal</h5>
              <ul className="space-y-4 text-sm text-brand-green font-bold uppercase tracking-wider">
                <li><a href="#" className="hover:opacity-50 transition-opacity">Privacy Policy</a></li>
                <li><a href="#" className="hover:opacity-50 transition-opacity">Terms of Service</a></li>
                <li><a href="#" className="hover:opacity-50 transition-opacity">Cookies</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-10 border-t border-brand-green/10 flex flex-col lg:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-[0.2em] font-bold text-brand-green/30">
          <p>© 2026 Twenty4 Studios. All rights reserved.</p>
          <p>Built for Icons.</p>
        </div>
      </div>
    </footer>
  );
};

// --- Main Page ---

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2800);

    // Force scroll to top on initial load
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
      // Clear hash from URL to prevent browser from scrolling to a section
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    }

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const handleScroll = () => {
      if (footerRef.current) {
        const rect = footerRef.current.getBoundingClientRect();
        // If the top of the footer is within 100px of the viewport height from the bottom
        // or if any part of the footer is in view
        setIsFooterVisible(rect.top < window.innerHeight - 100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    setTimeout(handleScroll, 100); 
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading]);

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <LoadingScreen key="loader" />
      ) : (
        <motion.main 
          key="main"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative min-h-screen bg-black bg-fixed"
        >
          <Navbar hide={isFooterVisible} />
          <Hero />
          
          <div className="relative z-30">
            <BrandShowcase />
            <Projects />
            <Talents />
            <AboutUs />
            <Contact />
            <Footer footerRef={footerRef} />
          </div>
          
          {/* Custom Cursor */}
          <CustomCursor />
        </motion.main>
      )}
    </AnimatePresence>
  );
}

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, a, input, select, textarea')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 border border-brand-green rounded-3xl pointer-events-none z-[9999] hidden lg:block"
      animate={{
        x: position.x - 16,
        y: position.y - 16,
        scale: isHovering ? 2 : 1,
        backgroundColor: isHovering ? 'rgba(34, 51, 13, 0.1)' : 'transparent',
      }}
      transition={{ type: 'spring', damping: 20, stiffness: 250, mass: 0.5 }}
    />
  );
}
