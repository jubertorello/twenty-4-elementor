'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, Variants } from 'motion/react';
import { Menu, X, ArrowRight, Instagram, Twitter, Linkedin, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

// --- Components ---

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
    { name: 'Studio', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Talents', href: '#talents' },
    { name: 'Team', href: '#team' },
  ];

  return (
    <div className="fixed top-0 left-0 w-full z-50 px-4 md:px-8 py-4 md:py-6 pointer-events-none">
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`max-w-7xl mx-auto w-full pointer-events-auto transition-all duration-500 rounded-[1.125rem] flex items-center justify-between px-6 md:px-10 py-3 md:py-4 border shadow-sm ${
          isScrolled 
            ? 'bg-white/90 backdrop-blur-md border-brand-green/10 shadow-xl' 
            : 'bg-white/10 backdrop-blur-sm border-white/20'
        }`}
      >
        {/* Logo */}
        <a href="#hero" className="relative h-8 w-40 md:h-10 md:w-48 transition-opacity duration-500 hover:opacity-80">
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
        </a>

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
            className={`hidden md:inline-flex px-6 py-2.5 rounded-lg text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-500 ${
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
              className="absolute top-full left-0 w-full mt-4 bg-white rounded-[1.125rem] p-8 shadow-2xl flex flex-col space-y-6 md:hidden border border-brand-green/10"
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
                  className="bg-brand-green text-brand-sand px-8 py-4 rounded-lg text-center text-[12px] uppercase tracking-[0.2em] font-bold shadow-lg"
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
    <section id="hero" ref={sectionRef} className="relative h-[100vh] w-full p-3">
      <motion.div 
        style={{ scale, opacity, y }}
        className="relative h-full w-full overflow-hidden rounded-[1.125rem] shadow-2xl bg-black"
      >
        {/* Background Video Embed */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <iframe
            src="https://talentfinder.cloud/embed/xwprl4mwl98f?autoplay=yes&loop=yes&kiosk=yes&fill=yes"
            className="absolute top-1/2 left-1/2 w-[100vw] h-[100vh] min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover opacity-70 pointer-events-none"
            allow="autoplay; fullscreen"
            style={{ border: 'none' }}
          />
          <div className="absolute inset-0 bg-black/30 z-10" />
        </div>

        <div className="relative z-20 h-full flex items-center justify-center text-center px-6">
          <div className="max-w-7xl">
            <motion.h1 
              variants={container}
              initial="hidden"
              animate="visible"
              className="text-white text-4xl md:text-6xl font-bold lg:text-[8.5rem] font-serif leading-[0.85] mb-10 text-balance tracking-tighter"
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
          <span className="text-[9px] uppercase tracking-[0.3em] font-bold">Discover More</span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-brand-sand/30 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
};

const BrandShowcase = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Section 2 Logic (Inverse): Scale down on enter, scale up on exit
  const scale = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [1.5, 1, 1, 1.5]);
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

  const text = "Where athletes become icons";
  const words = text.split(" ");

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const wordVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      filter: "blur(8px)",
    },
    visible: { 
      opacity: 1, 
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
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
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <section ref={sectionRef} className="relative py-24 md:py-40 overflow-hidden bg-transparent min-h-screen flex flex-col justify-center gap-6 md:gap-12">
      <motion.div 
        style={{ scale, opacity, y }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
        className="w-full flex flex-col gap-6 md:gap-12"
      >
        {/* Top Row */}
        <motion.div variants={rowVariants} className="flex justify-center items-center gap-4 md:gap-8 px-4 w-full">
          {topRow.map((src, i) => (
            <motion.div
              key={`top-${i}`}
              variants={imageVariants}
              className={`relative flex-shrink-0 w-44 h-32 md:w-64 md:h-44 lg:w-80 lg:h-56 rounded-[1.125rem] overflow-hidden shadow-2xl border border-brand-green/5 grayscale hover:grayscale-0 transition-all duration-500 ${
                i % 2 === 0 ? 'translate-y-4 md:translate-y-8' : '-translate-y-4 md:-translate-y-8'
              } ${
                i === 0 || i === 4 ? 'hidden xl:block' : ''
              }`}
            >
              <Image
                src={src}
                alt="Showcase"
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Central Content */}
        <div className="relative z-20 text-center px-6 max-w-7xl mx-auto">
          <motion.h2 
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            className="text-2xl md:text-4xl lg:text-6xl font-serif font-bold text-black leading-[0.95] tracking-tighter flex flex-wrap justify-center gap-x-[0.3em]"
          >
            {words.map((word, i) => (
              <motion.span key={i} variants={wordVariants} className="inline-block">
                {word}
              </motion.span>
            ))}
          </motion.h2>
        </div>

        {/* Bottom Row */}
        <motion.div variants={rowVariants} className="flex justify-center items-center gap-4 md:gap-8 px-4 w-full">
          {bottomRow.map((src, i) => (
            <motion.div
              key={`bottom-${i}`}
              variants={imageVariants}
              className={`relative flex-shrink-0 w-44 h-32 md:w-64 md:h-44 lg:w-80 lg:h-56 rounded-[1.125rem] overflow-hidden shadow-2xl border border-brand-green/5 grayscale hover:grayscale-0 transition-all duration-500 ${
                i % 2 === 0 ? '-translate-y-4 md:-translate-y-8' : 'translate-y-4 md:translate-y-8'
              } ${
                i === 0 || i === 4 ? 'hidden xl:block' : ''
              }`}
            >
              <Image
                src={src}
                alt="Showcase"
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

const Projects = () => {
  const projects = [
    {
      title: 'Editorial Campaign',
      category: 'Branding',
      img: 'https://picsum.photos/seed/p1/800/1000',
      year: '2024'
    },
    {
      title: 'Digital Experience',
      category: 'Web Design',
      img: 'https://picsum.photos/seed/p2/800/1000',
      year: '2023'
    },
    {
      title: 'Content Series',
      category: 'Production',
      img: 'https://picsum.photos/seed/p3/800/1000',
      year: '2024'
    }
  ];

  return (
    <section id="projects" className="py-24 md:py-40 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <span className="text-brand-green/40 uppercase tracking-widest text-xs mb-4 block font-bold">
            02 / SELECTED PROJECTS
          </span>
          <h2 className="text-4xl md:text-6xl font-serif text-brand-green">
            Crafting <span className="italic">digital legacies.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.125rem] mb-6">
                <Image
                  src={project.img}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-brand-green/40 mb-1">{project.category}</p>
                  <h3 className="text-2xl font-serif text-brand-green">{project.title}</h3>
                </div>
                <span className="text-xs font-bold text-brand-green/30">{project.year}</span>
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

  return (
    <section id="talents" className="py-24 md:py-40 px-6 md:px-12 bg-black text-white overflow-hidden w-full">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-start mb-20 gap-4">
          <span className="text-white uppercase tracking-widest text-xs block font-bold">
            03 / TALENTS
          </span>
          <h2 className="text-4xl md:text-6xl font-bold font-serif max-w-3xl leading-[1.05]">
            Built for impact
          </h2>
        </div>

        {/* Expanding Gallery */}
        <div className="flex flex-col md:flex-row gap-4 h-[500px] mb-32">
          {talents.map((talent, i) => (
            <motion.div
              key={i}
              onMouseEnter={() => setHoveredIndex(i)}
              className="relative overflow-hidden rounded-[1.125rem] cursor-pointer transition-all duration-700 ease-[0.22, 1, 0.36, 1]"
              animate={{
                flex: hoveredIndex === i ? 4 : 1,
              }}
            >
              <Image 
                src={talent.img}
                alt={talent.name}
                fill
                className="object-cover transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-500 ${hoveredIndex === i ? 'opacity-100' : 'opacity-40'}`} />
              
              {/* Content Overlay */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="bg-brand-green/80 backdrop-blur-md px-3 py-1 rounded-md text-[10px] uppercase tracking-widest font-bold text-brand-sand">
                    {talent.tag}
                  </span>
                </div>
                
                <AnimatePresence>
                  {hoveredIndex === i && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.4 }}
                    >
                      <h3 className="text-3xl font-serif font-bold mb-2">{talent.name}</h3>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-24">
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
              <h3 className="text-2xl font-serif leading-tight font-bold">{service.title}</h3>
              <p className="text-white text-sm leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};



const Team = () => {
  return (
    <section id="team" className="py-24 md:py-40 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <span className="text-brand-green/40 uppercase tracking-widest text-xs mb-4 block font-bold">
            04 / The Team
          </span>
          <h2 className="text-4xl md:text-6xl font-serif text-brand-green">
            Driven by <span className="italic">passion.</span>
          </h2>
        </div>

        <div className="bg-brand-sand/10 rounded-[1.125rem] p-8 md:p-20 flex flex-col lg:flex-row items-center gap-16 md:gap-24">
          {/* Left: Team Photo with Tilt */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative w-full lg:w-1/2"
          >
            <div className="relative aspect-[4/3] rounded-[1.125rem] overflow-hidden transform -rotate-3 hover:rotate-0 transition-transform duration-700 shadow-2xl">
              <Image 
                src="https://picsum.photos/seed/team-photo/1200/900"
                alt="Twenty4 Studios Team"
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>

          {/* Right: Quote and Info */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="w-full lg:w-1/2 space-y-10"
          >
            <blockquote className="text-3xl md:text-5xl font-serif text-brand-green leading-[1.1] tracking-tight">
              &ldquo;Nuestra visión es elevar el potencial de cada atleta a través de una narrativa visual única y una estrategia de marca impecable.&rdquo;
            </blockquote>
            
            <div className="space-y-2">
              <h4 className="text-xl font-bold text-brand-green">Julian V. CEO, Twenty4 Studios</h4>
              <p className="text-brand-green/50 text-sm font-medium tracking-wide">
                Liderando la intersección entre deporte y branding editorial.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  return (
    <section id="contact" className="py-24 md:py-40 px-6 md:px-12 bg-black text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div>
          <span className="text-white/40 uppercase tracking-widest text-xs mb-4 block font-bold">
            05 / Get in touch
          </span>
          <h2 className="text-5xl md:text-7xl font-serif text-white leading-tight mb-8">
            Let&apos;s build your <span className="italic">legacy together.</span>
          </h2>
          <p className="text-brand-sand/60 text-lg mb-12 max-w-md">
            Whether you&apos;re a brand looking for impact or an athlete aiming for the next level, we&apos;re here to help.
          </p>
          <div className="space-y-4">
            <p className="text-white font-serif text-2xl">hello@twenty4studios.com</p>
            <p className="text-brand-sand/60 uppercase tracking-widest text-xs font-bold">+44 (0) 20 7946 0000</p>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/5 backdrop-blur-md border border-white/10 p-8 md:p-12 rounded-[1.125rem]"
        >
          <form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-white/40">Name</label>
                <input type="text" className="w-full bg-transparent border-b border-white/20 py-2 focus:border-white outline-none transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-white/40">Email</label>
                <input type="email" className="w-full bg-transparent border-b border-white/20 py-2 focus:border-white outline-none transition-colors" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-white/40">Subject</label>
              <select className="w-full bg-transparent border-b border-white/20 py-2 focus:border-white outline-none transition-colors appearance-none">
                <option className="bg-black">New Project</option>
                <option className="bg-black">Talent Inquiry</option>
                <option className="bg-black">Partnership</option>
                <option className="bg-black">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-white/40">Message</label>
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

const Footer = () => {
  return (
    <footer className="bg-black text-brand-sand py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="md:col-span-2">
            <div className="relative h-10 w-48 mb-6">
              <Image
                src="https://res.cloudinary.com/djqtkbyez/image/upload/v1773914212/Twenty4_Long_White-cropped_au6yl4.svg"
                alt="Twenty4 Studios Logo"
                fill
                className="object-contain object-left"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-brand-sand/40 max-w-xs text-sm leading-relaxed">
              Elevating the narrative of modern sports through premium editorial branding and fashion-tech innovation.
            </p>
          </div>
          <div>
            <h5 className="text-[10px] uppercase tracking-widest font-bold mb-6 text-white">Navigation</h5>
            <ul className="space-y-4 text-sm text-brand-sand/60">
              <li><a href="#about" className="hover:text-white transition-colors">Studio</a></li>
              <li><a href="#projects" className="hover:text-white transition-colors">Projects</a></li>
              <li><a href="#talents" className="hover:text-white transition-colors">Talents</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-[10px] uppercase tracking-widest font-bold mb-6 text-white">Social</h5>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-white transition-colors"><Instagram size={20} /></a>
              <a href="#" className="hover:text-white transition-colors"><Twitter size={20} /></a>
              <a href="#" className="hover:text-white transition-colors"><Linkedin size={20} /></a>
            </div>
          </div>
        </div>
        <div className="pt-10 border-t border-brand-sand/10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-[0.2em] font-bold text-brand-sand/30">
          <p>© 2026 Twenty4 Studios. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Main Page ---

export default function LandingPage() {
  useEffect(() => {
    // Force scroll to top on initial load
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
      // Clear hash from URL to prevent browser from scrolling to a section
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    }
  }, []);

  return (
    <main className="relative min-h-screen bg-brand-gradient bg-fixed">
      <Navbar />
      <Hero />
      
      <div className="relative z-30">
        <BrandShowcase />
        <Projects />
        <Talents />
        <Team />
        <Contact />
        <Footer />
      </div>
      
      {/* Custom Cursor */}
      <CustomCursor />
    </main>
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
      className="fixed top-0 left-0 w-8 h-8 border border-brand-green rounded-3xl pointer-events-none z-[9999] hidden md:block"
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
