'use client';

import { useEffect, useRef, useCallback } from 'react';
import { Upload, Video, Image as ImageIcon, X } from 'lucide-react';

declare global {
  interface Window { cloudinary: any; }
}

export const optimizeCloudinaryUrl = (url: string, type: 'image' | 'video'): string => {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  if (type === 'image') {
    if (url.toLowerCase().endsWith('.svg')) return url;
    return url.replace('/upload/', '/upload/f_webp,q_auto:good,w_1920,c_limit/');
  }
  if (type === 'video') {
    return url.replace('/upload/', '/upload/q_auto:good,vc_auto/');
  }
  return url;
};

interface CloudinaryUploaderProps {
  onUpload: (url: string, resourceType: 'image' | 'video') => void;
  accept?: 'image' | 'video' | 'auto';
  label?: string;
  currentUrl?: string;
  className?: string;
  previewClassName?: string;
  imageClassName?: string;
}

export const CloudinaryUploader = ({
  onUpload,
  accept = 'auto',
  label = 'Subir archivo',
  currentUrl,
  className = '',
  previewClassName = 'aspect-video',
  imageClassName = 'object-cover',
  children,
}: CloudinaryUploaderProps & { children?: React.ReactNode }) => {
  const widgetRef = useRef<any>(null);
  const onUploadRef = useRef(onUpload);
  useEffect(() => { onUploadRef.current = onUpload; }, [onUpload]);

  useEffect(() => {
    if (!document.getElementById('cloudinary-widget-script')) {
      const script = document.createElement('script');
      script.id = 'cloudinary-widget-script';
      script.src = 'https://widget.cloudinary.com/v2.0/global/all.js';
      script.async = true;
      document.head.appendChild(script);
    }
    return () => {
      if (widgetRef.current) {
        widgetRef.current.destroy();
        widgetRef.current = null;
      }
    };
  }, []);

  const openWidget = useCallback(() => {
    if (widgetRef.current) {
      widgetRef.current.destroy();
      widgetRef.current = null;
    }

    if (!window.cloudinary) {
      alert('Cloudinary no cargado');
      return;
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      console.error('Missing Cloudinary env vars');
      alert('Error de configuración: Faltan claves de Cloudinary en el .env.local');
      return;
    }

    const isImage = accept === 'image';
    const isVideo = accept === 'video';

    widgetRef.current = window.cloudinary.createUploadWidget(
      {
        cloudName: cloudName,
        uploadPreset: uploadPreset,
        // Usamos 'auto' para evitar errores de tipo, pero filtramos por formato abajo
        resourceType: 'auto',
        sources: ['local', 'url'],
        multiple: false,
        maxFileSize: 209715200, // 200MB
        clientAllowedFormats: isImage
          ? ['jpg', 'jpeg', 'png', 'webp', 'svg']
          : isVideo
            ? ['mp4', 'mov', 'webm']
            : undefined,
        styles: {
          palette: {
            window: '#0a0a0a',
            windowBorder: '#1a1a1a',
            tabIcon: '#4d7c0f',
            menuIcons: '#999999',
            textDark: '#FFFFFF',
            textLight: '#FFFFFF',
            link: '#4d7c0f',
            action: '#4d7c0f',
            inactiveTabIcon: '#555555',
            error: '#ef4444',
            inProgress: '#4d7c0f',
            complete: '#4d7c0f',
            sourceBg: '#111111',
          },
        },
      },
      (error: any, result: any) => {
        if (error) {
          console.error('DETALLE ERROR CLOUDINARY:', error);
        }
        if (result && result.event === 'success') {
          const { secure_url, resource_type } = result.info;
          const optimizedUrl = optimizeCloudinaryUrl(secure_url, resource_type as 'image' | 'video');
          onUploadRef.current(optimizedUrl, resource_type as 'image' | 'video');
        }
      }
    );

    widgetRef.current.open();
  }, [accept]);

  const isVideoPreview = currentUrl && (currentUrl.includes('/video/') || currentUrl.match(/\.(mp4|mov|webm)$/i));

  if (children) {
    return <div className={className} onClick={openWidget}>{children}</div>;
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {currentUrl && (
        <div className={`relative w-full ${previewClassName} rounded-2xl overflow-hidden bg-white/5 border border-white/10 group/preview`}>
          {isVideoPreview ? (
            <video src={currentUrl} controls className={`w-full h-full ${imageClassName}`} />
          ) : (
            <img src={currentUrl} alt="Preview" className={`w-full h-full ${imageClassName}`} />
          )}
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
            {isVideoPreview ? <Video size={12} className="text-blue-400" /> : <ImageIcon size={12} className="text-brand-green" />}
            <span className="text-[9px] font-bold text-white/70 uppercase tracking-widest">Listo</span>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={openWidget}
        className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl border-2 border-dashed border-white/10 hover:border-brand-green/50 hover:bg-brand-green/5 transition-all group"
      >
        <Upload size={18} className="text-white/20 group-hover:text-brand-green transition-colors" />
        <div className="text-left">
          <p className="text-[10px] uppercase tracking-widest font-black text-white/30 group-hover:text-brand-green transition-colors">
            {currentUrl ? 'Cambiar archivo' : label}
          </p>
          <p className="text-[8px] text-white/10 mt-0.5 uppercase tracking-widest font-bold">
            {accept === 'image' ? 'Imágenes (JPG, PNG, WebP, SVG)' : accept === 'video' ? 'Vídeos (MP4, MOV)' : 'Auto'}
          </p>
        </div>
      </button>
    </div>
  );
};
