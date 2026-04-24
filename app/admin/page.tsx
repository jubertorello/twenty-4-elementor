'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard, Image as ImageIcon, Video, Briefcase,
  Users, Info, Mail, Globe, Save, Settings,
  ArrowLeft, ChevronRight, Eye, Star
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { DashboardSection, LeadsSection } from './dashboard-leads';
import {
  GeneralSection, HeroSection, PresentationSection,
  ProjectsSection, TalentsSection, AboutSection, ContactSection
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
      { id: 'general', label: 'General & SEO', icon: Settings },
      { id: 'hero', label: 'Hero Banner', icon: Star },
      { id: 'presentation', label: 'Presentación', icon: Globe },
      { id: 'projects', label: 'Proyectos', icon: Briefcase },
      { id: 'talents', label: 'Talentos & Marcas', icon: Users },
      { id: 'about', label: 'About Us', icon: Info },
      { id: 'contact', label: 'Contacto', icon: Mail },
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
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[11px] uppercase tracking-widest font-bold transition-all relative ${
                    active
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
    <div className="px-4 py-5 border-t border-white/5">
      <Link
        href="/"
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/25 hover:text-white hover:bg-white/5 transition-all group"
      >
        <ArrowLeft size={15} />
        <span className="text-[11px] uppercase tracking-widest font-bold">Volver a la web</span>
      </Link>
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
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }, 1200);
  };

  const sectionLabels: Record<string, string> = {
    dashboard: 'Dashboard',
    leads: 'Leads',
    general: 'General & SEO',
    hero: 'Hero Banner',
    presentation: 'Presentación',
    projects: 'Proyectos',
    talents: 'Talentos & Marcas',
    about: 'About Us',
    contact: 'Contacto',
  };

  const isContentSection = !['dashboard', 'leads'].includes(activeSection);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex overflow-hidden">
      <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} />

      <main className="flex-grow h-screen overflow-y-auto overflow-x-hidden">
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
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] uppercase tracking-widest font-black transition-all min-w-[140px] justify-center ${
                  saved
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
        <div className="max-w-5xl mx-auto py-12 px-10 pb-32">
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
    </div>
  );
}
