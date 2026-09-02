'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Search, Image as ImageIcon, Video, 
  Trash2, Check, AlertCircle, Loader2, RefreshCw
} from 'lucide-react';
import { deleteCloudinaryAsset } from '@/lib/cloudinary';

interface CloudinaryResource {
  public_id: string;
  secure_url: string;
  resource_type: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  created_at: string;
}

export const MediaLibrary = ({ 
  onSelect,
  type = 'auto',
  isFullPage = false
}: { 
  onSelect?: (url: string, resourceType: 'image' | 'video') => void;
  type?: 'image' | 'video' | 'auto';
  isFullPage?: boolean;
}) => {
  const [resources, setResources] = useState<CloudinaryResource[]>([]);
  const [inUse, setInUse] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, []);

  useEffect(() => {
    fetchData();
    const timer = setTimeout(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [mediaRes, usageRes] = await Promise.all([
        fetch('/api/media/list'),
        fetch('/api/media/usage')
      ]);
      const mediaData = await mediaRes.json();
      const usageData = await usageRes.json();
      
      setResources(mediaData.resources || []);
      setInUse(usageData.inUse || []);
    } catch (e) {
      console.error('Error loading media library:', e);
    }
    setLoading(false);
  };

  const handleDelete = async (resource: CloudinaryResource) => {
    if (inUse.includes(resource.public_id)) {
      alert('Esta imagen está en uso en alguna sección de la web. Para borrarla, cámbiala primero en esa sección.');
      return;
    }

    if (!confirm('¿Seguro que quieres borrar este archivo permanentemente?')) return;

    setDeletingId(resource.public_id);
    try {
      const success = await deleteCloudinaryAsset(resource.secure_url);
      if (success) {
        setResources(prev => prev.filter(r => r.public_id !== resource.public_id));
      } else {
        alert('Error al borrar de Cloudinary');
      }
    } catch (e) {
      console.error(e);
      alert('Error al procesar el borrado');
    }
    setDeletingId(null);
  };

  const filteredResources = resources.filter(r => {
    const matchesType = type === 'auto' || r.resource_type === type;
    const matchesSearch = r.public_id.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const containerCls = isFullPage 
    ? "w-full bg-white/3 border border-white/8 rounded-[2.5rem] overflow-hidden flex flex-col min-h-[600px]"
    : "relative w-full max-w-6xl h-full max-h-[850px] bg-[#111] border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl";

  return (
    <div className={containerCls}>
      {/* Header */}
      <div className={`p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 ${!isFullPage ? 'pr-24' : ''}`}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-almost-black/20 flex items-center justify-center text-brand-almost-black">
            <ImageIcon size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Biblioteca de Medios</h2>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Gestiona y reutiliza tus archivos de Cloudinary</p>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-1 max-w-md">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-white/40 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nombre..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-3.5 text-sm text-white focus:border-brand-almost-black outline-none transition-all"
            />
          </div>
          <button 
            onClick={fetchData}
            className="p-3.5 rounded-2xl bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all"
            title="Refrescar"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div 
        ref={scrollRef}
        className={`flex-1 overflow-y-auto p-8 custom-scrollbar ${isFullPage ? '' : 'max-h-[850px]'}`}
      >
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center space-y-4 py-20">
            <Loader2 className="w-12 h-12 text-brand-almost-black animate-spin" />
            <p className="text-white/20 font-black uppercase tracking-[0.3em] text-[10px]">Cargando Galería...</p>
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center space-y-4 border-2 border-dashed border-white/5 rounded-[2rem] py-20">
            <ImageIcon size={48} className="text-white/5" />
            <p className="text-white/20 font-bold uppercase tracking-widest text-[10px]">No se encontraron archivos</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredResources.map((resource) => {
              const isUsed = inUse.includes(resource.public_id);
              const isVideo = resource.resource_type === 'video';
              
              return (
                <div 
                  key={resource.public_id}
                  className="group relative aspect-square bg-black/40 border border-white/10 rounded-3xl overflow-hidden cursor-pointer hover:border-brand-almost-black/50 transition-all"
                >
                  <div className="absolute inset-0">
                    {isVideo ? (
                      <div className="w-full h-full flex items-center justify-center bg-blue-500/5">
                         <Video size={32} className="text-blue-500/20" />
                      </div>
                    ) : (
                      <img 
                        src={resource.secure_url?.includes('/upload/') 
                          ? resource.secure_url.replace('/upload/', '/upload/w_400,c_fill,q_auto,f_webp/') 
                          : resource.secure_url || ''
                        } 
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" 
                        alt="" 
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            const fallback = document.createElement('div');
                            fallback.className = 'w-full h-full flex items-center justify-center bg-white/5';
                            fallback.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" class="text-white/10"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>';
                            parent.appendChild(fallback);
                          }
                        }}
                      />
                    )}
                  </div>

                  <div className="absolute top-3 left-3 flex flex-col gap-2 pointer-events-none">
                    {isUsed && (
                      <div className="px-2 py-1 rounded-md bg-brand-almost-black text-white text-[8px] font-black uppercase tracking-widest shadow-lg">
                        EN USO
                      </div>
                    )}
                    {isVideo && (
                      <div className="px-2 py-1 rounded-md bg-blue-500 text-white text-[8px] font-black uppercase tracking-widest shadow-lg">
                        VÍDEO
                      </div>
                    )}
                  </div>

                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3 backdrop-blur-[2px]">
                     {onSelect && (
                       <button 
                         onClick={() => onSelect(resource.secure_url, resource.resource_type as 'image' | 'video')}
                         className="p-3 rounded-xl bg-brand-almost-black text-white hover:scale-110 transition-transform shadow-xl"
                       >
                         <Check size={18} />
                       </button>
                     )}
                     <button 
                       onClick={(e) => {
                         e.stopPropagation();
                         handleDelete(resource);
                       }}
                       className={`p-3 rounded-xl transition-all shadow-xl ${
                         isUsed 
                          ? 'bg-white/10 text-white/20 cursor-not-allowed' 
                          : 'bg-red-500 text-white hover:scale-110'
                       }`}
                       disabled={deletingId === resource.public_id}
                     >
                       {deletingId === resource.public_id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                     </button>
                  </div>

                  <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black to-transparent">
                     <p className="text-[8px] text-white/40 truncate font-bold uppercase tracking-widest">
                       {resource.public_id.split('/').pop()}
                     </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="p-6 bg-white/2 border-t border-white/5 flex items-center justify-between text-[9px] uppercase tracking-widest font-black text-white/20">
         <div>{filteredResources.length} ARCHIVOS MOSTRADOS</div>
         <div className="flex items-center gap-2">
            <AlertCircle size={12} />
            LAS IMÁGENES "EN USO" NO SE PUEDEN BORRAR POR SEGURIDAD
         </div>
      </div>
    </div>
  );
};

export const MediaLibraryModal = ({ 
  isOpen, 
  onClose, 
  onSelect,
  type = 'auto'
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSelect: (url: string, resourceType: 'image' | 'video') => void;
  type?: 'image' | 'video' | 'auto';
}) => {
  useEffect(() => {
    const mainElement = document.querySelector('main');
    if (isOpen) {
      if (mainElement) {
        mainElement.style.overflow = 'hidden';
        mainElement.scrollTop = 0;
      }
      window.scrollTo({ top: 0, behavior: 'instant' });
      document.body.style.overflow = 'hidden';
    } else {
      if (mainElement) mainElement.style.overflow = 'auto';
      document.body.style.overflow = 'unset';
    }
    return () => {
      if (mainElement) mainElement.style.overflow = 'auto';
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-6xl h-full flex flex-col"
      >
        <div className="absolute top-8 right-8 z-50">
           <button onClick={onClose} className="p-3.5 rounded-2xl bg-white/5 text-white/40 hover:text-white hover:bg-red-500/20 transition-all">
              <X size={20} />
           </button>
        </div>
        <MediaLibrary onSelect={onSelect} type={type} />
      </motion.div>
    </div>
  );
};

export const PhotosSection = () => {
  return <MediaLibrary isFullPage={true} />;
};

