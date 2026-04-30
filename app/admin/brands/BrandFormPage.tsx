'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, Save, Loader2, Tag, 
  Image as ImageIcon, AlertCircle
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { CloudinaryUploader } from '@/components/CloudinaryUploader';
import { ImageEditor } from '../components';

interface BrandItem {
  uid: string;
  name: string;
  url: string;
  is_archived: boolean;
}

const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-green/40 focus:bg-white/8 transition-all placeholder:text-white/15 disabled:opacity-50 disabled:cursor-not-allowed";
const labelCls = "block text-[9px] uppercase tracking-[0.25em] font-black text-white/30 mb-2";

export default function BrandFormPage() {
  const router = useRouter();
  const params = useParams();
  const brandUid = params.uid as string;
  // Fallback robusto para detectar si es nueva
  const isNew = brandUid === 'new' || (typeof window !== 'undefined' && window.location.pathname.endsWith('/new'));


  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'saving' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState<BrandItem>({
    uid: '',
    name: '',
    url: '',
    is_archived: false,
  });

  const [allSettings, setAllSettings] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Usar maybeSingle para evitar errores si la fila no existe aún
      const { data: settings } = await supabase.from('site_settings').select('*').eq('id', 'talents').maybeSingle();
      
      if (settings) {
        setAllSettings(settings);
        const brands: any[] = settings.data?.brands || [];
        
        if (!isNew) {
          const brand = brands.find((b: any) => b.uid === brandUid || (typeof b === 'string' && b === brandUid));
          if (brand) {
            setForm({
              uid: brand.uid || brandUid,
              name: brand.name || 'Brand',
              url: typeof brand === 'string' ? brand : (brand.url || ''),
              is_archived: brand.is_archived || false
            });
          }
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [brandUid, isNew]);

  const handleSave = async () => {
    if (!form.name || !form.url) {
      setStatus('error');
      setErrorMsg('El nombre y el logo son obligatorios');
      return;
    }

    setIsSaving(true);
    setStatus('saving');

    try {
      // 1. Fetch de nuevo para asegurar datos frescos antes de guardar (evita pisar cambios de otros)
      const { data: freshSettings } = await supabase.from('site_settings').select('*').eq('id', 'talents').maybeSingle();
      const currentData = freshSettings?.data || {};
      const currentBrands = Array.isArray(currentData.brands) ? currentData.brands : [];
      
      const brandToSave = {
        ...form,
        uid: form.uid || `brand-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };

      let newBrands;
      if (isNew) {
        if (currentBrands.length >= 20) {
          throw new Error('Límite de 20 marcas alcanzado');
        }
        newBrands = [...currentBrands, brandToSave];
      } else {
        newBrands = currentBrands.map((b: any) => {
          const bUid = b?.uid || (typeof b === 'string' ? b : '');
          return (bUid === brandUid) ? brandToSave : b;
        });
      }

      const { error } = await supabase.from('site_settings').upsert({
        id: 'talents',
        data: {
          ...currentData,
          brands: newBrands
        }
      }, { onConflict: 'id' });

      if (error) throw error;
      
      // Forzar recarga total al volver para asegurar que el listado se refresque
      window.location.href = '/admin?tab=talents&saved=true';
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMsg(err.message || 'Error al guardar');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A0A0A] space-y-4">
      <div className="w-12 h-12 border-4 border-brand-green/20 border-t-brand-green rounded-full animate-spin" />
      <p className="text-white/20 font-black uppercase tracking-[0.3em] animate-pulse text-[10px]">Cargando...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* HEADER BAR */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-white/5 px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/admin?tab=talents')}
            className="flex items-center gap-2 text-white/30 hover:text-white transition-colors text-[10px] uppercase tracking-widest font-black group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Volver
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[9px] uppercase tracking-[0.4em] font-black text-brand-green">Admin</span>
            <span className="text-white/20">/</span>
            <span className="text-[9px] uppercase tracking-[0.4em] font-black text-white/60">{isNew ? 'Nueva' : 'Editar'} Marca</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-brand-green text-white font-black uppercase tracking-widest text-[10px] hover:opacity-80 transition-all disabled:opacity-50 min-w-[140px] justify-center"
          >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {isSaving ? 'Guardando...' : isNew ? 'Crear Marca' : 'Guardar Cambios'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {status === 'error' && (
          <motion.div 
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            className="fixed top-24 left-1/2 z-50 flex items-center gap-3 px-6 py-3 bg-red-500 text-white rounded-full font-bold uppercase tracking-widest text-xs shadow-2xl border border-red-400/50"
          >
            <AlertCircle size={16} /> {errorMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto px-8 py-32">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-brand-green/20 flex items-center justify-center"><Tag size={16} className="text-brand-green" /></div>
              <h2 className="text-lg font-black uppercase tracking-widest text-white/80">Identidad de la Marca</h2>
            </div>

            <div className="p-8 rounded-3xl bg-white/3 border border-white/8 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* NOMBRE */}
                <div className="space-y-2">
                  <label className={labelCls}>Nombre de la Marca <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    maxLength={30}
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className={inputCls}
                    placeholder="Ej: Nike, Adidas..."
                  />
                </div>

                {/* LOGO */}
                <div className="space-y-4">
                  <label className={labelCls}>Logotipo <span className="text-red-400">*</span></label>
                  <div className="max-w-md">
                    <ImageEditor
                      url={form.url}
                      aspect="video"
                      objectFit="contain"
                      className={form.url ? "bg-white/90" : ""}
                      label={isNew ? "Subir Logotipo" : "Cambiar Logo"}
                      onUpload={(url) => setForm(f => ({ ...f, url }))}
                      onDelete={() => setForm(f => ({ ...f, url: '' }))}
                    />
                  </div>
                  <p className="text-[9px] text-white/20 uppercase tracking-widest font-bold">
                    PNG transparente o SVG recomendado.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ESTADO */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-orange-500/20 flex items-center justify-center"><AlertCircle size={16} className="text-orange-400" /></div>
              <h2 className="text-lg font-black uppercase tracking-widest text-white/80">Visibilidad</h2>
            </div>
            
            <div className="p-8 rounded-3xl bg-white/3 border border-white/8">
               <button
                  onClick={() => setForm(f => ({ ...f, is_archived: !f.is_archived }))}
                  className="flex items-center gap-4 group"
               >
                  <div className={`w-14 h-8 rounded-full transition-all relative ${form.is_archived ? 'bg-red-500/20' : 'bg-brand-green/20'}`}>
                     <div className={`absolute top-1 w-6 h-6 rounded-full transition-all ${
                        form.is_archived ? 'left-7 bg-red-500' : 'left-1 bg-brand-green'
                     }`} />
                  </div>
                  <div className="text-left">
                     <span className="text-[10px] font-black uppercase tracking-widest block">
                        {form.is_archived ? 'Marca Oculta' : 'Marca Visible'}
                     </span>
                     <span className="text-[9px] text-white/30 uppercase font-bold">
                        {form.is_archived ? 'No aparecerá en el carrusel' : 'Aparecerá en el carrusel'}
                     </span>
                  </div>
               </button>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
}

