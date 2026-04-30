'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Reorder, AnimatePresence, motion } from 'motion/react';
import {
  Plus, Trash2, Edit3, User as UserIcon,
  GripVertical, EyeOff, Eye, X, Image as ImageIcon
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { deleteCloudinaryAsset } from '@/lib/cloudinary';
import { CloudinaryUploader } from '@/components/CloudinaryUploader';
import { TranslationField } from './components';

interface Talent {
  id: string;
  name: string;
  category_es: string;
  image_url: string;
  is_archived: boolean;
  order_index: number;
}

interface BrandItem {
  uid: string;
  name: string;
  url: string;
  is_archived: boolean;
}

interface ExperienceItem {
  title_es: string;
  title_en: string;
  description_es: string;
  description_en: string;
}

function normalizeBrands(raw: any): BrandItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((b, i) => {
    const base = typeof b === 'string' 
      ? { name: 'Brand', url: b, is_archived: false } 
      : { name: b?.name ?? 'Brand', url: b?.url ?? '', is_archived: b?.is_archived ?? false };
    
    return {
      ...base,
      uid: b?.uid || (typeof b === 'string' ? b : `brand-${i}`)
    };
  });
}

export const TalentsAdminSection = ({
  saveTrigger,
  onSaveComplete,
}: {
  saveTrigger: number;
  onSaveComplete: (success?: boolean) => void;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [talents, setTalents] = useState<Talent[]>([]);
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState<BrandItem[]>([]);
  const [experience, setExperience] = useState<ExperienceItem[]>([
    { title_es: '', title_en: '', description_es: '', description_en: '' },
    { title_es: '', title_en: '', description_es: '', description_en: '' },
    { title_es: '', title_en: '', description_es: '', description_en: '' }
  ]);
  const [sectionData, setSectionData] = useState({ es: '', en: '' });
  const initialMount = React.useRef(true);
  const reorderTimer = React.useRef<NodeJS.Timeout | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const [{ data: talentData }, { data: settings }] = await Promise.all([
      supabase
        .from('talents')
        .select('id, name, category_es, image_url, is_archived, order_index')
        .order('order_index', { ascending: true }),
      supabase.from('site_settings').select('data').eq('id', 'talents').single(),
    ]);

    if (talentData) setTalents(talentData);
    if (settings?.data) {
      setBrands(normalizeBrands(settings.data.brands || []));
      setExperience(settings.data.experience || [
        { title_es: '', title_en: '', description_es: '', description_en: '' },
        { title_es: '', title_en: '', description_es: '', description_en: '' },
        { title_es: '', title_en: '', description_es: '', description_en: '' }
      ]);
      setSectionData({
        es: settings.data.title_es || '',
        en: settings.data.title_en || '',
      });
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (initialMount.current) {
      initialMount.current = false;
      return;
    }
    if (saveTrigger > 0) handleSaveSettings();
  }, [saveTrigger]);

  // Re-fetch when returning from a save operation
  useEffect(() => {
    if (searchParams.get('saved') === 'true') {
      fetchData();
    }
  }, [searchParams]);

  const handleReorder = (newOrder: Talent[]) => {
    setTalents(newOrder);
    if (reorderTimer.current) clearTimeout(reorderTimer.current);
    reorderTimer.current = setTimeout(async () => {
      await Promise.all(
        newOrder.map((t, index) =>
          supabase.from('talents').update({ order_index: index }).eq('id', t.id)
        )
      );
      reorderTimer.current = null;
    }, 500);
  };

  const handleToggleArchive = async (id: string, archived: boolean) => {
    setTalents(prev => prev.map(t => t.id === id ? { ...t, is_archived: archived } : t));
    await supabase.from('talents').update({ is_archived: archived }).eq('id', id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este talento? Esta acción no se puede deshacer.')) return;
    const talent = talents.find(t => t.id === id);
    const { error } = await supabase.from('talents').delete().eq('id', id);
    if (error) { console.error('Error deleting talent:', error); return; }
    setTalents(prev => prev.filter(p => p.id !== id));
    if (talent?.image_url) deleteCloudinaryAsset(talent.image_url);
  };

  const handleSaveSettings = async () => {
    if (loading) return;
    const { error } = await supabase.from('site_settings').upsert({
      id: 'talents',
      data: {
        brands,
        experience,
        title_es: sectionData.es,
        title_en: sectionData.en,
      },
    }, { onConflict: 'id' }
    );
    if (error) console.error('Error saving talents settings:', error);
    onSaveComplete(!error);
  };

  const handleReorderBrands = (newOrder: BrandItem[]) => {
    setBrands(newOrder);
  };

  const handleToggleBrandArchive = (uid: string) => {
    setBrands(prev => prev.map(b => b.uid === uid ? { ...b, is_archived: !b.is_archived } : b));
  };

  const handleRemoveBrand = (uid: string) => {
    if (!confirm('¿Eliminar este logo?')) return;
    const brand = brands.find(b => b.uid === uid);
    if (brand?.url) deleteCloudinaryAsset(brand.url);
    setBrands(prev => prev.filter(b => b.uid !== uid));
  };

  return (
    <div className="space-y-12">

      {/* 1. TÍTULO DE LA SECCIÓN */}
      <section className="bg-white/3 border border-white/8 rounded-[2.5rem] p-10 space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-green/20 flex items-center justify-center text-brand-green">
            <UserIcon size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Título de la Sección</h2>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Aparece en la home encima de los talentos</p>
          </div>
        </div>
        <TranslationField
          label="Título"
          maxLength={30}
          required={true}
          value={sectionData}
          onChange={setSectionData}
        />
      </section>

      {/* 2. LISTADO DE TALENTOS */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white mb-1">Talentos</h2>
            <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Arrastra para reordenar cómo aparecen en la web</p>
          </div>
          <button
            onClick={() => router.push('/admin/talents/new')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-[9px] uppercase tracking-widest font-black bg-brand-green text-white hover:opacity-80 transition-all"
          >
            <Plus size={15} /> Nuevo Talento
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-20 rounded-2xl bg-white/5 animate-pulse" />)}
          </div>
        ) : talents.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-white/10 rounded-3xl text-white/20 uppercase tracking-widest font-bold text-[10px]">
            No hay talentos creados.
          </div>
        ) : (
          <Reorder.Group axis="y" values={talents} onReorder={handleReorder} className="space-y-3">
            {talents.map((talent) => (
              <Reorder.Item
                key={talent.id}
                value={talent}
                className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all ${talent.is_archived
                    ? 'bg-black/40 border-white/5 opacity-60'
                    : 'bg-white/5 border-white/10 hover:border-brand-green/30'
                  }`}
              >
                <div className="cursor-grab active:cursor-grabbing text-white/10 group-hover:text-white/30 transition-colors shrink-0">
                  <GripVertical size={20} />
                </div>
                <div className="w-12 h-12 rounded-full overflow-hidden bg-white/5 border border-white/10 shrink-0">
                  {talent.image_url
                    ? <img src={talent.image_url} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center"><UserIcon size={16} className="text-white/20" /></div>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white truncate">{talent.name}</h4>
                    {talent.is_archived && (
                      <span className="px-2 py-0.5 rounded-md bg-white/10 text-[8px] uppercase tracking-widest font-black text-white/40">Archivado</span>
                    )}
                  </div>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest">{talent.category_es}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleToggleArchive(talent.id, !talent.is_archived); }}
                    onPointerDown={(e) => e.stopPropagation()}
                    title={talent.is_archived ? 'Activar en web' : 'Archivar'}
                    className={`p-2.5 rounded-xl transition-all ${talent.is_archived
                        ? 'bg-orange-500/10 text-orange-400 hover:bg-orange-500 hover:text-white'
                        : 'bg-white/5 text-white/40 hover:bg-brand-green/20 hover:text-brand-green'
                      }`}
                  >
                    {talent.is_archived ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); router.push(`/admin/talents/${talent.id}/edit`); }}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="p-2.5 rounded-xl bg-white/5 text-white/40 hover:text-white hover:bg-brand-green transition-all"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(talent.id); }}
                    onPointerDown={(e) => e.stopPropagation()}
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

      {/* 3. MARCAS & LOGOS */}
      <section className="bg-white/3 border border-white/8 rounded-[2.5rem] p-10 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-green/20 flex items-center justify-center text-brand-green">
              <ImageIcon size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Marcas</h2>
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
                Logos del carrusel infinito · {brands.filter(b => !b.is_archived).length} visibles / {brands.length} de 20 máx.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (brands.length >= 20) {
                alert('Has alcanzado el límite de 20 marcas.');
                return;
              }
              router.push('/admin/brands/new');
            }}
            disabled={brands.length >= 20}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[9px] uppercase tracking-widest font-black transition-all ${
              brands.length >= 20 ? 'bg-white/10 text-white/20 cursor-not-allowed' : 'bg-brand-green text-white hover:opacity-80'
            }`}
          >
            <Plus size={15} /> Añadir Marca
          </button>
        </div>

        {brands.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-white/10 rounded-2xl text-white/20 uppercase tracking-widest font-bold text-[10px]">
            No hay marcas. Añade el primero con el botón de arriba.
          </div>
        ) : (
          <Reorder.Group axis="y" values={brands} onReorder={handleReorderBrands} className="space-y-3">
            {brands.map((brand) => (
              <Reorder.Item
                key={brand.uid}
                value={brand}
                className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all ${brand.is_archived
                    ? 'bg-black/40 border-white/5 opacity-50'
                    : 'bg-white/5 border-white/10 hover:border-brand-green/30'
                  }`}
              >
                <div className="cursor-grab active:cursor-grabbing text-white/10 group-hover:text-white/30 transition-colors shrink-0">
                  <GripVertical size={20} />
                </div>

                <div className="w-16 h-8 rounded-lg overflow-hidden bg-black/40 border border-white/10 shrink-0 flex items-center justify-center p-2">
                  <img src={brand.url} className="w-full h-full object-contain" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-white truncate">{brand.name || 'Sin nombre'}</h4>
                    {brand.is_archived && (
                      <span className="px-2 py-0.5 rounded-md bg-white/10 text-[8px] uppercase tracking-widest font-black text-white/40">Oculto</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleToggleBrandArchive(brand.uid); }}
                    onPointerDown={(e) => e.stopPropagation()}
                    title={brand.is_archived ? 'Mostrar en web' : 'Ocultar de la web'}
                    className={`p-2.5 rounded-xl transition-all ${brand.is_archived
                        ? 'bg-orange-500/10 text-orange-400 hover:bg-orange-500 hover:text-white'
                        : 'bg-white/5 text-white/40 hover:bg-brand-green/20 hover:text-brand-green'
                      }`}
                  >
                    {brand.is_archived ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); router.push(`/admin/brands/${brand.uid}`); }}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="p-2.5 rounded-xl bg-white/5 text-white/40 hover:text-white hover:bg-brand-green transition-all"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleRemoveBrand(brand.uid); }}
                    onPointerDown={(e) => e.stopPropagation()}
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

      {/* 4. EXPERIENCIA (PUNTOS 1, 2, 3) */}
      <section className="bg-white/3 border border-white/8 rounded-[2.5rem] p-10 space-y-12">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-green/20 flex items-center justify-center text-brand-green">
            <Edit3 size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Sección Experiencia</h2>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Los 3 puntos informativos debajo de las marcas</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12">
          {experience.map((item, index) => (
            <div key={index} className="space-y-6 p-8 rounded-3xl bg-white/5 border border-white/10 relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-brand-green text-white flex items-center justify-center font-black text-sm shadow-xl">
                0{index + 1}
              </div>
              <div className="grid grid-cols-1 gap-8">
                <TranslationField
                  label={`Título Punto 0${index + 1}`}
                  maxLength={30}
                  required={true}
                  value={{ es: item.title_es, en: item.title_en }}
                  stacked={true}
                  onChange={(val) => {
                    const newExp = [...experience];
                    newExp[index] = { ...newExp[index], title_es: val.es, title_en: val.en };
                    setExperience(newExp);
                  }}
                />
                <TranslationField
                  label={`Descripción Punto 0${index + 1}`}
                  type="textarea"
                  maxLength={200}
                  required={true}
                  value={{ es: item.description_es, en: item.description_en }}
                  stacked={true}
                  onChange={(val) => {
                    const newExp = [...experience];
                    newExp[index] = { ...newExp[index], description_es: val.es, description_en: val.en };
                    setExperience(newExp);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
