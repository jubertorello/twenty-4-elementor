'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { AdminSectionProps } from './components';
import {
  Bold, Italic, Heading1, Heading2, List, ListOrdered,
  Link as LinkIcon, Minus, RotateCcw, RotateCw
} from 'lucide-react';

// ─── Rich Text Editor ────────────────────────────────────────────────────────

const TOOLBAR_BUTTONS = [
  { cmd: 'bold',          icon: Bold,         title: 'Negrita (⌘B)' },
  { cmd: 'italic',        icon: Italic,       title: 'Cursiva (⌘I)' },
  { cmd: 'h2',            icon: Heading1,     title: 'Título H2' },
  { cmd: 'h3',            icon: Heading2,     title: 'Título H3' },
  { cmd: 'insertUnorderedList', icon: List,   title: 'Lista' },
  { cmd: 'insertOrderedList',  icon: ListOrdered, title: 'Lista numerada' },
  { cmd: 'insertHorizontalRule', icon: Minus, title: 'Separador' },
  { cmd: 'undo',          icon: RotateCcw,    title: 'Deshacer' },
  { cmd: 'redo',          icon: RotateCw,     title: 'Rehacer' },
] as const;

const HEADING_CMDS = ['h2', 'h3'] as const;

const RichTextEditor = ({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInternalChange = useRef(false);

  // Sync external value → editor (only on first load or when value changes externally)
  useEffect(() => {
    if (editorRef.current && !isInternalChange.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value;
      }
    }
    isInternalChange.current = false;
  }, [value]);

  const exec = useCallback((cmd: string) => {
    editorRef.current?.focus();
    if ((HEADING_CMDS as readonly string[]).includes(cmd)) {
      document.execCommand('formatBlock', false, cmd);
    } else {
      document.execCommand(cmd, false, undefined);
    }
    // Trigger onChange after command
    if (editorRef.current) {
      isInternalChange.current = true;
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      isInternalChange.current = true;
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handleLink = useCallback(() => {
    const url = prompt('Introduce la URL del enlace:');
    if (url) {
      editorRef.current?.focus();
      document.execCommand('createLink', false, url);
      if (editorRef.current) {
        isInternalChange.current = true;
        onChange(editorRef.current.innerHTML);
      }
    }
  }, [onChange]);

  return (
    <div className="rounded-2xl border border-white/10 overflow-hidden bg-[#0d0d0d]">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 px-3 py-2 border-b border-white/10 bg-white/5">
        {TOOLBAR_BUTTONS.map(({ cmd, icon: Icon, title }) => (
          <button
            key={cmd}
            type="button"
            title={title}
            onMouseDown={e => { e.preventDefault(); exec(cmd); }}
            className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"
          >
            <Icon size={15} />
          </button>
        ))}
        {/* Link button */}
        <button
          type="button"
          title="Enlace"
          onMouseDown={e => { e.preventDefault(); handleLink(); }}
          className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"
        >
          <LinkIcon size={15} />
        </button>
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        data-placeholder={placeholder}
        className={`
          min-h-[320px] px-5 py-4 text-sm text-white/80 outline-none leading-relaxed
          focus:ring-0
          [&_h2]:text-xl [&_h2]:font-black [&_h2]:text-white [&_h2]:mt-6 [&_h2]:mb-2 [&_h2]:uppercase [&_h2]:tracking-wider
          [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-white/80 [&_h3]:mt-4 [&_h3]:mb-1
          [&_p]:mb-3 [&_p]:text-white/60
          [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ul]:mb-3 [&_ul]:text-white/60
          [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1 [&_ol]:mb-3 [&_ol]:text-white/60
          [&_strong]:text-white [&_strong]:font-bold
          [&_em]:italic [&_em]:text-white/70
          [&_a]:text-brand-almost-black [&_a]:underline [&_a]:hover:opacity-70
          [&_hr]:border-white/10 [&_hr]:my-4
          empty:before:content-[attr(data-placeholder)] empty:before:text-white/20 empty:before:pointer-events-none
        `}
        suppressContentEditableWarning
      />
    </div>
  );
};

// ─── Legal Section ────────────────────────────────────────────────────────────

interface LegalData {
  privacy_es: string;
  privacy_en: string;
  legal_notice_es: string;
  legal_notice_en: string;
  company_name: string;
  company_cif: string;
  company_address: string;
  company_email: string;
}

const defaultData: LegalData = {
  privacy_es: '',
  privacy_en: '',
  legal_notice_es: '',
  legal_notice_en: '',
  company_name: 'Twenty4 Studios',
  company_cif: '',
  company_address: '',
  company_email: 'hello@twenty4studios.com',
};

export const LegalSection = ({ saveTrigger, onSaveComplete }: AdminSectionProps) => {
  const [data, setData] = useState<LegalData>(defaultData);
  const [activeTab, setActiveTab] = useState<'identity' | 'privacy' | 'legal'>('identity');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('site_settings').select('data').eq('id', 'legal').single().then(({ data: res }) => {
      if (res?.data) setData({ ...defaultData, ...res.data });
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!saveTrigger) return;
    supabase.from('site_settings')
      .upsert({ id: 'legal', data }, { onConflict: 'id' })
      .then(({ error }) => onSaveComplete?.(!error));
  }, [saveTrigger]);

  const tabs = [
    { id: 'identity', label: 'Datos de Empresa' },
    { id: 'privacy',  label: 'Política de Privacidad' },
    { id: 'legal',    label: 'Aviso Legal' },
  ] as const;

  const fieldCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-almost-black outline-none transition-colors placeholder:text-white/20";
  const labelCls = "block text-[10px] uppercase tracking-widest font-bold text-white/40 mb-2";

  if (loading) return <div className="text-white/30 text-sm py-20 text-center">Cargando...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-serif font-black text-white mb-1">Páginas Legales</h2>
        <p className="text-white/30 text-sm">Edita el contenido de las páginas de Política de Privacidad y Aviso Legal.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 text-[11px] uppercase tracking-widest font-bold rounded-t-lg transition-all border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'text-white border-brand-almost-black bg-white/5'
                : 'text-white/30 border-transparent hover:text-white/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Datos de Empresa ── */}
      {activeTab === 'identity' && (
        <div className="space-y-6 bg-white/5 rounded-2xl border border-white/10 p-6">
          <p className="text-white/40 text-xs leading-relaxed">
            Estos datos aparecen en la cabecera de las páginas legales públicas para identificar al responsable.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Nombre / Razón Social</label>
              <input className={fieldCls} value={data.company_name} onChange={e => setData({ ...data, company_name: e.target.value })} placeholder="Twenty4 Studios SL" />
            </div>
            <div>
              <label className={labelCls}>CIF / NIF</label>
              <input className={fieldCls} value={data.company_cif} onChange={e => setData({ ...data, company_cif: e.target.value })} placeholder="B12345678" />
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>Dirección</label>
              <input className={fieldCls} value={data.company_address} onChange={e => setData({ ...data, company_address: e.target.value })} placeholder="Calle Mayor 1, 28001 Madrid" />
            </div>
            <div>
              <label className={labelCls}>Email de Contacto</label>
              <input className={fieldCls} type="email" value={data.company_email} onChange={e => setData({ ...data, company_email: e.target.value })} placeholder="hello@twenty4studios.com" />
            </div>
          </div>
        </div>
      )}

      {/* ── Política de Privacidad ── */}
      {activeTab === 'privacy' && (
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🇪🇸</span>
              <label className={labelCls + ' mb-0'}>Política de Privacidad — Español</label>
            </div>
            <RichTextEditor
              value={data.privacy_es}
              onChange={html => setData(d => ({ ...d, privacy_es: html }))}
              placeholder="Escribe aquí la política de privacidad en español..."
            />
          </div>
          <div className="space-y-3 mt-8">
            <div className="flex items-center gap-2">
              <span className="text-xl">🇬🇧</span>
              <label className={labelCls + ' mb-0'}>Privacy Policy — English</label>
            </div>
            <RichTextEditor
              value={data.privacy_en}
              onChange={html => setData(d => ({ ...d, privacy_en: html }))}
              placeholder="Write the privacy policy in English here..."
            />
          </div>
        </div>
      )}

      {/* ── Aviso Legal ── */}
      {activeTab === 'legal' && (
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🇪🇸</span>
              <label className={labelCls + ' mb-0'}>Aviso Legal — Español</label>
            </div>
            <RichTextEditor
              value={data.legal_notice_es}
              onChange={html => setData(d => ({ ...d, legal_notice_es: html }))}
              placeholder="Escribe aquí el aviso legal en español..."
            />
          </div>
          <div className="space-y-3 mt-8">
            <div className="flex items-center gap-2">
              <span className="text-xl">🇬🇧</span>
              <label className={labelCls + ' mb-0'}>Legal Notice — English</label>
            </div>
            <RichTextEditor
              value={data.legal_notice_en}
              onChange={html => setData(d => ({ ...d, legal_notice_en: html }))}
              placeholder="Write the legal notice in English here..."
            />
          </div>
        </div>
      )}
    </div>
  );
};
