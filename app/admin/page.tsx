'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  Video, 
  Briefcase, 
  Users, 
  Info, 
  Mail, 
  Globe, 
  Search,
  Save,
  Plus,
  Trash2,
  ChevronRight,
  Languages,
  Eye,
  Settings,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

// --- Types ---

type Language = 'EN' | 'ES';

interface TranslatedText {
  en: string;
  es: string;
}

// --- Components ---

const AdminSidebar = ({ activeSection, setActiveSection }: { activeSection: string; setActiveSection: (s: string) => void }) => {
  const menuItems = [
    { id: 'general', label: 'General & SEO', icon: Settings },
    { id: 'hero', label: 'Hero Banner', icon: ImageIcon },
    { id: 'presentation', label: 'Presentation', icon: Globe },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'talents', label: 'Talents & Brands', icon: Users },
    { id: 'about', label: 'About Us', icon: Info },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 h-screen sticky top-0 flex flex-col p-6">
      <Link href="/" className="flex items-center gap-3 mb-12 hover:opacity-70 transition-opacity">
        <ArrowLeft size={18} className="text-slate-400" />
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-900">Back to Web</span>
      </Link>

      <div className="space-y-1 flex-grow">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-xs uppercase tracking-widest font-bold transition-all ${
              activeSection === item.id 
                ? 'bg-brand-green text-white shadow-lg shadow-brand-green/20' 
                : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </div>

      <div className="pt-6 border-t border-slate-100">
        <div className="flex items-center gap-3 px-4 text-slate-300">
          <LayoutDashboard size={14} />
          <span className="text-[8px] uppercase tracking-[0.3em] font-bold">Admin Panel v1.0</span>
        </div>
      </div>
    </div>
  );
};

