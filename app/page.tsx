'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, Variants, useInView } from 'motion/react';
import { Menu, X, ArrowRight, Instagram, Twitter, Linkedin, ArrowUpRight, ChevronRight, Mail, Check } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { projects as staticProjects } from './data/projects';
import { supabase } from '@/lib/supabase';

// --- Context ---
export type Language = 'ES' | 'EN';
export const LanguageContext = React.createContext<{ language: Language; setLanguage: (l: Language) => void }>({ language: 'ES', setLanguage: () => { } });
export const useLanguage = () => React.useContext(LanguageContext);

// --- Components ---

const LoadingScreen = () => {
  const [logo, setLogo] = useState("https://res.cloudinary.com/djqtkbyez/image/upload/v1773912109/Twenty4_Short_White_qhrgmr.svg");
  useEffect(() => {
    supabase.from('site_settings').select('data').eq('id', 'general').single().then(({ data: res }) => {
      if (res?.data?.loading_logo_url) setLogo(res.data.loading_logo_url);
      else if (res?.data?.header_logo_url) setLogo(res.data.header_logo_url);
    });
  }, []);

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
            src={logo}
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
  const { language, setLanguage } = useLanguage();
  const [logo, setLogo] = useState("https://res.cloudinary.com/djqtkbyez/image/upload/v1773914212/Twenty4_Long_White-cropped_au6yl4.svg");

  useEffect(() => {
    supabase.from('site_settings').select('data').eq('id', 'general').single().then(({ data: res }) => {
      if (res?.data?.header_logo_url) setLogo(res.data.header_logo_url);
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = language === 'ES'
    ? [
      { name: 'Proyectos', href: '#projects' },
      { name: 'Talentos & Marcas', href: '#talents' },
      { name: 'Quiénes Somos', href: '#team' },
    ]
    : [
      { name: 'Projects', href: '#projects' },
      { name: 'Talents & Brands', href: '#talents' },
      { name: 'About Us', href: '#team' },
    ];

  return (
    <div className={`fixed top-0 left-0 w-full z-50 px-4 lg:px-8 py-4 lg:py-6 pointer-events-none transition-all duration-700 ${hide ? 'opacity-0 -translate-y-full' : 'opacity-100 translate-y-0'}`}>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`max-w-7xl mx-auto w-full pointer-events-auto transition-all duration-500 rounded-[1.125rem] flex items-center justify-between px-4 lg:px-10 py-3 lg:py-4 border shadow-sm ${isScrolled
          ? 'bg-white/10 backdrop-blur-md border-white/20 shadow-xl'
          : 'bg-white/10 backdrop-blur-sm border-white/20'
          }`}
      >
        {/* Logo */}
        <a href="#hero" className="relative h-8 w-40 lg:h-10 lg:w-48 transition-opacity duration-500 hover:opacity-80">
          <Image
            src={logo}
            alt="Twenty4 Studios Logo"
            fill
            className="object-contain object-left"
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
            {language === 'ES' ? 'Contactar' : 'Contact'}
          </a>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden transition-colors duration-500 text-white p-0"
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
              className="absolute top-full left-0 w-full mt-4 bg-black/95 backdrop-blur-xl rounded-[1.125rem] p-8 shadow-2xl flex flex-col space-y-6 lg:hidden border border-white/10"
            >
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[1.25rem] uppercase tracking-[0.2em] font-bold text-white border-b border-white/10 pb-4"
                >
                  {link.name}
                </a>
              ))}
              <div className="flex flex-col gap-6 pt-4">
                <a
                  href="#contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="bg-white text-brand-green px-8 py-4 rounded-lg text-center text-[1rem] uppercase tracking-[0.2em] font-bold shadow-lg hover:bg-brand-sand transition-colors"
                >
                  Contactar
                </a>
                <div className="flex gap-4 items-center justify-center">
                  <button
                    onClick={() => setLanguage('ES')}
                    className={`text-[1rem] uppercase tracking-[0.2em] font-bold transition-opacity ${language === 'ES' ? 'text-white opacity-100' : 'text-white/40'}`}
                  >
                    ES
                  </button>
                  <span className="text-white/20">|</span>
                  <button
                    onClick={() => setLanguage('EN')}
                    className={`text-[1rem] uppercase tracking-[0.2em] font-bold transition-opacity ${language === 'EN' ? 'text-white opacity-100' : 'text-white/40'}`}
                  >
                    EN
                  </button>
                </div>
                <div className="flex gap-8 items-center justify-center pt-4 border-t border-white/10">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[0.75rem] uppercase tracking-[0.2em] font-bold text-white/60 hover:text-white transition-colors"
                  >
                    Instagram
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[0.75rem] uppercase tracking-[0.2em] font-bold text-white/60 hover:text-white transition-colors"
                  >
                    Linkedin
                  </a>
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

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    supabase.from('site_settings').select('data').eq('id', 'hero').single().then(({ data: res }) => {
      if (res?.data) {
        setData(res.data);
      }
    });
  }, []);

  const defaultTitle = "sports content &\nbrands partnerships";
  const defaultVideoUrl = "https://talentfinder.cloud/embed/xwprl4mwl98f?autoplay=yes&loop=yes&kiosk=yes&fill=yes";

  const { language } = useLanguage();
  const currentLang = language.toLowerCase();
  const titleRaw = data?.[`title_${currentLang}`] || data?.title_es || defaultTitle;
  const lines = titleRaw.split('\n');
  const line1 = (lines[0] || "").split(" ").filter((w: string) => w);
  const line2 = (lines[1] || "").split(" ").filter((w: string) => w);

  const rawUrl = data?.videoUrl || defaultVideoUrl;
  let bgVideoUrl = rawUrl;
  if (rawUrl.includes('youtube.com/watch') || rawUrl.includes('youtu.be/')) {
    const videoId = rawUrl.includes('youtu.be/') ? rawUrl.split('youtu.be/')[1].split('?')[0] : new URLSearchParams(rawUrl.split('?')[1]).get('v');
    bgVideoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&mute=1&controls=0&playlist=${videoId}`;
  } else if (rawUrl.includes('vimeo.com/') && !rawUrl.includes('player.vimeo.com')) {
    const match = rawUrl.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (match) bgVideoUrl = `https://player.vimeo.com/video/${match[1]}?background=1&autoplay=1&loop=1&byline=0&title=0`;
  }

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
        {/* Background Media */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {data?.type === 'image' ? (
            <Image
              src={data.imageUrl}
              alt="Hero Background"
              fill
              className="object-cover opacity-70"
              priority
              referrerPolicy="no-referrer"
            />
          ) : (
            bgVideoUrl && (
              <iframe
                src={bgVideoUrl}
                className="absolute top-1/2 left-1/2 w-[100vw] h-[100vh] min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover opacity-70 pointer-events-none"
                allow="autoplay; fullscreen"
                style={{ border: 'none' }}
              />
            )
          )}
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
                {line1.map((word: string, i: number) => (
                  <motion.span key={i} variants={wordVariants} className="inline-block">
                    {word}
                  </motion.span>
                ))}
              </div>
              <div className="flex flex-wrap justify-center gap-x-[0.2em]">
                {line2.map((word: string, i: number) => (
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

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    supabase.from('site_settings').select('data').eq('id', 'presentation').single().then(({ data: res }) => {
      if (res?.data) {
        setData(res.data);
      }
    });
  }, []);

  const defaultTopRow = [
    'https://res.cloudinary.com/djqtkbyez/image/upload/v1774774203/588626340_17937020454117098_1616832114950864925_n_poa6a8.jpg',
    'https://res.cloudinary.com/djqtkbyez/image/upload/v1773939249/531600444_17921122038117098_5360922844406571590_n_xyddjc.jpg',
    'https://res.cloudinary.com/djqtkbyez/image/upload/v1773939096/479487334_17895797886117098_1135703105300039762_n_m9g8ha.jpg',
    'https://res.cloudinary.com/djqtkbyez/image/upload/v1773938918/475271473_17893917237117098_3840431804277799553_n_gewozi.jpg',
    'https://res.cloudinary.com/djqtkbyez/image/upload/v1774773890/655970916_17956930692117098_2415210670614176645_n_zedqh4.jpg',
  ];

  const defaultBottomRow = [
    'https://res.cloudinary.com/djqtkbyez/image/upload/v1774774204/625562433_17945187636117098_3562246760192146692_n_bmfydx.jpg',
    'https://res.cloudinary.com/djqtkbyez/image/upload/v1774773890/654026590_17956035957117098_5856671028597925931_n_unocse.jpg',
    'https://res.cloudinary.com/djqtkbyez/image/upload/v1773938918/625013552_17943968889117098_1308860520742695209_n_z7m4kq.jpg',
    'https://res.cloudinary.com/djqtkbyez/image/upload/v1774774175/655511938_17956930713117098_1078108901050426995_n_b6yzqw.jpg',
    'https://res.cloudinary.com/djqtkbyez/image/upload/v1774774174/655199745_17956930731117098_1449537988951363301_n_e4xbis.jpg',
  ];

  const gallery = data?.gallery && data.gallery.length > 0 ? data.gallery : [...defaultTopRow, ...defaultBottomRow];
  const half = Math.ceil(gallery.length / 2);
  const topRow = gallery.slice(0, half);
  const bottomRow = gallery.slice(half);

  const { language } = useLanguage();
  const currentLang = language.toLowerCase();
  const textRaw = data?.[`text_${currentLang}`] || data?.text_es || "Where Athletes Become Icons";
  const words = textRaw.split(" ").filter(Boolean);

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
    <section ref={sectionRef} className="relative py-20 lg:py-32 overflow-hidden bg-transparent min-h-screen flex flex-col justify-center gap-6 lg:gap-12">
      <motion.div
        style={{ opacity, y }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
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
                  {src && (
                    <Image
                      src={src}
                      alt="Showcase"
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  )}
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
            viewport={{ once: true, amount: 0.1 }}
            className="text-2xl md:text-4xl lg:text-[3.125rem] font-serif font-bold text-white leading-[0.95] tracking-tighter flex flex-wrap justify-center gap-x-[0.3em]"
          >
            {words.map((word: string, i: number) => (
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
                  {src && (
                    <Image
                      src={src}
                      alt="Showcase"
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  )}
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
  const { language } = useLanguage();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [projectsList, setProjectsList] = useState<any[]>(staticProjects);
  const [loading, setLoading] = useState(true);
  const [sectionTitle, setSectionTitle] = useState({ es: 'Trabajo Seleccionado', en: 'Selected Work' });

  useEffect(() => {
    const fetchProjects = async () => {
      const [projectsRes, settingsRes] = await Promise.all([
        supabase
          .from('projects')
          .select('*')
          .eq('is_archived', false)
          .order('order_index', { ascending: true })
          .limit(6),
        supabase.from('site_settings').select('data').eq('id', 'projects').single(),
      ]);

      if (projectsRes.data && projectsRes.data.length > 0) {
        const lang = language.toLowerCase();
        setProjectsList(projectsRes.data.map(p => ({
          slug: p.slug,
          title: p[`title_${lang}`] || p.title_es,
          category: p[`category_${lang}`] || p.category_es,
          description: p[`mini_description_${lang}`] || p[`description_${lang}`] || p.mini_description_es || p.description_es,
          img: p.image_url,
          videoUrl: p.video_url,
          isVideoEmbed: p.is_video_embed,
          year: p.year,
          has_case_study: p.has_case_study
        })));
      }

      if (settingsRes.data?.data) {
        setSectionTitle({
          es: settingsRes.data.data.title_es || 'Trabajo Seleccionado',
          en: settingsRes.data.data.title_en || 'Selected Work',
        });
      }

      setLoading(false);
    };

    fetchProjects();
  }, []);

  const title = language === 'ES' ? sectionTitle.es : sectionTitle.en;
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
    <section id="projects" className="relative py-20 lg:py-32 px-6 lg:px-12 bg-black overflow-hidden">
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
          {projectsList.map((project, i) => (
            <div key={i} className="flex flex-col gap-12">
              <motion.div
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
                    {project.img && (
                      <Image
                        src={project.img}
                        alt={project.title}
                        fill
                        className={`object-cover transition-all duration-700 ${hoveredIndex === i ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}
                        referrerPolicy="no-referrer"
                      />
                    )}

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

                  <div className="pt-4 min-h-[40px]">
                    {project.has_case_study && (
                      <Link
                        href={`/projects/${project.slug}`}
                        className="group flex items-center gap-4 text-white font-bold uppercase tracking-widest text-xs md:text-sm"
                      >
                        <span>View Case Study</span>
                        <div className="w-10 h-[1px] bg-white/30 group-hover:w-16 transition-all duration-500" />
                        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Talents = () => {
  const { language } = useLanguage();
  const [talents, setTalents] = useState<any[]>([]);
  const [brands, setBrands] = useState<{ name: string, logo: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [talentsSettings, setTalentsSettings] = useState<any>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    supabase.from('talents')
      .select('*')
      .eq('is_archived', false)
      .order('order_index', { ascending: true })
      .then(({ data }) => {
        if (data) setTalents(data);
      });

    // 2. Fetch Brands & Services & General Settings
    supabase.from('site_settings').select('id, data').in('id', ['talents', 'about', 'general']).then(({ data }) => {
      const talentsData = data?.find(d => d.id === 'talents')?.data;

      if (talentsData) {
        setTalentsSettings(talentsData);
        if (Array.isArray(talentsData.brands)) {
          setBrands(
            talentsData.brands
              .filter((b: any) => !(typeof b === 'object' && b?.is_archived))
              .map((b: any) => ({
                name: typeof b === 'string' ? 'Brand' : (b?.name || 'Brand'),
                logo: typeof b === 'string' ? b : (b?.url || '')
              }))
          );
        }
      }
      setLoading(false);
    });
  }, []);

  if (loading) return null;
  if (talents.length === 0) return null;

  const currentLang = language.toLowerCase();

  const title = (language === 'ES' ? talentsSettings?.title_es : talentsSettings?.title_en) || "Built For Impact";
  const words = title.split(" ").filter(Boolean);

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
    <section id="talents" className="relative py-20 lg:py-32 px-6 lg:px-12 bg-black text-white overflow-hidden w-full">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
        variants={sectionVariants}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="flex flex-col gap-4">
            <motion.span variants={itemVariants} className="text-white uppercase tracking-widest text-xs md:text-sm block font-bold">
              03 / TALENTS & BRANDS
            </motion.span>
            <motion.h2
              variants={titleContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="text-4xl md:text-6xl lg:text-[4.5rem] font-black font-serif max-w-3xl leading-[1.05] flex flex-wrap gap-x-[0.3em]"
            >
              {words.map((word: string, i: number) => (
                <motion.span key={i} variants={wordVariantsTitle} className="inline-block">
                  {word}
                </motion.span>
              ))}
            </motion.h2>
          </div>
        </div>

        {/* Talent Grid: Flex accordion on desktop, 2-col grid on mobile */}

        {/* Desktop accordion */}
        <div className="hidden lg:flex gap-3 mb-32 h-[650px]">
          {talents.map((talent, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`relative overflow-hidden rounded-[0.5rem] cursor-pointer h-full transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                hoveredIndex === i ? 'flex-[3]' : 'flex-[1]'
              }`}
            >
              {talent.image_url && (
                <Image
                  src={talent.image_url}
                  alt={talent.name}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              )}
              <div className={`absolute inset-0 bg-gradient-to-t from-black via-brand-green/20 to-transparent transition-opacity duration-500 ${hoveredIndex === i ? 'opacity-100' : 'opacity-40'}`} />
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className={`space-y-4 transition-all duration-500 ${hoveredIndex === i ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  <div className="overflow-hidden">
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white uppercase leading-tight">
                      {talent.name}
                    </h3>
                  </div>
                  <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">
                    {talent[`category_${currentLang}`] || talent.category_es}
                  </p>
                  <a
                    href={talent.instagram_url || "https://www.instagram.com"}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="flex items-center gap-3 text-white/80 hover:text-white transition-colors w-fit group/link"
                  >
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold">View on Instagram</span>
                    <div className="w-8 h-[1px] bg-white/30 group-hover/link:w-12 transition-all duration-500" />
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile grid */}
        <div className="lg:hidden grid grid-cols-2 gap-3 mb-32">
          {talents.map((talent, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="relative overflow-hidden rounded-[0.5rem] cursor-pointer h-[500px]"
            >
              {talent.image_url && (
                <Image
                  src={talent.image_url}
                  alt={talent.name}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
              <div className="absolute inset-0 p-4 flex flex-col justify-end">
                <h3 className="text-2xl font-serif text-white uppercase leading-tight">{talent.name}</h3>
                <p className="text-white/50 text-[9px] uppercase tracking-widest font-bold mt-1">
                  {talent[`category_${currentLang}`] || talent.category_es}
                </p>
              </div>
            </motion.div>
          ))}
        </div>


        {/* Brand Ticker */}
        <div className="relative py-20 overflow-hidden -mx-6 lg:-mx-12 bg-black mb-32">
          <div className="flex whitespace-nowrap">
            <motion.div
              animate={{ x: ["0%", "-100%"] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="flex items-center gap-16 md:gap-24 px-8 md:px-12"
            >
              {brands.map((brand, i) => (
                <div key={i} className="flex items-center gap-6 md:gap-8 text-white/50 font-black text-3xl md:text-5xl tracking-tighter group">
                  <span className="text-white/10 font-light text-4xl md:text-6xl transition-colors group-hover:text-brand-green">[</span>
                  {brand.logo ? (
                    <div className="relative w-32 md:w-48 h-8 md:h-12 opacity-70 group-hover:opacity-100 transition-all duration-500">
                      <Image
                        src={brand.logo}
                        alt={brand.name}
                        fill
                        className="object-contain brightness-0 invert"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ) : (
                    <span className="hover:text-white transition-all duration-500 cursor-default">{brand.name}</span>
                  )}
                  <span className="text-white/10 font-light text-4xl md:text-6xl transition-colors group-hover:text-brand-green">]</span>
                </div>
              ))}
            </motion.div>
            <motion.div
              animate={{ x: ["0%", "-100%"] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="flex items-center gap-16 md:gap-24 px-8 md:px-12"
            >
              {brands.map((brand, i) => (
                <div key={i + 10} className="flex items-center gap-6 md:gap-8 text-white/50 font-black text-3xl md:text-5xl tracking-tighter group">
                  <span className="text-white/10 font-light text-4xl md:text-6xl transition-colors group-hover:text-brand-green">[</span>
                  {brand.logo ? (
                    <div className="relative w-32 md:w-48 h-8 md:h-12 opacity-70 group-hover:opacity-100 transition-all duration-500">
                      <Image
                        src={brand.logo}
                        alt={brand.name}
                        fill
                        className="object-contain brightness-0 invert"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ) : (
                    <span className="hover:text-white transition-all duration-500 cursor-default">{brand.name}</span>
                  )}
                  <span className="text-white/10 font-light text-4xl md:text-6xl transition-colors group-hover:text-brand-green">]</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Experience Section */}
        {talentsSettings?.experience && talentsSettings.experience.some((e: any) => e.title_es || e.title_en) && (
          <div className="max-w-7xl mx-auto px-0 lg:px-0 grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border border-white/10 rounded-3xl overflow-hidden">
            {talentsSettings.experience.map((item: any, i: number) => {
              const expTitle = (language === 'ES' ? item.title_es : item.title_en) || item.title_es || '';
              const expDesc = (language === 'ES' ? item.description_es : item.description_en) || item.description_es || '';
              if (!expTitle && !expDesc) return null;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                  className="bg-black p-10 lg:p-14 space-y-4 group hover:bg-white/5 transition-colors duration-500"
                >
                  <span className="text-brand-green font-black text-4xl leading-none">0{i + 1}</span>
                  <h3 className="text-xl lg:text-2xl font-black uppercase tracking-tight text-white">{expTitle}</h3>
                  <p className="text-sm text-white/50 leading-relaxed font-light">{expDesc}</p>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </section>
  );
};



const defaultFeatures = [
  {
    title: "Producción",
    description: "Damos vida a las ideas a través de contenido visualmente impactante y con fuerza. Desde el concepto hasta la entrega final, gestionamos cada paso del proceso.",
    image: "https://res.cloudinary.com/djqtkbyez/image/upload/v1774773890/653060378_17956036014117098_6147440382387293_n_vqfcrn.jpg"
  },
  {
    title: "Social Media",
    description: "Ayudamos a los atletas y las marcas a hacer crecer sus comunidades y conectar con su audiencia de manera auténtica y estratégica.",
    image: "https://res.cloudinary.com/djqtkbyez/image/upload/v1774773890/654031290_17956035993117098_4433731200775056854_n_rp4pvn.jpg"
  },
  {
    title: "Contenido",
    description: "Creamos historias únicas que posicionan a nuestros clientes en el punto de mira. Diseñamos contenido con un propósito narrativo para emocionar.",
    image: "https://res.cloudinary.com/djqtkbyez/image/upload/v1774860454/654596267_17956035960117098_3415009189650686711_n_v0xekc.jpg"
  },
  {
    title: "Roadmap del Atleta",
    description: "Construimos y elevamos las marcas personales de los deportistas. Guiamos a los atletas para que creen una marca que refleje quiénes son.",
    image: "https://res.cloudinary.com/djqtkbyez/image/upload/v1774783981/656067117_18464630485103231_6128771137241890857_n_rfok3q.jpg"
  }
];

const AboutUs = () => {
  const { language } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [aboutData, setAboutData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('site_settings').select('data').eq('id', 'about').single().then(({ data }) => {
      if (data?.data) setAboutData(data.data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (isPaused || !aboutData?.services?.length) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % aboutData.services.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, aboutData]);

  if (loading || !aboutData) return null;

  const currentLang = language.toLowerCase();
  const title = (language === 'ES' ? aboutData.title_es : aboutData.title_en) || '';
  const statement = (language === 'ES' ? aboutData.statement_es : aboutData.statement_en) || '';
  const services = (aboutData.services || []).filter((s: any) => !s.is_hidden);
  const sectionLogo = aboutData.section_logo || "https://res.cloudinary.com/djqtkbyez/image/upload/v1773912109/Twenty4_Short_White_qhrgmr.svg";
  const wordsTitle = title.split(" ").filter(Boolean);

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
    <section id="team" className="relative py-20 lg:py-32 px-6 lg:px-12 bg-black overflow-hidden relative min-h-[800px]">
      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Header Section - Left Aligned */}
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
            viewport={{ once: true, amount: 0.1 }}
            className="text-4xl md:text-6xl lg:text-[4.5rem] font-serif font-black text-white leading-[0.8] tracking-tighter flex flex-wrap justify-start gap-x-[0.3em]"
          >
            {wordsTitle.map((word: string, i: number) => (
              <motion.span key={i} variants={wordVariantsTitle} className="inline-block">
                {word}
              </motion.span>
            ))}
          </motion.h2>
        </div>

        {/* Statement - Centered */}
        <div className="mb-32 max-w-5xl mx-auto">
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
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
            className="text-white/70 text-lg md:text-2xl leading-relaxed text-white tracking-tight italic font-serif flex flex-wrap justify-center gap-x-[0.3em]"
          >
            {statement.split(" ").filter(Boolean).map((word: string, i: number) => (
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
          <div
            className="space-y-12 order-2 lg:order-1"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="flex flex-col gap-8">
              {services.map((service: any, i: number) => (
                <button
                  key={i}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => setActiveIndex(i)}
                  className="text-left group"
                >
                  <h3 className={`text-4xl md:text-5xl lg:text-[3.125rem] font-serif transition-all duration-500 ${activeIndex === i ? 'text-white' : 'text-white/20 hover:text-white/40'
                    }`}>
                    {language === 'ES' ? service.title_es : service.title_en}
                  </h3>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Featured Card */}
          <div className="relative order-1 lg:order-2">
            {/* Logo Overlapping Card - Top Right */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              animate={{
                y: [0, -15, 0],
                rotate: [0, 5, 0]
              }}
              transition={{
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                default: { duration: 0.8, ease: "easeOut" }
              }}
              className="absolute -top-6 -right-6 md:-top-10 md:-right-10 z-20 w-24 h-24 md:w-32 md:h-32 bg-brand-green backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center p-0"
            >
              <img
                src={sectionLogo}
                alt="Section Icon"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="relative aspect-square rounded-[2rem] overflow-hidden group shadow-2xl bg-white/5"
              >
                <img
                  src={services[activeIndex]?.image || "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop"}
                  alt="Service"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* UI-like Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                <div className="absolute bottom-8 left-8 right-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-2"
                  >
                    <h4 className="text-2xl font-serif font-bold text-white">
                      {language === 'ES' ? services[activeIndex]?.title_es : services[activeIndex]?.title_en}
                    </h4>
                    <p className="text-white/70 text-sm max-w-sm leading-relaxed">
                      {language === 'ES' ? services[activeIndex]?.description_es : services[activeIndex]?.description_en}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const { language } = useLanguage();
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    supabase.from('site_settings').select('data').eq('id', 'general').single().then(({ data }) => {
      if (data?.data) setSettings(data.data);
    });
  }, []);

  const title = (language === 'ES' ? "Contacta con nosotros." : "Get In Touch.");
  const words = title.split(" ").filter(Boolean);
  const email = settings?.email || "hello@twenty4studios.com";
  const phone = settings?.phone || "+44 (0) 20 7946 0000";

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
    <section id="contact" className="relative py-20 lg:py-32 px-6 lg:px-12 bg-black text-white overflow-hidden">
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
            05 / {language === 'ES' ? 'Contacto' : 'Contact'}
          </span>
          <motion.h2
            variants={titleContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="text-5xl md:text-6xl lg:text-[4.5rem] font-serif font-black text-brand-sand leading-tight mb-8 flex flex-wrap gap-x-[0.3em]"
          >
            {words.map((word: string, i: number) => (
              <motion.span
                key={i}
                variants={wordVariants}
              >
                {word}
              </motion.span>
            ))}
          </motion.h2>
          <p className="text-brand-sand/60 text-lg mb-12 max-w-md">
            {language === 'ES'
              ? 'Ponte en contacto, escríbenos o simplemente saluda — estamos aquí para conectar, crear y convertir ideas audaces en realidad.'
              : 'Reach out, drop a line, or just say hey — we’re here to connect, create, and turn bold ideas into reality.'}
          </p>
          <div className="space-y-4">
            <p className="text-brand-sand font-serif text-2xl md:text-3xl">{email}</p>
            <p className="text-brand-sand/60 uppercase tracking-widest text-xs md:text-sm font-bold">{phone}</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/5 backdrop-blur-md border border-white/10 p-8 lg:p-12 rounded-[1.125rem]"
        >
          <ContactForm />
        </motion.div>
      </div>
    </section>
  );
};

// Componente extraído para manejar el estado del formulario
const ContactForm = () => {
  const { language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'New Project',
    message: ''
  });
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedPolicies || honeypot) return;
    setIsSubmitting(true);

    // Importamos dinámicamente para evitar problemas de SSR si fuera necesario, 
    // pero como es 'use client' podemos importarlo arriba o usar un import normal
    const { submitLead } = await import('./actions/leads');
    const result = await submitLead(formData);

    setIsSubmitting(false);
    if (result.success) {
      setIsSuccess(true);
      setFormData({ name: '', email: '', subject: 'New Project', message: '' });
      setTimeout(() => setIsSuccess(false), 5000);
    } else {
      alert('Error enviando el mensaje. Por favor intenta de nuevo.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Honeypot anti-spam — hidden from real users */}
      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-[10px] md:text-[12px] uppercase tracking-widest font-bold text-white/40">Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-transparent border-b border-white/20 py-2 focus:border-white outline-none transition-colors"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] md:text-[12px] uppercase tracking-widest font-bold text-white/40">Email</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-transparent border-b border-white/20 py-2 focus:border-white outline-none transition-colors"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] md:text-[12px] uppercase tracking-widest font-bold text-white/40">Subject</label>
        <select
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          className="w-full bg-transparent border-b border-white/20 py-2 focus:border-white outline-none transition-colors appearance-none"
        >
          <option className="bg-black">New Project</option>
          <option className="bg-black">Talent Inquiry</option>
          <option className="bg-black">Partnership</option>
          <option className="bg-black">Other</option>
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] md:text-[12px] uppercase tracking-widest font-bold text-white/40">Message</label>
        <textarea
          rows={4}
          required
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full bg-transparent border-b border-white/20 py-2 focus:border-white outline-none transition-colors resize-none"
        ></textarea>
      </div>
      <div className="pt-2">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative shrink-0">
            <input
              type="checkbox"
              required
              checked={acceptedPolicies}
              onChange={(e) => setAcceptedPolicies(e.target.checked)}
              className="peer sr-only"
            />
            <div className="w-5 h-5 border border-white/20 rounded bg-white/5 transition-all peer-checked:bg-brand-green peer-checked:border-brand-green flex items-center justify-center">
              <Check size={12} className="text-black opacity-0 peer-checked:opacity-100 transition-opacity" />
            </div>
          </div>
          <span className="text-xs text-white/40 group-hover:text-white/60 transition-colors leading-snug">
            {language === 'ES' ? (
              <>
                He leído y acepto la <Link href="/politica-de-privacidad?lang=es" className="underline hover:text-brand-green transition-colors">política de privacidad</Link> y el tratamiento de mis datos.
              </>
            ) : (
              <>
                I have read and accept the <Link href="/politica-de-privacidad?lang=en" className="underline hover:text-brand-green transition-colors">privacy policy</Link> and the processing of my data.
              </>
            )}
          </span>
        </label>
      </div>

      <motion.button
        type="submit"
        disabled={isSubmitting || isSuccess || !acceptedPolicies}
        whileHover={acceptedPolicies ? { scale: 1.02 } : {}}
        whileTap={acceptedPolicies ? { scale: 0.98 } : {}}
        className={`w-full py-4 rounded-lg uppercase tracking-widest text-xs font-bold transition-all ${isSuccess ? 'bg-brand-green text-white' : (acceptedPolicies ? 'bg-white text-brand-green' : 'bg-white/20 text-white/40 cursor-not-allowed')
          }`}
      >
        {isSubmitting ? 'Sending...' : isSuccess ? 'Message Sent!' : 'Send Message'}
      </motion.button>
    </form>
  );
};

const Footer = ({ footerRef }: { footerRef: React.RefObject<HTMLDivElement | null> }) => {
  const [data, setData] = useState<any>(null);
  const { language } = useLanguage();

  useEffect(() => {
    supabase.from('site_settings').select('data').eq('id', 'general').single().then(({ data: res }) => {
      if (res?.data) setData(res.data);
    });
  }, []);

  const logo = data?.favicon_url || "https://res.cloudinary.com/djqtkbyez/image/upload/v1774858243/Twenty4_Long_Green-cropped_enulok.svg";
  const currentLang = language.toLowerCase();
  const footerText = language === 'ES'
    ? (data?.footer_text_es || "La creencia es mutua por eso es que funciona.")
    : (data?.footer_text_en || "The belief is mutual, that's why it works.");

  const renderFormattedText = (text: string) => {
    if (!text) return null;
    const hasManualBold = text.includes('**');

    if (!hasManualBold) {
      // Classic fallback: bold the last word
      const words = text.split(" ");
      const lastWord = words.pop() || "";
      const initialWords = words.join(" ");
      return (
        <>
          {initialWords} <span className="text-brand-green font-serif font-black">{lastWord}</span>
        </>
      );
    }

    // Manual bold support with **word**
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <span key={i} className="text-brand-green font-serif font-black">{part.slice(2, -2)}</span>;
      }
      return part;
    });
  };

  const instagram = data?.instagram_url || "#";
  const linkedin = data?.linkedin_url || "#";
  const email = data?.email || "hello@twenty4studios.com";

  return (
    <footer ref={footerRef} className="bg-brand-green p-3 pt-20 lg:pt-32 min-h-[600px] flex flex-col">
      <div className="bg-brand-sand rounded-[1.125rem] flex-grow flex flex-col p-8 lg:p-16 relative overflow-hidden">

        <div className="flex-grow flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Left Side: Logo & Brand Message */}
          <div className="lg:w-1/2 flex flex-col">
            <div className="relative h-[15vh] md:h-[20vh] lg:h-[25vh] w-full mb-12 lg:mb-0">
              <Image
                src={data?.footer_logo_url || "https://res.cloudinary.com/djqtkbyez/image/upload/v1773912109/Twenty4_Long_Green_f4koxb.svg"}
                alt="Twenty4 Studios Logo"
                fill
                className="object-contain object-left"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="mt-auto">
              <p className="text-brand-green text-xl md:text-1xl lg:text-2xl font-serif leading-relaxed">
                {renderFormattedText(footerText)}
              </p>
            </div>
          </div>

          {/* Right Side: Links Grid & Social Icons */}
          <div className="lg:w-1/2 flex flex-col lg:pl-12 lg:border-l border-brand-green/5">
            <div className="mt-auto space-y-12">
              <div className="flex space-x-8 text-brand-green">
                <a href={instagram} target="_blank" rel="noopener noreferrer" className="text-sm font-bold uppercase tracking-widest hover:opacity-50 transition-opacity">Instagram</a>
                <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-sm font-bold uppercase tracking-widest hover:opacity-50 transition-opacity">LinkedIn</a>
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
                    <li><Link href={`/politica-de-privacidad?lang=${language.toLowerCase()}`} className="hover:opacity-50 transition-opacity">{language === 'ES' ? 'Privacidad' : 'Privacy'}</Link></li>
                    <li><Link href={`/aviso-legal?lang=${language.toLowerCase()}`} className="hover:opacity-50 transition-opacity">{language === 'ES' ? 'Aviso Legal' : 'Legal Notice'}</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-10 border-t border-brand-green/10 flex flex-col lg:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-[0.2em] font-bold text-brand-green/30">
          <p>© {new Date().getFullYear()} {data?.site_name || 'Twenty4 Studios'}. All rights reserved.</p>
          <p>Built for Icons.</p>
        </div>
      </div>
    </footer>
  );
};

// --- Main Page ---

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(() => {
    if (typeof window === 'undefined') return true;
    return !sessionStorage.getItem('homeScrollPos');
  });
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [language, setLanguage] = useState<Language>('ES');
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Check if we are returning to skip loading screen
    const savedScroll = sessionStorage.getItem('homeScrollPos');
    let timer: NodeJS.Timeout | null = null;

    if (savedScroll) {
      setIsLoading(false);
    } else {
      timer = setTimeout(() => {
        setIsLoading(false);
      }, 2200);
    }

    // 2. Save scroll position logic
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      if (link) {
        const href = link.getAttribute('href');
        if (href && href.startsWith('/') && !href.startsWith('/#')) {
          sessionStorage.setItem('homeScrollPos', window.scrollY.toString());
        }
      }
    };

    document.addEventListener('click', handleLinkClick);

    // 3. Handle initial scroll or hash
    if (typeof window !== 'undefined') {
      if (!savedScroll && !window.location.hash) {
        window.scrollTo(0, 0);
      }
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    }

    return () => {
      if (timer) clearTimeout(timer);
      document.removeEventListener('click', handleLinkClick);
    };
  }, []);

  // Effect to restore scroll position after loading
  useEffect(() => {
    if (isLoading) return;
    const savedScroll = sessionStorage.getItem('homeScrollPos');
    if (!savedScroll) return;

    const targetY = parseInt(savedScroll, 10);
    sessionStorage.removeItem('homeScrollPos');

    // Poll each rAF until the page is tall enough to reach targetY
    let attempts = 0;
    const tryRestore = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll >= targetY - 50 || attempts > 40) {
        window.scrollTo({ top: targetY, behavior: 'auto' });
      } else {
        attempts++;
        requestAnimationFrame(tryRestore);
      }
    };
    requestAnimationFrame(tryRestore);
  }, [isLoading]);

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
    <LanguageContext.Provider value={{ language, setLanguage }}>
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
    </LanguageContext.Provider>
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
