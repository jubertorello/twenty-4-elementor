'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft, Save, Loader2, User as UserIcon,
  Instagram, Type, Languages, AlertCircle
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { CloudinaryUploader } from '@/components/CloudinaryUploader';
import { TranslationField, ImageEditor } from '../components';

interface TalentFormProps {
  initialData?: any;
  talentId?: string;
}

export default function TalentFormPage({ initialData, talentId }: TalentFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'saving' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const [form, setForm] = useState({
    name: '',
    category_es: '',
    category_en: '',
    description_es: '',
    description_en: '',
    image_url: '',
    instagram_url: '',
    is_archived: false,
  });

  // Sincronizar formulario cuando lleguen los datos iniciales
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        category_es: initialData.category_es || '',
        category_en: initialData.category_en || '',
        description_es: initialData.description_es || '',
        description_en: initialData.description_en || '',
        image_url: initialData.image_url || '',
        instagram_url: initialData.instagram_url || '',
        is_archived: initialData.is_archived || false,
      });
    }
  }, [initialData]);

  const set = (key: string, val: any) => setForm(p => ({ ...p, [key]: val }));

  const handleSave = async () => {
    if (!form.name) {
      setStatus('error');
      setErrorMsg('El nombre es obligatorio');
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }

    setIsSaving(true);
    setStatus('saving');

    const isNew = talentId === 'new';
    const finalData: any = {
      ...form,
      updated_at: new Date().toISOString(),
    };

    if (isNew) {
      const { count } = await supabase.from('talents').select('*', { count: 'exact', head: true });
      finalData.order_index = count ?? 0;
    } else {
      finalData.id = talentId;
    }

    const { error, data } = await supabase.from('talents').upsert(finalData).select();

    if (error) {
      console.error('Error de Supabase:', error.message, error.details, error.hint);
      setStatus('error');
      setErrorMsg(`Error: ${error.message || 'No se pudo guardar'}`);
      setIsSaving(false);
      setTimeout(() => setStatus('idle'), 5000);
      return;
    }

    router.push('/admin?tab=talents&saved=true');
  };

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-almost-black/40 focus:bg-white/8 transition-all placeholder:text-white/15 disabled:opacity-50 disabled:cursor-not-allowed";
const labelCls = "block text-[9px] uppercase tracking-[0.25em] font-black text-white/30 mb-2";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header Fijo */}
      <div className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/5 px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/admin?tab=talents')}
            className="flex items-center gap-2 text-white/30 hover:text-white transition-colors text-[10px] uppercase tracking-widest font-black group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Volver
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[9px] uppercase tracking-[0.4em] font-black text-brand-almost-black">Admin</span>
            <span className="text-white/20">/</span>
            <span className="text-[9px] uppercase tracking-[0.4em] font-black text-white/60">{talentId === 'new' ? 'Nuevo' : 'Editar'} Talento</span>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-8 py-2.5 rounded-xl text-[10px] uppercase tracking-widest font-black text-white transition-all min-w-[140px] justify-center bg-brand-almost-black hover:opacity-80 disabled:opacity-50"
        >
          {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {isSaving ? 'Guardando...' : 'Guardar'}
        </button>
      </div>

      {/* Alertas */}
      <AnimatePresence>
        {status === 'error' && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] bg-red-500 text-white px-6 py-3 rounded-full font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 shadow-2xl border border-red-400">
            <AlertCircle size={14} /> {errorMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto px-8 py-12 pb-32">
        <div className="space-y-12">

          {/* 1. IDENTIDAD */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-brand-almost-black/20 flex items-center justify-center"><UserIcon size={16} className="text-brand-almost-black" /></div>
              <h2 className="text-lg font-black uppercase tracking-widest text-white/80">01 · Perfil</h2>
            </div>
            <div className="p-8 rounded-3xl bg-white/3 border border-white/8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center">
                      <label className={labelCls}>Nombre Completo <span className="text-red-400">*</span></label>
                      <span className={`text-[8px] font-bold tracking-widest ${form.name.length >= 60 ? 'text-red-500' : 'text-white/20'}`}>
                        {form.name.length}/60
                      </span>
                    </div>
                    <input type="text" maxLength={60} value={form.name} onChange={e => set('name', e.target.value)} className={inputCls} placeholder="Ej: Juan Lebrón" />
                  </div>
                  <div>
                    <label className={labelCls}>Instagram URL <span className="opacity-50 lowercase font-normal italic">(Opcional)</span></label>
                    <div className="relative">
                      <Instagram className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                      <input type="text" value={form.instagram_url} onChange={e => set('instagram_url', e.target.value)} className={inputCls + " pl-14"} placeholder="https://instagram.com/..." />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className={labelCls}>Foto de Perfil <span className="text-red-400">*</span></label>
                  <ImageEditor
                    url={form.image_url}
                    aspect="portrait"
                    label="Subir foto de perfil"
                    onUpload={(url) => set('image_url', url)}
                    onDelete={() => set('image_url', '')}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 2. TRADUCCIONES */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-brand-almost-black/20 flex items-center justify-center"><Languages size={16} className="text-brand-almost-black" /></div>
              <h2 className="text-lg font-black uppercase tracking-widest text-white/80">02 · Categoría</h2>
            </div>
            <div className="space-y-8">
              <TranslationField
                label="Categoría / Deporte"
                maxLength={30}
                required={true}
                value={{ es: form.category_es, en: form.category_en }}
                onChange={(val) => setForm(p => ({ ...p, category_es: val.es, category_en: val.en }))}
              />
            </div>
          </section>

          {/* 3. ESTADO */}
          <section className="p-10 rounded-3xl bg-white/5 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-1">Visibilidad en la Web</h3>
              <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Controla si este talento aparece o no en el carrusel público.</p>
            </div>
            <button
              onClick={() => set('is_archived', !form.is_archived)}
              className={`px-10 py-4 rounded-2xl text-[11px] uppercase tracking-[0.2em] font-black transition-all border-2 ${form.is_archived
                  ? 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20'
                  : 'bg-brand-almost-black/20 text-brand-almost-black border-brand-almost-black/30 hover:bg-brand-almost-black/30'
                }`}
            >
              {form.is_archived ? '✖ Oculto / Archivado' : '✔ Activo en Web'}
            </button>
          </section>

        </div>
      </div>
    </div>
  );
}
