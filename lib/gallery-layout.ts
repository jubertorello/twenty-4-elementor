/**
 * Maquetación de la galería de presentación (la de "Donde los atletas se
 * convierten en iconos"). La comparten la home y el admin, para que la
 * referencia que ve quien sube las fotos sea exactamente lo que sale en la web.
 *
 * Las fotos se reparten en dos filas: la primera mitad arriba y el resto abajo.
 * Cada posición tiene una forma y un tratamiento fijos que se repiten en ciclo.
 */

export type GalleryShapeKey = 'tall' | 'wide' | 'portrait';
export type GalleryTone = 'red' | 'bw';

export interface GalleryShape {
  /** Nombre para el admin. */
  label: string;
  /** Proporción orientativa para el admin (ancho:alto). */
  ratio: string;
  /** Ancho / alto del hueco en desktop, para dibujar la miniatura del admin. */
  aspect: number;
  /** Tamaño del hueco en la web. */
  className: string;
  /**
   * Ancho de imagen a pedir. No es el ancho del hueco: la foto se recorta con
   * object-cover, y una foto horizontal en un hueco vertical necesita bastante
   * más ancho que el hueco para llenar el alto sin ampliarse (y verse borrosa).
   * Calculado para fotos horizontales 3:2, el caso más desfavorable.
   */
  sizes: string;
}

export const GALLERY_SHAPES: Record<GalleryShapeKey, GalleryShape> = {
  tall: {
    label: 'Vertical',
    ratio: '2:3',
    aspect: 208 / 320,
    className: 'w-28 h-44 lg:w-52 lg:h-80',
    sizes: '(min-width: 1024px) 480px, 270px',
  },
  wide: {
    label: 'Horizontal',
    ratio: '16:9',
    aspect: 384 / 224,
    className: 'w-48 h-28 lg:w-96 lg:h-56',
    sizes: '(min-width: 1024px) 384px, 200px',
  },
  portrait: {
    label: 'Vertical',
    ratio: '4:5',
    aspect: 240 / 288,
    className: 'w-32 h-40 lg:w-60 lg:h-72',
    sizes: '(min-width: 1024px) 440px, 240px',
  },
};

/*
 * Ritmo: dos verticales y una horizontal. Las verticales alternan entre la
 * alta (2:3) y la de 4:5 para que no sean todas iguales. Cada fila tiene su
 * propia secuencia, así arriba y abajo no coinciden.
 */
const SHAPE_ORDER: Record<'top' | 'bottom', GalleryShapeKey[]> = {
  top: ['tall', 'portrait', 'wide', 'portrait', 'tall', 'wide'],
  bottom: ['wide', 'tall', 'portrait', 'wide', 'portrait', 'tall'],
};
const TONE_ORDER: GalleryTone[] = ['red', 'bw', 'bw', 'red', 'bw', 'red', 'bw'];

/** Desfase del tono en la fila de abajo, para que tampoco repita el de arriba. */
const BOTTOM_TONE_OFFSET = 3;

/** Forma y tono para la posición `rowIndex` dentro de su fila. */
export function slotStyle(rowIndex: number, row: 'top' | 'bottom') {
  const shapes = SHAPE_ORDER[row];
  const shapeKey = shapes[rowIndex % shapes.length];
  const toneIndex = rowIndex + (row === 'bottom' ? BOTTOM_TONE_OFFSET : 0);
  return {
    shapeKey,
    shape: GALLERY_SHAPES[shapeKey],
    tone: TONE_ORDER[toneIndex % TONE_ORDER.length],
  };
}

/** Reparto de la galería completa en dos filas. */
export function splitGallery<T>(gallery: T[]) {
  const half = Math.ceil(gallery.length / 2);
  return { top: gallery.slice(0, half), bottom: gallery.slice(half) };
}

/** Forma, tono y fila para la foto en la posición `position` de la lista del admin. */
export function gallerySlot(position: number, total: number) {
  const half = Math.ceil(total / 2);
  const row: 'top' | 'bottom' = position < half ? 'top' : 'bottom';
  const rowIndex = row === 'top' ? position : position - half;
  return { row, rowIndex, ...slotStyle(rowIndex, row) };
}
