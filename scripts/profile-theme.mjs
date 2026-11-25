// Identidade visual comum às imagens do perfil (azul profundo, verde-limão e anéis concêntricos).
export const color = {
  navy: '#0a1033',
  card0: '#0e1638',
  card1: '#162160',
  blue: '#3b5bff',
  blueDeep: '#1a2fd0',
  lime: '#c8ff3e',
  text: '#f4f6ff',
  muted: '#b4bde6',
  line: 'rgba(255,255,255,0.10)',
};

export const accent = {
  saude: '#ff6b8a',
  gestao: '#c8ff3e',
  financas: '#3ee0a0',
  campo: '#ffb547',
  marketing: '#ff8ad8',
  posvenda: '#49c6ff',
  crm: '#c8ff3e',
  logistica: '#7dd3fc',
  compliance: '#a78bfa',
  suporte: '#a78bfa',
  estoque: '#3ee0a0',
  links: '#ff8ad8',
  devops: '#49c6ff',
  front: '#ffb547',
};

const sans = "'Segoe UI', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif";
const mono = "'Cascadia Code', 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace";

export const baseCss = `
  .sans{font-family:${sans}}
  .mono{font-family:${mono}}
  .pulse{transform-box:fill-box;transform-origin:center;animation:pulse 2.4s ease-out infinite}
  @keyframes pulse{0%{transform:scale(1);opacity:.75}100%{transform:scale(2.5);opacity:0}}
  .blink{animation:blink 1.1s steps(1) infinite}
  @keyframes blink{50%{opacity:0}}
  @media (prefers-reduced-motion: reduce){.pulse,.blink,.spin,.flow,.trace,.cycle,.glow,.grow{animation:none!important}}
`;

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Quebra o texto em linhas de até `max` caracteres, sem cortar palavras. */
export function wrap(text, max) {
  const lines = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    if (line && (line + ' ' + word).length > max) { lines.push(line); line = word; } else line = line ? line + ' ' + word : word;
  }
  if (line) lines.push(line);
  return lines;
}

/** Linhas de texto em <tspan>, uma abaixo da outra. */
export const lines = (list, x, y, step) => list.map((l, i) => `<tspan x="${x}" y="${y + i * step}">${esc(l)}</tspan>`).join('');

/** Etiquetas em linha; devolve o SVG e onde a linha terminou. */
export function chips(list, x, y, { size = 13, height = 28, gap = 8, fill = 'rgba(255,255,255,0.06)', stroke = 'rgba(255,255,255,0.14)', text = '#dfe4ff' } = {}) {
  let cx = x;
  const out = list.map((label) => {
    const w = Math.round(label.length * size * 0.62 + 24);
    const g = `<g><rect x="${cx}" y="${y}" width="${w}" height="${height}" rx="${height / 2}" fill="${fill}" stroke="${stroke}"/><text class="mono" x="${cx + w / 2}" y="${y + height / 2 + size * 0.36}" font-size="${size}" font-weight="600" fill="${text}" text-anchor="middle">${esc(label)}</text></g>`;
    cx += w + gap;
    return g;
  }).join('');
  return { svg: out, end: cx - gap };
}

/** Anéis concêntricos da marca. */
export function rings(cx, cy, from, to, step, opacity = 0.14) {
  let out = '';
  for (let r = from; r <= to; r += step) out += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#ffffff" stroke-opacity="${opacity}"/>`;
  return out;
}

export function svg(width, height, label, body, css = '') {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="titulo">
<title id="titulo">${esc(label)}</title>
<style>${baseCss}${css}</style>
${body}
</svg>
`;
}
