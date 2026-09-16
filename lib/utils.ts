import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Normaliza una URL externa escrita en el admin. Sin protocolo
 * ("www.linkedin.com/…") el navegador la toma como ruta interna del sitio y el
 * enlace se rompe. Devuelve null si está vacía, para poder ocultar el enlace.
 */
export function externalUrl(url?: string | null): string | null {
  const u = (url || '').trim();
  if (!u || u === '#') return null;
  return /^[a-z][a-z0-9+.-]*:/i.test(u) ? u : `https://${u.replace(/^\/+/, '')}`;
}