const TranslationField = ({ label, value, onChange, type = 'text' }: { 
  label: string; 
  value: TranslatedText; 
  onChange: (val: TranslatedText) => void;
  type?: 'text' | 'textarea';
}) => {
  return (
    <div className="space-y-4 p-6 bg-slate-50 rounded-2xl border border-slate-200">
      <div className="flex items-center justify-between mb-2">
        <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400">{label}</label>
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-brand-green">
          <Languages size={12} />
          Multi-language
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[8px] text-slate-400 font-bold uppercase tracking-widest">English Content</div>
          {type === 'text' ? (
            <input 
              type="text" 
              value={value.en} 
              onChange={(e) => onChange({ ...value, en: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-900 focus:border-brand-green outline-none transition-colors"
              placeholder="Enter English text..."
            />
          ) : (
            <textarea 
              value={value.en} 
              onChange={(e) => onChange({ ...value, en: e.target.value })}
              rows={3}
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-900 focus:border-brand-green outline-none transition-colors resize-none"
              placeholder="Enter English content..."
            />
          )}
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[8px] text-slate-400 font-bold uppercase tracking-widest">Contenido Español</div>
          {type === 'text' ? (
            <input 
              type="text" 
              value={value.es} 
              onChange={(e) => onChange({ ...value, es: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-900 focus:border-brand-green outline-none transition-colors"
              placeholder="Introducir texto en español..."
            />
          ) : (
            <textarea 
              value={value.es} 
              onChange={(e) => onChange({ ...value, es: e.target.value })}
              rows={3}
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-900 focus:border-brand-green outline-none transition-colors resize-none"
              placeholder="Introducir contenido en español..."
            />
          )}
        </div>
      </div>
    </div>
  );
};

const ImageUploadPlaceholder = ({ label, currentUrl, helpText }: { label: string, currentUrl?: string, helpText?: string }) => {
  return (
    <div className="space-y-2">
      <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400">{label}</label>
      <div className="relative aspect-video bg-slate-100 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-4 hover:border-brand-green/40 transition-colors group cursor-pointer overflow-hidden">
        {currentUrl ? (
          <>
            <img src={currentUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
            <div className="relative z-10 flex flex-col items-center gap-2 bg-white/80 backdrop-blur-sm p-3 rounded-full border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
              <ImageIcon size={18} className="text-slate-900" />
              <span className="text-[8px] uppercase tracking-widest font-bold text-slate-900">Change Image</span>
            </div>
          </>
        ) : (
          <>
            <Plus size={24} className="text-slate-300 group-hover:text-brand-green transition-colors" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-slate-300 group-hover:text-slate-400 transition-all">Upload Asset</span>
          </>
        )}
      </div>
      {helpText && <p className="text-[8px] uppercase tracking-widest font-bold text-slate-300">{helpText}</p>}
    </div>
  );
};

const VideoUploadPlaceholder = ({ label, currentUrl }: { label: string, currentUrl?: string }) => {
  return (
    <div className="space-y-2">
      <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400">{label}</label>
      <div className="aspect-video bg-slate-100 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-4 hover:border-brand-green/40 transition-colors group cursor-pointer">
        <Video size={24} className="text-slate-300 group-hover:text-brand-green transition-colors" />
        <span className="text-[10px] uppercase tracking-widest font-bold text-slate-300 group-hover:text-slate-400 transition-all">
          {currentUrl ? 'Change Video MP4 / Embed' : 'Upload Video File'}
        </span>
        {currentUrl && <p className="text-[8px] text-slate-400">{currentUrl}</p>}
      </div>
    </div>
  );
};

// --- Section Views ---

const HeroSection = () => (
  <div className="space-y-12">
    <h2 className="text-2xl font-serif font-bold text-slate-900 mb-8">Hero Header</h2>
    <TranslationField label="Main Title" value={{ en: 'sports content & brands partnerships', es: 'contenido deportivo y colaboraciones de marcas' }} onChange={() => {}} />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <VideoUploadPlaceholder label="Background Video (MP4)" currentUrl="https://res.cloudinary.com/djqc/video.mp4" />
      <div className="p-8 bg-slate-50 rounded-3xl border border-slate-200 flex flex-col justify-center">
        <h4 className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-4">Video Overlay Settings</h4>
        <div className="space-y-4 text-[10px] uppercase tracking-[0.2em] font-bold text-slate-900">
           <div className="flex justify-between items-center py-3 border-b border-slate-200">
             <span>Opacity</span>
             <span className="text-brand-green">60%</span>
           </div>
           <div className="flex justify-between items-center py-3 border-b border-slate-200">
             <span>Playback Speed</span>
             <span className="text-brand-green">0.8x</span>
           </div>
           <div className="flex justify-between items-center py-3 border-b border-slate-200">
             <span>Blur Effect</span>
             <span className="text-brand-green">4px</span>
           </div>
        </div>
      </div>
    </div>
  </div>
);

const PresentationSection = () => (
  <div className="space-y-12">
    <h2 className="text-2xl font-serif font-bold text-slate-900 mb-8">Presentation</h2>
    <TranslationField label="Intro Phrase" value={{ en: 'Where Athletes Become Icons', es: 'Donde los atletas se convierten en iconos' }} type="textarea" onChange={() => {}} />
    
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Atmosphere & Agency Photos</label>
        <button className="text-[10px] uppercase tracking-widest font-bold text-brand-green">+ Add Photo</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="aspect-[4/5] bg-slate-100 rounded-xl overflow-hidden group relative border border-slate-200">
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon size={20} className="text-slate-200" />
            </div>
            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <button className="p-2 bg-white rounded-lg text-red-500 shadow-xl"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const TalentsSection = () => (
  <div className="space-y-12 text-slate-900">
    <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-bold">Talents & Brands</h2>
    </div>
    <TranslationField label="Section title" value={{ en: 'Talent & Brands', es: 'Talento y Marcas' }} onChange={() => {}} />

    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-serif font-bold">Managing Talents</h3>
        <button className="text-[10px] uppercase tracking-widest font-bold text-brand-green">+ Add Talent</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map(i => (
          <div key={i} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex gap-4 text-slate-900">
            <div className="w-20 h-20 bg-white rounded-lg shrink-0 overflow-hidden border border-slate-200 flex items-center justify-center text-slate-200"><ImageIcon size={20} /></div>
            <div className="flex-grow space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input type="text" className="bg-white text-[10px] uppercase px-3 py-2 rounded focus:border-brand-green outline-none border border-slate-200" placeholder="Name" />
                <input type="text" className="bg-white text-[10px] uppercase px-3 py-2 rounded focus:border-brand-green outline-none border border-slate-200" placeholder="Sport" />
              </div>
              <input type="text" className="w-full bg-white text-[10px] px-3 py-2 rounded focus:border-brand-green outline-none border border-slate-200" placeholder="Instagram Link" />
            </div>
            <button className="text-red-400 hover:text-red-500 p-2"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
    </div>

    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-serif font-bold">Managing Brands</h3>
        <button className="text-[10px] uppercase tracking-widest font-bold text-brand-green">+ Add Brand</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between group">
            <div className="w-10 h-10 bg-white border border-slate-100 rounded flex items-center justify-center"><ImageIcon size={14} className="text-slate-200" /></div>
            <input type="text" className="flex-grow bg-transparent text-slate-900 text-[10px] px-3 outline-none" placeholder="Brand Name" />
            <button className="text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
          </div>
        ))}
      </div>
    </div>

    <div className="space-y-8">
      <h3 className="text-lg font-serif font-bold">Services (Max 3)</h3>
      <div className="grid grid-cols-1 gap-6">
        {[1, 2, 3].map(i => (
          <TranslationField key={i} label={`Service ${i}`} value={{ en: 'Sports Marketing', es: 'Marketing Deportivo' }} onChange={() => {}} />
        ))}
      </div>
    </div>
  </div>
);

const AboutSection = () => (
  <div className="space-y-12 text-slate-900">
    <h2 className="text-2xl font-serif font-bold mb-8">About Us Section</h2>
    <TranslationField label="Section title" value={{ en: 'About our Studio', es: 'Sobre nuestro estudio' }} onChange={() => {}} />
    <TranslationField label="Main Phrase" value={{ en: 'We believe in the power of icons.', es: 'Creemos en el poder de los iconos.' }} type="textarea" onChange={() => {}} />
    
    <div className="max-w-md">
      <ImageUploadPlaceholder label="Logo/Icon above photos" currentUrl="https://res.cloudinary.com/logo.svg" />
    </div>

    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-serif font-bold text-slate-900">Services Carousel (Max 4)</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200 space-y-6">
             <ImageUploadPlaceholder label={`Service Photo ${i}`} />
             <TranslationField label="Service Title" value={{ en: 'Art Direction', es: 'Dirección de Arte' }} onChange={() => {}} />
             <TranslationField label="Service Description" value={{ en: 'Crafting unique aesthetics...', es: 'Creando estéticas únicas...' }} type="textarea" onChange={() => {}} />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ContactSection = () => (
  <div className="space-y-12 text-slate-900">
    <h2 className="text-2xl font-serif font-bold mb-8">Contact Information</h2>
    <TranslationField label="Section title" value={{ en: 'Work with us', es: 'Trabaja con nosotros' }} onChange={() => {}} />
    <TranslationField label="Call to action phrase" value={{ en: 'Ready to build your next icon?', es: '¿Listo para construir tu próximo icono?' }} type="textarea" onChange={() => {}} />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6 bg-slate-50 p-8 rounded-3xl border border-slate-200">
        <h4 className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Direct Contact</h4>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[8px] uppercase tracking-widest font-bold text-slate-400 opacity-60">Email Address</label>
            <input type="email" className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-900 outline-none" defaultValue="hello@twenty4studios.com" />
          </div>
          <div className="space-y-1">
            <label className="text-[8px] uppercase tracking-widest font-bold text-slate-400 opacity-60">Phone Number</label>
            <input type="tel" className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-900 outline-none" defaultValue="+34 600 000 000" />
          </div>
        </div>
      </div>

      <div className="space-y-6 bg-slate-50 p-8 rounded-3xl border border-slate-200">
        <h4 className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Social Links</h4>
        <div className="space-y-4">
          <input type="text" className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-900 outline-none" placeholder="Instagram URL" />
          <input type="text" className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-900 outline-none" placeholder="LinkedIn URL" />
          <input type="text" className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-900 outline-none" placeholder="Twitter URL" />
        </div>
      </div>
    </div>
  </div>
);

const GeneralSection = () => (
  <div className="space-y-12 text-slate-900">
    <div>
      <h2 className="text-2xl font-serif font-bold mb-8">Brand Logos</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <ImageUploadPlaceholder label="Header Logo" currentUrl="https://res.cloudinary.com/djqtkbyez/image/upload/v1774858243/Twenty4_Long_Green-cropped_enulok.svg" />
        <ImageUploadPlaceholder label="Loading Logo" currentUrl="https://res.cloudinary.com/djqtkbyez/image/upload/v1773950275/Untitled_design_62_v4e71o.png" />
        <ImageUploadPlaceholder label="Footer Logo" currentUrl="https://res.cloudinary.com/djqtkbyez/image/upload/v1774858243/Twenty4_Long_Green-cropped_enulok.svg" />
      </div>
    </div>
    
    <div>
      <h2 className="text-2xl font-serif font-bold mb-8">Footer Content</h2>
      <TranslationField 
        label="Footer Phrase" 
        value={{ en: 'The belief is mutual, that is why it works.', es: 'La creencia es mutua por eso es que funciona.' }}
        onChange={() => {}}
      />
    </div>

    <div>
      <h2 className="text-2xl font-serif font-bold mb-8">SEO Settings</h2>
      <div className="space-y-6 bg-slate-50 p-8 rounded-3xl border border-slate-200">
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Meta Title</label>
          <input type="text" className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-900 outline-none" placeholder="Twenty4 Studios | Production Agency" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Meta Description</label>
          <textarea rows={3} className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-900 outline-none resize-none" placeholder="Description for search engines..." />
        </div>
        <ImageUploadPlaceholder label="OG Image (Social Sharing)" helpText="1200 x 630px recommended" />
      </div>
    </div>
  </div>
);

const ProjectsSection = () => {
  const [dummyProjects, setDummyProjects] = useState([
    { id: 1, title: 'BARO', category: 'Netflix Documentation', type: 'Film' },
    { id: 2, title: 'YouTube Festival', category: 'Event Production', type: 'Event' },
  ]);

  return (
    <div className="space-y-12 text-slate-900">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-bold">Manage Projects</h2>
        <button className="flex items-center gap-3 bg-brand-green px-6 py-3 rounded-full text-[10px] uppercase tracking-widest font-bold text-white hover:scale-105 transition-transform">
          <Plus size={16} />
          Add New Project
        </button>
      </div>

      <TranslationField 
        label="Section Title" 
        value={{ en: 'Selected Work', es: 'Trabajos Seleccionados' }}
        onChange={() => {}}
      />

      <div className="grid grid-cols-1 gap-4">
        {dummyProjects.map((p) => (
          <div key={p.id} className="bg-slate-50 border border-slate-200 p-6 rounded-2xl flex items-center justify-between group hover:border-brand-green/50 transition-colors">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white rounded-lg overflow-hidden border border-slate-200">
                <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                  <ImageIcon size={20} className="text-slate-200" />
                </div>
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-serif font-bold">{p.title}</h4>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">{p.category}</span>
                  <span className="w-1 h-1 bg-slate-200 rounded-full" />
                  <span className="text-[10px] uppercase tracking-widest font-bold text-brand-green">{p.type}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-3 bg-white text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl border border-slate-200 transition-all">
                <Eye size={18} />
              </button>
              <button className="p-3 bg-white text-slate-900 hover:bg-brand-green hover:text-white rounded-xl border border-slate-200 transition-all">
                <Briefcase size={18} />
              </button>
              <button className="p-3 bg-red-50 text-red-400 hover:text-white hover:bg-red-500 rounded-xl transition-all">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-50 p-12 rounded-[2.5rem] border border-slate-200 space-y-12">
        <h3 className="text-xl font-serif font-bold">Editing Project: BARO</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ImageUploadPlaceholder label="Main Photo" />
          <VideoUploadPlaceholder label="Main Video" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Client</label>
            <input type="text" className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-900 outline-none" placeholder="Netflix" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Year</label>
            <input type="text" className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-900 outline-none" placeholder="2024" />
          </div>
        </div>

        <TranslationField label="Project Name" value={{ en: 'BARO', es: 'BARO' }} onChange={() => {}} />
        <TranslationField label="Mini Description" value={{ en: 'The story of a man who changed German rap.', es: 'La historia del hombre que cambió el rap alemán.' }} type="textarea" onChange={() => {}} />
        <TranslationField label="Long Description" value={{ en: 'A deep dive into the life and legacy of an icon...', es: 'Una inmersión profunda en la vida y el legado de un icono...' }} type="textarea" onChange={() => {}} />
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Project Gallery</label>
            <button className="text-[10px] uppercase tracking-widest font-bold text-brand-green">+ Add Photo</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="relative aspect-[4/5] bg-white rounded-xl overflow-hidden group border border-slate-200">
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/5 transition-opacity z-10">
                  <button className="p-2 bg-red-500 rounded-lg text-white"><Trash2 size={16} /></button>
                </div>
                <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                  <ImageIcon size={20} className="text-slate-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function BackofficePage() {
  const [activeSection, setActiveSection] = useState('general');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex overflow-hidden">
      <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <main className="flex-grow h-screen overflow-y-auto overflow-x-hidden scroll-smooth bg-white">
        {/* Header Sticky */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-12 py-6 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="text-[8px] uppercase tracking-[0.4em] font-black text-brand-green">Admin Panel</span>
              <span className="text-slate-300">/</span>
              <span className="text-[8px] uppercase tracking-[0.4em] font-black text-slate-400">{activeSection}</span>
            </div>
            <h1 className="text-xl font-serif font-bold uppercase tracking-widest text-slate-900">
              Manage {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-200">
              <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
              <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">System Online</span>
            </div>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-3 bg-slate-900 text-white px-8 py-3 rounded-full text-[10px] uppercase tracking-[0.2em] font-black hover:bg-brand-green transition-all disabled:opacity-50 min-w-[160px] justify-center"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-5xl mx-auto py-20 px-12 pb-40">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {activeSection === 'general' && <GeneralSection />}
              {activeSection === 'hero' && <HeroSection />}
              {activeSection === 'presentation' && <PresentationSection />}
              {activeSection === 'projects' && <ProjectsSection />}
              {activeSection === 'talents' && <TalentsSection />}
              {activeSection === 'about' && <AboutSection />}
              {activeSection === 'contact' && <ContactSection />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #f8fafc;
        }
        ::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
}
