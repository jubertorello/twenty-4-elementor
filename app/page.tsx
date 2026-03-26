'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
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
              <span className="italic font-light">& Brand Partnerships</span>
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

const Projects = () => {
  const projects = [
    { title: 'The Sprint Series', category: 'Branding', img: 'https://picsum.photos/seed/p1/800/800' },
    { title: 'Neon Velocity', category: 'Digital', img: 'https://picsum.photos/seed/p2/800/800' },
    { title: 'Peak Performance', category: 'Editorial', img: 'https://picsum.photos/seed/p3/800/800' },
    { title: 'Urban Athlete', category: 'Campaign', img: 'https://picsum.photos/seed/p4/800/800' },
  ];

  return (
    <section id="projects" className="py-24 md:py-40 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <span className="text-brand-green/40 uppercase tracking-widest text-xs mb-4 block font-bold">
              02 / Selected Works
            </span>
            <h2 className="text-4xl md:text-6xl font-serif text-brand-green">
              Crafting <span className="italic">legacies.</span>
            </h2>
          </div>
          <p className="text-brand-green/60 max-w-xs text-sm uppercase tracking-wider leading-relaxed">
            A curated selection of our most impactful collaborations between global brands and elite athletes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {projects.map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-square overflow-hidden mb-6 bg-brand-sand">
                <Image 
                  src={project.img}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-brand-green/0 group-hover:bg-brand-green/20 transition-colors duration-500" />
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                   <div className="w-12 h-12 bg-white rounded-3xl flex items-center justify-center text-brand-green">
                      <ArrowUpRight size={24} />
                   </div>
                </div>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-serif text-brand-green mb-1">{project.title}</h3>
                  <p className="text-brand-gray text-xs uppercase tracking-widest font-bold">{project.category}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

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

const Team = () => {
  const team = [
    { name: 'Julian V.', role: 'Creative Director', img: 'https://picsum.photos/seed/tm1/400/500' },
    { name: 'Sofia M.', role: 'Brand Strategist', img: 'https://picsum.photos/seed/tm2/400/500' },
    { name: 'Alex K.', role: 'Tech Lead', img: 'https://picsum.photos/seed/tm3/400/500' },
    { name: 'Elena P.', role: 'Talent Manager', img: 'https://picsum.photos/seed/tm4/400/500' },
  ];

  return (
    <section id="team" className="py-24 md:py-40 px-6 md:px-12 bg-brand-sand">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <span className="text-brand-green/40 uppercase tracking-widest text-xs mb-4 block font-bold">
            04 / The Team
          </span>
          <h2 className="text-4xl md:text-6xl font-serif text-brand-green">
            Driven by <span className="italic">passion.</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {team.map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="relative aspect-square mb-6 overflow-hidden rounded-3xl grayscale hover:grayscale-0 transition-all duration-500 border border-brand-green/10 p-2">
                <div className="relative w-full h-full overflow-hidden rounded-3xl">
                  <Image 
                    src={member.img}
                    alt={member.name}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <h4 className="text-xl font-serif text-brand-green">{member.name}</h4>
              <p className="text-brand-green/50 text-[10px] uppercase tracking-widest font-bold mt-1">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

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
              <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#projects" className="hover:text-white transition-colors">Projects</a></li>
              <li><a href="#talent" className="hover:text-white transition-colors">Talent</a></li>
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
  return (
    <main className="relative min-h-screen bg-gradient-to-b from-brand-green to-brand-sand">
      <Navbar />
      <Hero />
      <div className="relative bg-white rounded-3xl shadow-2xl z-30 mx-4 md:mx-6 lg:mx-8 mb-8 overflow-hidden">
        <About />
        <Projects />
        <Talent />
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
