import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getPublicIdFromUrl } from '@/lib/media-usage';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const publicIds = new Set<string>();

    // 1. Scan site_settings
    const { data: settings } = await supabaseAdmin.from('site_settings').select('data');
    if (settings) {
      settings.forEach(row => {
        extractUrls(row.data).forEach(url => {
          const id = getPublicIdFromUrl(url);
          if (id) publicIds.add(id);
        });
      });
    }

    // 2. Scan projects
    const { data: projects } = await supabaseAdmin.from('projects').select('image_url, gallery');
    if (projects) {
      projects.forEach(p => {
        if (p.image_url) {
          const id = getPublicIdFromUrl(p.image_url);
          if (id) publicIds.add(id);
        }
        if (Array.isArray(p.gallery)) {
          p.gallery.forEach((url: string) => {
            const id = getPublicIdFromUrl(url);
            if (id) publicIds.add(id);
          });
        }
      });
    }

    // 3. Scan talents
    const { data: talents } = await supabaseAdmin.from('talents').select('image_url');
    if (talents) {
      talents.forEach(t => {
        if (t.image_url) {
          const id = getPublicIdFromUrl(t.image_url);
          if (id) publicIds.add(id);
        }
      });
    }

    return NextResponse.json({ inUse: Array.from(publicIds) });
  } catch (error) {
    console.error('Error scanning media usage:', error);
    return NextResponse.json({ error: 'Failed to scan media usage' }, { status: 500 });
  }
}

/**
 * Función recursiva para extraer URLs de Cloudinary de cualquier objeto/array
 */
function extractUrls(obj: any): string[] {
  const urls: string[] = [];
  
  if (!obj) return urls;
  
  if (typeof obj === 'string') {
    if (obj.includes('res.cloudinary.com')) {
      urls.push(obj);
    }
  } else if (Array.isArray(obj)) {
    obj.forEach(item => urls.push(...extractUrls(item)));
  } else if (typeof obj === 'object') {
    Object.values(obj).forEach(val => urls.push(...extractUrls(val)));
  }
  
  return urls;
}
