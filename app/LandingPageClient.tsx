'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, Variants } from 'motion/react';
import { Menu, X, ArrowUpRight, ChevronRight, Check } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { externalUrl } from '@/lib/utils';
import EditorialFrame from '@/components/brand/EditorialFrame';
import Stars from '@/components/brand/Stars';
import { Highlight, highlightWords, SCRIPT_CLASS } from '@/components/brand/ScriptHighlight';
import { slotStyle, splitGallery } from '@/lib/gallery-layout';

// --- Context ---
export type Language = 'ES' | 'EN';
export const LanguageContext = React.createContext<{ language: Language; setLanguage: (l: Language) => void }>({ language: 'ES', setLanguage: () => { } });
export const useLanguage = () => React.useContext(LanguageContext);

// --- Types ---
interface PageData {
  settings: Record<string, any>;
  projects: any[];
  talents: any[];
}

// --- Components ---

const LoadingScreen = ({ logoUrl }: { logoUrl: string }) => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] bg-brand-almost-black flex items-center justify-center overflow-hidden"
    >
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative w-64 h-24 md:w-96 md:h-32">
          <motion.div
            initial={{ scale: 0.1, opacity: 0, filter: "blur(20px)" }}
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            transition={{
              duration: 2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative w-full h-full"
          >
            <Image
              src={logoUrl}
              alt="Twenty4 Studios"
              fill
              className="object-contain"
              priority
            />
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.2, scale: 1.5 }}
        transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
        className="absolute w-[500px] h-[500px] bg-brand-almost-black/20 rounded-full blur-[120px] pointer-events-none"
      />
    </motion.div>
  );
};

