import { ImageResponse } from 'next/og';
import { BRAND, STARS_POLYGONS } from '@/lib/site';

export const runtime = 'edge';

/**
 * Imagen por defecto para compartir en redes (1200×630). Solo se usa si en
 * Admin → SEO & Redes no hay "OG Image": esa, si existe, tiene prioridad.
 * Composición del brandbook: fondo Almost Black, isotipo en Crimson y los
 * marcadores editoriales (Vol. 01 / 2026 / MAD. / coordenadas).
 */
// Public Sans en pesos fijos (el generador no admite fuentes variables).
// Instancias sacadas de /public/fonts/PublicSans-latin.woff2.
const publicSans900 = fetch(new URL('./PublicSans-900.ttf', import.meta.url)).then((r) => r.arrayBuffer());
const publicSans700 = fetch(new URL('./PublicSans-700.ttf', import.meta.url)).then((r) => r.arrayBuffer());

export async function GET() {
  const [black, bold] = await Promise.all([publicSans900, publicSans700]);
  const marker = { fontSize: 18, letterSpacing: 6, color: 'rgba(240,237,232,0.45)', fontWeight: 700 } as const;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: BRAND.almostBlack,
          padding: '56px 64px',
          color: BRAND.warmLux,
          fontFamily: 'Public Sans',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', ...marker }}>
          <span>VOL. 01</span>
          <span>2026</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
          <svg width="260" height="124" viewBox="0 0 938.16 448.99">
            {STARS_POLYGONS.map((points) => (
              <polygon key={points} points={points} fill={BRAND.crimson} />
            ))}
          </svg>
          <div style={{ display: 'flex', fontSize: 104, fontWeight: 900, letterSpacing: -3, lineHeight: 1 }}>
            TWENTY4 STUDIOS
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', ...marker }}>
          <span>MAD.</span>
          {/* Apóstrofo en vez de ′: Public Sans no trae el signo prima y aquí no hay fuente de reserva. */}
          <span>( 40°32.57'N / 3°38.15'W )</span>
          <span>TW4</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Public Sans', data: black, weight: 900, style: 'normal' },
        { name: 'Public Sans', data: bold, weight: 700, style: 'normal' },
      ],
    },
  );
}
