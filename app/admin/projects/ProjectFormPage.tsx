'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, Reorder, AnimatePresence } from 'motion/react';
import { TranslationField, ImageEditor } from '../components';
import {
  ArrowLeft, Save, Globe, Image as ImageIcon, Video,
  AlertCircle, CheckCircle, Loader2, Plus, X, GripVertical,
  EyeOff, Eye, Search, Type, Hash, Pencil, Unlock, Edit3, Trash2, Library
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { CloudinaryUploader } from '@/components/CloudinaryUploader';
import { MediaLibraryModal } from '../components';

// --- Types ---
interface Project {
  id?: string;
  slug: string;
  title_es: string; title_en: string;
  category_es: string; category_en: string;
  description_es: string; description_en: string;
  mini_description_es: string; mini_description_en: string;
  image_url: string;
  video_url: string;
  is_video_embed: boolean;
  gallery: string[];
  client: string; year: string;
  is_archived: boolean;
  order_index: number;
  has_case_study: boolean;
  meta_title_es: string; meta_title_en: string;
  meta_description_es: string; meta_description_en: string;
}

const empty: Project = {
  slug: '', title_es: '', title_en: '',
  category_es: '', category_en: '',
  description_es: '', description_en: '',
  mini_description_es: '', mini_description_en: '',
  image_url: '', video_url: '', is_video_embed: false,
  gallery: [],
  client: '', year: new Date().getFullYear().toString(),
  is_archived: false,
  order_index: 0,
  has_case_study: false,
  meta_title_es: '', meta_title_en: '',
  meta_description_es: '', meta_description_en: '',
};

const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-green/40 focus:bg-white/8 transition-all placeholder:text-white/15 disabled:opacity-50 disabled:cursor-not-allowed";
const labelCls = "block text-[9px] uppercase tracking-[0.25em] font-black text-white/30 mb-2";

const CharCount = ({ current, max }: { current: number; max: number }) => (
  <span className={`text-[8px] font-bold tracking-widest ${current >= max ? 'text-red-500' : 'text-white/20'}`}>
    {current}/{max}
  </span>
);

interface ProjectFormPageProps {
  initialData?: Project;
  projectId?: string;
}

export default function ProjectFormPage({ initialData, projectId }: ProjectFormPageProps) {
  const router = useRouter();
  const [form, setForm] = useState<Project>({ ...empty, ...initialData });
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [isEditingSEO, setIsEditingSEO] = useState(false);

  const set = (key: keyof Project, value: any) => setForm(prev => ({ ...prev, [key]: value }));

  useEffect(() => {
    if (!projectId && form.title_es) {
      const slug = form.title_es.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      set('slug', slug.slice(0, 100));
    }
  }, [form.title_es, projectId]);

  const handleSave = async () => {
    if (!form.title_es) { setErrorMsg('El Título (ES) es obligatorio.'); setStatus('error'); return; }
    if (form.has_case_study && !form.slug) { setErrorMsg('El Slug es obligatorio si activas el Case Study.'); setStatus('error'); return; }
    
    setStatus('saving'); setErrorMsg('');
    
    // AUTOCOMPLETAR SEO SI ESTÁ VACÍO
    const projectToSave = { ...form };
    if (!projectToSave.meta_title_es) projectToSave.meta_title_es = `${projectToSave.title_es} | Twenty4 Studios`;
    if (!projectToSave.meta_description_es) projectToSave.meta_description_es = projectToSave.mini_description_es || projectToSave.description_es.substring(0, 150);
    if (!projectToSave.meta_title_en && projectToSave.title_en) projectToSave.meta_title_en = `${projectToSave.title_en} | Twenty4 Studios`;
    if (!projectToSave.meta_description_en && projectToSave.mini_description_en) projectToSave.meta_description_en = projectToSave.mini_description_en;

    try {
      if (projectId) {
        const { id, ...rest } = projectToSave;
        const { error } = await supabase.from('projects').update(rest).eq('id', projectId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('projects').insert([projectToSave]);
        if (error) throw error;
      }
      // Redirección inmediata pasando la señal de éxito
      router.push('/admin?tab=projects&saved=true');
    } catch (e: any) { 
      setErrorMsg(e.message); 
      setStatus('error'); 
      setTimeout(() => setStatus('idle'), 4000); 
    }
  };

  const addToGallery = (url: string) => set('gallery', [...(form.gallery || []), url]);
  const removeFromGallery = (index: number) => {
    const newGallery = [...form.gallery];
    newGallery.splice(index, 1);
    set('gallery', newGallery);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      <div className="sticky top-0 z-30 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/5 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/admin?tab=projects')} className="flex items-center gap-2 text-white/30 hover:text-white transition-colors text-[10px] uppercase tracking-widest font-black group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Volver
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[9px] uppercase tracking-[0.4em] font-black text-brand-green">Admin</span>
            <span className="text-white/20">/</span>
            <span className="text-[9px] uppercase tracking-[0.4em] font-black text-white/60">{projectId ? 'Editar' : 'Nuevo'} Proyecto</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => set('is_archived', !form.is_archived)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] uppercase tracking-widest font-black transition-all border ${form.is_archived ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' : 'bg-brand-green/10 border-brand-green/20 text-brand-green'}`}>
            {form.is_archived ? <><EyeOff size={14} /> Archivado</> : <><Eye size={14} /> Activo en Web</>}
          </button>
          <button onClick={handleSave} disabled={status === 'saving'} className={`flex items-center gap-2 px-8 py-2.5 rounded-xl text-[10px] uppercase tracking-widest font-black text-white transition-all min-w-[140px] justify-center bg-brand-green hover:opacity-80`}>
            {status === 'saving' ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} 
            {status === 'saving' ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>

      {/* TOAST NOTIFICATIONS (Sólo errores) */}
      <AnimatePresence>
        {status === 'error' && (
          <motion.div 
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            className="fixed top-24 left-1/2 z-50 flex items-center gap-3 px-6 py-3 bg-red-500 text-white rounded-full font-bold uppercase tracking-widest text-xs shadow-2xl shadow-red-500/20 border border-red-400/50"
          >
            <AlertCircle size={16} /> {errorMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-8 py-12 pb-32">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
          
          {/* 1. IDENTIDAD Y DESCRIPCIÓN CORTA */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-brand-green/20 flex items-center justify-center"><Type size={16} className="text-brand-green" /></div>
              <h2 className="text-lg font-black uppercase tracking-widest text-white/80">01 · Identidad y Textos Home</h2>
            </div>
            
            <div className="p-8 rounded-3xl bg-white/3 border border-white/8 space-y-10">
              {/* Nombres y Categorías */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[14px]">🇪🇸</span>
                    <div className="h-[1px] flex-1 bg-white/5" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center"><label className={labelCls}>Nombre del Proyecto (ES) <span className="text-red-400">*</span></label><CharCount current={form.title_es.length} max={60} /></div>
                    <input type="text" maxLength={60} value={form.title_es} onChange={e => set('title_es', e.target.value)} className={inputCls} placeholder="Ej: BARO" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center"><label className={labelCls}>Categoría (ES) <span className="text-red-400">*</span></label><CharCount current={form.category_es.length} max={30} /></div>
                    <input type="text" maxLength={30} value={form.category_es} onChange={e => set('category_es', e.target.value)} className={inputCls} placeholder="Ej: Documental Netflix" />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[14px]">🇬🇧</span>
                    <div className="h-[1px] flex-1 bg-white/5" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center"><label className={labelCls}>Project Name (EN)</label><CharCount current={form.title_en.length} max={60} /></div>
                    <input type="text" maxLength={60} value={form.title_en} onChange={e => set('title_en', e.target.value)} className={inputCls} placeholder="Ej: BARO" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center"><label className={labelCls}>Category (EN)</label><CharCount current={form.category_en.length} max={30} /></div>
                    <input type="text" maxLength={30} value={form.category_en} onChange={e => set('category_en', e.target.value)} className={inputCls} placeholder="Ej: Netflix Documentary" />
                  </div>
                </div>
              </div>

              {/* Descripciones Cortas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4 border-t border-white/5">
                <div>
                  <div className="flex justify-between items-center"><label className={labelCls}>🇪🇸 Descripción Corta — Home <span className="text-red-400">*</span></label><CharCount current={form.mini_description_es.length} max={150} /></div>
                  <input type="text" maxLength={150} value={form.mini_description_es} onChange={e => set('mini_description_es', e.target.value)} className={inputCls} placeholder="Frase impactante..." />
                </div>
                <div>
                  <div className="flex justify-between items-center"><label className={labelCls}>🇬🇧 Short Description — Home</label><CharCount current={form.mini_description_en.length} max={150} /></div>
                  <input type="text" maxLength={150} value={form.mini_description_en} onChange={e => set('mini_description_en', e.target.value)} className={inputCls} placeholder="Impactful phrase..." />
                </div>
              </div>
            </div>
          </section>

          {/* MEDIA PRINCIPAL */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center"><ImageIcon size={16} className="text-blue-400" /></div>
              <h2 className="text-lg font-black uppercase tracking-widest text-white/80">02 · Media Principal <span className="text-red-400">*</span></h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-8 rounded-3xl bg-white/3 border border-white/8">
              <div>
                <label className={labelCls}>Foto de Portada <span className="text-red-400">*</span></label>
                <ImageEditor
                  url={form.image_url || undefined}
                  aspect="video"
                  label="Subir portada"
                  onUpload={(url) => set('image_url', url)}
                  onDelete={() => set('image_url', '')}
                />
              </div>
              <div className="space-y-6">
                {/* Estado del vídeo y botón para desactivar */}
                <div className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                  form.video_url 
                    ? 'bg-brand-green/5 border-brand-green/20' 
                    : 'bg-white/3 border-white/8'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${form.video_url ? 'bg-brand-green animate-pulse' : 'bg-white/20'}`} />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white">
                        {form.video_url ? 'Vídeo Activo' : 'Vídeo Inactivo (Sólo Foto)'}
                      </p>
                      <p className="text-[8px] text-white/40 uppercase tracking-widest font-bold mt-0.5">
                        {form.video_url 
                          ? 'Se mostrará el vídeo en la home' 
                          : 'Se mostrará la foto de portada'
                        }
                      </p>
                    </div>
                  </div>
                  {form.video_url && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('¿Seguro que quieres eliminar y desactivar el vídeo de este proyecto?')) {
                          set('video_url', '');
                          set('is_video_embed', false);
                        }
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[8px] uppercase tracking-widest font-black bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white transition-all border border-red-500/20"
                    >
                      <Trash2 size={12} /> Quitar Vídeo
                    </button>
                  )}
                </div>

                <div>
                  <label className={labelCls}>Vídeo/Reel <span className="opacity-50 lowercase font-normal italic">(Opcional)</span></label>
                  <CloudinaryUploader 
                    accept="video" 
                    label="Subir MP4" 
                    currentUrl={form.video_url && !form.is_video_embed ? form.video_url : undefined} 
                    onUpload={(url) => { set('video_url', url); set('is_video_embed', false); }} 
                  />
                </div>
                <div className="pt-4 border-t border-white/5 space-y-3">
                  <label className={labelCls}>O Link Externo (YouTube / Vimeo)</label>
                  <input 
                    type="text" 
                    value={form.is_video_embed ? form.video_url : ''} 
                    onChange={e => {
                      let url = e.target.value;
                      let isEmbed = !!url;
                      if (url.includes('youtube.com/watch?v=')) url = url.replace('watch?v=', 'embed/');
                      else if (url.includes('youtu.be/')) url = url.replace('youtu.be/', 'www.youtube.com/embed/');
                      if (url.includes('vimeo.com/') && !url.includes('player.vimeo.com')) {
                        const vimeoId = url.split('/').pop();
                        url = `https://player.vimeo.com/video/${vimeoId}`;
                      }
                      set('video_url', url);
                      set('is_video_embed', isEmbed);
                    }} 
                    className={inputCls} 
                    placeholder="https://www.youtube.com/..." 
                  />
                  <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold">Pega el link y el sistema lo convertirá a embed automáticamente</p>
                </div>
              </div>
            </div>
          </section>

          {/* ACTIVAR CASE STUDY TOGGLE */}
          <section className="pt-8 border-t border-white/10">
            <div className="flex items-center justify-between p-8 rounded-3xl bg-brand-green/5 border border-brand-green/20">
              <div className="space-y-2">
                <h2 className="text-xl font-serif font-bold text-white">¿Crear Case Study?</h2>
                <p className="text-white/40 text-sm max-w-md">
                  Activa esta opción si quieres crear una página dedicada para este proyecto con historia detallada, galería de fotos y optimización SEO.
                </p>
              </div>
              <button 
                onClick={() => set('has_case_study', !form.has_case_study)}
                className={`relative w-16 h-8 rounded-full transition-colors ${form.has_case_study ? 'bg-brand-green' : 'bg-white/10'}`}
              >
                <motion.div 
                  layout
                  className="absolute top-1 bottom-1 w-6 bg-white rounded-full"
                  animate={{ left: form.has_case_study ? 'calc(100% - 28px)' : '4px' }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
          </section>

          {/* SECCIONES OPCIONALES (CASE STUDY) */}
          <AnimatePresence>
            {form.has_case_study && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-12 overflow-hidden"
              >
                {/* 3. DATOS TÉCNICOS */}
                <section className="space-y-6 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/20 flex items-center justify-center"><Hash size={16} className="text-purple-400" /></div>
                    <h2 className="text-lg font-black uppercase tracking-widest text-white/80">03 · Datos y Enlace</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 rounded-3xl bg-white/3 border border-white/8">
                    <div>
                      <label className={labelCls}>Cliente <span className="opacity-50 lowercase font-normal italic">(Opcional)</span></label>
                      <input type="text" maxLength={50} value={form.client} onChange={e => set('client', e.target.value)} className={inputCls} placeholder="Netflix, Nike..." />
                    </div>
                    <div>
                      <label className={labelCls}>Año <span className="opacity-50 lowercase font-normal italic">(Opcional)</span></label>
                      <input type="text" maxLength={4} value={form.year} onChange={e => set('year', e.target.value)} className={inputCls} placeholder="2024" />
                    </div>
                    <div>
                      <label className={labelCls}>Slug (URL) — <span className="text-white/40 normal-case">Autogenerado</span></label>
                      <input type="text" value={form.slug} disabled className={inputCls} />
                    </div>
                  </div>
                </section>

                {/* 4. DESCRIPCIÓN LARGA (CASE STUDY) */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-brand-green/20 flex items-center justify-center"><Globe size={16} className="text-brand-green" /></div>
                    <h2 className="text-lg font-black uppercase tracking-widest text-white/80">04 · Historia (Case Study)</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 rounded-3xl bg-white/3 border border-white/8">
                    <div>
                      <div className="flex justify-between items-center"><label className={labelCls}>🇪🇸 Descripción Larga <span className="text-red-400">*</span></label><CharCount current={form.description_es.length} max={2000} /></div>
                      <textarea rows={10} maxLength={2000} value={form.description_es} onChange={e => set('description_es', e.target.value)} className={inputCls + ' resize-none'} placeholder="Cuenta la historia completa..." />
                    </div>
                    <div>
                      <div className="flex justify-between items-center"><label className={labelCls}>🇬🇧 Full Description</label><CharCount current={form.description_en.length} max={2000} /></div>
                      <textarea rows={10} maxLength={2000} value={form.description_en} onChange={e => set('description_en', e.target.value)} className={inputCls + ' resize-none'} placeholder="Tell the full story..." />
                    </div>
                  </div>
                </section>

                {/* 5. GALERIA */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-orange-500/20 flex items-center justify-center"><Plus size={16} className="text-orange-400" /></div>
                    <h2 className="text-lg font-black uppercase tracking-widest text-white/80">05 · Galería de Imágenes <span className="opacity-50 lowercase font-normal italic">(Opcional)</span></h2>
                  </div>
                  <div className="p-8 rounded-3xl bg-white/3 border border-white/8 space-y-6">
                    <Reorder.Group axis="y" values={form.gallery || []} onReorder={(val) => set('gallery', val)} className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {(form.gallery || []).map((url, index) => (
                        <Reorder.Item key={url} value={url} className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 group cursor-move bg-black">
                          <img src={url} className="w-full h-full object-cover transition-all group-hover:scale-105" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3 backdrop-blur-[2px]">
                            <div className="relative">
                               <div className="p-2.5 rounded-lg bg-brand-green text-white hover:scale-110 transition-transform shadow-lg cursor-pointer">
                                  <Edit3 size={14} />
                               </div>
                               <CloudinaryUploader
                                  accept="image"
                                  label=""
                                  onUpload={(newUrl) => {
                                    // NOTE: We no longer delete the old asset from Cloudinary to keep it in the library
                                    const newGallery = [...form.gallery];
                                    newGallery[index] = newUrl;
                                    set('gallery', newGallery);
                                  }}
                                  className="absolute inset-0 opacity-0 cursor-pointer"
                               />
                            </div>
                            <button 
                              onClick={() => {
                                if (confirm('¿Quitar esta imagen? (Se mantendrá en tu biblioteca)')) {
                                  removeFromGallery(index);
                                }
                              }} 
                              className="p-2.5 rounded-lg bg-red-500 text-white hover:scale-110 transition-transform shadow-lg"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <div className="absolute bottom-2 left-2 p-1 rounded-md bg-black/40 backdrop-blur-sm opacity-40 group-hover:opacity-100 transition-opacity"><GripVertical size={12} className="text-white" /></div>
                        </Reorder.Item>
                      ))}
                    </Reorder.Group>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => {
                          if (form.gallery.length >= 6) {
                            alert('Máximo 6 fotos.');
                            return;
                          }
                          setIsLibraryOpen(true);
                        }}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest font-black transition-all ${
                          form.gallery.length >= 6 ? 'opacity-20 cursor-not-allowed' : 'text-white/40 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <Library size={14} /> Biblioteca
                      </button>
                      <CloudinaryUploader 
                        accept="image" 
                        label={form.gallery.length >= 6 ? "Límite alcanzado" : "+ Subir foto"} 
                        onUpload={(url) => form.gallery.length < 6 ? addToGallery(url) : alert('Máximo 6 fotos.')} 
                        className={form.gallery.length >= 6 ? "opacity-50 pointer-events-none" : ""} 
                      />
                    </div>
                  </div>
                </section>

                <AnimatePresence>
                  {isLibraryOpen && (
                    <MediaLibraryModal 
                      isOpen={isLibraryOpen}
                      onClose={() => setIsLibraryOpen(false)}
                      onSelect={(url) => {
                        if (form.gallery.length < 6) {
                          addToGallery(url);
                        }
                        setIsLibraryOpen(false);
                      }}
                      type="image"
                    />
                  )}
                </AnimatePresence>

                {/* 6. SEO */}
                <section className="space-y-6 pb-12">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-pink-500/20 flex items-center justify-center"><Search size={16} className="text-pink-400" /></div>
                      <h2 className="text-lg font-black uppercase tracking-widest text-white/80">06 · SEO (Google)</h2>
                    </div>
                    <button 
                      onClick={() => setIsEditingSEO(!isEditingSEO)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] uppercase tracking-widest font-black transition-all border ${isEditingSEO ? 'bg-brand-green/20 border-brand-green/40 text-brand-green' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}`}
                    >
                      {isEditingSEO ? <><Unlock size={14} /> Editando Manual</> : <><Pencil size={14} /> Personalizar SEO</>}
                    </button>
                  </div>

                  <div className="p-8 rounded-3xl bg-white/3 border border-white/8 space-y-12">
                    
                    {/* Google Previews */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <span className="text-[10px] font-black text-white/30 tracking-widest uppercase">🇪🇸 Vista previa Google</span>
                        <div className="bg-white p-4 rounded-xl font-sans">
                          <div className="text-xs text-[#4d5156] mb-1">https://twenty4studios.com › projects › {form.slug || '...' }</div>
                          <h3 className="text-xl text-[#1a0dab] hover:underline cursor-pointer truncate">
                            {form.meta_title_es || `${form.title_es || 'Título'} | Twenty4 Studios`}
                          </h3>
                          <p className="text-sm text-[#4d5156] mt-1 line-clamp-2">
                            {form.meta_description_es || form.mini_description_es || 'Descripción SEO...'}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <span className="text-[10px] font-black text-white/30 tracking-widest uppercase">🇬🇧 Google Preview</span>
                        <div className="bg-white p-4 rounded-xl font-sans">
                          <div className="text-xs text-[#4d5156] mb-1">https://twenty4studios.com › projects › {form.slug || '...' }</div>
                          <h3 className="text-xl text-[#1a0dab] hover:underline cursor-pointer truncate">
                            {form.meta_title_en || `${form.title_en || 'Title'} | Twenty4 Studios`}
                          </h3>
                          <p className="text-sm text-[#4d5156] mt-1 line-clamp-2">
                            {form.meta_description_en || form.mini_description_en || 'SEO Description...'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {isEditingSEO ? (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-8 border-t border-white/5 overflow-hidden"
                        >
                          <div className="space-y-6">
                            <div>
                              <div className="flex justify-between items-center"><label className={labelCls}>🇪🇸 Meta Title</label><CharCount current={form.meta_title_es.length} max={60} /></div>
                              <input type="text" maxLength={60} value={form.meta_title_es} onChange={e => set('meta_title_es', e.target.value)} className={inputCls} placeholder="Autognerado si vacío..." />
                            </div>
                            <div>
                              <div className="flex justify-between items-center"><label className={labelCls}>🇪🇸 Meta Description</label><CharCount current={form.meta_description_es.length} max={160} /></div>
                              <textarea rows={3} maxLength={160} value={form.meta_description_es} onChange={e => set('meta_description_es', e.target.value)} className={inputCls + ' resize-none'} placeholder="Autogenerado si vacío..." />
                            </div>
                          </div>
                          <div className="space-y-6">
                            <div>
                              <div className="flex justify-between items-center"><label className={labelCls}>🇬🇧 Meta Title</label><CharCount current={form.meta_title_en.length} max={60} /></div>
                              <input type="text" maxLength={60} value={form.meta_title_en} onChange={e => set('meta_title_en', e.target.value)} className={inputCls} placeholder="Autogenerated if empty..." />
                            </div>
                            <div>
                              <div className="flex justify-between items-center"><label className={labelCls}>🇬🇧 Meta Description</label><CharCount current={form.meta_description_en.length} max={160} /></div>
                              <textarea rows={3} maxLength={160} value={form.meta_description_en} onChange={e => set('meta_description_en', e.target.value)} className={inputCls + ' resize-none'} placeholder="Autogenerated if empty..." />
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="pt-8 border-t border-white/5 text-center"
                        >
                          <p className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-bold">
                            Modo automático activo. Haz clic en "Personalizar SEO" para editar manualmente.
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </section>

              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </div>
    </div>
  );
}
