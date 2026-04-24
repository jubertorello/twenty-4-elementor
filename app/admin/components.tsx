'use client';

import React from 'react';
import { Image as ImageIcon, Video, Plus, Trash2, Languages, Eye, Briefcase } from 'lucide-react';

// --- Types ---
export type Language = 'EN' | 'ES';
export interface TranslatedText { en: string; es: string; }

// --- Shared Components ---

export const TranslationField = ({ label, value, onChange, type = 'text' }: {
  label: string; value: TranslatedText; onChange: (v: TranslatedText) => void; type?: 'text' | 'textarea';
}) => (
  <div className="space-y-4 p-5 bg-white/5 rounded-2xl border border-white/10">
    <div className="flex items-center justify-between">
      <label className="text-[10px] uppercase tracking-widest font-bold text-white/40">{label}</label>
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-brand-green">
        <Languages size={11} /> Multi-language
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {(['en', 'es'] as const).map((lang) => (
        <div key={lang} className="space-y-2">
          <div className="text-[8px] text-white/30 font-bold uppercase tracking-widest">{lang === 'en' ? 'English' : 'Español'}</div>
          {type === 'text' ? (
            <input type="text" value={value[lang]} onChange={(e) => onChange({ ...value, [lang]: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-brand-green outline-none transition-colors placeholder:text-white/20" />
          ) : (
            <textarea value={value[lang]} onChange={(e) => onChange({ ...value, [lang]: e.target.value })} rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-brand-green outline-none transition-colors resize-none placeholder:text-white/20" />
          )}
        </div>
      ))}
    </div>
  </div>
);

export const ImageUploadPlaceholder = ({ label, currentUrl, helpText }: { label: string; currentUrl?: string; helpText?: string }) => (
  <div className="space-y-2">
    <label className="text-[10px] uppercase tracking-widest font-bold text-white/40">{label}</label>
    <div className="relative aspect-video bg-white/5 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-4 hover:border-brand-green/40 transition-colors group cursor-pointer overflow-hidden">
      {currentUrl ? (
        <>
          <img src={currentUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-30 transition-opacity" />
          <div className="relative z-10 flex flex-col items-center gap-2 bg-black/60 backdrop-blur-sm p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <ImageIcon size={18} className="text-white" />
            <span className="text-[8px] uppercase tracking-widest font-bold text-white">Cambiar</span>
          </div>
        </>
      ) : (
        <>
          <Plus size={22} className="text-white/20 group-hover:text-brand-green transition-colors" />
          <span className="text-[10px] uppercase tracking-widest font-bold text-white/20 group-hover:text-white/40 transition-all">Subir imagen</span>
        </>
      )}
    </div>
    {helpText && <p className="text-[8px] uppercase tracking-widest font-bold text-white/20">{helpText}</p>}
  </div>
);

export const VideoUploadPlaceholder = ({ label, currentUrl }: { label: string; currentUrl?: string }) => (
  <div className="space-y-2">
    <label className="text-[10px] uppercase tracking-widest font-bold text-white/40">{label}</label>
    <div className="aspect-video bg-white/5 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-4 hover:border-brand-green/40 transition-colors group cursor-pointer">
      <Video size={22} className="text-white/20 group-hover:text-brand-green transition-colors" />
      <span className="text-[10px] uppercase tracking-widest font-bold text-white/20 group-hover:text-white/40">
        {currentUrl ? 'Cambiar video' : 'Subir video MP4'}
      </span>
    </div>
  </div>
);

// --- Section Views ---

export const HeroSection = () => (
  <div className="space-y-10">
    <h2 className="text-2xl font-bold text-white">Hero Banner</h2>
    <TranslationField label="Título Principal" value={{ en: 'sports content & brands partnerships', es: 'contenido deportivo y colaboraciones de marcas' }} onChange={() => {}} />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <VideoUploadPlaceholder label="Video de fondo (MP4)" currentUrl="https://res.cloudinary.com/djqc/video.mp4" />
      <div className="p-6 bg-white/5 rounded-2xl border border-white/10 flex flex-col justify-center space-y-4">
        <h4 className="text-[10px] uppercase tracking-widest font-bold text-white/40">Configuración del video</h4>
        {[['Opacidad', '60%'], ['Velocidad', '0.8x'], ['Desenfoque', '4px']].map(([k, v]) => (
          <div key={k} className="flex justify-between items-center py-2.5 border-b border-white/5 text-[10px] uppercase tracking-widest font-bold">
            <span className="text-white/60">{k}</span>
            <span className="text-brand-green">{v}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const PresentationSection = () => (
  <div className="space-y-10">
    <h2 className="text-2xl font-bold text-white">Presentación</h2>
    <TranslationField label="Frase intro" value={{ en: 'Where Athletes Become Icons', es: 'Donde los atletas se convierten en iconos' }} type="textarea" onChange={() => {}} />
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-[10px] uppercase tracking-widest font-bold text-white/40">Fotos de galería</label>
        <button className="text-[10px] uppercase tracking-widest font-bold text-brand-green hover:opacity-70 transition-opacity">+ Añadir foto</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[1,2,3,4,5].map(i => (
          <div key={i} className="aspect-[4/5] bg-white/5 rounded-xl overflow-hidden group relative border border-white/10">
            <div className="w-full h-full flex items-center justify-center"><ImageIcon size={18} className="text-white/10" /></div>
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <button className="p-2 bg-red-500 rounded-lg text-white"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const TalentsSection = () => (
  <div className="space-y-10 text-white">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold">Talentos & Marcas</h2>
    </div>
    <TranslationField label="Título de sección" value={{ en: 'Talent & Brands', es: 'Talento y Marcas' }} onChange={() => {}} />
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">Talentos</h3>
        <button className="text-[10px] uppercase tracking-widest font-bold text-brand-green hover:opacity-70 transition-opacity">+ Añadir</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1,2].map(i => (
          <div key={i} className="bg-white/5 p-5 rounded-2xl border border-white/10 flex gap-4">
            <div className="w-16 h-16 bg-white/5 rounded-lg shrink-0 border border-white/10 flex items-center justify-center text-white/10"><ImageIcon size={18}/></div>
            <div className="flex-grow space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <input type="text" className="bg-white/5 border border-white/10 text-[10px] uppercase px-3 py-2 rounded text-white outline-none focus:border-brand-green" placeholder="Nombre" />
                <input type="text" className="bg-white/5 border border-white/10 text-[10px] uppercase px-3 py-2 rounded text-white outline-none focus:border-brand-green" placeholder="Deporte" />
              </div>
              <input type="text" className="w-full bg-white/5 border border-white/10 text-[10px] px-3 py-2 rounded text-white outline-none focus:border-brand-green" placeholder="Instagram URL" />
            </div>
            <button className="text-red-400 hover:text-red-300 p-1"><Trash2 size={14}/></button>
          </div>
        ))}
      </div>
    </div>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">Marcas</h3>
        <button className="text-[10px] uppercase tracking-widest font-bold text-brand-green hover:opacity-70 transition-opacity">+ Añadir</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[1,2,3].map(i => (
          <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center justify-between group">
            <div className="w-8 h-8 bg-white/5 border border-white/10 rounded flex items-center justify-center"><ImageIcon size={12} className="text-white/10"/></div>
            <input type="text" className="flex-grow bg-transparent text-white text-[10px] px-3 outline-none" placeholder="Nombre de marca" />
            <button className="text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12}/></button>
          </div>
        ))}
      </div>
    </div>
    <div className="space-y-6">
      <h3 className="text-lg font-bold">Servicios (Max 3)</h3>
      <div className="space-y-4">
        {[1,2,3].map(i => (
          <TranslationField key={i} label={`Servicio ${i}`} value={{ en: 'Sports Marketing', es: 'Marketing Deportivo' }} onChange={() => {}} />
        ))}
      </div>
    </div>
  </div>
);

export const AboutSection = () => (
  <div className="space-y-10 text-white">
    <h2 className="text-2xl font-bold">About Us</h2>
    <TranslationField label="Título" value={{ en: 'About our Studio', es: 'Sobre nuestro estudio' }} onChange={() => {}} />
    <TranslationField label="Frase principal" value={{ en: 'We believe in the power of icons.', es: 'Creemos en el poder de los iconos.' }} type="textarea" onChange={() => {}} />
    <div className="max-w-sm"><ImageUploadPlaceholder label="Logo / Icono" currentUrl="https://res.cloudinary.com/djqtkbyez/image/upload/v1774858243/Twenty4_Long_Green-cropped_enulok.svg" /></div>
    <div className="space-y-6">
      <h3 className="text-lg font-bold">Servicios Carousel (Max 4)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1,2,3,4].map(i => (
          <div key={i} className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-5">
            <ImageUploadPlaceholder label={`Foto servicio ${i}`} />
            <TranslationField label="Título" value={{ en: 'Art Direction', es: 'Dirección de Arte' }} onChange={() => {}} />
            <TranslationField label="Descripción" value={{ en: 'Crafting unique aesthetics...', es: 'Creando estéticas únicas...' }} type="textarea" onChange={() => {}} />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const ContactSection = () => (
  <div className="space-y-10 text-white">
    <h2 className="text-2xl font-bold">Información de Contacto</h2>
    <TranslationField label="Título de sección" value={{ en: 'Work with us', es: 'Trabaja con nosotros' }} onChange={() => {}} />
    <TranslationField label="Frase CTA" value={{ en: 'Ready to build your next icon?', es: '¿Listo para construir tu próximo icono?' }} type="textarea" onChange={() => {}} />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/10">
        <h4 className="text-[10px] uppercase tracking-widest font-bold text-white/40">Contacto directo</h4>
        {[['Email', 'email', 'hello@twenty4studios.com'], ['Teléfono', 'tel', '+34 600 000 000']].map(([label, type, val]) => (
          <div key={label} className="space-y-1">
            <label className="text-[8px] uppercase tracking-widest font-bold text-white/30">{label}</label>
            <input type={type} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-brand-green" defaultValue={val} />
          </div>
        ))}
      </div>
      <div className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/10">
        <h4 className="text-[10px] uppercase tracking-widest font-bold text-white/40">Redes sociales</h4>
        {['Instagram URL', 'LinkedIn URL', 'Twitter URL'].map(p => (
          <input key={p} type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-brand-green placeholder:text-white/20" placeholder={p} />
        ))}
      </div>
    </div>
  </div>
);

export const GeneralSection = () => (
  <div className="space-y-10 text-white">
    <div>
      <h2 className="text-2xl font-bold mb-6">Logos de marca</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ImageUploadPlaceholder label="Logo Header" currentUrl="https://res.cloudinary.com/djqtkbyez/image/upload/v1774858243/Twenty4_Long_Green-cropped_enulok.svg" />
        <ImageUploadPlaceholder label="Logo Loading" currentUrl="https://res.cloudinary.com/djqtkbyez/image/upload/v1773950275/Untitled_design_62_v4e71o.png" />
        <ImageUploadPlaceholder label="Logo Footer" currentUrl="https://res.cloudinary.com/djqtkbyez/image/upload/v1774858243/Twenty4_Long_Green-cropped_enulok.svg" />
      </div>
    </div>
    <div>
      <h2 className="text-2xl font-bold mb-6">Footer</h2>
      <TranslationField label="Frase footer" value={{ en: 'The belief is mutual, that is why it works.', es: 'La creencia es mutua por eso es que funciona.' }} onChange={() => {}} />
    </div>
    <div>
      <h2 className="text-2xl font-bold mb-6">SEO</h2>
      <div className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/10">
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest font-bold text-white/40">Meta Title</label>
          <input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-brand-green placeholder:text-white/20" placeholder="Twenty4 Studios | Production Agency" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest font-bold text-white/40">Meta Description</label>
          <textarea rows={3} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white outline-none resize-none focus:border-brand-green placeholder:text-white/20" placeholder="Descripción para motores de búsqueda..." />
        </div>
        <ImageUploadPlaceholder label="OG Image (Social Sharing)" helpText="1200 x 630px recomendado" />
      </div>
    </div>
  </div>
);

export const ProjectsSection = () => {
  const [projects] = React.useState([
    { id: 1, title: 'BARO', category: 'Netflix Documentation', type: 'Film' },
    { id: 2, title: 'YouTube Festival', category: 'Event Production', type: 'Event' },
  ]);

  return (
    <div className="space-y-10 text-white">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gestionar Proyectos</h2>
        <button className="flex items-center gap-2 bg-brand-green px-5 py-2.5 rounded-full text-[10px] uppercase tracking-widest font-bold text-white hover:opacity-80 transition-opacity">
          <Plus size={14}/> Nuevo Proyecto
        </button>
      </div>
      <TranslationField label="Título de sección" value={{ en: 'Selected Work', es: 'Trabajos Seleccionados' }} onChange={() => {}} />
      <div className="space-y-3">
        {projects.map(p => (
          <div key={p.id} className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center justify-between group hover:border-brand-green/30 transition-colors">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center"><ImageIcon size={18} className="text-white/10"/></div>
              <div>
                <h4 className="font-bold text-lg">{p.title}</h4>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-white/40">{p.category}</span>
                  <span className="w-1 h-1 bg-white/20 rounded-full"/>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-brand-green">{p.type}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2.5 bg-white/5 text-white/40 hover:text-white rounded-xl border border-white/10 transition-all"><Eye size={16}/></button>
              <button className="p-2.5 bg-white/5 text-white hover:bg-brand-green rounded-xl border border-white/10 transition-all"><Briefcase size={16}/></button>
              <button className="p-2.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all"><Trash2 size={16}/></button>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white/5 p-8 rounded-2xl border border-white/10 space-y-8">
        <h3 className="text-xl font-bold">Editando Proyecto: BARO</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ImageUploadPlaceholder label="Foto principal" />
          <VideoUploadPlaceholder label="Video principal" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[['Cliente', 'Netflix'], ['Año', '2024']].map(([label, val]) => (
            <div key={label} className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-white/40">{label}</label>
              <input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-brand-green" placeholder={val} />
            </div>
          ))}
        </div>
        <TranslationField label="Nombre del Proyecto" value={{ en: 'BARO', es: 'BARO' }} onChange={() => {}} />
        <TranslationField label="Mini descripción" value={{ en: 'The story of a man who changed German rap.', es: 'La historia del hombre que cambió el rap alemán.' }} type="textarea" onChange={() => {}} />
        <TranslationField label="Descripción larga" value={{ en: 'A deep dive into the life and legacy of an icon...', es: 'Una inmersión profunda en la vida y el legado de un icono...' }} type="textarea" onChange={() => {}} />
      </div>
    </div>
  );
};
