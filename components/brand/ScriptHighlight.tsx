/**
 * Resalte tipográfico TW4 — tercera voz de la composición del brandbook
 * (Neue Haas Unica textos + Degular titulares + Herr Von Muellerhoff resalte).
 *
 * Regla única para todo el sitio: en los textos editables desde el admin, lo
 * que va entre **dobles asteriscos** se compone en Herr Von Muellerhoff.
 *
 *   "Donde los atletas se convierten en **iconos**"
 *   "La creencia es mutua por eso es que **funciona**."
 *
 * Sin marca no hay resalte: nada se aplica automáticamente.
 */

import React from 'react';

/**
 * Clases de la palabra resaltada. La script tiene la altura de x más pequeña
 * que Public Sans, por eso va a más cuerpo; y siempre en minúscula, porque en
 * caja alta es ilegible (el texto del CMS a veces viene en mayúsculas).
 */
export const SCRIPT_CLASS =
  'font-script font-normal tracking-normal text-[1.45em] leading-[0.75] lowercase';

const MARKER = /(\*\*.+?\*\*)/g;

export interface HighlightSegment {
  text: string;
  script: boolean;
}

/** Divide el texto en tramos normales y tramos marcados con **…**. */
export function parseHighlight(text: string): HighlightSegment[] {
  if (!text) return [];
  return text
    .split(MARKER)
    .filter(Boolean)
    .map((part) =>
      part.startsWith('**') && part.endsWith('**') && part.length > 4
        ? { text: part.slice(2, -2), script: true }
        : { text: part, script: false },
    );
}

/**
 * Igual que parseHighlight pero palabra a palabra, para los titulares que se
 * animan palabra por palabra. La puntuación pegada a una marca ("**funciona**.")
 * se queda en su propio token normal.
 */
export function highlightWords(text: string): HighlightSegment[] {
  return parseHighlight(text).flatMap((seg) =>
    seg.text
      .split(' ')
      .filter(Boolean)
      .map((word) => ({ text: word, script: seg.script })),
  );
}

/** Texto plano sin marcas, para <title>, alt, aria-label, etc. */
export function stripHighlight(text: string): string {
  return (text || '').replace(/\*\*(.+?)\*\*/g, '$1');
}

/** Render inline de un texto con marcas, para textos que no se animan. */
export function Highlight({ text, scriptClassName = '' }: { text: string; scriptClassName?: string }) {
  return (
    <>
      {parseHighlight(text).map((seg, i) =>
        seg.script ? (
          <span key={i} className={`inline-block ${SCRIPT_CLASS} px-[0.12em] ${scriptClassName}`}>
            {seg.text}
          </span>
        ) : (
          <React.Fragment key={i}>{seg.text}</React.Fragment>
        ),
      )}
    </>
  );
}
