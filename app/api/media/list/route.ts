import { NextResponse } from 'next/server';

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

export async function GET() {
  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    return NextResponse.json({ error: 'Cloudinary credentials not configured' }, { status: 500 });
  }

  try {
    const auth = Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64');
    
    // Fetch images (max 500 per request)
    const imagesUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/image?max_results=500`;
    const imagesRes = await fetch(imagesUrl, {
      headers: { Authorization: `Basic ${auth}` },
    });
    
    // Fetch videos
    const videosUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/video?max_results=500`;
    const videosRes = await fetch(videosUrl, {
      headers: { Authorization: `Basic ${auth}` },
    });

    if (!imagesRes.ok || !videosRes.ok) {
       console.error('Cloudinary API error:', await imagesRes.text(), await videosRes.text());
       return NextResponse.json({ error: 'Failed to fetch from Cloudinary' }, { status: 502 });
    }

    const imagesData = await imagesRes.json();
    const videosData = await videosRes.json();

    const allResources = [
      ...(imagesData.resources || []),
      ...(videosData.resources || [])
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({ resources: allResources });
  } catch (error) {
    console.error('Error fetching Cloudinary resources:', error);
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}
