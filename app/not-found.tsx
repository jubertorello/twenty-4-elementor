import type { Metadata } from 'next';
import Link from 'next/link';
import Stars from '@/components/brand/Stars';
import EditorialFrame from '@/components/brand/EditorialFrame';

// Next ya marca las 404 como noindex; solo hace falta el título.
export const metadata: Metadata = {
  title: 'Página no encontrada',
};

/**
 * 404 real. Antes hacía redirect('/'): Google recibía una redirección en vez
 * de un 404 y podía indexar URLs inexistentes como si fueran la home.
 * Bilingüe porque aquí no se conoce el idioma del visitante.
 */
export default function NotFound() {
  return (
    <main className="relative min-h-screen bg-brand-almost-black text-white flex items-center justify-center px-6 overflow-hidden brand-grain">
      <EditorialFrame />
      <div className="relative z-30 text-center flex flex-col items-center">
        <Stars className="w-20 md:w-24 text-brand-crimson mb-10" />
        <p className="text-brand-crimson uppercase tracking-[0.3em] text-xs md:text-sm font-bold mb-6">Error 404</p>
        <h1 className="text-5xl md:text-7xl lg:text-[6rem] font-display font-black uppercase leading-[0.92] tracking-tight">
          Página no encontrada
        </h1>
        <p className="mt-6 text-white/60 text-base md:text-lg uppercase tracking-[0.2em] font-bold">Page not found</p>
        <Link
          href="/"
          className="mt-12 inline-flex px-8 py-4 bg-brand-crimson text-brand-warm-lux uppercase tracking-[0.2em] text-xs md:text-sm font-bold hover:bg-brand-warm-lux hover:text-brand-almost-black transition-colors"
        >
          Volver al inicio · Back home
        </Link>
      </div>
    </main>
  );
}
