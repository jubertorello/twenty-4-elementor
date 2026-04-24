'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, Reorder } from 'motion/react';
import { 
  Plus, Trash2, Edit3, Briefcase, Image as ImageIcon, 
  AlertCircle, GripVertical, EyeOff, Eye, Info
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Project {
  id: string;
  slug: string;
  title_es: string;
  category_es: string;
  image_url: string;
  is_archived: boolean;
  order_index: number;
}

export const ProjectsAdminSection = () => {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('id, slug, title_es, category_es, image_url, is_archived, order_index')
      .order('order_index', { ascending: true });
    
    if (data) setProjects(data);
    if (error) setError(error.message);
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  // Guardar el nuevo orden en la DB
  const handleReorder = async (newOrder: Project[]) => {
    setProjects(newOrder);
    
    // Actualizamos los índices en segundo plano
    const updates = newOrder.map((p, index) => ({
      id: p.id,
      order_index: index
    }));

    // Hacemos un upsert masivo para actualizar solo los order_index
    const { error } = await supabase.from('projects').upsert(
      newOrder.map((p, index) => ({ ...p, order_index: index }))
    );
    
    if (error) console.error('Error guardando orden:', error);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este proyecto?')) return;
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (!error) setProjects(prev => prev.filter(p => p.id !== id));
  };

  const activeCount = projects.filter(p => !p.is_archived).length;
  const totalCount = projects.length;

  return (
    <div className="space-y-8">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Proyectos</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
              <div className={`w-1.5 h-1.5 rounded-full ${activeCount >= 6 ? 'bg-orange-500' : 'bg-brand-green'}`} />
              <span className="text-[10px] uppercase tracking-widest font-bold text-white/40">
                {activeCount}/6 Activos en Web
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
              <span className="text-[10px] uppercase tracking-widest font-bold text-white/40">
                {totalCount}/10 Total Proyectos
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            if (totalCount >= 10) {
              alert('Has alcanzado el límite máximo de 10 proyectos.');
              return;
            }
            router.push('/admin/projects/new');
          }}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[9px] uppercase tracking-widest font-black transition-all ${
            totalCount >= 10 ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-brand-green text-white hover:opacity-80'
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

      {/* Projects List with Drag & Drop */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-24 rounded-2xl bg-white/5 animate-pulse" />)}
        </div>
      ) : projects.length === 0 ? (
        <div className="py-24 text-center border border-dashed border-white/10 rounded-2xl text-white/20">
          No hay proyectos.
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
                  : 'bg-white/5 border-white/10 hover:border-brand-green/30'
              }`}
            >
              {/* Drag Handle */}
              <div className="cursor-grab active:cursor-grabbing text-white/10 group-hover:text-white/30 transition-colors">
                <GripVertical size={20} />
              </div>

              {/* Thumbnail */}
              <div className="w-16 h-12 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                {project.image_url ? (
                  <img src={project.image_url} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><ImageIcon size={16} className="text-white/10" /></div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white truncate">{project.title_es}</h4>
                  {project.is_archived && (
                    <span className="px-2 py-0.5 rounded-md bg-white/10 text-[8px] uppercase tracking-widest font-black text-white/40">Archivado</span>
                  )}
                </div>
                <p className="text-[10px] text-white/30 uppercase tracking-widest">{project.category_es}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => router.push(`/admin/projects/${project.id}/edit`)}
                  className="p-2.5 rounded-xl bg-white/5 text-white/40 hover:text-white hover:bg-brand-green transition-all"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="p-2.5 rounded-xl bg-white/5 text-white/40 hover:text-white hover:bg-red-500 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}
    </div>
  );
};
