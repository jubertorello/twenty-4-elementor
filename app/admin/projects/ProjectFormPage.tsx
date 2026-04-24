'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, Reorder, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, Save, Globe, Image as ImageIcon, Video,
  AlertCircle, CheckCircle, Loader2, Plus, X, GripVertical,
  EyeOff, Eye, Search, Type
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { CloudinaryUploader } from '@/components/CloudinaryUploader';

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
  image_url: '', video_url: '',
  gallery: [],
  client: '', year: new Date().getFullYear().toString(),
  is_archived: false,
  order_index: 0,
  has_case_study: false,
  meta_title_es: '', meta_title_en: '',
  meta_description_es: '', meta_description_en: '',
};

const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-green/40 focus:bg-white/8 transition-all placeholder:text-white/15";
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
  const [tab, setTab] = useState<'es' | 'en'>('es');
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const set = (key: keyof Project, value: any) => setForm(prev => ({ ...prev, [key]: value }));

  useEffect(() => {
    if (!projectId && form.title_es) {
      const slug = form.title_es.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
      set('slug', slug.slice(0, 100));
    }
  }, [form.title_es, projectId]);

  const handleSave = async () => {
    if (!form.title_es) { setErrorMsg('El Título es obligatorio.'); setStatus('error'); return; }
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
      setStatus('success'); setTimeout(() => router.push('/admin'), 1200);
    } catch (e: any) { setErrorMsg(e.message); setStatus('error'); }
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
          <button onClick={() => router.push('/admin')} className="flex items-center gap-2 text-white/30 hover:text-white transition-colors text-[10px] uppercase tracking-widest font-black group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Volver
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[9px] uppercase tracking-[0.4em] font-black text-brand-green">Admin</span>
            <span className="text-white/20">/</span>
            <span className="text-[9px] uppercase tracking-[0.4em] font-black text-white/60">{projectId ? 'Editar' : 'Nuevo'} Proyecto</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
            {(['es', 'en'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} className={`px-4 py-1.5 rounded-lg text-[9px] uppercase tracking-widest font-black transition-all ${tab === t ? 'bg-white/10 text-white shadow-xl' : 'text-white/20 hover:text-white/40'}`}>
                {t === 'es' ? '🇪🇸 ES' : '🇬🇧 EN'}
              </button>
            ))}
          </div>
          <button onClick={() => set('is_archived', !form.is_archived)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] uppercase tracking-widest font-black transition-all border ${form.is_archived ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' : 'bg-brand-green/10 border-brand-green/20 text-brand-green'}`}>
            {form.is_archived ? <><EyeOff size={14} /> Archivado</> : <><Eye size={14} /> Activo en Web</>}
          </button>
          <button onClick={handleSave} disabled={status === 'saving'} className="flex items-center gap-2 px-8 py-2.5 rounded-xl text-[10px] uppercase tracking-widest font-black bg-brand-green text-white hover:opacity-80 transition-all min-w-[140px] justify-center">
            {status === 'saving' ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} {status === 'saving' ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12 pb-32">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
          
          {/* 1. IDENTIDAD Y DESCRIPCIÓN CORTA */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-brand-green/20 flex items-center justify-center"><Type size={16} className="text-brand-green" /></div>
              <h2 className="text-lg font-black uppercase tracking-widest text-white/80">01 · Identidad</h2>
            </div>
            <div className="p-8 rounded-3xl bg-white/3 border border-white/8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center"><label className={labelCls}>Nombre del Proyecto ({tab}) <span className="text-red-400">*</span></label><CharCount current={(form[`title_${tab}` as keyof Project] as string || '').length} max={30} /></div>
                  <input type="text" maxLength={30} value={form[`title_${tab}` as keyof Project] as string || ''} onChange={e => set(`title_${tab}` as keyof Project, e.target.value)} className={inputCls} placeholder="Ej: BARO" />
                </div>
                <div>
                  <div className="flex justify-between items-center"><label className={labelCls}>Categoría ({tab})</label><CharCount current={(form[`category_${tab}` as keyof Project] as string || '').length} max={50} /></div>
                  <input type="text" maxLength={50} value={form[`category_${tab}` as keyof Project] as string || ''} onChange={e => set(`category_${tab}` as keyof Project, e.target.value)} className={inputCls} placeholder="Ej: Documental Netflix" />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center"><label className={labelCls}>Descripción Corta ({tab}) — Se ve en la Home</label><CharCount current={(form[`mini_description_${tab}` as keyof Project] as string || '').length} max={120} /></div>
                <input type="text" maxLength={120} value={form[`mini_description_${tab}` as keyof Project] as string || ''} onChange={e => set(`mini_description_${tab}` as keyof Project, e.target.value)} className={inputCls} placeholder="Frase impactante para la home..." />
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
                <label className={labelCls}>Foto de Portada</label>
                <CloudinaryUploader accept="image" label="Subir portada" currentUrl={form.image_url || undefined} onUpload={(url) => set('image_url', url)} />
              </div>
              <div>
                <label className={labelCls}>Vídeo de Hover</label>
                <CloudinaryUploader accept="video" label="Subir vídeo" currentUrl={form.video_url && !form.is_video_embed ? form.video_url : undefined} onUpload={(url) => { set('video_url', url); set('is_video_embed', false); }} />
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
                    <div className="w-8 h-8 rounded-xl bg-purple-500/20 flex items-center justify-center"><span className="text-purple-400 text-xs font-black">03</span></div>
                    <h2 className="text-lg font-black uppercase tracking-widest text-white/80">03 · Datos y Enlace</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 rounded-3xl bg-white/3 border border-white/8">
              <div>
                <label className={labelCls}>Cliente</label>
                <input type="text" maxLength={50} value={form.client} onChange={e => set('client', e.target.value)} className={inputCls} placeholder="Netflix, Nike..." />
              </div>
              <div>
                <label className={labelCls}>Año</label>
                <input type="text" maxLength={4} value={form.year} onChange={e => set('year', e.target.value)} className={inputCls} placeholder="2024" />
              </div>
              <div>
                <label className={labelCls}>Slug (URL)</label>
                <input type="text" value={form.slug} onChange={e => set('slug', e.target.value)} className={inputCls} placeholder="nombre-del-proyecto" />
              </div>
            </div>
          </section>

          {/* 4. DESCRIPCIÓN LARGA (CASE STUDY) */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-brand-green/20 flex items-center justify-center"><Globe size={16} className="text-brand-green" /></div>
              <h2 className="text-lg font-black uppercase tracking-widest text-white/80">04 · Historia (Case Study)</h2>
            </div>
            <div className="p-8 rounded-3xl bg-white/3 border border-white/8">
              <div className="flex justify-between items-center"><label className={labelCls}>Descripción Larga ({tab})</label><CharCount current={(form[`description_${tab}` as keyof Project] as string || '').length} max={2000} /></div>
              <textarea rows={8} maxLength={2000} value={form[`description_${tab}` as keyof Project] as string || ''} onChange={e => set(`description_${tab}` as keyof Project, e.target.value)} className={inputCls + ' resize-none'} placeholder="Cuenta la historia completa del proyecto..." />
            </div>
          </section>

          {/* 5. GALERIA */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-orange-500/20 flex items-center justify-center"><Plus size={16} className="text-orange-400" /></div>
              <h2 className="text-lg font-black uppercase tracking-widest text-white/80">05 · Galería de Imágenes</h2>
            </div>
            <div className="p-8 rounded-3xl bg-white/3 border border-white/8 space-y-6">
              <Reorder.Group axis="y" values={form.gallery || []} onReorder={(val) => set('gallery', val)} className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {(form.gallery || []).map((url, index) => (
                  <Reorder.Item key={url} value={url} className="relative aspect-video rounded-xl overflow-hidden border border-white/10 group cursor-move bg-black">
                    <img src={url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    <button onClick={() => removeFromGallery(index)} className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
                    <div className="absolute bottom-2 left-2 p-1 rounded-md bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"><GripVertical size={12} className="text-white/40" /></div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
              <CloudinaryUploader accept="image" label={form.gallery.length >= 6 ? "Límite alcanzado" : "Añadir a la galería"} onUpload={(url) => form.gallery.length < 6 ? addToGallery(url) : alert('Máximo 6 fotos.')} className={form.gallery.length >= 6 ? "opacity-50 pointer-events-none" : ""} />
            </div>
          </section>

          {/* 6. SEO */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-pink-500/20 flex items-center justify-center"><Search size={16} className="text-pink-400" /></div>
              <h2 className="text-lg font-black uppercase tracking-widest text-white/80">06 · SEO (Google)</h2>
            </div>
            <div className="p-8 rounded-3xl bg-white/3 border border-white/8 space-y-8">
              {/* Google Preview */}
              <div className="bg-white p-4 rounded-xl max-w-2xl font-sans">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-[10px]">T24</div>
                  <div className="text-xs text-[#202124]">
                    <span className="block">Twenty4 Studios</span>
                    <span className="text-[#4d5156]">https://twenty4studios.com › projects › {form.slug || 'nombre-proyecto'}</span>
                  </div>
                </div>
                <h3 className="text-xl text-[#1a0dab] hover:underline cursor-pointer truncate">
                  {form[`meta_title_${tab}` as keyof Project] || `${form[`title_${tab}` as keyof Project] || 'Título del Proyecto'} | Twenty4 Studios`}
                </h3>
                <p className="text-sm text-[#4d5156] mt-1 line-clamp-2">
                  {form[`meta_description_${tab}` as keyof Project] || form[`mini_description_${tab}` as keyof Project] || 'La descripción corta aparecerá aquí en los resultados de Google...'}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <div className="flex justify-between items-center">
                    <label className={labelCls}>Meta Title ({tab})</label>
                    <CharCount current={(form[`meta_title_${tab}` as keyof Project] as string || '').length} max={60} />
                  </div>
                  <input type="text" maxLength={60} value={form[`meta_title_${tab}` as keyof Project] as string || ''} onChange={e => set(`meta_title_${tab}` as keyof Project, e.target.value)} className={inputCls} placeholder="Dejar vacío para autogenerar..." />
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <label className={labelCls}>Meta Description ({tab})</label>
                    <CharCount current={(form[`meta_description_${tab}` as keyof Project] as string || '').length} max={160} />
                  </div>
                  <textarea rows={3} maxLength={160} value={form[`meta_description_${tab}` as keyof Project] as string || ''} onChange={e => set(`meta_description_${tab}` as keyof Project, e.target.value)} className={inputCls + ' resize-none'} placeholder="Dejar vacío para autogenerar..." />
                </div>
              </div>
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
