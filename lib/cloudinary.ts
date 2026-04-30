/** Extracts the Cloudinary public_id from a URL (handles our optimization transforms). */
export function getCloudinaryPublicId(url: string): string | null {
  if (!url?.includes('res.cloudinary.com')) return null;

  // Strip the fixed transform strings added by optimizeCloudinaryUrl
  const normalized = url
    .replace('/upload/f_webp,q_auto:good,w_1920,c_limit/', '/upload/')
    .replace('/upload/q_auto:good,vc_auto/', '/upload/');

  // Match: /upload/[v{digits}/]public_id[.ext]
  const match = normalized.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^./]+)?$/);
  return match ? match[1] : null;
}

/** Detects resource type from URL ('image' or 'video'). */
function getResourceType(url: string): 'image' | 'video' {
  return url.includes('/video/') ? 'video' : 'image';
}

/**
 * Deletes a Cloudinary asset by URL.
 * Calls our server-side API route (requires CLOUDINARY_API_KEY + CLOUDINARY_API_SECRET in .env.local).
 * Silent on failure — deletion is best-effort.
 */
export async function deleteCloudinaryAsset(url: string): Promise<boolean> {
  const publicId = getCloudinaryPublicId(url);
  if (!publicId) return false;

  try {
    const res = await fetch('/api/cloudinary/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicId, resourceType: getResourceType(url) }),
    });
    return res.ok;
  } catch (e) {
    console.warn('Cloudinary delete failed (non-critical):', e);
    return false;
  }
}

/** Deletes multiple Cloudinary assets in parallel. */
export async function deleteCloudinaryAssets(urls: string[]): Promise<void> {
  await Promise.all(urls.filter(Boolean).map(deleteCloudinaryAsset));
}
