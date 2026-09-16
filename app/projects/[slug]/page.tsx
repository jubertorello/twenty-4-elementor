import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase-server';
import { SITE_NAME, stripSiteSuffix } from '@/lib/site';
import ProjectDetailClient from './client';

// ISR: revalidate project pages every hour
export const revalidate = 3600;

async function getProject(slug: string) {
  const { data } = await supabaseServer
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single();
  return data;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return { title: 'Proyecto no encontrado', robots: { index: false } };
  }

  const { data: settingsData } = await supabaseServer
    .from('site_settings')
    .select('data')
    .eq('id', 'general')
    .single();

  const globalSettings = settingsData?.data || {};
  const siteTitle = globalSettings.meta_title || globalSettings.site_name || SITE_NAME;

  // El admin guarda el meta título con " | Twenty4 Studios" al final y la
  // plantilla del layout lo vuelve a añadir: se quita aquí para que salga una vez.
  const title = stripSiteSuffix(project.meta_title_es || project.title_es || 'Proyecto', siteTitle);
  const description = project.meta_description_es || project.mini_description_es || project.description_es || '';
  const ogImage = project.image_url || globalSettings.og_image || '';
  const url = `/projects/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${siteTitle}`,
      description,
      url,
      images: ogImage ? [ogImage] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${siteTitle}`,
      description,
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Slug inexistente → 404 real (antes respondía 200 con "Project Not Found").
  if (!(await getProject(slug))) notFound();
  return <ProjectDetailClient />;
}
