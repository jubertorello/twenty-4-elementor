import { ImageResponse } from 'next/og';
import { BRAND, STARS_POLYGONS } from '@/lib/site';

export const runtime = 'edge';

const ALLOWED_SIZES = [180, 192, 512];

/**
 * Icono PNG cuadrado (apple-touch-icon y manifest): el mismo diseño que
 * /favicon.svg — fondo Crimson con el isotipo en Warm Lux.
 * ?maskable=1 deja más margen para los recortes circulares de Android.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requested = Number(searchParams.get('size'));
  const size = ALLOWED_SIZES.includes(requested) ? requested : 512;
  const maskable = searchParams.get('maskable') === '1';
  const starsWidth = Math.round(size * (maskable ? 0.62 : 0.82));

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: BRAND.crimson,
        }}
      >
        <svg width={starsWidth} height={Math.round(starsWidth * (448.99 / 938.16))} viewBox="0 0 938.16 448.99">
          {STARS_POLYGONS.map((points) => (
            <polygon key={points} points={points} fill={BRAND.warmLux} />
          ))}
        </svg>
      </div>
    ),
    { width: size, height: size },
  );
}
