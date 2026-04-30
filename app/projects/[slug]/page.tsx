import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import ProjectDetailClient from './client';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  
  // 1. Obtener datos del proyecto
  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', resolvedParams.slug)
    .single();

  if (!project) {
    return { title: 'Project Not Found | Twenty4' };
  }

  // 2. Obtener la metadata global por si acaso falta algo
  const { data: settingsData } = await supabase
    .from('site_settings')
    .select('data')
    .eq('id', 'general')
    .single();
    
  const globalSettings = settingsData?.data || {};
  const globalTitle = globalSettings.meta_title || 'TWENTY4 STUDIOS';

  // Usar los campos específicos del proyecto si existen, si no, fallback
  const title = project.meta_title_es || project.title_es || 'Project';
  const description = project.meta_description_es || project.mini_description_es || project.description_es || '';
  const ogImage = project.image_url || globalSettings.og_image || '';

  return {
    title: `${title} | ${globalTitle}`,
    description: description,
    openGraph: {
      title: `${title} | ${globalTitle}`,
      description: description,
      images: ogImage ? [ogImage] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${globalTitle}`,
      description: description,
      images: ogImage ? [ogImage] : [],
    }
  };
}

export default function ProjectPage() {
  return <ProjectDetailClient />;
}
