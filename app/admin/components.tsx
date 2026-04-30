'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Image as ImageIcon, Video, Plus, Trash2, Star, Edit3, Library } from 'lucide-react';
import { CloudinaryUploader } from '@/components/CloudinaryUploader';
import { deleteCloudinaryAsset } from '@/lib/cloudinary';
import { supabase } from '@/lib/supabase';
import { MediaLibraryModal, PhotosSection } from './MediaLibraryModal';
export { PhotosSection, MediaLibraryModal };

// --- Types ---
export interface AdminSectionProps {
  saveTrigger?: number;
  onSaveComplete?: (success: boolean) => void;
}

export type Language = 'EN' | 'ES';
export interface TranslatedText { en: string; es: string; }

// --- Shared Components ---

export const TranslationField = ({ label, value, onChange, type = 'text', maxLength, required = false, stacked = false }: {
  label: string; value: TranslatedText; onChange: (v: TranslatedText) => void; type?: 'text' | 'textarea'; maxLength?: number;
  required?: boolean; stacked?: boolean;
}) => (
  <div className="space-y-4 p-5 bg-white/5 rounded-2xl border border-white/10">
    <div className="flex items-center justify-between">
      <label className="text-[10px] uppercase tracking-widest font-bold text-white/40">
        {label} {!required && <span className="opacity-50 lowercase font-normal italic">(Opcional)</span>}
      </label>
    </div>
    <div className={`grid gap-4 ${stacked ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
      {(['es', 'en'] as const).map((lang) => (
        <div key={lang} className="space-y-2">
          <div className="flex justify-between items-center text-[8px] text-white/30 font-bold uppercase tracking-widest">
            <div className="flex items-center gap-1.5">
              <span className="text-[12px]">{lang === 'es' ? '🇪🇸' : '🇬🇧'}</span>
              <span>{lang === 'es' ? 'Español' : 'English'}</span>
            </div>
            {maxLength && <span className={value[lang]?.length > maxLength ? 'text-red-500' : ''}>{value[lang]?.length || 0}/{maxLength}</span>}
          </div>
          {type === 'text' ? (
            <input type="text" maxLength={maxLength} value={value[lang]} onChange={(e) => onChange({ ...value, [lang]: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-brand-green outline-none transition-colors placeholder:text-white/20" />
          ) : (
            <textarea maxLength={maxLength} value={value[lang]} onChange={(e) => onChange({ ...value, [lang]: e.target.value })} rows={stacked ? 4 : 3}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-brand-green outline-none transition-colors resize-none placeholder:text-white/20" />
          )}
        </div>
      ))}
    </div>
  </div>
);

export const ImageEditor = ({
  url,
  onUpload,
  onDelete,
  aspect = 'video',
  label = 'Subir Imagen',
  className = "",
  objectFit = 'cover' as 'cover' | 'contain'
}: {
  url?: string;
  onUpload: (url: string) => void;
  onDelete: () => void;
  aspect?: 'video' | 'square' | 'portrait' | 'wide' | 'auto';
  label?: string;
  className?: string;
  objectFit?: 'cover' | 'contain';
}) => {
  const [isLibraryOpen, setIsLibraryOpen] = React.useState(false);
  const aspectCls = aspect === 'video' ? 'aspect-video' : aspect === 'square' ? 'aspect-square' : aspect === 'portrait' ? 'aspect-[4/5]' : aspect === 'wide' ? 'aspect-[3/1]' : 'aspect-auto';

  const handleSelectFromLibrary = (newUrl: string) => {
    onUpload(newUrl);
    setIsLibraryOpen(false);
  };

  return (
    <>
      <div className={`${aspectCls} rounded-[2rem] bg-[#0a0a0a] border-2 border-dashed border-white/10 overflow-hidden relative group min-h-[120px] ${className}`}>
        {/* Subtle grid background for logo visualization */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
        />
        
        {url ? (
          <>
            <img src={url} className={`absolute inset-0 w-full h-full ${objectFit === 'contain' ? 'object-contain p-4' : 'object-cover'} transition-transform duration-700 group-hover:scale-105 z-10`} alt="" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-4 backdrop-blur-[2px] z-20">
              <div className="relative">
                <CloudinaryUploader
                  accept="image"
                  onUpload={onUpload}
                  className="p-4 rounded-2xl bg-brand-green text-white hover:scale-110 transition-transform shadow-xl cursor-pointer"
                >
                  <Edit3 size={20} />
                </CloudinaryUploader>
              </div>
              <button 
                onClick={() => setIsLibraryOpen(true)}
                className="p-4 rounded-2xl bg-blue-500 text-white hover:scale-110 transition-transform shadow-xl"
                title="Seleccionar de la galería"
              >
                <Library size={20} />
              </button>
              <button
                onClick={() => {
                  if (confirm('¿Quitar esta imagen? (Se mantendrá en tu biblioteca)')) {
                    onDelete();
                  }
                }}
                className="p-4 rounded-2xl bg-red-500 text-white hover:scale-110 transition-transform shadow-xl"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-8 group/empty z-10">
            <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover/empty:bg-brand-green/20 group-hover/empty:border-brand-green/30 transition-all">
              <ImageIcon size={20} className="text-white/10 group-hover/empty:text-brand-green transition-colors" />
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <CloudinaryUploader
                accept="image"
                onUpload={onUpload}
                className="cursor-pointer"
              >
                <p className="text-[9px] uppercase tracking-[0.2em] font-black text-white/30 group-hover/empty:text-white transition-colors">
                  {label}
                </p>
              </CloudinaryUploader>

              <div className="w-4 h-[1px] bg-white/5" />

              <button 
                onClick={() => setIsLibraryOpen(true)}
                className="flex items-center gap-2 text-[8px] uppercase tracking-widest font-black text-white/20 hover:text-white transition-all"
              >
                <Library size={12} /> Galería
              </button>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isLibraryOpen && (
          <MediaLibraryModal 
            isOpen={isLibraryOpen}
            onClose={() => setIsLibraryOpen(false)}
            onSelect={handleSelectFromLibrary}
            type="image"
          />
        )}
      </AnimatePresence>
    </>
  );
};

// --- Section Views ---

export const HeroSection = ({ saveTrigger, onSaveComplete }: AdminSectionProps) => {
  const [data, setData] = React.useState({
    type: 'video' as 'video' | 'image',
    title_es: 'contenido deportivo &\ncolaboraciones de marcas',
    title_en: 'sports content &\nbrands partnerships',
    videoUrl: 'https://talentfinder.cloud/embed/xwprl4mwl98f?autoplay=yes&loop=yes&kiosk=yes&fill=yes',
    imageUrl: ''
  });
  const [loading, setLoading] = React.useState(true);
  const [isLibraryOpen, setIsLibraryOpen] = React.useState(false);

  const dataRef = React.useRef(data);
  React.useEffect(() => { dataRef.current = data; }, [data]);

  React.useEffect(() => {
    supabase.from('site_settings').select('data').eq('id', 'hero').single().then(({ data: res }) => {
      if (res?.data) setData(prev => ({ ...prev, ...res.data }));
      setLoading(false);
    });
  }, []);

  const initialMount = React.useRef(true);
  React.useEffect(() => {
    if (initialMount.current) { initialMount.current = false; return; }
    if (saveTrigger && saveTrigger > 0) {
      supabase.from('site_settings').upsert({ id: 'hero', data: dataRef.current }, { onConflict: 'id' }).then(({ error }) => {
        if (error) console.error('Error saving hero section:', error);
        if (onSaveComplete) onSaveComplete(!error);
      });
    }
  }, [saveTrigger]);

  const updateData = (key: string, val: any) => setData(p => ({ ...p, [key]: val }));

  if (loading) return <div className="text-white/20 p-20 text-center font-black uppercase tracking-widest animate-pulse">Cargando Hero Banner...</div>;

  return (
    <div className="space-y-12">
      <AnimatePresence>
        {isLibraryOpen && (
          <MediaLibraryModal 
            isOpen={isLibraryOpen}
            onClose={() => setIsLibraryOpen(false)}
            onSelect={(url) => {
              if (data.type === 'video') updateData('videoUrl', url);
              else updateData('imageUrl', url);
              setIsLibraryOpen(false);
            }}
            type={data.type}
          />
        )}
      </AnimatePresence>

      {/* TÍTULO DE SECCIÓN */}
      <section className="bg-white/3 border border-white/8 rounded-[2.5rem] p-10 space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-green/20 flex items-center justify-center text-brand-green">
            <Star size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Título Principal</h2>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Gran texto animado en la pantalla de entrada. Usa salto de línea para dividirlo en dos filas.</p>
          </div>
        </div>
        <TranslationField
          label="Título"
          type="textarea"
          maxLength={40}
          required={true}
          stacked={true}
          value={{ es: data.title_es, en: data.title_en }}
          onChange={(val) => setData(prev => ({ ...prev, title_es: val.es, title_en: val.en }))}
        />
      </section>

      {/* MEDIA SELECTOR */}
      <section className="bg-white/3 border border-white/8 rounded-[2.5rem] p-10 space-y-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${data.type === 'video' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
              {data.type === 'video' ? <Video size={24} /> : <ImageIcon size={24} />}
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Fondo del Hero</h2>
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Elige si prefieres un vídeo o una imagen estática de fondo.</p>
            </div>
          </div>

          <div className="flex p-1 bg-white/5 rounded-xl border border-white/10">
            <button 
              onClick={() => updateData('type', 'video')}
              className={`px-6 py-2 rounded-lg text-[10px] uppercase tracking-widest font-black transition-all ${data.type === 'video' ? 'bg-blue-500 text-white shadow-lg' : 'text-white/30 hover:text-white'}`}
            >
              Vídeo
            </button>
            <button 
              onClick={() => updateData('type', 'image')}
              className={`px-6 py-2 rounded-lg text-[10px] uppercase tracking-widest font-black transition-all ${data.type === 'image' ? 'bg-purple-500 text-white shadow-lg' : 'text-white/30 hover:text-white'}`}
            >
              Imagen
            </button>
          </div>
        </div>

        {data.type === 'video' ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-5 bg-white/5 rounded-2xl border border-white/10">
              <Video size={20} className="text-white/20 shrink-0" />
              <input
                type="text"
                value={data.videoUrl}
                onChange={e => updateData('videoUrl', e.target.value)}
                className="flex-grow bg-transparent text-sm text-white outline-none placeholder:text-white/20"
                placeholder="https://vimeo.com/123456789 o enlace de YouTube"
              />
              <button 
                onClick={() => setIsLibraryOpen(true)}
                className="px-4 py-2 rounded-xl bg-white/5 text-[9px] uppercase tracking-widest font-black text-white/40 hover:text-white hover:bg-white/10 transition-all border border-white/10 flex items-center gap-2"
              >
                <Library size={14} /> Galería
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <ImageEditor
              url={data.imageUrl}
              aspect="video"
              label="Subir Imagen de Fondo"
              onUpload={(url) => updateData('imageUrl', url)}
              onDelete={() => updateData('imageUrl', '')}
              className="bg-white/5 border-white/20"
            />
          </div>
        )}
      </section>
    </div>
  );
};

export const PresentationSection = ({ saveTrigger, onSaveComplete }: AdminSectionProps) => {
  const [data, setData] = React.useState({
    text_es: 'Donde los atletas se convierten en iconos.',
    text_en: 'Where Athletes Become Icons.',
    gallery: [] as string[]
  });
  const [loading, setLoading] = React.useState(true);

  const dataRef = React.useRef(data);
  React.useEffect(() => { dataRef.current = data; }, [data]);

  React.useEffect(() => {
    supabase.from('site_settings').select('data').eq('id', 'presentation').single().then(({ data: res }) => {
      if (res?.data) setData(prev => ({ ...prev, ...res.data }));
      setLoading(false);
    });
  }, []);

  const initialMount = React.useRef(true);
  React.useEffect(() => {
    if (initialMount.current) { initialMount.current = false; return; }
    if (saveTrigger && saveTrigger > 0) {
      supabase.from('site_settings').upsert({ id: 'presentation', data: dataRef.current }, { onConflict: 'id' }).then(({ error }) => {
        if (error) console.error('Error saving presentation section:', error);
        if (onSaveComplete) onSaveComplete(!error);
      });
    }
  }, [saveTrigger]);

  const [isLibraryOpen, setIsLibraryOpen] = React.useState(false);
  const updateData = (key: string, val: any) => setData(p => ({ ...p, [key]: val }));

  if (loading) return <div className="text-white/20 p-20 text-center font-black uppercase tracking-widest animate-pulse">Cargando Presentación...</div>;

  return (
    <div className="space-y-12">
      <AnimatePresence>
        {isLibraryOpen && (
          <MediaLibraryModal 
            isOpen={isLibraryOpen}
            onClose={() => setIsLibraryOpen(false)}
            onSelect={(url) => {
              if ((data.gallery || []).length < 14) {
                setData(p => ({ ...p, gallery: [...(p.gallery || []), url] }));
              } else {
                alert('Límite de 14 imágenes alcanzado.');
              }
              setIsLibraryOpen(false);
            }}
            type="image"
          />
        )}
      </AnimatePresence>

      {/* FRASE ANIMADA */}
      <section className="bg-white/3 border border-white/8 rounded-[2.5rem] p-10 space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-green/20 flex items-center justify-center text-brand-green">
            <ImageIcon size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Frase</h2>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Aparece en el centro de la sección de galería. Máx. 46 caracteres.</p>
          </div>
        </div>
        <TranslationField
          label="Frase Intro"
          type="textarea"
          maxLength={46}
          required={true}
          stacked={true}
          value={{ es: data.text_es, en: data.text_en }}
          onChange={(val) => setData(prev => ({ ...prev, text_es: val.es, text_en: val.en }))}
        />
      </section>

      {/* GALERÍA */}
      <section className="bg-white/3 border border-white/8 rounded-[2.5rem] p-10 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400">
              <ImageIcon size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Galería</h2>
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
                {(data.gallery || []).length}/14 fotos
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                if ((data.gallery || []).length >= 14) {
                  alert('Has alcanzado el límite de 14 imágenes.');
                  return;
                }
                setIsLibraryOpen(true);
              }}
              disabled={(data.gallery || []).length >= 14}
              className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest font-black transition-all ${
                (data.gallery || []).length >= 14 ? 'opacity-20 cursor-not-allowed' : 'text-white/40 hover:text-white hover:bg-white/10'
              }`}
            >
              <Library size={16} /> Biblioteca
            </button>
            <CloudinaryUploader
              accept="image"
              label={(data.gallery || []).length >= 14 ? 'Límite 14' : '+ Añadir foto'}
              className={(data.gallery || []).length >= 14 ? 'opacity-50 pointer-events-none' : ''}
              onUpload={(url) => {
                if ((data.gallery || []).length < 14) {
                  setData(p => ({ ...p, gallery: [...(p.gallery || []), url] }));
                }
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {(data.gallery || []).map((url, i) => (
            <div key={i} className="aspect-[4/5] bg-black/50 rounded-2xl overflow-hidden group relative border border-white/10">
              <img src={url} className="w-full h-full object-cover transition-all group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-all backdrop-blur-[2px]">
                <div className="relative">
                   <div className="p-2.5 rounded-lg bg-brand-green text-white hover:scale-110 transition-transform shadow-lg cursor-pointer">
                      <Edit3 size={14} />
                   </div>
                   <CloudinaryUploader
                      accept="image"
                      label=""
                      onUpload={(newUrl) => {
                        // NOTE: We no longer delete the old asset from Cloudinary to keep it in the library
                        setData(p => {
                          const newG = [...(p.gallery || [])];
                          newG[i] = newUrl;
                          return { ...p, gallery: newG };
                        });
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                   />
                </div>
                <button
                  onClick={() => {
                    if (confirm('¿Quitar de la presentación? (La foto se mantendrá en tu biblioteca)')) {
                      // NOTE: Only remove from local state, do not delete from Cloudinary
                      setData(p => {
                        const newG = [...(p.gallery || [])];
                        newG.splice(i, 1);
                        return { ...p, gallery: newG };
                      });
                    }
                  }}
                  className="p-2.5 rounded-lg bg-red-500 text-white hover:scale-110 transition-transform shadow-lg"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