const Navbar = ({ ready = true, hide, logoUrl, instagramUrl, linkedinUrl }: { ready?: boolean; hide?: boolean; logoUrl: string; instagramUrl?: string | null; linkedinUrl?: string | null }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOverCrimson, setIsOverCrimson] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      // ¿El navbar (≈ primeros 100px de pantalla) está sobre la sección de contacto roja?
      const contact = document.getElementById('contact');
      if (contact) {
        const r = contact.getBoundingClientRect();
        setIsOverCrimson(r.top < 100 && r.bottom > 0);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Menú móvil abierto: la página de fondo no se desplaza y Escape lo cierra.
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    // En html y body: Safari de iOS ignora overflow:hidden si solo va en body.
    const previousOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsMobileMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [isMobileMenuOpen]);

  const navLinks = language === 'ES'
    ? [
      { name: 'Talentos & Marcas', href: '#talents' },
      { name: 'Proyectos', href: '#projects' },
      { name: 'Sobre Nosotros', href: '#team' },
    ]
    : [
      { name: 'Talents & Brands', href: '#talents' },
      { name: 'Projects', href: '#projects' },
      { name: 'About Us', href: '#team' },
    ];

  return (
    <div className={`fixed top-0 left-0 w-full z-50 px-4 lg:px-8 py-4 lg:py-6 pointer-events-none transition-all duration-700 ${hide ? 'opacity-0 -translate-y-full' : 'opacity-100 translate-y-0'}`}>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={ready ? { y: 0, opacity: 1 } : { y: -100, opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`max-w-7xl mx-auto w-full pointer-events-auto transition-all duration-500 rounded-none flex items-center justify-between px-4 lg:px-10 py-3 lg:py-4 border shadow-sm ${isScrolled
          ? 'bg-brand-almost-black/80 backdrop-blur-md border-brand-warm-lux/15 shadow-xl'
          : 'bg-brand-almost-black/60 backdrop-blur-sm border-brand-warm-lux/10'
          }`}
      >
        <a href="#hero" className="relative h-8 w-40 lg:h-10 lg:w-48 transition-opacity duration-500 hover:opacity-80">
          <Image
            src={logoUrl}
            alt="Twenty4 Studios"
            fill
            className="object-contain object-left"
            referrerPolicy="no-referrer"
          />
        </a>

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
            className={`hidden lg:inline-flex px-6 py-2.5 rounded-none text-[0.75rem] uppercase tracking-[0.2em] font-bold transition-all duration-500 ${isOverCrimson ? 'bg-brand-warm-lux text-brand-almost-black hover:bg-white' : 'bg-brand-crimson text-brand-warm-lux hover:bg-brand-warm-lux hover:text-brand-almost-black'}`}
          >
            {language === 'ES' ? 'Contáctanos' : "Let's work"}
          </a>

          <button
            type="button"
            className="lg:hidden transition-colors duration-500 text-white p-2.5 -mr-2.5"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? (language === 'ES' ? 'Cerrar menú' : 'Close menu') : (language === 'ES' ? 'Abrir menú' : 'Open menu')}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              id="mobile-menu"
              className="absolute top-full left-0 w-full mt-4 bg-brand-almost-black rounded-none p-8 shadow-2xl flex flex-col space-y-6 lg:hidden border border-white/10"
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
                  className="bg-brand-crimson text-brand-warm-lux px-8 py-4 rounded-none text-center text-[1rem] uppercase tracking-[0.2em] font-bold shadow-lg hover:bg-brand-warm-lux hover:text-brand-almost-black transition-colors"
                >
                  {language === 'ES' ? 'Contáctanos' : "Let's work"}
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
                {(instagramUrl || linkedinUrl) && (
                  <div className="flex gap-8 items-center justify-center pt-4 border-t border-white/10">
                    {instagramUrl && (
                      <a
                        href={instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 text-[0.75rem] uppercase tracking-[0.2em] font-bold text-white/60 hover:text-white transition-colors"
                      >
                        Instagram
                      </a>
                    )}
                    {linkedinUrl && (
                      <a
                        href={linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 text-[0.75rem] uppercase tracking-[0.2em] font-bold text-white/60 hover:text-white transition-colors"
                      >
                        LinkedIn
                      </a>
                    )}
                  </div>
                )}
                <Stars className="w-12 mx-auto text-brand-crimson" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
};

const Hero = ({ heroData, ready = true }: { heroData: any; ready?: boolean }) => {
  const sectionRef = useRef(null);
  const [iframeReady, setIframeReady] = useState(false);

  useEffect(() => {
    // Defer iframe mount until after first paint so it doesn't block LCP
    const id = requestAnimationFrame(() => setIframeReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0.5, 1, 1, 0.5]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [100, 0, 0, -100]);

  const defaultTitle = "sports content &\nbrands partnerships";
  const defaultVideoUrl = "https://talentfinder.cloud/embed/xwprl4mwl98f?autoplay=yes&loop=yes&kiosk=yes&fill=yes";

  const { language } = useLanguage();
  const currentLang = language.toLowerCase();
  const titleRaw = heroData?.[`title_${currentLang}`] || heroData?.title_es || defaultTitle;
  const lines = titleRaw.split('\n');
  const line1 = (lines[0] || "").split(" ").filter((w: string) => w);
  const line2 = (lines[1] || "").split(" ").filter((w: string) => w);

  const rawUrl = heroData?.videoUrl || defaultVideoUrl;
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
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
  };

  const wordVariants: Variants = {
    hidden: { opacity: 0, y: 10, filter: "blur(8px)", color: "rgba(255, 255, 255, 0)" },
    visible: {
      opacity: 1, y: 0, filter: "blur(0px)", color: "rgba(255, 255, 255, 1)",
      transition: { duration: 0.6, ease: "easeOut" }
    },
  };

  return (
    <section id="hero" ref={sectionRef} className="relative h-[100vh] w-full p-3 bg-brand-almost-black">
      <motion.div
        style={{ scale, opacity, y }}
        className="relative h-full w-full overflow-hidden rounded-none shadow-2xl bg-brand-almost-black"
      >
        <EditorialFrame tone="media" className="z-30" coords={null} inset="inset-x-0 top-24 bottom-0" />
        <div className="absolute inset-0 z-0 overflow-hidden">
          {heroData?.type === 'image' ? (
            <Image
              src={heroData.imageUrl}
              alt=""
              fill
              className="object-cover opacity-70"
              priority
              referrerPolicy="no-referrer"
            />
          ) : (
            bgVideoUrl && iframeReady && (
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
              animate={ready ? "visible" : "hidden"}
              className="text-white text-4xl md:text-7xl lg:text-[6rem] font-display font-black uppercase leading-[0.92] mb-10 text-balance tracking-tight"
            >
              <div className="flex flex-wrap justify-center gap-x-[0.2em] gap-y-[0.12em]">
                {line1.map((word: string, i: number) => (
                  <motion.span key={i} variants={wordVariants} className="inline-block">{word}</motion.span>
                ))}
              </div>
              <div className="flex flex-wrap justify-center gap-x-[0.2em] gap-y-[0.12em]">
                {line2.map((word: string, i: number) => (
                  <motion.span key={i} variants={wordVariants} className="inline-block">{word}</motion.span>
                ))}
              </div>
            </motion.h1>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ delay: ready ? 1.5 : 0 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-brand-warm-lux/30 flex flex-col items-center gap-3"
        >
          <span className="text-[11px] uppercase tracking-[0.3em] font-bold">{language === 'ES' ? 'Descubre Más' : 'Discover More'}</span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-brand-warm-lux/30 to-transparent" />
        </motion.div>
      </motion.div>

      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-brand-almost-black to-transparent pointer-events-none z-40" />
    </section>
  );
};

/**
 * Foto de la galería de presentación, en marco polaroid como la lámina de
 * "Estilo fotográfico" del brandbook: borde Warm Lux más grueso abajo, tamaños
 * alternos y dos tratamientos — duotono Crimson o blanco y negro. Al pasar el
 * ratón se ve la foto original en color.
 *
 * La forma y el tono salen del índice dentro de la fila original (no del de la
 * lista duplicada del marquee), para que el bucle infinito empalme sin salto.
 * La secuencia vive en lib/gallery-layout.ts y el admin la usa como referencia.
 */
const PolaroidCard = ({ src, index, row, variants }: { src: string; index: number; row: 'top' | 'bottom'; variants: Variants }) => {
  const { language } = useLanguage();
  // Forma y tono compartidos con el admin (lib/gallery-layout.ts)
  const { shape, tone } = slotStyle(index, row);

  return (
    <motion.div
      variants={variants}
      className="group flex-shrink-0 bg-brand-warm-lux p-1.5 pb-6 lg:p-3 lg:pb-12 shadow-2xl"
    >
      <div className={`relative overflow-hidden bg-brand-almost-black ${shape.className}`}>
        {src && (
          <Image
            src={src}
            alt={language === 'ES' ? 'Galería de Twenty4 Studios' : 'Twenty4 Studios gallery'}
            fill
            sizes={shape.sizes}
            className="object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:contrast-100 transition-[filter] duration-700"
            referrerPolicy="no-referrer"
          />
        )}
        {tone === 'red' && (
          // Multiply sobre la foto en grises: los blancos pasan a Crimson y las sombras quedan negras.
          <div className="absolute inset-0 bg-brand-crimson mix-blend-multiply transition-opacity duration-700 group-hover:opacity-0" />
        )}
      </div>
    </motion.div>
  );
};

const BrandShowcase = ({ presentationData }: { presentationData: any }) => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [-100, 0, 0, 100]);

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

  const gallery = presentationData?.gallery && presentationData.gallery.length > 0
    ? presentationData.gallery
    : [...defaultTopRow, ...defaultBottomRow];
  const { top: topRow, bottom: bottomRow } = splitGallery<string>(gallery);

  const { language } = useLanguage();
  const currentLang = language.toLowerCase();
  const textRaw = presentationData?.[`text_${currentLang}`] || presentationData?.text_es || "Where Athletes Become **Icons**";

  // **palabra** en el CMS → Herr Von Muellerhoff (ver components/brand/ScriptHighlight)
  const words = highlightWords(textRaw);

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
  };

  const wordVariants: Variants = {
    hidden: { opacity: 0, y: 10, filter: "blur(8px)", color: "rgba(255, 255, 255, 0)" },
    visible: {
      opacity: 1, y: 0, filter: "blur(0px)", color: "rgba(255, 255, 255, 1)",
      transition: { duration: 0.6, ease: "easeOut" }
    },
  };

  const sectionVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const rowVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: 1, ease: [0.22, 1, 0.36, 1] as any, staggerChildren: 0.1 }
    }
  };

  const imageVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <section ref={sectionRef} className="relative py-16 lg:py-24 overflow-hidden bg-transparent flex flex-col gap-6 lg:gap-12">
      <motion.div
        style={{ opacity, y }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
        variants={sectionVariants}
        className="w-full flex flex-col gap-6 lg:gap-12"
      >
        <div className="w-full overflow-hidden py-8 lg:py-12">
          <motion.div
            variants={rowVariants}
            animate={{ x: ["0%", "-50%"] }}
            transition={{ x: { duration: 40, repeat: Infinity, ease: "linear" }, default: { duration: 1 } }}
            className="flex items-center gap-3 lg:gap-6 px-4 w-max"
          >
            {[...topRow, ...topRow].map((src, i) => (
              <PolaroidCard key={`top-${i}`} src={src} index={i % topRow.length} row="top" variants={imageVariants} />
            ))}
          </motion.div>
        </div>

        <div className="relative z-20 text-center px-6 max-w-7xl mx-auto">
          <motion.h2
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="text-2xl md:text-4xl lg:text-[3.125rem] font-display font-bold text-white leading-[0.95] tracking-tighter flex flex-wrap justify-center gap-x-[0.3em]"
          >
            {words.map((word, i) => (
              <motion.span
                key={i}
                variants={wordVariants}
                className={
                  word.script
                    ? `inline-block ${SCRIPT_CLASS}`
                    : "inline-block"
                }
              >
                {word.text}
              </motion.span>
            ))}
          </motion.h2>
        </div>

        <div className="w-full overflow-hidden py-8 lg:py-12">
          <motion.div
            variants={rowVariants}
            animate={{ x: ["-50%", "0%"] }}
            transition={{ x: { duration: 40, repeat: Infinity, ease: "linear" }, default: { duration: 1 } }}
            className="flex items-center gap-3 lg:gap-6 px-4 w-max"
          >
            {[...bottomRow, ...bottomRow].map((src, i) => (
              <PolaroidCard key={`bottom-${i}`} src={src} index={i % bottomRow.length} row="bottom" variants={imageVariants} />
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

const Projects = ({ projectsData, projectsSettings }: { projectsData: any[]; projectsSettings: any }) => {
  const { language } = useLanguage();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const sectionTitle = language === 'ES'
    ? (projectsSettings?.title_es || 'Trabajo Seleccionado')
    : (projectsSettings?.title_en || 'Selected Work');

  const projectsList = projectsData.map(p => {
    const lang = language.toLowerCase();
    return {
      slug: p.slug,
      title: p[`title_${lang}`] || p.title_es,
      category: p[`category_${lang}`] || p.category_es,
      description: p[`mini_description_${lang}`] || p[`description_${lang}`] || p.mini_description_es || p.description_es,
      img: p.image_url,
      videoUrl: p.video_url,
      isVideoEmbed: p.is_video_embed,
      year: p.year,
      has_case_study: p.has_case_study
    };
  });

  const words = sectionTitle.split(" ");

  const titleContainer: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };

  const wordVariants: Variants = {
    hidden: { opacity: 0, y: 10, filter: "blur(8px)", color: "rgba(255, 255, 255, 0)" },
    visible: {
      opacity: 1, y: 0, filter: "blur(0px)", color: "rgba(255, 255, 255, 1)",
      transition: { duration: 0.6, ease: "easeOut" }
    },
  };

  if (projectsList.length === 0) return null;

  return (
    <section id="projects" className="relative py-16 lg:py-24 px-6 lg:px-12 bg-brand-almost-black overflow-hidden">
      <EditorialFrame />
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 lg:mb-20 text-left flex flex-col items-start">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-brand-crimson uppercase tracking-[0.3em] text-xs md:text-sm mb-6 block font-bold"
          >
            03 / {language === 'ES' ? 'PROYECTOS' : 'PROJECTS'}
          </motion.span>
          <motion.h2
            variants={titleContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            className="text-4xl md:text-6xl lg:text-[4.5rem] font-display font-black uppercase text-white leading-[0.92] tracking-tight flex flex-wrap gap-x-[0.3em] gap-y-[0.12em]"
          >
            {words.map((word: string, i: number) => (
              <motion.span key={i} variants={wordVariants} className="inline-block">{word}</motion.span>
            ))}
          </motion.h2>
        </div>

        <div className="space-y-20 lg:space-y-28">
          {projectsList.map((project, i) => (
            <div key={i} className="flex flex-col gap-12">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
                className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-24 items-center`}
              >
                <div
                  className="w-full lg:w-3/5"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="relative aspect-[4/5] lg:aspect-[16/10] overflow-hidden rounded-none group bg-brand-almost-black">
                    {project.img && (
                      <Image
                        src={project.img}
                        alt={project.title}
                        fill
                        className={`object-cover transition-all duration-700 ${hoveredIndex === i && project.videoUrl ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}
                        referrerPolicy="no-referrer"
                      />
                    )}

                    {project.videoUrl && (
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
                    )}

                    <div className={`absolute inset-0 bg-brand-almost-black/10 transition-opacity duration-500 ${hoveredIndex === i ? 'opacity-0' : 'opacity-100'}`} />
                  </div>
                </div>

                <div className="w-full lg:w-2/5 space-y-6 lg:space-y-8">
                  <div className="space-y-2">
                    <p className="text-xs md:text-sm uppercase tracking-widest font-bold text-white/40">{project.category}</p>
                    <h3 className="text-3xl md:text-5xl lg:text-[3.125rem] font-display font-black uppercase text-white leading-none tracking-tight">{project.title}</h3>
                  </div>

                  <p className="text-white/70 text-lg md:text-xl leading-relaxed max-w-md">{project.description}</p>

                  {project.has_case_study && (
                    <Link
                      href={`/projects/${project.slug}?lang=${language.toLowerCase()}`}
                      className="group flex items-center gap-4 text-white font-bold uppercase tracking-widest text-xs md:text-sm pt-4"
                    >
                      <span>{language === 'ES' ? 'Ver Caso de Estudio' : 'View Case Study'}</span>
                      <div className="w-10 h-[1px] bg-brand-crimson group-hover:w-16 transition-all duration-500" />
                      <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </Link>
                  )}
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const EXPERIENCE_DEGREES = ['90°', '180°', '360°'];

const Talents = ({ talentsData, talentsSettings }: { talentsData: any[]; talentsSettings: any }) => {
  const { language } = useLanguage();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (talentsData.length === 0) return null;

  const currentLang = language.toLowerCase();

  const title = (language === 'ES' ? talentsSettings?.title_es : talentsSettings?.title_en) || "Built For Impact";
  const words = title.split(" ").filter(Boolean);

  const brands: { name: string; logo: string }[] = Array.isArray(talentsSettings?.brands)
    ? talentsSettings.brands
      .filter((b: any) => !(typeof b === 'object' && b?.is_archived))
      .map((b: any) => ({
        name: typeof b === 'string' ? 'Brand' : (b?.name || 'Brand'),
        logo: typeof b === 'string' ? b : (b?.url || '')
      }))
    : [];

  const titleContainer: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };

  const wordVariantsTitle: Variants = {
    hidden: { opacity: 0, y: 10, filter: "blur(8px)", color: "rgba(255, 255, 255, 0)" },
    visible: {
      opacity: 1, y: 0, filter: "blur(0px)", color: "rgba(255, 255, 255, 1)",
      transition: { duration: 0.6, ease: "easeOut" }
    },
  };

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.2 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section id="talents" className="relative py-16 lg:py-24 px-6 lg:px-12 bg-brand-almost-black text-white overflow-hidden w-full">
      <EditorialFrame />
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 lg:mb-20 text-left flex flex-col items-start">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-brand-crimson uppercase tracking-[0.3em] text-xs md:text-sm mb-6 block font-bold"
          >
            02 / {language === 'ES' ? 'TALENTOS' : 'TALENTS'}
          </motion.span>
          <motion.h2
            variants={titleContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="text-4xl md:text-6xl lg:text-[4.5rem] font-display font-black uppercase text-white leading-[0.92] tracking-tight flex flex-wrap gap-x-[0.3em] gap-y-[0.12em]"
          >
            {words.map((word: string, i: number) => (
              <motion.span key={i} variants={wordVariantsTitle} className="inline-block">{word}</motion.span>
            ))}
          </motion.h2>
        </div>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={sectionVariants}
        className="w-full space-y-20 lg:space-y-28"
      >
        {/* Desktop: filas de máx. 7, accordion independiente por fila */}
        {(() => {
          const numRows = Math.ceil(talentsData.length / 7);
          const perRow = Math.ceil(talentsData.length / numRows);
          const talentRows = talentsData.reduce<(typeof talentsData)[]>((rows, talent, i) => {
            const rowIdx = Math.floor(i / perRow);
            if (!rows[rowIdx]) rows[rowIdx] = [];
            rows[rowIdx].push(talent);
            return rows;
          }, []);
          const rowHeight = 'h-[650px]';
          return (
            <div className="hidden lg:flex flex-col gap-3 max-w-7xl mx-auto">
              {talentRows.map((row, rowIdx) => (
                <div key={rowIdx} className={`flex gap-3 ${rowHeight}`}>
                  {row.map((talent, colIdx) => {
                    const flatIdx = rowIdx * perRow + colIdx;
                    return (
                      <motion.div
                        key={talent.id}
                        className={`relative overflow-hidden rounded-none cursor-pointer h-full transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          hoveredIndex === flatIdx ? 'flex-[3]' : 'flex-[1]'
                        }`}
                        onMouseEnter={() => setHoveredIndex(flatIdx)}
                        onMouseLeave={() => setHoveredIndex(null)}
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
                        <div className={`absolute inset-0 bg-gradient-to-t from-brand-almost-black via-brand-almost-black/20 to-transparent transition-opacity duration-500 ${hoveredIndex === flatIdx ? 'opacity-100' : 'opacity-40'}`} />
                        <div className="absolute inset-0 p-8 flex flex-col justify-end">
                          <div className={`space-y-4 transition-all duration-500 ${hoveredIndex === flatIdx ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            <h3 className="text-3xl md:text-4xl lg:text-5xl font-display font-black text-white uppercase leading-[0.95] tracking-tight">{talent.name}</h3>
                            <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">
                              {talent[`category_${currentLang}`] || talent.category_es}
                            </p>
                            {talent.instagram_url && (
                              <a href={talent.instagram_url} className="flex items-center gap-3 text-white/80 hover:text-white w-fit group/link">
                                <span className="text-[10px] uppercase tracking-[0.2em] font-bold">{language === 'ES' ? 'Ver en Instagram' : 'View on Instagram'}</span>
                                <div className="w-8 h-[1px] bg-white/30 group-hover/link:w-12 transition-all duration-500" />
                                <ChevronRight className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ))}
            </div>
          );
        })()}

        {/* Mobile: cuadrícula de 2 columnas (antes una ficha a todo el ancho por atleta, ~5 pantallas) */}
        <div className="lg:hidden grid grid-cols-2 gap-3 max-w-7xl mx-auto">
          {talentsData.map((talent) => {
            const instagram = externalUrl(talent.instagram_url);
            const card = (
              <>
                {talent.image_url && (
                  <Image
                    src={talent.image_url}
                    alt={talent.name}
                    fill
                    sizes="50vw"
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-almost-black via-brand-almost-black/30 to-transparent" />
                {instagram && (
                  <ArrowUpRight className="absolute top-3 right-3 w-4 h-4 text-white/80" aria-hidden="true" />
                )}
                <div className="absolute inset-0 p-3 flex flex-col justify-end">
                  <h3 className="text-base font-display font-black text-white uppercase leading-[1.05]">{talent.name}</h3>
                </div>
              </>
            );
            return (
              <motion.div key={talent.id} variants={itemVariants} className="relative overflow-hidden rounded-none aspect-[3/4]">
                {instagram ? (
                  <a
                    href={instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${talent.name} — ${language === 'ES' ? 'ver en Instagram' : 'view on Instagram'}`}
                    className="absolute inset-0 block"
                  >
                    {card}
                  </a>
                ) : card}
              </motion.div>
            );
          })}
        </div>

        {/* Brand Ticker */}
        {brands.length > 0 && (
          <div className="relative overflow-hidden -mx-6 lg:-mx-12 bg-brand-almost-black">
            <div className="flex whitespace-nowrap">
              <motion.div
                animate={{ x: ["0%", "-100%"] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="flex items-center gap-16 md:gap-24 px-8 md:px-12"
              >
                {brands.map((brand, i) => (
                  <div key={i} className="flex items-center gap-6 md:gap-8 text-white/50 font-black text-3xl md:text-5xl tracking-tighter group">
                    <span className="text-brand-crimson/60 font-light text-4xl md:text-6xl transition-colors group-hover:text-brand-crimson">[</span>
                    {brand.logo ? (
                      <div className="relative w-32 md:w-48 h-8 md:h-12">
                        <Image src={brand.logo} alt={brand.name} fill className="object-contain" referrerPolicy="no-referrer" />
                      </div>
                    ) : (
                      <span className="hover:text-white transition-all duration-500 cursor-default">{brand.name}</span>
                    )}
                    <span className="text-brand-crimson/60 font-light text-4xl md:text-6xl transition-colors group-hover:text-brand-crimson">]</span>
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
                    <span className="text-brand-crimson/60 font-light text-4xl md:text-6xl transition-colors group-hover:text-brand-crimson">[</span>
                    {brand.logo ? (
                      <div className="relative w-32 md:w-48 h-8 md:h-12">
                        <Image src={brand.logo} alt={brand.name} fill className="object-contain" referrerPolicy="no-referrer" />
                      </div>
                    ) : (
                      <span className="hover:text-white transition-all duration-500 cursor-default">{brand.name}</span>
                    )}
                    <span className="text-brand-crimson/60 font-light text-4xl md:text-6xl transition-colors group-hover:text-brand-crimson">]</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        )}

        {/* Experience Section */}
        {talentsSettings?.experience && talentsSettings.experience.some((e: any) => e.title_es || e.title_en) && (
          <motion.div
            className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-y-14 md:gap-x-10 lg:gap-x-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.2 } } }}
          >
            {talentsSettings.experience.map((item: any, i: number) => {
              const expTitle = (language === 'ES' ? item.title_es : item.title_en) || item.title_es || '';
              const expDesc = (language === 'ES' ? item.description_es : item.description_en) || item.description_es || '';
              if (!expTitle && !expDesc) return null;
              return (
                <motion.div
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as any } }
                  }}
                  className="space-y-5"
                >
                  <span className="block text-white font-black text-2xl lg:text-3xl leading-none tracking-tight">
                    {/* Progresión 90° → 180° → 360°: del atleta a la marca a la visión completa. */}
                    {EXPERIENCE_DEGREES[i] ?? `${(i + 1) * 90}°`}
                  </span>
                  <h3 className="font-script font-normal tracking-normal text-5xl lg:text-6xl leading-[0.85] py-1 text-white">
                    {expTitle.charAt(0).toLocaleUpperCase('es') + expTitle.slice(1).toLocaleLowerCase('es')}
                  </h3>
                  <p className="text-lg md:text-xl text-white/70 leading-relaxed font-light">{expDesc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

/**
 * Tarjeta de servicio de About Us. Es un componente aparte porque necesita
 * estado propio: si la imagen del CMS no carga (hay URLs de Cloudinary que
 * devuelven 404), cae al bloque Terra con el isotipo en lugar de dejar el
 * icono de imagen rota.
 */
const ServiceCard = ({ index, title, description, image }: { index: number; title: string; description: string; image?: string }) => {
  // 'optimized' → la sirve Vercel optimizada; si falla (p. ej. un timeout en la
  // primera carga), 'direct' la pide tal cual a Cloudinary; solo si también
  // falla se muestra el bloque de ejemplo. Antes un único fallo lo dejaba fijo.
  const [attempt, setAttempt] = useState<'optimized' | 'direct' | 'failed'>('optimized');
  const showImage = Boolean(image) && attempt !== 'failed';

  return (
    <article className="group flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden bg-brand-terra">
        {showImage ? (
          <Image
            src={image as string}
            alt={title}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
            referrerPolicy="no-referrer"
            unoptimized={attempt === 'direct'}
            onError={() => setAttempt((a) => (a === 'optimized' ? 'direct' : 'failed'))}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Stars className="w-24 text-brand-warm-lux/10" />
          </div>
        )}
      </div>

      <div className="mt-6 flex items-start gap-5">
        <Stars className="w-7 md:w-9 shrink-0 mt-2 md:mt-2.5 text-brand-crimson" />
        <div className="space-y-3">
          <h3 className="text-2xl md:text-3xl lg:text-[2.25rem] font-display font-black uppercase tracking-tight text-white leading-[0.95]">
            {title}
          </h3>
          <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-md">
            {description}
          </p>
        </div>
      </div>
    </article>
  );
};

const AboutUs = ({ aboutData }: { aboutData: any }) => {
  const { language } = useLanguage();

  if (!aboutData) return null;

  const title = (language === 'ES' ? aboutData.title_es : aboutData.title_en) || '';
  const statement = (language === 'ES' ? aboutData.statement_es : aboutData.statement_en) || '';
  const services = (aboutData.services || []).filter((s: any) => !s.is_hidden);
  const wordsTitle = title.split(" ").filter(Boolean);

  const titleContainer: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };

  const wordVariantsTitle: Variants = {
    hidden: { opacity: 0, y: 10, filter: "blur(8px)", color: "rgba(255, 255, 255, 0)" },
    visible: {
      opacity: 1, y: 0, filter: "blur(0px)", color: "rgba(255, 255, 255, 1)",
      transition: { duration: 0.6, ease: "easeOut" }
    },
  };

  const gridVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any } },
  };

  return (
    <section id="team" className="relative py-16 lg:py-24 px-6 lg:px-12 bg-brand-almost-black overflow-hidden">
      <EditorialFrame />
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="mb-12 lg:mb-20 text-left flex flex-col items-start">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-brand-crimson uppercase tracking-[0.3em] text-xs md:text-sm mb-6 block font-bold"
          >
            04 / {language === 'ES' ? 'SOBRE NOSOTROS' : 'ABOUT US'}
          </motion.span>
          <motion.h2
            variants={titleContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="text-4xl md:text-6xl lg:text-[4.5rem] font-display font-black uppercase text-white leading-[0.92] tracking-tight flex flex-wrap justify-start gap-x-[0.3em] gap-y-[0.12em]"
          >
            {wordsTitle.map((word: string, i: number) => (
              <motion.span key={i} variants={wordVariantsTitle} className="inline-block">{word}</motion.span>
            ))}
          </motion.h2>
        </div>

        <div className="mb-20 lg:mb-28 max-w-3xl">
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.04, delayChildren: 0.2 } },
            }}
            className="text-white/70 text-lg md:text-2xl leading-relaxed tracking-tight italic font-display flex flex-wrap justify-start gap-x-[0.3em]"
          >
            {statement.split(" ").filter(Boolean).map((word: string, i: number) => (
              <motion.span
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 8, filter: "blur(12px)", scale: 0.98 },
                  visible: { opacity: 1, y: 0, filter: "blur(0px)", scale: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any } },
                }}
                className="inline-block"
              >
                {word}
              </motion.span>
            ))}
          </motion.p>
        </div>

        {/*
          Rejilla editorial: los cuatro servicios visibles a la vez, cada uno con
          su imagen y su descripción. Sustituye al carrusel auto-rotativo, que
          mostraba uno de cuatro y escondía los textos sobre la foto.
        */}
        {services.length > 0 && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={gridVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-x-16 lg:gap-y-20"
          >
            {services.map((service: any, i: number) => {
              const serviceTitle = (language === 'ES' ? service.title_es : service.title_en) || service.title_es || '';
              const serviceDesc = (language === 'ES' ? service.description_es : service.description_en) || service.description_es || '';
              return (
                <motion.div key={i} variants={cardVariants}>
                  <ServiceCard index={i} title={serviceTitle} description={serviceDesc} image={service.image} />
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
};

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

  const t = language === 'ES' ? {
    name: 'Nombre',
    email: 'Email',
    subject: 'Asunto',
    message: 'Mensaje',
    subjects: ['Nuevo Proyecto', 'Consulta de Talentos', 'Colaboración', 'Otro'],
    submit: 'Enviar Mensaje',
    sending: 'Enviando...',
    sent: '¡Mensaje enviado!',
  } : {
    name: 'Name',
    email: 'Email',
    subject: 'Subject',
    message: 'Message',
    subjects: ['New Project', 'Talent Inquiry', 'Partnership', 'Other'],
    submit: 'Send Message',
    sending: 'Sending...',
    sent: 'Message Sent!',
  };

  const defaultSubject = t.subjects[0];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!acceptedPolicies || honeypot) return;
    setIsSubmitting(true);
    const { submitLead } = await import('./actions/leads');
    const result = await submitLead(formData);
    setIsSubmitting(false);
    if (result.success) {
      setIsSuccess(true);
      setFormData({ name: '', email: '', subject: defaultSubject, message: '' });
      setTimeout(() => setIsSuccess(false), 5000);
    } else {
      alert(language === 'ES' ? 'Error enviando el mensaje. Por favor intenta de nuevo.' : 'Error sending the message. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
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
          <label htmlFor="contact-name" className="text-[11px] md:text-[12px] uppercase tracking-widest font-bold text-white/50">{t.name}</label>
          <input id="contact-name" name="name" type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-transparent border-b border-white/20 py-2 focus:border-white outline-none transition-colors" />
        </div>
        <div className="space-y-2">
          <label htmlFor="contact-email" className="text-[11px] md:text-[12px] uppercase tracking-widest font-bold text-white/50">{t.email}</label>
          <input id="contact-email" name="email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-transparent border-b border-white/20 py-2 focus:border-white outline-none transition-colors" />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="contact-subject" className="text-[11px] md:text-[12px] uppercase tracking-widest font-bold text-white/50">{t.subject}</label>
        <select id="contact-subject" name="subject" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="w-full bg-transparent border-b border-white/20 py-2 focus:border-white outline-none transition-colors appearance-none">
          {t.subjects.map((s) => <option key={s} className="bg-brand-almost-black">{s}</option>)}
        </select>
      </div>
      <div className="space-y-2">
        <label htmlFor="contact-message" className="text-[11px] md:text-[12px] uppercase tracking-widest font-bold text-white/50">{t.message}</label>
        <textarea id="contact-message" name="message" rows={4} required value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full bg-transparent border-b border-white/20 py-2 focus:border-white outline-none transition-colors resize-none" />
      </div>
      <div className="pt-2">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative shrink-0">
            <input type="checkbox" required checked={acceptedPolicies} onChange={(e) => setAcceptedPolicies(e.target.checked)} className="peer sr-only" />
            <div className="w-5 h-5 border border-white/20 rounded-none bg-white/5 transition-all peer-checked:bg-brand-crimson peer-checked:border-brand-crimson flex items-center justify-center">
              <Check size={12} className="text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
            </div>
          </div>
          <span className="text-xs text-white/40 group-hover:text-white/60 transition-colors leading-snug">
            {language === 'ES' ? (
              <>He leído y acepto la <Link href="/politica-de-privacidad?lang=es" className="underline hover:text-brand-crimson transition-colors">política de privacidad</Link> y el tratamiento de mis datos.</>
            ) : (
              <>I have read and accept the <Link href="/politica-de-privacidad?lang=en" className="underline hover:text-brand-crimson transition-colors">privacy policy</Link> and the processing of my data.</>
            )}
          </span>
        </label>
      </div>
      <motion.button
        type="submit"
        disabled={isSubmitting || isSuccess || !acceptedPolicies}
        whileHover={acceptedPolicies ? { scale: 1.02 } : {}}
        whileTap={acceptedPolicies ? { scale: 0.98 } : {}}
        className={`w-full py-4 rounded-none uppercase tracking-widest text-xs font-bold transition-all ${isSuccess ? 'bg-brand-warm-lux text-brand-almost-black' : (acceptedPolicies ? 'bg-brand-crimson text-brand-warm-lux hover:bg-brand-warm-lux hover:text-brand-almost-black' : 'bg-white/20 text-white/40 cursor-not-allowed')}`}
      >
        {isSubmitting ? t.sending : isSuccess ? t.sent : t.submit}
      </motion.button>
    </form>
  );
};

const Contact = ({ generalSettings }: { generalSettings: any }) => {
  const { language } = useLanguage();

  const title = language === 'ES' ? "Contacta con nosotros." : "Get In Touch.";
  const words = title.split(" ").filter(Boolean);
  const email = generalSettings?.email || "hello@twenty4studios.com";
  const phone = generalSettings?.phone || "+44 (0) 20 7946 0000";

  const titleContainer: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };

  const wordVariants: Variants = {
    hidden: { opacity: 0, y: 10, filter: "blur(8px)", color: "rgba(240, 237, 232, 0)" },
    visible: {
      opacity: 1, y: 0, filter: "blur(0px)", color: "rgba(240, 237, 232, 1)",
      transition: { duration: 0.6, ease: "easeOut" }
    },
  };

  return (
    <section id="contact" className="relative py-16 lg:py-24 px-6 lg:px-12 bg-brand-crimson text-white overflow-hidden brand-grain">
      <EditorialFrame tone="crimson" className="z-30" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 relative z-20">
        <div>
          <span className="text-brand-almost-black uppercase tracking-widest text-xs md:text-sm mb-4 block font-bold">
            05 / {language === 'ES' ? 'Contacto' : 'Contact'}
          </span>
          <motion.h2
            variants={titleContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="text-5xl md:text-6xl lg:text-[4.5rem] font-display font-black uppercase text-brand-warm-lux leading-[0.92] tracking-tight mb-8 flex flex-wrap gap-x-[0.3em] gap-y-[0.12em]"
          >
            {words.map((word: string, i: number) => (
              <motion.span key={i} variants={wordVariants}>{word}</motion.span>
            ))}
          </motion.h2>
          <p className="text-brand-warm-lux/85 text-lg mb-12 max-w-md">
            {language === 'ES'
              ? 'Ponte en contacto, escríbenos o simplemente saluda — estamos aquí para conectar, crear y convertir ideas audaces en realidad.'
              : "Reach out, drop a line, or just say hey — we're here to connect, create, and turn bold ideas into reality."}
          </p>
          <div className="space-y-4">
            <a href={`mailto:${email}`} className="block text-brand-warm-lux font-display text-2xl md:text-3xl break-all hover:underline underline-offset-4">{email}</a>
            <a href={`tel:${phone.replace(/[^+\d]/g, '')}`} className="inline-block py-2 text-brand-warm-lux/75 uppercase tracking-widest text-xs md:text-sm font-bold hover:text-brand-warm-lux">{phone}</a>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-brand-almost-black p-8 lg:p-12 rounded-none shadow-2xl"
        >
          <ContactForm />
        </motion.div>
      </div>
    </section>
  );
};

const Footer = ({ footerRef, generalSettings }: { footerRef: React.RefObject<HTMLDivElement | null>; generalSettings: any }) => {
  const { language } = useLanguage();

  const footerText = language === 'ES'
    ? (generalSettings?.footer_text_es || "La creencia es mutua por eso es que **funciona**.")
    : (generalSettings?.footer_text_en || "The belief is mutual, that's why it **works**.");


  const instagram = externalUrl(generalSettings?.instagram_url);
  const linkedin = externalUrl(generalSettings?.linkedin_url);

  return (
    <footer ref={footerRef} className="relative overflow-hidden bg-brand-warm-lux min-h-[600px] flex flex-col">
      <div className="flex-grow flex flex-col px-6 py-16 lg:px-12 lg:py-24 max-w-7xl w-full mx-auto relative z-40">
        <div className="flex-grow flex flex-col lg:flex-row gap-12 lg:gap-20">
          <div className="lg:w-1/2 flex flex-col">
            <div className="relative h-[15vh] md:h-[20vh] lg:h-[25vh] w-full mb-12 lg:mb-0">
              <Image
                src={generalSettings?.footer_logo_url || "https://res.cloudinary.com/djqtkbyez/image/upload/v1773912109/Twenty4_Long_Green_f4koxb.svg"}
                alt="Twenty4 Studios"
                fill
                className="object-contain object-left"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="mt-auto">
              <p className="text-brand-almost-black text-xl lg:text-2xl font-display leading-relaxed">
                <Highlight text={footerText} />
              </p>
            </div>
          </div>

          <div className="lg:w-1/2 flex flex-col lg:pl-12 lg:border-l border-brand-almost-black/10">
            <div className="mt-auto space-y-12">
              <div className="flex space-x-8 text-brand-almost-black">
                {instagram && <a href={instagram} target="_blank" rel="noopener noreferrer" className="py-2 text-sm font-bold uppercase tracking-widest hover:text-brand-crimson transition-colors">Instagram</a>}
                {linkedin && <a href={linkedin} target="_blank" rel="noopener noreferrer" className="py-2 text-sm font-bold uppercase tracking-widest hover:text-brand-crimson transition-colors">LinkedIn</a>}
              </div>
              <div className="grid grid-cols-2 gap-8 lg:justify-items-start">
                <div>
                  <h5 className="text-[11px] uppercase tracking-widest font-bold mb-4 text-brand-almost-black/50">{language === 'ES' ? 'Navegación' : 'Navigation'}</h5>
                  <ul className="space-y-1 text-sm text-brand-almost-black font-bold uppercase tracking-wider">
                    <li><a href="#hero" className="inline-block py-1.5 hover:text-brand-crimson transition-colors">{language === 'ES' ? 'Estudio' : 'Studio'}</a></li>
                    <li><a href="#talents" className="inline-block py-1.5 hover:text-brand-crimson transition-colors">{language === 'ES' ? 'Talentos' : 'Talents'}</a></li>
                    <li><a href="#projects" className="inline-block py-1.5 hover:text-brand-crimson transition-colors">{language === 'ES' ? 'Proyectos' : 'Projects'}</a></li>
                    <li><a href="#team" className="inline-block py-1.5 hover:text-brand-crimson transition-colors">{language === 'ES' ? 'Sobre Nosotros' : 'About Us'}</a></li>
                    <li><a href="#contact" className="inline-block py-1.5 hover:text-brand-crimson transition-colors">{language === 'ES' ? 'Contacto' : 'Contact'}</a></li>
                  </ul>
                </div>
                <div>
                  <h5 className="text-[11px] uppercase tracking-widest font-bold mb-4 text-brand-almost-black/50">Legal</h5>
                  <ul className="space-y-1 text-sm text-brand-almost-black font-bold uppercase tracking-wider">
                    <li><Link href={`/politica-de-privacidad?lang=${language.toLowerCase()}`} className="inline-block py-1.5 hover:text-brand-crimson transition-colors">{language === 'ES' ? 'Privacidad' : 'Privacy'}</Link></li>
                    <li><Link href={`/aviso-legal?lang=${language.toLowerCase()}`} className="inline-block py-1.5 hover:text-brand-crimson transition-colors">{language === 'ES' ? 'Aviso Legal' : 'Legal Notice'}</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-10 border-t border-brand-almost-black/10 flex flex-col lg:flex-row justify-between items-center gap-6 text-[11px] uppercase tracking-[0.2em] font-bold text-brand-almost-black/50">
          <p>© {new Date().getFullYear()} {generalSettings?.site_name || 'Twenty4 Studios'}. {language === 'ES' ? 'Todos los derechos reservados.' : 'All rights reserved.'}</p>
          <p>{language === 'ES' ? 'Hecho para iconos.' : 'Built for Icons.'}</p>
        </div>
      </div>
    </footer>
  );
};

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => setPosition({ x: e.clientX, y: e.clientY });
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setIsHovering(!!target.closest('button, a, input, select, textarea'));
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      <motion.div
        className="hidden lg:flex items-center justify-center fixed top-0 left-0 w-9 h-9 text-brand-crimson pointer-events-none z-[9998]"
        animate={{ x: position.x - 18, y: position.y - 18, scale: isHovering ? 1.5 : 1, rotate: isHovering ? 20 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <Stars className="w-[34px]" />
      </motion.div>
    </>
  );
};

// --- Main Client Component ---

export default function LandingPageClient({ settings, projects, talents }: PageData) {
  const [isLoading, setIsLoading] = useState(true);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [language, setLanguage] = useState<Language>('ES');
  const footerRef = useRef<HTMLDivElement>(null);

  // Detect language on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const langParam = params.get('lang')?.toUpperCase();
      if (langParam === 'EN' || langParam === 'ES') {
        setLanguage(langParam as Language);
      } else {
        const savedLang = localStorage.getItem('language')?.toUpperCase();
        if (savedLang === 'EN' || savedLang === 'ES') {
          setLanguage(savedLang as Language);
        }
      }
    }
  }, []);

  // Sync language changes with localStorage and URL query parameters
  useEffect(() => {
    localStorage.setItem('language', language);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      const currentLangParam = url.searchParams.get('lang')?.toUpperCase();
      if (currentLangParam !== language) {
        url.searchParams.set('lang', language.toLowerCase());
        window.history.replaceState(null, '', url.pathname + url.search);
      }
    }
  }, [language]);

  const generalSettings = settings.general || {};
  const loadingLogoUrl = process.env.NEXT_PUBLIC_LOADING_LOGO_URL
    || generalSettings.loading_logo_url
    || generalSettings.header_logo_url
    || "https://res.cloudinary.com/djqtkbyez/image/upload/v1773912109/Twenty4_Short_White_qhrgmr.svg";
  const navLogoUrl = generalSettings.header_logo_url
    || "https://res.cloudinary.com/djqtkbyez/image/upload/v1773914212/Twenty4_Long_White-cropped_au6yl4.svg";

  useEffect(() => {
    const savedScroll = sessionStorage.getItem('homeScrollPos');
    let timer: NodeJS.Timeout | null = null;

    if (savedScroll) {
      setIsLoading(false);
    } else {
      timer = setTimeout(() => setIsLoading(false), 2200);
    }

    const handleLinkClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest('a');
      if (link) {
        const href = link.getAttribute('href');
        if (href && href.startsWith('/') && !href.startsWith('/#')) {
          sessionStorage.setItem('homeScrollPos', window.scrollY.toString());
        }
      }
    };

    document.addEventListener('click', handleLinkClick);

    if (!savedScroll && !window.location.hash) window.scrollTo(0, 0);
    if (window.location.hash) window.history.replaceState(null, '', window.location.pathname);

    return () => {
      if (timer) clearTimeout(timer);
      document.removeEventListener('click', handleLinkClick);
    };
  }, []);

  useEffect(() => {
    if (!isLoading) return;
    const html = document.documentElement;
    const previous = { html: html.style.overflow, body: document.body.style.overflow };
    html.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      html.style.overflow = previous.html;
      document.body.style.overflow = previous.body;
    };
  }, [isLoading]);

  useEffect(() => {
    if (isLoading) return;
    const savedScroll = sessionStorage.getItem('homeScrollPos');
    if (!savedScroll) return;
    const targetY = parseInt(savedScroll, 10);
    sessionStorage.removeItem('homeScrollPos');
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
        setIsFooterVisible(rect.top < window.innerHeight - 100);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    setTimeout(handleScroll, 100);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {/*
        El contenido se renderiza siempre (llega en el HTML del servidor, lo lee
        Google y cualquier vista previa de enlace). La pantalla de carga es una
        capa fija encima que se desvanece; antes el <main> no existía hasta que
        terminaba el loader y el HTML servido estaba vacío.
      */}
      <AnimatePresence>
        {isLoading && <LoadingScreen key="loader" logoUrl={loadingLogoUrl} />}
      </AnimatePresence>
          <main className="relative min-h-screen bg-brand-almost-black bg-fixed">
            <Navbar ready={!isLoading} hide={isFooterVisible} logoUrl={navLogoUrl} instagramUrl={externalUrl(generalSettings.instagram_url)} linkedinUrl={externalUrl(generalSettings.linkedin_url)} />
            <Hero ready={!isLoading} heroData={settings.hero || {}} />

            <div className="relative z-30">
              <BrandShowcase presentationData={settings.presentation || {}} />
              <Talents talentsData={talents} talentsSettings={settings.talents || {}} />
              <Projects projectsData={projects} projectsSettings={settings.projects || {}} />
              <AboutUs aboutData={settings.about || null} />
              <Contact generalSettings={generalSettings} />
              <Footer footerRef={footerRef} generalSettings={generalSettings} />
            </div>

            <CustomCursor />
          </main>
    </LanguageContext.Provider>
  );
}
