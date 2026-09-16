/**
 * EditorialFrame — marcadores de encuadre del brandbook TW4 2026.
 *
 * Reproduce la retícula de marcadores que aparece en las láminas del manual
 * (portada, "FROM CONTENT TO CULTURE", composiciones tipográficas):
 *
 *   Vol. 01                                                    2026
 *   ( )                                                         ( )
 *   MAD.          ( 40°32.57′N / 3°38.15′W )                   TW4
 *
 * Se monta dentro de cualquier <section className="relative">. Es puramente
 * decorativo: `pointer-events-none` y `aria-hidden`, no afecta al layout ni
 * intercepta clicks.
 */

type Tone = 'dark' | 'light' | 'media' | 'crimson';

interface EditorialFrameProps {
  /**
   * 'dark' para fondos Almost Black, 'light' para fondos Warm Lux,
   * 'media' para superponer sobre foto o vídeo (más contraste + sombra),
   * 'crimson' para fondos rojos.
   */
  tone?: Tone;
  /** Marcador superior izquierdo. */
  volume?: string;
  /** Marcador superior derecho. */
  year?: string;
  /** Marcador inferior izquierdo. */
  city?: string;
  /** Coordenadas centradas abajo. Pasar null para ocultarlas. */
  coords?: string | null;
  /** Marcador inferior derecho. */
  mark?: string;
  /**
   * Área que ocupa el frame. Por defecto toda la sección; se ajusta cuando hay
   * elementos fijos encima (p. ej. el navbar sobre el hero).
   */
  inset?: string;
  /** Para ajustar el z-index cuando la sección ya tiene capas propias. */
  className?: string;
}

const TONES: Record<Tone, { text: string; accent: string; extra: string }> = {
  dark: { text: 'text-brand-warm-lux/30', accent: 'text-brand-crimson/60', extra: '' },
  light: { text: 'text-brand-almost-black/30', accent: 'text-brand-crimson/70', extra: '' },
  crimson: { text: 'text-brand-warm-lux/50', accent: 'text-brand-almost-black/60', extra: '' },
  media: {
    text: 'text-brand-warm-lux/70',
    accent: 'text-brand-crimson',
    // La foto de fondo puede ser clara u oscura: la sombra garantiza legibilidad.
    extra: '[text-shadow:0_1px_3px_rgba(22,22,22,0.85)]',
  },
};

const BASE = 'text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-bold leading-none';

export default function EditorialFrame({
  tone = 'dark',
  volume = 'Vol. 01',
  year = '2026',
  city = 'MAD.',
  coords = '40°32.57′N / 3°38.15′W',
  mark = 'TW4',
  inset = 'inset-0',
  className = 'z-20',
}: EditorialFrameProps) {
  const c = TONES[tone];
  const MARKER = `${BASE} ${c.extra}`;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute select-none ${inset} ${className}`}
    >
      {/* Fila superior */}
      <span className={`absolute top-5 left-5 lg:top-8 lg:left-8 ${MARKER} ${c.text}`}>{volume}</span>
      <span className={`absolute top-5 right-5 lg:top-8 lg:right-8 ${MARKER} ${c.text}`}>{year}</span>

      {/* Paréntesis laterales — solo desktop, replican el ( ) del manual */}
      <span className={`hidden lg:block absolute top-1/2 left-8 -translate-y-1/2 ${MARKER} ${c.accent}`}>( )</span>
      <span className={`hidden lg:block absolute top-1/2 right-8 -translate-y-1/2 ${MARKER} ${c.accent}`}>( )</span>

      {/*
        Fila inferior — solo desde md. En mobile las secciones son cortas y el
        cierre de una (MAD. · TW4) quedaba pegado a la apertura de la siguiente
        (Vol. 01 · 2026): dos filas de marcadores seguidas.
      */}
      <span className={`hidden md:block absolute bottom-5 left-5 lg:bottom-8 lg:left-8 ${MARKER} ${c.text}`}>{city}</span>
      {coords && (
        <span
          className={`hidden md:block absolute bottom-5 left-1/2 -translate-x-1/2 lg:bottom-8 ${MARKER} ${c.text}`}
        >
          <span className={c.accent}>(</span> {coords} <span className={c.accent}>)</span>
        </span>
      )}
      <span className={`hidden md:block absolute bottom-5 right-5 lg:bottom-8 lg:right-8 ${MARKER} ${c.text}`}>{mark}</span>
    </div>
  );
}
