'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, notFound, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Play, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const DEFAULT_HEADER_LOGO = 'https://res.cloudinary.com/djqtkbyez/image/upload/v1773914212/Twenty4_Long_White-cropped_au6yl4.svg';

const ProjectDetail = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const [isPlaying, setIsPlaying] = useState(false);
  const [projectRaw, setProjectRaw] = useState<any>(null);
  const [nextProjectRaw, setNextProjectRaw] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<'es' | 'en'>('es');
  // Barra superior (Volver + cliente): se oculta al bajar para no tapar el
  // texto del caso y reaparece al subir o al volver arriba del todo.
  const [showTopBar, setShowTopBar] = useState(true);
  // Mismo logo que el menú de la home (Admin → Logos & Footer → logo del header).
  const [logoUrl, setLogoUrl] = useState<string>(DEFAULT_HEADER_LOGO);

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('data')
      .eq('id', 'general')
      .single()
      .then(({ data }) => {
        const url = (data?.data as Record<string, string> | undefined)?.header_logo_url;
        if (url) setLogoUrl(url);
      });
  }, []);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 80) setShowTopBar(true);
      else if (Math.abs(y - lastY) > 8) setShowTopBar(y < lastY);
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Detect language on mount / query changes
  useEffect(() => {
    const langQuery = searchParams.get('lang')?.toLowerCase();
    let currentLang: 'es' | 'en' = 'es';
    if (langQuery === 'en' || langQuery === 'es') {
      currentLang = langQuery;
    } else {
      const savedLang = localStorage.getItem('language')?.toLowerCase();
      if (savedLang === 'en' || savedLang === 'es') {
        currentLang = savedLang;
      }
    }
    setLang(currentLang);
  }, [searchParams]);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      // 1. Obtener el proyecto actual
      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (data) {
        setProjectRaw(data);
        
        // 2. Obtener el siguiente proyecto para el footer (el siguiente por order_index)
        const { data: nextData } = await supabase
          .from('projects')
          .select('slug, title_es, title_en')
          .eq('is_archived', false)
          .gt('order_index', data.order_index)
          .order('order_index', { ascending: true })
          .limit(1)
          .single();
        
        if (nextData) {
          setNextProjectRaw(nextData);
        } else {
          const { data: firstData } = await supabase
            .from('projects')
            .select('slug, title_es, title_en')
            .eq('is_archived', false)
            .order('order_index', { ascending: true })
            .limit(1)
            .single();
          if (firstData) {
            setNextProjectRaw(firstData);
          }
        }
      }
      setLoading(false);
    };

    fetchProject();
  }, [slug]);

  const project = projectRaw ? {
    ...projectRaw,
    title: projectRaw[`title_${lang}`] || projectRaw.title_es,
    category: projectRaw[`category_${lang}`] || projectRaw.category_es,
    description: projectRaw[`description_${lang}`] || projectRaw.description_es,
  } : null;

  const nextProject = nextProjectRaw ? {
    ...nextProjectRaw,
    title: nextProjectRaw[`title_${lang}`] || nextProjectRaw.title_es,
  } : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-almost-black flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-brand-almost-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-brand-almost-black text-white font-sans selection:bg-brand-almost-black selection:text-white">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 w-full z-50 px-6 py-6 md:py-8 flex justify-between items-center pointer-events-none transition-transform duration-500 ${showTopBar ? 'translate-y-0' : '-translate-y-full'}`}>
        <button 
          onClick={() => {
            // Siempre a la home de la web. Antes hacía router.back(): si habías
            // entrado desde Instagram o Google te sacaba de la web, y después de
            // "Siguiente proyecto" volvía al caso anterior en vez de a la home.
            // Si venías de la home, esta restaura la altura guardada; si no,
            // baja a la sección Proyectos.
            try {
              if (!sessionStorage.getItem('homeScrollPos')) sessionStorage.setItem('homeScrollTo', 'projects');
            } catch {}
            // scroll:false: la home decide la altura; si no, Next sube arriba del todo después.
            router.push(`/?lang=${lang}`, { scroll: false });
          }}
          aria-label={lang === 'es' ? 'Volver' : 'Back'}
          className="pointer-events-auto group flex items-center justify-center gap-3 bg-brand-almost-black/85 backdrop-blur-md border border-white/10 w-11 h-11 md:w-auto md:h-auto md:px-6 md:py-3 rounded-none hover:bg-white hover:text-brand-almost-black transition-all duration-500"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="hidden md:inline text-[11px] uppercase tracking-[0.2em] font-bold">
            {lang === 'es' ? 'Volver' : 'Back'}
          </span>
        </button>
        
        <Link
          href={`/?lang=${lang}`}
          aria-label="Twenty4 Studios — inicio"
          // El logo lleva al principio de la home, no a la altura guardada.
          onClick={() => { try { sessionStorage.removeItem('homeScrollPos'); sessionStorage.setItem('introSeen', '1'); } catch {} }}
          className="pointer-events-auto absolute left-1/2 -translate-x-1/2 hover:opacity-80 transition-opacity"
        >
          <span className="relative block h-8 w-36 md:h-10 md:w-44">
            <Image
              src={logoUrl}
              alt="Twenty4 Studios"
              fill
              sizes="176px"
              className="object-contain"
              referrerPolicy="no-referrer"
            />
          </span>
        </Link>

        {project.client && (
          <div className="pointer-events-auto hidden md:flex items-center bg-white/10 backdrop-blur-md border border-white/10 px-8 py-3 rounded-none">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/70">{project.client}</span>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative h-[80vh] w-full overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src={project.image_url || ''}
            alt={project.title || project.title_es || ''}
            fill
            className="object-cover opacity-60"
            priority
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-almost-black/20 via-transparent to-brand-almost-black" />
        </motion.div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="space-y-4"
          >
            <span className="inline-block bg-brand-crimson text-brand-warm-lux uppercase tracking-[0.3em] text-[11px] font-bold px-3 py-1.5">
              {[project.category, project.year].filter(Boolean).join(' — ')}
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-[5.5rem] font-display font-black uppercase leading-[0.98] tracking-tight break-words hyphens-auto max-w-full">
              {project.title}
            </h1>
          </motion.div>

          {project.video_url && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1, type: "spring", stiffness: 200 }}
              onClick={() => setIsPlaying(true)}
              className="mt-12 w-20 h-20 md:w-24 md:h-24 rounded-full bg-brand-almost-black flex items-center justify-center hover:scale-110 transition-transform duration-500 group"
            >
              <Play fill="white" size={32} className="ml-1 group-hover:scale-110 transition-transform" />
            </motion.button>
          )}
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 lg:py-40 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
        {/* Left: Description */}
        <div className="lg:col-span-7 space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="font-script font-normal tracking-normal text-5xl md:text-6xl leading-[1.15]">
              {lang === 'es' ? 'La historia' : 'The story'}
            </h2>
            <p className="whitespace-pre-wrap text-xl md:text-2xl text-white/70 leading-relaxed font-light">
              {project.description}
            </p>
          </motion.div>

        </div>

        {/* Right: Info Sidebar */}
        <div className="lg:col-span-5 space-y-12">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 rounded-none p-10 border border-white/10 space-y-10"
          >
            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-widest font-bold text-brand-crimson">
                {lang === 'es' ? 'Cliente / Proyecto' : 'Client / Project'}
              </span>
              <p className="text-xl font-display font-bold">{project.client || project.title}</p>
            </div>
            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-widest font-bold text-brand-crimson">
                {lang === 'es' ? 'Servicios' : 'Services'}
              </span>
              <p className="text-lg">{project.category}</p>
            </div>
            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-widest font-bold text-brand-crimson">
                {lang === 'es' ? 'Año' : 'Year'}
              </span>
              <p className="text-lg">{project.year}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="pb-24 lg:pb-40 px-6">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="flex justify-between items-end">
              <h2 className="font-script font-normal tracking-normal text-5xl md:text-6xl leading-[1.15]">
                {lang === 'es' ? 'Viaje visual' : 'Visual journey'}
              </h2>
              <span className="text-white/30 text-xs uppercase tracking-widest font-bold">
                {project.gallery.length} {lang === 'es' ? 'Imágenes' : 'Images'}
              </span>
            </div>
            
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {project.gallery.map((img: string, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative rounded-none overflow-hidden border border-white/5 group"
                >
                  <Image
                    src={img}
                    alt={`${project.title} — ${lang === 'es' ? 'galería' : 'gallery'} ${i + 1}`}
                    width={800}
                    height={1000}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Video Modal */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-brand-almost-black flex items-center justify-center p-4 md:p-12"
          >
            <button 
              onClick={() => setIsPlaying(false)}
              className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-[110]"
            >
              <X size={40} />
            </button>
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-6xl aspect-video rounded-none overflow-hidden shadow-2xl bg-white/5"
            >
              {project.is_video_embed ? (
                <iframe
                  src={`${project.video_url}${project.video_url.includes('?') ? '&' : '?'}autoplay=1`}
                  className="w-full h-full"
                  allow="autoplay; fullscreen"
                  style={{ border: 'none' }}
                />
              ) : (
                <video
                  src={project.video_url}
                  autoPlay
                  controls
                  playsInline
                  className="w-full h-full object-cover"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Mini */}
      {nextProject && (
        <footer className="py-20 px-6 border-t border-white/10 text-center space-y-8">
          <p className="text-brand-crimson text-[11px] uppercase tracking-[0.3em] font-bold">
            {lang === 'es' ? 'Siguiente Proyecto' : 'Next Project'}
          </p>
          <Link 
            href={`/projects/${nextProject.slug}?lang=${lang}`}
            className="inline-block text-3xl md:text-6xl font-display font-black uppercase leading-[0.95] tracking-tight hover:text-brand-crimson transition-colors"
          >
            {nextProject.title}
          </Link>
        </footer>
      )}
    </main>
  );
};

export default ProjectDetail;
