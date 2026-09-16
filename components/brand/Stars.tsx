/**
 * Stars — isotipo TW4 (las dos estrellas del brandbook 2026).
 *
 * Mismo trazado que /public/brand/tw4-stars-*.svg, pero inline y con
 * `fill="currentColor"`, para poder teñirlo con cualquier utilidad de color
 * (text-brand-crimson, text-brand-warm-lux, text-brand-almost-black…) sin
 * duplicar el archivo por cada variante.
 *
 * Relación de aspecto nativa 938.16 × 448.99 (≈ 2.09:1): fijar sólo el ancho.
 */

interface StarsProps {
  className?: string;
  /** Texto alternativo. Si se omite, el icono se marca como decorativo. */
  title?: string;
}

export default function Stars({ className = '', title }: StarsProps) {
  return (
    <svg
      viewBox="0 0 938.16 448.99"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {title && <title>{title}</title>}
      <polygon points="606.43 115.41 420.52 115.41 466.72 0 308.48 115.41 123.92 115.41 216.18 183.79 0 340.62 269.74 242.99 328.95 340.53 395.59 199.47 606.43 115.41" />
      <polygon points="752.24 223.79 798.44 108.37 640.21 223.79 455.64 223.79 547.91 292.16 331.73 448.99 601.46 351.36 660.67 448.9 727.32 307.84 938.16 223.79 752.24 223.79" />
    </svg>
  );
}
