'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import TalentFormPage from '../../TalentFormPage';
import { Loader2 } from 'lucide-react';

export default function EditTalentPage() {
  const { id } = useParams();
  const [talent, setTalent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTalent = async () => {
      const { data, error } = await supabase
        .from('talents')
        .select('*')
        .eq('id', id)
        .single();
      
      if (data) setTalent(data);
      setLoading(false);
    };

    if (id) fetchTalent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-green animate-spin" />
      </div>
    );
  }

  if (!talent) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white/40 uppercase tracking-[0.2em] font-black text-xs">
        Talento no encontrado
      </div>
    );
  }

  return <TalentFormPage initialData={talent} talentId={id as string} />;
}
