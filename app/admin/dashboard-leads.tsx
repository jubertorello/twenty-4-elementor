'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp, Users, Briefcase, Mail, Star, Eye,
  ArrowUpRight, ArrowDownRight, Clock, CheckCircle,
  XCircle, AlertCircle, Trash2, ChevronDown, X, MessageSquare,
  Phone, Calendar, Filter, Search
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

// --- Dashboard ---

export const DashboardSection = ({ setActiveSection }: { setActiveSection: (s: string) => void }) => {
  const [stats, setStats] = useState({
    totalLeads: 0,
    newLeads: 0,
    projects: 0,
    talents: 0,
    brands: 0,
    seoHealth: 94
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [leadsRes, projectsRes, talentsRes, brandsRes] = await Promise.all([
        supabase.from('leads').select('id, status', { count: 'exact' }),
        supabase.from('projects').select('id', { count: 'exact' }),
        supabase.from('talents').select('id', { count: 'exact' }),
        supabase.from('brands').select('id', { count: 'exact' }),
      ]);

      setStats({
        totalLeads: leadsRes.count || 0,
        newLeads: (leadsRes.data || []).filter(l => l.status === 'new').length,
        projects: projectsRes.count || 0,
        talents: talentsRes.count || 0,
        brands: brandsRes.count || 0,
        seoHealth: 94
      });
    };

    fetchStats();
  }, []);

  const kpis = [
    { label: 'Leads Totales', value: stats.totalLeads.toString(), change: `+${stats.newLeads} nuevos`, up: true, icon: Mail, color: 'from-brand-green/20 to-brand-green/5', accent: 'text-brand-green' },
    { label: 'Proyectos', value: stats.projects.toString(), change: 'En la web', up: true, icon: Briefcase, color: 'from-blue-500/10 to-blue-500/5', accent: 'text-blue-400' },
    { label: 'Talentos', value: stats.talents.toString(), change: 'Activos', up: true, icon: Star, color: 'from-amber-500/10 to-amber-500/5', accent: 'text-amber-400' },
    { label: 'Marcas', value: stats.brands.toString(), change: 'Colaboraciones', up: true, icon: Users, color: 'from-purple-500/10 to-purple-500/5', accent: 'text-purple-400' },
    { label: 'Salud SEO', value: `${stats.seoHealth}%`, change: 'Optimizado', up: true, icon: CheckCircle, color: 'from-emerald-500/10 to-emerald-500/5', accent: 'text-emerald-400' },
  ];

  return (
    <div className="space-y-10">
      <div>
        <p className="text-[10px] uppercase tracking-widest font-bold text-white/30 mb-2">Resumen general</p>
        <h2 className="text-3xl font-bold text-white">Dashboard</h2>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className={`relative bg-gradient-to-br ${kpi.color} border border-white/10 rounded-2xl p-5 overflow-hidden group hover:border-white/20 transition-colors`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2 rounded-xl bg-white/5`}>
                <kpi.icon size={16} className={kpi.accent} />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-bold ${kpi.up ? 'text-emerald-400' : 'text-rose-400'}`}>
                {kpi.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {kpi.change}
              </div>
            </div>
            <p className="text-3xl font-black text-white mb-1">{kpi.value}</p>
            <p className="text-[10px] uppercase tracking-widest font-bold text-white/40">{kpi.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/5 rounded-2xl border border-white/10 p-6 space-y-5">
          <h3 className="text-[10px] uppercase tracking-widest font-bold text-white/40">Actividad reciente</h3>
          <div className="space-y-4">
            <p className="text-white/20 text-xs italic">Los leads aparecerán aquí en tiempo real...</p>
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl border border-white/10 p-6 space-y-5">
          <h3 className="text-[10px] uppercase tracking-widest font-bold text-white/40">Acciones rápidas</h3>
          <div className="space-y-3">
            {[
              { label: 'Ver Leads', id: 'leads', icon: Mail },
              { label: 'Nuevo Proyecto', id: 'projects', icon: Briefcase },
            ].map(a => (
              <button key={a.id} onClick={() => setActiveSection(a.id)}
                className="w-full flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-brand-green/20 border border-white/10 hover:border-brand-green/30 rounded-xl transition-all group">
                <a.icon size={15} className="text-white/40 group-hover:text-brand-green transition-colors" />
                <span className="text-sm font-bold text-white/60 group-hover:text-white transition-colors">{a.label}</span>
                <ArrowUpRight size={13} className="ml-auto text-white/20 group-hover:text-brand-green transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Leads ---

type LeadStatus = 'new' | 'following' | 'closed';

interface Lead {
  id: string; 
  name: string; 
  email: string; 
  phone?: string;
  message: string; 
  created_at: string; 
  status: LeadStatus;
}

const statusConfig: Record<LeadStatus, { label: string; icon: typeof CheckCircle; cls: string }> = {
  new: { label: 'Nuevo', icon: AlertCircle, cls: 'text-brand-green bg-brand-green/10 border-brand-green/30' },
  following: { label: 'En seguimiento', icon: Clock, cls: 'text-amber-400 bg-amber-400/10 border-amber-400/30' },
  closed: { label: 'Cerrado', icon: XCircle, cls: 'text-white/30 bg-white/5 border-white/10' },
};

export const LeadsSection = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | LeadStatus>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Lead | null>(null);

  const fetchLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setLeads(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const updateStatus = async (id: string, status: LeadStatus) => {
    const { error } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', id);

    if (!error) {
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
      if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
    }
  };

  const deleteLead = async (id: string) => {
    if (!confirm('¿Seguro que quieres eliminar este lead?')) return;
    const { error } = await supabase.from('leads').delete().eq('id', id);
    if (!error) {
      setLeads(prev => prev.filter(l => l.id !== id));
      setSelected(null);
    }
  };

  const filtered = leads.filter(l =>
    (filter === 'all' || l.status === filter) &&
    (l.name.toLowerCase().includes(search.toLowerCase()) || l.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest font-bold text-white/30 mb-2">Formulario de contacto</p>
          <h2 className="text-3xl font-bold text-white">Leads</h2>
        </div>
        <div className="flex items-center gap-2 bg-brand-green/10 border border-brand-green/30 rounded-xl px-4 py-2.5">
          <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
          <span className="text-[10px] uppercase tracking-widest font-bold text-brand-green">
            {leads.filter(l => l.status === 'new').length} nuevos
          </span>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3">
        {(['new', 'following', 'closed'] as LeadStatus[]).map(s => {
          const cfg = statusConfig[s];
          const count = leads.filter(l => l.status === s).length;
          return (
            <button key={s} onClick={() => setFilter(filter === s ? 'all' : s)}
              className={`p-4 rounded-xl border transition-all text-left ${filter === s ? cfg.cls : 'bg-white/5 border-white/10 hover:border-white/20'}`}>
              <p className="text-xl font-black text-white">{count}</p>
              <p className={`text-[10px] uppercase tracking-widest font-bold mt-1 ${filter === s ? '' : 'text-white/30'}`}>{cfg.label}</p>
            </button>
          );
        })}
      </div>

      {/* Search & filter */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white outline-none focus:border-brand-green/50 placeholder:text-white/20"
            placeholder="Buscar por nombre o email..." />
        </div>
        <button onClick={() => setFilter('all')}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-[10px] uppercase tracking-widest font-bold transition-all ${filter === 'all' ? 'bg-brand-green text-white border-brand-green' : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'}`}>
          <Filter size={13} /> Todos
        </button>
      </div>

      {/* Table */}
      <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
        <div className="grid grid-cols-[1fr_1fr_2fr_auto_auto] gap-4 px-5 py-3 border-b border-white/5">
          {['Nombre', 'Email', 'Mensaje', 'Fecha', 'Estado'].map(h => (
            <span key={h} className="text-[8px] uppercase tracking-widest font-bold text-white/30">{h}</span>
          ))}
        </div>
        <div className="divide-y divide-white/5">
          {loading ? (
            <div className="py-16 text-center text-white/20 italic text-sm">Cargando leads...</div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center">
              <MessageSquare size={32} className="text-white/10 mx-auto mb-3" />
              <p className="text-white/30 text-sm">No hay leads que coincidan</p>
            </div>
          ) : filtered.map(lead => {
            const cfg = statusConfig[lead.status];
            const SIcon = cfg.icon;
            return (
              <motion.div key={lead.id} layout
                className="grid grid-cols-[1fr_1fr_2fr_auto_auto] gap-4 px-5 py-4 hover:bg-white/5 cursor-pointer items-center group transition-colors"
                onClick={() => setSelected(lead)}>
                <span className="text-sm font-bold text-white truncate">{lead.name}</span>
                <span className="text-xs text-white/50 truncate">{lead.email}</span>
                <span className="text-xs text-white/40 truncate">{lead.message.slice(0, 60)}...</span>
                <span className="text-[10px] text-white/30 whitespace-nowrap">{new Date(lead.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}</span>
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[9px] font-bold uppercase tracking-wider whitespace-nowrap ${cfg.cls}`}>
                  <SIcon size={10} /> {cfg.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Lead Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#111] border border-white/10 rounded-3xl p-8 w-full max-w-lg space-y-6 shadow-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-white/30 mb-1">Lead recibido</p>
                  <h3 className="text-xl font-bold text-white">{selected.name}</h3>
                </div>
                <button onClick={() => setSelected(null)} className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/40 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-white/60">
                  <Mail size={14} className="text-brand-green shrink-0" />
                  <a href={`mailto:${selected.email}`} className="hover:text-white transition-colors">{selected.email}</a>
                </div>
                <div className="flex items-center gap-3 text-sm text-white/60">
                  <Calendar size={14} className="text-brand-green shrink-0" />
                  <span>{new Date(selected.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                <p className="text-[10px] uppercase tracking-widest font-bold text-white/30 mb-3">Mensaje</p>
                <p className="text-sm text-white/80 leading-relaxed">{selected.message}</p>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-widest font-bold text-white/30">Estado</p>
                <div className="flex gap-2">
                  {(['new', 'following', 'closed'] as LeadStatus[]).map(s => {
                    const c = statusConfig[s];
                    return (
                      <button key={s} onClick={() => updateStatus(selected.id, s)}
                        className={`flex-1 py-2 px-3 rounded-xl border text-[9px] font-bold uppercase tracking-wider transition-all ${selected.status === s ? c.cls : 'bg-white/5 border-white/10 text-white/30 hover:border-white/20'}`}>
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => deleteLead(selected.id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white py-3 rounded-xl border border-red-500/20 transition-all text-[10px] uppercase tracking-widest font-bold">
                  <Trash2 size={14} /> Eliminar Lead
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
