'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard, Image as ImageIcon, Video, Briefcase,
  Users, Info, Mail, Globe, Save, Settings,
  ArrowLeft, ChevronRight, Eye, Star, CheckCircle, Shield, LogOut
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { DashboardSection, LeadsSection } from './dashboard-leads';
import { ProjectsAdminSection } from './projects-section';
import { TalentsAdminSection } from './talents-section';
import { AboutAdminSection } from './about-section';
import { SettingsSection } from './settings-section';
import { LegalSection } from './legal-section';
import {
  HeroSection, PresentationSection, PhotosSection
} from './components';

// --- Sidebar ---

const menuGroups = [
  {
    label: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'leads', label: 'Leads', icon: Mail, badge: 3 },
    ]
  },
  {
    label: 'Contenido',
    items: [
      { id: 'hero', label: 'Hero Banner', icon: Star },
      { id: 'presentation', label: 'Presentación', icon: ImageIcon },
      { id: 'projects', label: 'Proyectos', icon: Briefcase },
      { id: 'talents', label: 'Talentos & Marcas', icon: Users },
      { id: 'about', label: 'About Us', icon: Info },
      { id: 'legal', label: 'Páginas Legales', icon: Shield },
      { id: 'settings', label: 'Generales', icon: Settings },
    ]
  },
  {
    label: 'Multimedia',
    items: [
      { id: 'photos', label: 'Biblioteca Fotos', icon: ImageIcon },
    ]
  }
];

