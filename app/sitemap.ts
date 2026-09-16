import { MetadataRoute } from 'next';
import { supabaseServer } from '@/lib/supabase-server';
import { SITE_URL } from '@/lib/site';

// Se regenera como mucho cada hora (igual que las páginas de proyecto). Sin esto
// se generaba una única vez al publicar y no reflejaba cambios del admin.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Solo proyectos con caso de estudio: los demás no tienen página enlazada.
  // (Antes se pedía la columna updated_at, que no existe: la consulta fallaba
  // y el sitemap salía únicamente con la home.)
  const { data: projects } = await supabaseServer
    .from('projects')
    .select('slug')
    .eq('is_archived', false)
    .eq('has_case_study', true);

  const projectUrls: MetadataRoute.Sitemap = (projects || []).map((project) => ({
    url: `${SITE_URL}/projects/${project.slug}`,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [
    { url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1 },
    ...projectUrls,
    { url: `${SITE_URL}/aviso-legal`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/politica-de-privacidad`, changeFrequency: 'yearly', priority: 0.2 },
  ];
}
