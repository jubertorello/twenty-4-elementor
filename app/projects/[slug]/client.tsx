'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, notFound } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Instagram, Twitter, Linkedin, Play, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { projects as staticProjects } from '../../data/projects';
import { supabase } from '@/lib/supabase';

const ProjectDetail = () => {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [isPlaying, setIsPlaying] = useState(false);
  const [project, setProject] = useState<any>(null);
  const [nextProject, setNextProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      // 1. Obtener el proyecto actual
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (data) {
        const lang = 'es'; // TODO: Variable de estado para el idioma
        const localizedProject = {
          ...data,
          title: data[`title_${lang}`] || data.title_es,
          category: data[`category_${lang}`] || data.category_es,
          description: data[`description_${lang}`] || data.description_es,
        };
        setProject(localizedProject);
        
        // 2. Obtener el siguiente proyecto para el footer (el siguiente por order_index)
        const { data: nextData } = await supabase
          .from('projects')
          .select('slug, title_es')
          .eq('is_archived', false)
          .gt('order_index', data.order_index)
          .order('order_index', { ascending: true })
          .limit(1)
          .single();
        
        if (nextData) {
          setNextProject({ ...nextData, title: nextData.title_es });
        } else {
          const { data: firstData } = await supabase
            .from('projects')
            .select('slug, title_es')
            .eq('is_archived', false)
            .order('order_index', { ascending: true })
            .limit(1)
            .single();
          if (firstData) {
            setNextProject({ ...firstData, title: firstData.title_es });
          }
        }
      }
      setLoading(false);
    };

    fetchProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-brand-green selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-8 flex justify-between items-center pointer-events-none">
        <button 
          onClick={() => {
            if (typeof window !== 'undefined' && window.history.length > 1) {
              router.back();
            } else {
              router.push('/');
            }
          }}
          className="pointer-events-auto group flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/10 px-6 py-3 rounded-full hover:bg-white hover:text-black transition-all duration-500"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Back</span>
        </button>
        
        <div className="pointer-events-auto hidden md:flex items-center gap-6 bg-white/10 backdrop-blur-md border border-white/10 px-8 py-3 rounded-full">
          <a href="#" className="hover:opacity-50 transition-opacity"><Instagram size={16} /></a>
          <a href="#" className="hover:opacity-50 transition-opacity"><Twitter size={16} /></a>
          <a href="#" className="hover:opacity-50 transition-opacity"><Linkedin size={16} /></a>
        </div>
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
            alt={project.title_es || 'Project Image'}
            fill
            className="object-cover opacity-60"
            priority
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black" />
        </motion.div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="space-y-4"
          >
            <span className="text-brand-sand uppercase tracking-[0.4em] text-xs font-bold block">
              {project.category} — {project.year}
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-[7rem] font-serif font-black leading-none tracking-tighter break-words hyphens-auto max-w-full">
              {project.title}
            </h1>
          </motion.div>

          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1, type: "spring", stiffness: 200 }}
            onClick={() => setIsPlaying(true)}
            className="mt-12 w-20 h-20 md:w-24 md:h-24 rounded-full bg-brand-green flex items-center justify-center hover:scale-110 transition-transform duration-500 group"
          >
            <Play fill="white" size={32} className="ml-1 group-hover:scale-110 transition-transform" />
          </motion.button>
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
            <h2 className="text-3xl md:text-4xl font-serif font-bold italic">The Story</h2>
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
            className="bg-white/5 rounded-3xl p-10 border border-white/10 space-y-10"
          >
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-widest font-bold text-white/30">Client / Project</span>
              <p className="text-xl font-serif font-bold">{project.client || project.title}</p>
            </div>
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-widest font-bold text-white/30">Services</span>
              <p className="text-lg">{project.category}</p>
            </div>
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-widest font-bold text-white/30">Year</span>
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
              <h2 className="text-3xl md:text-4xl font-serif font-bold italic">Visual Journey</h2>
              <span className="text-white/30 text-xs uppercase tracking-widest font-bold">
                {project.gallery.length} Images
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
                  className="relative rounded-2xl overflow-hidden border border-white/5 group"
                >
                  <Image
                    src={img}
                    alt={`${project.title} gallery ${i}`}
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
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-4 md:p-12"
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
              className="relative w-full max-w-6xl aspect-video rounded-3xl overflow-hidden shadow-2xl bg-white/5"
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
        <footer className="py-20 border-t border-white/10 text-center space-y-8">
          <p className="text-white/30 text-[10px] uppercase tracking-[0.3em] font-bold">Next Project</p>
          <Link 
            href={`/projects/${nextProject.slug}`}
            className="text-4xl md:text-6xl font-serif font-black hover:text-brand-green transition-colors"
          >
            {nextProject.title}
          </Link>
        </footer>
      )}
    </main>
  );
};

export default ProjectDetail;