const AdminSidebar = ({
  activeSection,
  setActiveSection
}: {
  activeSection: string;
  setActiveSection: (s: string) => void;
}) => (
  <div className="w-72 shrink-0 bg-[#0d0d0d] border-r border-white/5 h-screen sticky top-0 flex flex-col overflow-y-auto">
    {/* Logo */}
    <div className="px-6 py-7 border-b border-white/5">
      <div className="relative h-7 w-36 mb-1">
        <Image
          src="https://res.cloudinary.com/dxmmnvpab/image/upload/q_auto/f_auto/v1777040958/Twenty4_Long_Summit-cropped_1_nw9whv.svg"
          alt="Twenty4 Studios"
          fill
          className="object-contain object-left"
        />
      </div>
      <p className="text-[8px] uppercase tracking-[0.3em] font-bold text-white/20 mt-2">Admin Panel</p>
    </div>

    {/* Menu */}
    <nav className="flex-1 px-4 py-6 space-y-6">
      {menuGroups.map(group => (
        <div key={group.label}>
          <p className="text-[8px] uppercase tracking-[0.3em] font-black text-white/20 px-3 mb-2">{group.label}</p>
          <div className="space-y-0.5">
            {group.items.map(item => {
              const active = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[11px] uppercase tracking-widest font-bold transition-all relative ${active
                      ? 'bg-brand-green text-white shadow-lg shadow-brand-green/20'
                      : 'text-white/30 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <item.icon size={15} className={active ? 'text-white' : ''} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {'badge' in item && item.badge && !active && (
                    <span className="w-5 h-5 rounded-full bg-brand-green text-white text-[9px] font-black flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                  {active && <ChevronRight size={13} className="text-white/40" />}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </nav>

    {/* Footer */}
    <div className="px-4 py-5 border-t border-white/5 space-y-1">
      <Link
        href="/"
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/25 hover:text-white hover:bg-white/5 transition-all group"
      >
        <ArrowLeft size={15} />
        <span className="text-[11px] uppercase tracking-widest font-bold">Volver a la web</span>
      </Link>
      <button
        onClick={async () => {
          const { supabase } = await import('@/lib/supabase');
          await supabase.auth.signOut();
          window.location.href = '/login';
        }}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/25 hover:text-red-400 hover:bg-red-500/10 transition-all group"
      >
        <LogOut size={15} />
        <span className="text-[11px] uppercase tracking-widest font-bold">Cerrar Sesión</span>
      </button>
      <div className="mt-3 px-3 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
        <span className="text-[8px] uppercase tracking-[0.25em] font-bold text-white/20">Sistema online</span>
      </div>
    </div>
  </div>
);

// --- Main Page ---

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [toastMsg, setToastMsg] = useState('');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab) setActiveSection(tab);

      if (params.get('saved') === 'true') {
        setToastMsg('Proyecto guardado con éxito');
        setTimeout(() => setToastMsg(''), 3000);
        window.history.replaceState({}, '', `/admin?tab=${tab || 'projects'}`);
      }
    }
  }, []);

  const mainRef = React.useRef<HTMLElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveTrigger, setSaveTrigger] = useState(0);

  React.useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
    // Reset save trigger when changing tabs so we don't accidentally auto-save initial state on mount
    setSaveTrigger(0);
  }, [activeSection]);

  const handleSave = () => {
    setIsSaving(true);
    setSaveTrigger(prev => prev + 1);
  };

  const onSaveComplete = (success?: boolean) => {
    setIsSaving(false);
    if (success === true) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      setToastMsg('Guardado con éxito');
      setTimeout(() => setToastMsg(''), 3000);
    } else if (success === false) {
      setToastMsg('Error al guardar. Por favor, revisa la conexión.');
      setTimeout(() => setToastMsg(''), 4000);
    }
  };

  const sectionLabels: Record<string, string> = {
    dashboard: 'Dashboard',
    leads: 'Leads',
    hero: 'Hero Banner',
    presentation: 'Presentación',
    projects: 'Proyectos',
    talents: 'Talentos & Marcas',
    about: 'About Us',
    legal: 'Páginas Legales',
    settings: 'SEO & Contacto',
    photos: 'Biblioteca de Fotos',
  };

  const isContentSection = !['dashboard', 'leads', 'photos'].includes(activeSection);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex overflow-hidden">
      <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* TOAST GLOBAL */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            className="fixed top-10 left-[calc(50%+9rem)] z-[100] flex items-center gap-3 px-6 py-3 bg-brand-green text-black rounded-full font-bold uppercase tracking-widest text-xs shadow-2xl shadow-brand-green/20 border border-brand-green/50"
          >
            <CheckCircle size={16} /> {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <main ref={mainRef} className="flex-grow h-screen overflow-y-auto overflow-x-hidden">
        {/* Sticky Header */}
        <div className="sticky top-0 z-30 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5 px-10 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[9px] uppercase tracking-[0.4em] font-black text-brand-green">Admin</span>
            <span className="text-white/20">/</span>
            <span className="text-[9px] uppercase tracking-[0.4em] font-black text-white/40">
              {sectionLabels[activeSection] ?? activeSection}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-white/40 hover:text-white hover:border-white/20 transition-all text-[10px] uppercase tracking-widest font-bold"
            >
              <Eye size={13} /> Vista previa
            </Link>

            {isContentSection && (
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] uppercase tracking-widest font-black transition-all min-w-[140px] justify-center ${saved
                    ? 'bg-emerald-500 text-white'
                    : 'bg-brand-green text-white hover:opacity-80'
                  } disabled:opacity-50`}
              >
                {isSaving ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Guardando...
                  </>
                ) : saved ? (
                  '✓ Guardado'
                ) : (
                  <>
                    <Save size={13} /> Guardar
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className={`${activeSection === 'photos' ? 'max-w-[90rem]' : 'max-w-5xl'} mx-auto py-12 px-10 pb-32`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(8px)' }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {activeSection === 'dashboard' && <DashboardSection setActiveSection={setActiveSection} />}
              {activeSection === 'leads' && <LeadsSection />}
              {activeSection === 'settings' && <SettingsSection saveTrigger={saveTrigger} onSaveComplete={onSaveComplete} />}
              {activeSection === 'hero' && <HeroSection saveTrigger={saveTrigger} onSaveComplete={onSaveComplete} />}
              {activeSection === 'presentation' && <PresentationSection saveTrigger={saveTrigger} onSaveComplete={onSaveComplete} />}
              {activeSection === 'projects' && <ProjectsAdminSection saveTrigger={saveTrigger} onSaveComplete={onSaveComplete} />}
              {activeSection === 'talents' && <TalentsAdminSection saveTrigger={saveTrigger} onSaveComplete={onSaveComplete} />}
              {activeSection === 'about' && <AboutAdminSection saveTrigger={saveTrigger} onSaveComplete={onSaveComplete} />}
              {activeSection === 'legal' && <LegalSection saveTrigger={saveTrigger} onSaveComplete={onSaveComplete} />}
              {activeSection === 'photos' && <PhotosSection />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
