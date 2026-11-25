// Gera o cartão "Em números" com dados públicos do GitHub (roda todo dia pela Action).
// Uso: GITHUB_TOKEN=... PERFIL=Kenjihidehira node scripts/build-stats.mjs <pasta-de-saída>
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { color, esc, rings, svg } from './profile-theme.mjs';

const user = process.env.PERFIL || 'Kenjihidehira';
const token = process.env.GITHUB_TOKEN;
const outDir = process.argv[2] || 'dist';
const headers = { 'User-Agent': 'perfil-numeros', Accept: 'application/vnd.github+json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };

async function rest(path) {
  const res = await fetch('https://api.github.com' + path, { headers });
  if (!res.ok) throw new Error(`GET ${path}: ${res.status}`);
  return res.json();
}
async function graphql(query, variables) {
  const res = await fetch('https://api.github.com/graphql', { method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify({ query, variables }) });
  const json = await res.json();
  if (!res.ok || json.errors) throw new Error('GraphQL: ' + JSON.stringify(json.errors ?? res.status));
  return json.data;
}

// Repositórios públicos próprios (sem forks).
const repos = (await rest(`/users/${user}/repos?per_page=100&type=owner`)).filter((r) => !r.fork && !r.private);
const bytes = {};
for (const r of repos) for (const [lang, n] of Object.entries(await rest(`/repos/${user}/${r.name}/languages`))) bytes[lang] = (bytes[lang] ?? 0) + n;
const total = Object.values(bytes).reduce((a, b) => a + b, 0);
const sorted = Object.entries(bytes).sort((a, b) => b[1] - a[1]);
const top = sorted.slice(0, 5).map(([name, n]) => ({ name, share: n / total }));
const rest5 = sorted.slice(5).reduce((a, [, n]) => a + n, 0);
if (rest5 > 0) top.push({ name: 'Outras', share: rest5 / total });

// Contribuições dos últimos 12 meses (precisa de token).
let contrib = null;
if (token) {
  const data = await graphql(`query($login:String!){user(login:$login){contributionsCollection{contributionCalendar{totalContributions weeks{contributionDays{date contributionCount}}}}}}`, { login: user });
  const cal = data.user.contributionsCollection.contributionCalendar;
  const days = cal.weeks.flatMap((w) => w.contributionDays);
  let longest = 0, run = 0;
  for (const d of days) { run = d.contributionCount > 0 ? run + 1 : 0; longest = Math.max(longest, run); }
  let current = 0, i = days.length - 1;
  if (days[i]?.contributionCount === 0) i--; // hoje ainda sem contribuição não zera a sequência
  for (; i >= 0 && days[i].contributionCount > 0; i--) current++;
  contrib = { total: cal.totalContributions, active: days.filter((d) => d.contributionCount > 0).length, current, longest };
}

const fmt = (n) => n.toLocaleString('pt-BR');
const pct = (s) => (s * 100).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + '%';
const today = new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
const numbers = [
  [fmt(repos.length), 'repositórios públicos'],
  [contrib ? fmt(contrib.total) : '—', 'contribuições em 12 meses'],
  [contrib ? fmt(contrib.active) : '—', 'dias com contribuição'],
  [contrib ? fmt(contrib.longest) : '—', 'dias na maior sequência'],
];
const langColor = { JavaScript: '#f1e05a', TypeScript: '#4d8dff', CSS: '#a37cf0', HTML: '#ff7a52', PHP: '#8892ff', Blade: '#ff6b5a', PLpgSQL: '#5fa8d3', Java: '#e3a157', Dockerfile: '#7dd3fc', Shell: '#89e051', Outras: '#7f89b8' };

function card(mobile) {
  const w = mobile ? 720 : 1280, h = mobile ? 900 : 430;
  const L = mobile
    ? { nx: 48, ny: 128, tw: 304, langX: 48, langY: 470, langW: 624, colW: 312, foot: 862 }
    : { nx: 48, ny: 128, tw: 270, langX: 704, langY: 78, langW: 528, colW: 264, foot: 398 };
  const tiles = numbers.map(([value, label], i) => {
    const x = L.nx + (i % 2) * (L.tw + 16), y = L.ny + Math.floor(i / 2) * 124;
    return `<rect x="${x}" y="${y}" width="${L.tw}" height="108" rx="18" fill="#ffffff" fill-opacity=".05" stroke="${color.line}"/>
<text class="sans" x="${x + 22}" y="${y + 58}" font-size="46" font-weight="800" fill="${i === 0 ? color.lime : '#ffffff'}">${esc(value)}</text>
<text class="sans" x="${x + 22}" y="${y + 88}" font-size="17" fill="${color.muted}">${esc(label)}</text>`;
  }).join('\n');
  let bx = L.langX;
  const bar = top.map((l) => { const bw = Math.max(2, l.share * L.langW); const seg = `<rect x="${bx}" y="${L.langY + 60}" width="${bw}" height="16" fill="${langColor[l.name] ?? '#9aa5d1'}"/>`; bx += bw; return seg; }).join('');
  const list = top.map((l, i) => {
    const x = L.langX + (i % 2) * L.colW, y = L.langY + 128 + Math.floor(i / 2) * 50;
    return `<circle cx="${x + 8}" cy="${y - 6}" r="7" fill="${langColor[l.name] ?? '#9aa5d1'}"/>
<text class="sans" x="${x + 26}" y="${y}" font-size="19" font-weight="600" fill="#ffffff">${esc(l.name)}</text>
<text class="mono" x="${x + L.colW - 24}" y="${y}" font-size="16" fill="${color.muted}" text-anchor="end">${pct(l.share)}</text>`;
  }).join('\n');
  const body = `
<defs><linearGradient id="card" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${color.card0}"/><stop offset="1" stop-color="${color.card1}"/></linearGradient>
<clipPath id="clip"><rect width="${w}" height="${h}" rx="28"/></clipPath><clipPath id="barclip"><rect x="${L.langX}" y="${L.langY + 60}" width="${L.langW}" height="16" rx="8"/></clipPath></defs>
<g clip-path="url(#clip)"><rect width="${w}" height="${h}" fill="url(#card)"/>${rings(w - 40, h, 60, 300, 30, 0.05)}</g>
<rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="27" fill="none" stroke="${color.line}"/>
<text class="mono" x="${L.nx}" y="72" font-size="14" font-weight="700" letter-spacing="3" fill="${color.lime}">GITHUB · ATUALIZADO TODO DIA</text>
<text class="sans" x="${L.nx}" y="108" font-size="30" font-weight="800" fill="#ffffff">Atividade no GitHub</text>
${tiles}
${mobile ? `<line x1="48" y1="${L.langY - 30}" x2="672" y2="${L.langY - 30}" stroke="${color.line}"/>` : `<line x1="660" y1="56" x2="660" y2="360" stroke="${color.line}"/>`}
<text class="mono" x="${L.langX}" y="${L.langY - 6}" font-size="14" font-weight="700" letter-spacing="3" fill="${color.lime}">LINGUAGENS</text>
<text class="sans" x="${L.langX}" y="${L.langY + 30}" font-size="30" font-weight="800" fill="#ffffff">Onde está o código</text>
<g clip-path="url(#barclip)"><g class="grow">${bar}</g></g>
${list}
<text class="mono" x="${L.nx}" y="${L.foot}" font-size="13" fill="${color.muted}">Atualizado em ${today} · repositórios públicos próprios, sem forks</text>
`;
  const css = `.grow{transform-box:fill-box;transform-origin:left center;animation:grow 1.6s cubic-bezier(.2,.8,.2,1) both}@keyframes grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}`;
  return svg(w, h, `Em números: ${numbers.map(([v, l]) => `${v} ${l}`).join(', ')}. Linguagens: ${top.map((l) => `${l.name} ${pct(l.share)}`).join(', ')}.`, body, css);
}

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'stats.svg'), card(false));
writeFileSync(join(outDir, 'stats-mobile.svg'), card(true));
console.log(JSON.stringify({ repos: repos.length, contrib, top: top.map((l) => `${l.name} ${pct(l.share)}`) }));
