'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ProjectFormPage from '../../ProjectFormPage';
import { Loader2 } from 'lucide-react';

export default function EditProjectPage() {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
      
      if (data) setProject(data);
      setLoading(false);
    };

    if (id) fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-green animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white/40">
        Proyecto no encontrado
      </div>
    );
  }

  return <ProjectFormPage initialData={project} projectId={id as string} />;
}
