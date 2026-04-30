import { NextResponse } from 'next/server';

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

export async function POST(request: Request) {
  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    return NextResponse.json({ error: 'Cloudinary credentials not configured' }, { status: 500 });
  }

  const { publicId, resourceType = 'image' } = await request.json();
  if (!publicId) {
    return NextResponse.json({ error: 'Missing publicId' }, { status: 400 });
  }

  const auth = Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64');
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/${resourceType}/upload?public_ids[]=${encodeURIComponent(publicId)}`;

  const res = await fetch(url, {
    method: 'DELETE',
    headers: { Authorization: `Basic ${auth}` },
  });

  if (!res.ok) {
    const body = await res.text();
    console.error('Cloudinary delete failed:', body);
    return NextResponse.json({ error: 'Cloudinary delete failed', detail: body }, { status: res.status });
  }

  return NextResponse.json({ success: true });
}
