'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { TranslationField, ImageEditor } from './components';
import {
  Briefcase, Plus, Trash2, Info, ArrowLeft,
  Image as ImageIcon, ChevronRight, GripVertical, Quote, EyeOff, Eye, Edit3
} from 'lucide-react';
import { CloudinaryUploader } from '@/components/CloudinaryUploader';
import { deleteCloudinaryAsset } from '@/lib/cloudinary';
import { Reorder, motion, AnimatePresence } from 'motion/react';

interface Service {
  title_es: string;
  title_en: string;
  description_es: string;
  description_en: string;
  image: string;
  is_hidden?: boolean;
}

const labelCls = "block text-[9px] uppercase tracking-[0.25em] font-black text-white/30 mb-2";

export const AboutAdminSection = ({
  saveTrigger,
  onSaveComplete,
}: {
  saveTrigger: number;
  onSaveComplete: (success?: boolean) => void;
}) => {
  const [loading, setLoading] = useState(true);
  const [activeServiceIndex, setActiveServiceIndex] = useState<number | null>(null);
  const [data, setData] = useState({
    title_es: '',
    title_en: '',
    statement_es: '',
    statement_en: '',
    section_logo: '',
    services: [] as Service[]
  });
  const initialMount = React.useRef(true);

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    // Force scroll to top of the admin main container when switching between list and detail views
    const mainElement = document.querySelector('main');
    if (mainElement) mainElement.scrollTop = 0;
  }, [activeServiceIndex]);

  const fetchData = async () => {
    setLoading(true);
    const { data: rows, error } = await supabase
      .from('site_settings').select('data').eq('id', 'about');
    if (error) console.error('Error loading about section:', error);
    if (rows && rows.length > 0 && rows[0].data) {
      // Merge with defaults so new fields don't get lost if row predates them
      setData(prev => ({ ...prev, ...rows[0].data }));
    }
    setLoading(false);
  };

  useEffect(() => {
    if (initialMount.current) { initialMount.current = false; return; }
    if (saveTrigger > 0) handleSave();
  }, [saveTrigger]);

  const handleSave = async () => {
    if (loading) return;

    // Validación de servicios
    const invalidService = data.services.find(s => !s.title_es || !s.title_en || !s.description_es || !s.description_en || !s.image);
    if (invalidService) {
      alert(`El servicio "${invalidService.title_es || 'sin título'}" está incompleto. Título, descripción e imagen son obligatorios.`);
      setActiveServiceIndex(data.services.indexOf(invalidService));
      onSaveComplete(false);
      return;
    }

    try {
      const { error } = await supabase.from('site_settings').upsert(
        { id: 'about', data },
        { onConflict: 'id' }
      );
      if (error) console.error('Error saving about section:', error);
      onSaveComplete(!error);
    } catch (e) {
      console.error('Unexpected error saving about section:', e);
      onSaveComplete(false);
    }
  };

  const updateService = (index: number, updates: Partial<Service>) => {
    setData(prev => {
      const newServices = [...prev.services];
      newServices[index] = { ...newServices[index], ...updates };
      return { ...prev, services: newServices };
    });
  };

  const addService = () => {
    if (data.services.length >= 4) return;
    const newService: Service = { title_es: '', title_en: '', description_es: '', description_en: '', image: '' };
    setData(prev => ({ ...prev, services: [...prev.services, newService] }));
    setActiveServiceIndex(data.services.length);
  };

  const removeService = (index: number) => {
    if (!confirm('¿Eliminar este servicio?')) return;
    const service = data.services[index];
    if (service?.image) deleteCloudinaryAsset(service.image);
    setData(prev => ({ ...prev, services: prev.services.filter((_, i) => i !== index) }));
    setActiveServiceIndex(null);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-40 space-y-4">
      <div className="w-12 h-12 border-4 border-brand-almost-black/20 border-t-brand-almost-black rounded-full animate-spin" />
      <p className="text-white/20 font-black uppercase tracking-[0.3em] animate-pulse text-[10px]">Cargando...</p>
    </div>
  );

  // ── VISTA DETALLE DE SERVICIO ──────────────────────────────────────────────
  if (activeServiceIndex !== null) {
    const service = data.services[activeServiceIndex];
    return (
      <motion.div
        initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.3 }}
        className="space-y-10"
      >
        <button
          onClick={() => setActiveServiceIndex(null)}
          className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-white/40 hover:text-white transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Volver a la lista de servicios
        </button>

        <section className="bg-white/3 border border-white/8 rounded-[2.5rem] p-10 space-y-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-almost-black/20 flex items-center justify-center text-brand-almost-black">
                <Briefcase size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tighter text-white">
                  Servicio #{activeServiceIndex + 1}
                </h2>
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
                  {service.title_es || 'Sin título'}
                </p>
              </div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); removeService(activeServiceIndex); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-500 text-[10px] uppercase tracking-widest font-bold hover:bg-red-500 hover:text-white transition-all"
            >
              <Trash2 size={14} /> Eliminar
            </button>
          </div>

          <div className="space-y-8">
            {/* Título + Imagen — mitad/mitad */}
            <div className="grid grid-cols-2 gap-6 items-start">
              <TranslationField
                label="Título del Servicio"
                maxLength={30}
                required={true}
                value={{ es: service.title_es, en: service.title_en }}
                stacked={true}
                onChange={(val) => updateService(activeServiceIndex, { title_es: val.es, title_en: val.en })}
              />
              <div className="space-y-2">
                <label className={labelCls}>Imagen del Servicio <span className="text-red-400">*</span></label>
                <ImageEditor
                  url={service.image}
                  aspect="square"
                  label="Subir Foto"
                  onUpload={(url) => updateService(activeServiceIndex, { image: url })}
                  onDelete={() => updateService(activeServiceIndex, { image: '' })}
                />
              </div>
            </div>
            <TranslationField
              label="Descripción"
              type="textarea"
              maxLength={250}
              required={true}
              value={{ es: service.description_es, en: service.description_en }}
              stacked={true}
              onChange={(val) => updateService(activeServiceIndex, { description_es: val.es, description_en: val.en })}
            />
          </div>
        </section>
      </motion.div>
    );
  }

  // ── VISTA PRINCIPAL ────────────────────────────────────────────────────────
  return (
    <div className="space-y-12 pb-20">

      {/* 1. TÍTULO DE LA SECCIÓN */}
      <section className="bg-white/3 border border-white/8 rounded-[2.5rem] p-10 space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-almost-black/20 flex items-center justify-center text-brand-almost-black">
            <Briefcase size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Título de la Sección</h2>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Aparece en la home encima del about us</p>
          </div>
        </div>
        <TranslationField
          label="Título"
          maxLength={30}
          required={true}
          stacked={true}
          value={{ es: data.title_es, en: data.title_en }}
          onChange={(val) => setData(prev => ({ ...prev, title_es: val.es, title_en: val.en }))}
        />
      </section>

      {/* 2. FRASE + LOGO */}
      <section className="bg-white/3 border border-white/8 rounded-[2.5rem] p-10 space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400">
            <Quote size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Frase & Logo</h2>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Statement animado y logo decorativo de la sección</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[2.5fr_1fr] gap-8 items-start">
          <TranslationField
            label="Frase / Statement"
            type="textarea"
            maxLength={400}
            required={true}
            stacked={true}
            value={{ es: data.statement_es, en: data.statement_en }}
            onChange={(val) => setData(prev => ({ ...prev, statement_es: val.es, statement_en: val.en }))}
          />

          <div className="space-y-3">
            <label className={labelCls}>Logo / Icono de Sección</label>
            <ImageEditor
              url={data.section_logo}
              aspect="square"
              label="Cambiar Logo"
              onUpload={(url) => setData(prev => ({ ...prev, section_logo: url }))}
              onDelete={() => setData(prev => ({ ...prev, section_logo: '' }))}
            />
          </div>
        </div>
      </section>

      {/* 3. SERVICIOS */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-almost-black/20 flex items-center justify-center text-brand-almost-black">
              <Briefcase size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter text-white">
                Servicios <span className="text-white/20">({data.services.length}/4)</span>
              </h2>
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Arrastra para reordenar · haz clic para editar</p>
            </div>
          </div>
          <button
            onClick={addService}
            disabled={data.services.length >= 4}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-[9px] uppercase tracking-widest font-black bg-brand-almost-black text-white hover:opacity-80 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Plus size={15} /> Añadir Servicio
          </button>
        </div>

        {data.services.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-white/10 rounded-3xl text-white/20 uppercase tracking-widest font-bold text-[10px]">
            No hay servicios. Añade el primero con el botón de arriba.
          </div>
        ) : (
          <Reorder.Group
            axis="y"
            values={data.services}
            onReorder={(newOrder) => setData(prev => ({ ...prev, services: newOrder }))}
            className="space-y-3"
          >
            {data.services.map((service, i) => (
              <Reorder.Item
                key={i}
                value={service}
                className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                  service.is_hidden
                    ? 'bg-black/40 border-white/5 opacity-60'
                    : 'bg-white/5 border-white/10 hover:border-brand-almost-black/30'
                }`}
              >
                {/* Drag handle */}
                <div className="cursor-grab active:cursor-grabbing text-white/10 group-hover:text-white/30 transition-colors shrink-0">
                  <GripVertical size={20} />
                </div>

                {/* Thumbnail */}
                <div className="w-16 h-12 rounded-lg overflow-hidden bg-white/5 shrink-0 border border-white/10">
                  {service.image ? (
                    <img src={service.image} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon size={16} className="text-white/10" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white truncate">
                      {service.title_es || <span className="text-white/20 italic">Sin título</span>}
                    </h4>
                    {service.is_hidden && (
                      <span className="px-2 py-0.5 rounded-md bg-white/10 text-[8px] uppercase tracking-widest font-black text-white/40">
                        Oculto
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest truncate">
                    {service.description_es || 'Sin descripción'}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateService(i, { is_hidden: !service.is_hidden });
                    }}
                    title={service.is_hidden ? 'Mostrar en web' : 'Ocultar de la web'}
                    className={`p-2.5 rounded-xl transition-all ${
                      service.is_hidden
                        ? 'bg-orange-500/10 text-orange-400 hover:bg-orange-500 hover:text-white'
                        : 'bg-white/5 text-white/40 hover:bg-brand-almost-black/20 hover:text-brand-almost-black'
                    }`}
                  >
                    {service.is_hidden ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveServiceIndex(i);
                    }}
                    className="p-2.5 rounded-xl bg-white/5 text-white/40 hover:text-white hover:bg-brand-almost-black transition-all"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeService(i);
                    }}
                    className="p-2.5 rounded-xl bg-white/5 text-white/40 hover:text-white hover:bg-red-500 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        )}
      </section>
    </div>
  );
};
