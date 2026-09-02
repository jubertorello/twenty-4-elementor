'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Reorder } from 'motion/react';
import {
  Plus, Trash2, Edit3, Image as ImageIcon,
  GripVertical, EyeOff, Eye, Info, Briefcase
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { deleteCloudinaryAssets } from '@/lib/cloudinary';
import { TranslationField } from './components';

interface Project {
  id: string;
  slug: string;
  title_es: string;
  category_es: string;
  image_url: string;
  is_archived: boolean;
  order_index: number;
}

export const ProjectsAdminSection = ({
  saveTrigger,
  onSaveComplete,
}: {
  saveTrigger: number;
  onSaveComplete: (success?: boolean) => void;
}) => {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [sectionTitle, setSectionTitle] = useState({ es: '', en: '' });
  const initialMount = React.useRef(true);

  const fetchData = async () => {
    setLoading(true);
    const [{ data: projectsData }, { data: settingsData }] = await Promise.all([
      supabase
        .from('projects')
        .select('id, slug, title_es, category_es, image_url, is_archived, order_index')
        .order('order_index', { ascending: true }),
      supabase.from('site_settings').select('data').eq('id', 'projects').single(),
    ]);

    if (projectsData) setProjects(projectsData);
    if (settingsData?.data) {
      setSectionTitle({
        es: settingsData.data.title_es || 'Trabajo Seleccionado',
        en: settingsData.data.title_en || 'Selected Work',
      });
    } else {
      setSectionTitle({ es: 'Trabajo Seleccionado', en: 'Selected Work' });
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (initialMount.current) {
      initialMount.current = false;
      return;
    }
    if (saveTrigger > 0) handleSaveTitle();
  }, [saveTrigger]);

  const handleSaveTitle = async () => {
    const { error } = await supabase.from('site_settings').upsert(
      { id: 'projects', data: { title_es: sectionTitle.es, title_en: sectionTitle.en } },
      { onConflict: 'id' }
    );
    if (error) console.error('Error saving projects title:', error);
    onSaveComplete(!error);
  };

  const handleReorder = async (newOrder: Project[]) => {
    setProjects(newOrder);
    await Promise.all(
      newOrder.map((p, index) =>
        supabase.from('projects').update({ order_index: index }).eq('id', p.id)
      )
    );
  };

  const handleToggleArchive = async (id: string, archived: boolean) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, is_archived: archived } : p));
    await supabase.from('projects').update({ is_archived: archived }).eq('id', id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este proyecto? Esta acción no se puede deshacer.')) return;

    // Fetch full project data to get all image URLs before deleting
    const { data: full } = await supabase
      .from('projects')
      .select('image_url, gallery')
      .eq('id', id)
      .single();

    if (!confirm('¿Eliminar este proyecto? Esta acción no se puede deshacer.')) return;

    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) { console.error('Error deleting project:', error); return; }

    setProjects(prev => prev.filter(p => p.id !== id));

    // Delete associated Cloudinary assets after DB row is removed
    if (full) {
      const urls = [full.image_url, ...(full.gallery || [])].filter(Boolean);
      deleteCloudinaryAssets(urls);
    }
  };

  const activeCount = projects.filter(p => !p.is_archived).length;
  const totalCount = projects.length;

  return (
    <div className="space-y-12">

      {/* 1. TÍTULO DE LA SECCIÓN */}
      <section className="bg-white/3 border border-white/8 rounded-[2.5rem] p-10 space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-almost-black/20 flex items-center justify-center text-brand-almost-black">
            <Briefcase size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Título de la Sección</h2>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Aparece en la home encima de los proyectos</p>
          </div>
        </div>
        <TranslationField
          label="Título"
          maxLength={30}
          required={true}
          value={sectionTitle}
          onChange={setSectionTitle}
        />
      </section>

      {/* 2. LISTADO DE PROYECTOS */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white mb-2">Proyectos</h2>
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10`}>
                <div className={`w-1.5 h-1.5 rounded-full ${activeCount >= 6 ? 'bg-orange-500' : 'bg-brand-almost-black'}`} />
                <span className="text-[10px] uppercase tracking-widest font-bold text-white/40">
                  {activeCount}/6 Activos en Web
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <span className="text-[10px] uppercase tracking-widest font-bold text-white/40">
                  {totalCount} Total
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              if (totalCount >= 10) { alert('Has alcanzado el límite máximo de 10 proyectos.'); return; }
              router.push('/admin/projects/new');
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[9px] uppercase tracking-widest font-black transition-all ${
              totalCount >= 10 ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-brand-almost-black text-white hover:opacity-80'
            }`}
          >
            <Plus size={15} /> Nuevo Proyecto
          </button>
        </div>

        {activeCount > 6 && (
          <div className="flex items-center gap-3 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] uppercase tracking-widest font-bold p-4 rounded-xl">
            <Info size={14} /> Tienes más de 6 proyectos activos. Archiva algunos para cumplir el límite de la web.
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-24 rounded-2xl bg-white/5 animate-pulse" />)}
          </div>
        ) : projects.length === 0 ? (
          <div className="py-24 text-center border border-dashed border-white/10 rounded-2xl text-white/20 uppercase tracking-widest font-bold text-[10px]">
            No hay proyectos. Crea el primero.
          </div>
        ) : (
          <Reorder.Group axis="y" values={projects} onReorder={handleReorder} className="space-y-3">
            {projects.map((project) => (
              <Reorder.Item
                key={project.id}
                value={project}
                className={`group relative flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                  project.is_archived
                    ? 'bg-black/40 border-white/5 opacity-60'
                    : 'bg-white/5 border-white/10 hover:border-brand-almost-black/30'
                }`}
              >
                <div className="cursor-grab active:cursor-grabbing text-white/10 group-hover:text-white/30 transition-colors shrink-0">
                  <GripVertical size={20} />
                </div>

                <div className="w-16 h-12 rounded-lg overflow-hidden bg-white/5 shrink-0">
                  {project.image_url
                    ? <img src={project.image_url} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center"><ImageIcon size={16} className="text-white/10" /></div>
                  }
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white truncate">{project.title_es}</h4>
                    {project.is_archived && (
                      <span className="px-2 py-0.5 rounded-md bg-white/10 text-[8px] uppercase tracking-widest font-black text-white/40">Archivado</span>
                    )}
                  </div>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest">{project.category_es}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleToggleArchive(project.id, !project.is_archived); }}
                    onPointerDown={(e) => e.stopPropagation()}
                    title={project.is_archived ? 'Activar en web' : 'Archivar'}
                    className={`p-2.5 rounded-xl transition-all ${
                      project.is_archived
                        ? 'bg-orange-500/10 text-orange-400 hover:bg-orange-500 hover:text-white'
                        : 'bg-white/5 text-white/40 hover:bg-brand-almost-black/20 hover:text-brand-almost-black'
                    }`}
                  >
                    {project.is_archived ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); router.push(`/admin/projects/${project.id}/edit`); }}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="p-2.5 rounded-xl bg-white/5 text-white/40 hover:text-white hover:bg-brand-almost-black transition-all"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(project.id); }}
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
    </div>
  );
};
