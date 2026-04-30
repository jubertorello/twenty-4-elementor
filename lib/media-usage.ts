/**
 * Extrae el public_id de una URL de Cloudinary.
 * Funciona con URLs optimizadas o directas.
 */
export const getPublicIdFromUrl = (url: string): string | null => {
  if (!url || !url.includes('res.cloudinary.com')) return null;

  try {
    // Las URLs de Cloudinary tienen el formato:
    // https://res.cloudinary.com/[cloud]/[type]/upload/[options]/v[version]/[public_id].[ext]
    
    const parts = url.split('/upload/');
    if (parts.length < 2) return null;

    // Tomamos lo que hay después de /upload/
    let path = parts[1];
    
    // Eliminamos las transformaciones si existen (vienen antes de la versión v12345 o del public_id)
    // Buscamos el segmento que empieza por 'v' seguido de números
    const pathSegments = path.split('/');
    const versionIndex = pathSegments.findIndex(segment => /^v\d+$/.test(segment));
    
    let publicIdWithExt;
    if (versionIndex !== -1) {
      // Si hay versión, el public_id empieza justo después
      publicIdWithExt = pathSegments.slice(versionIndex + 1).join('/');
    } else {
      // Si no hay versión (raro en Cloudinary pero posible), 
      // el último segmento (o segmentos si hay carpetas) es el public_id.
      // Pero hay que saltarse las transformaciones iniciales si existen.
      // Las transformaciones suelen tener comas o carácteres como w_, h_, c_
      const firstRealSegmentIndex = pathSegments.findIndex(segment => 
        !segment.includes(',') && !segment.includes('_')
      );
      publicIdWithExt = pathSegments.slice(firstRealSegmentIndex !== -1 ? firstRealSegmentIndex : 0).join('/');
    }

    // Eliminamos la extensión final (.jpg, .png, .webp, etc)
    return publicIdWithExt.replace(/\.[^/.]+$/, "");
  } catch (e) {
    console.error('Error parsing Cloudinary URL:', url, e);
    return null;
  }
};
