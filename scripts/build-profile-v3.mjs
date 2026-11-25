// Gera as imagens fixas do README do perfil em assets/v3/.
// Uso: node scripts/build-profile-v3.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { accent, chips, color, esc, lines, rings, svg, wrap } from './profile-theme.mjs';

const out = join(import.meta.dirname, '..', 'assets', 'v3');
mkdirSync(out, { recursive: true });
const save = (name, content) => { writeFileSync(join(out, name), content); console.log('assets/v3/' + name); };

const cardDefs = (id, from = color.card0, to = color.card1) => `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient>`;

/** Etiquetas que quebram de linha quando passam de maxX. */
function chipRows(list, x, y, maxX, opts = {}) {
  const rows = [[]];
  let width = 0;
  for (const label of list) {
    const w = Math.round(label.length * (opts.size ?? 13) * 0.62 + 24) + 8;
    if (width + w > maxX - x && rows.at(-1).length) { rows.push([]); width = 0; }
    rows.at(-1).push(label); width += w;
  }
  return rows.map((row, i) => chips(row, x, y + i * ((opts.height ?? 28) + 10), opts).svg).join('');
}

// ---------------- Capa ----------------
const phrases = ['Sistemas web para operações', 'APIs e automações em Node.js', 'Painéis com dados e indicadores', 'Protótipos de saúde com IA'];
function header(mobile) {
  const w = mobile ? 720 : 1280, h = mobile ? 640 : 440;
  const cx = mobile ? 590 : 1010, cy = mobile ? 140 : 220;
  const x = mobile ? 48 : 72;
  const nameSize = mobile ? 80 : 88;
  const y = mobile ? { k: 70, n1: 300, n2: 384, p: 452, line: 492, loc: 536, chips: 566 } : { k: 86, n1: 182, n2: 268, p: 330, line: 364, loc: 404, chips: 384 };
  const orbit = mobile ? 120 : 160;
  const body = `
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0d1a7a"/><stop offset=".55" stop-color="#2440e6"/><stop offset="1" stop-color="#0a1250"/></linearGradient>
  <radialGradient id="glow" cx="${(cx / w) * 100}%" cy="${(cy / h) * 100 - 10}%" r="45%"><stop offset="0" stop-color="#6d8bff" stop-opacity=".55"/><stop offset="1" stop-color="#6d8bff" stop-opacity="0"/></radialGradient>
  <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="#fff" stroke-opacity=".045"/></pattern>
  <clipPath id="clip"><rect width="${w}" height="${h}" rx="28"/></clipPath>
</defs>
<g clip-path="url(#clip)">
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <rect width="${w}" height="${h}" fill="url(#grid)"/>
  <rect width="${w}" height="${h}" fill="url(#glow)"/>
  ${rings(cx, cy, mobile ? 50 : 70, mobile ? 200 : 260, 30)}
  <circle class="spin" cx="${cx}" cy="${cy}" r="${orbit + 30}" fill="none" stroke="${color.lime}" stroke-opacity=".35" stroke-dasharray="4 14"/>
  <g class="spin orbit">
    <circle cx="${cx + orbit}" cy="${cy}" r="9" fill="${color.lime}"/>
    <circle class="pulse" cx="${cx + orbit}" cy="${cy}" r="9" fill="${color.lime}"/>
  </g>
  <circle cx="${cx}" cy="${cy}" r="${mobile ? 50 : 64}" fill="#1a2fd0" stroke="${color.lime}" stroke-width="2"/>
  <text class="sans" x="${cx}" y="${cy + (mobile ? 15 : 20)}" font-size="${mobile ? 44 : 58}" font-weight="800" font-style="italic" fill="${color.lime}" text-anchor="middle">KH</text>
</g>
<text class="mono" x="${x}" y="${y.k}" font-size="${mobile ? 13 : 15}" font-weight="700" letter-spacing="${mobile ? 3 : 4}" fill="${color.lime}">PORTFÓLIO · DESENVOLVIMENTO WEB</text>
<text class="sans" x="${x}" y="${y.n1}" font-size="${nameSize}" font-weight="800" letter-spacing="-2" fill="#f6f7ff">Wesley Kenji</text>
<text class="sans" x="${x}" y="${y.n2}" font-size="${nameSize}" font-weight="800" letter-spacing="-2" fill="#f6f7ff">Hidehira</text>
${phrases.map((p, i) => `<text class="sans cycle c${i}" x="${x}" y="${y.p}" font-size="${mobile ? 28 : 30}" font-weight="600" fill="#e6eaff">${esc(p)}<tspan class="mono blink" fill="${color.lime}" dx="6">▌</tspan></text>`).join('\n')}
<line x1="${x}" y1="${y.line}" x2="${w - x}" y2="${y.line}" stroke="#fff" stroke-opacity=".2"/>
<text class="mono" x="${x}" y="${y.loc}" font-size="${mobile ? 13 : 14}" letter-spacing="3" fill="#c9d2ff">DOURADINA, PR · BRASIL</text>
${chips(['TypeScript', 'Node.js', 'React', 'PHP', 'Supabase'], mobile ? x : 380, y.chips, { fill: 'rgba(255,255,255,0.10)', stroke: 'rgba(255,255,255,0.22)', text: '#eef1ff' }).svg}
`;
  const css = `
  .spin{transform-box:view-box;transform-origin:${cx}px ${cy}px;animation:spin 70s linear infinite}
  .orbit{animation-duration:18s}
  @keyframes spin{to{transform:rotate(360deg)}}
  .cycle{opacity:0;animation:cycle 16s infinite}
  .c1{animation-delay:4s}.c2{animation-delay:8s}.c3{animation-delay:12s}
  @keyframes cycle{0%{opacity:0;transform:translateY(10px)}4%,21%{opacity:1;transform:translateY(0)}25%,100%{opacity:0;transform:translateY(-10px)}}
  @media (prefers-reduced-motion: reduce){.c0{opacity:1}}
`;
  return svg(w, h, 'Wesley Kenji Hidehira · Desenvolvedor web · Sistemas web, APIs e automações para operações · Douradina, PR', body, css);
}
save('header.svg', header(false));
save('header-mobile.svg', header(true));

// ---------------- Botões de navegação ----------------
const icons = {
  destaques: `<path d="M44 31l3.9 8 8.6 1.2-6.2 6 1.5 8.6L44 50.7l-7.8 4.1 1.5-8.6-6.2-6 8.6-1.2z" fill="none" stroke="${color.lime}" stroke-width="2.4" stroke-linejoin="round"/>`,
  projetos: [[34, 34], [46, 34], [34, 46], [46, 46]].map(([x, y]) => `<rect x="${x}" y="${y}" width="9" height="9" rx="2" fill="none" stroke="${color.lime}" stroke-width="2.4"/>`).join(''),
  numeros: `<path d="M34 56V47M42 56V39M50 56V33M57 56V43" stroke="${color.lime}" stroke-width="4" stroke-linecap="round"/>`,
  stack: `<path d="M44 31l13 7-13 7-13-7z" fill="none" stroke="${color.lime}" stroke-width="2.4" stroke-linejoin="round"/><path d="M31 45l13 7 13-7M31 51l13 7 13-7" fill="none" stroke="${color.lime}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>`,
  contato: `<path d="M31 35h26v17H41l-6 5v-5h-4z" fill="none" stroke="${color.lime}" stroke-width="2.4" stroke-linejoin="round"/><path d="M37 42h14M37 46h9" stroke="${color.lime}" stroke-width="2.4" stroke-linecap="round"/>`,
};
for (const [id, label] of [['destaques', 'Destaques'], ['projetos', 'Projetos'], ['numeros', 'Números'], ['stack', 'Stack'], ['contato', 'Contato']]) {
  save(`nav-${id}.svg`, svg(292, 88, `Ir para ${label}`, `
<defs>${cardDefs('g', '#18268f', '#2b46e8')}</defs>
<rect x="1" y="1" width="290" height="86" rx="22" fill="url(#g)" stroke="#ffffff" stroke-opacity=".18"/>
<circle cx="44" cy="44" r="25" fill="${color.lime}" fill-opacity=".14"/>
${icons[id]}
<text class="sans" x="84" y="54" font-size="27" font-weight="700" fill="#ffffff">${label}</text>
<path d="M254 50l12-12M256 38h10v10" fill="none" stroke="${color.lime}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
`));
}

// ---------------- Projetos em destaque ----------------
function ecgPath(x0, x1, base, amp) {
  let d = `M${x0} ${base}`;
  for (let x = x0; x + 150 <= x1; x += 150) {
    d += ` L${x + 40} ${base} q6 ${-amp * 0.25} 12 0 L${x + 64} ${base} l5 ${amp * 0.35} l7 ${-amp * 1.4} l7 ${amp * 1.65} l5 ${-amp * 0.6} L${x + 104} ${base} q9 ${-amp * 0.4} 18 0 L${x + 150} ${base}`;
  }
  return d + ` L${x1} ${base}`;
}
function barcode(x0, x1, top, height) {
  let out = '', x = x0, i = 0;
  const widths = [3, 1, 2, 1, 4, 1, 1, 3, 2, 1, 2, 4, 1, 2, 1, 3];
  while (x < x1) { const bw = widths[i % widths.length] * 2; if (i % 2 === 0) out += `<rect x="${x}" y="${top}" width="${bw}" height="${height}" fill="#ffffff" fill-opacity=".22"/>`; x += bw + 2; i++; }
  return out;
}

function feature(p, mobile) {
  const w = mobile ? 720 : 1280, h = mobile ? 812 : 360;
  const x = mobile ? 48 : 64;
  const L = mobile
    ? { k: 72, t: 142, pillY: 168, d: 244, chips: 372, band: [48, 672, 470, 30], tiles: [48, 548, 304, 108] }
    : { k: 78, t: 150, pillY: 112, d: 198, chips: 296, band: [760, 1216, 62, 22], tiles: [760, 96, 220, 108] };
  const titleSize = mobile ? 54 : 60;
  const pillX = mobile ? x : x + Math.round(p.title.length * titleSize * 0.62) + 24;
  const pillW = Math.round(p.pill.length * 8.2 + 44);
  const [tx, ty, tw, th] = L.tiles;
  const tiles = p.tiles.map(([value, label], i) => {
    const px = tx + (i % 2) * (tw + 16), py = ty + Math.floor(i / 2) * (th + 16);
    const word = value.length > 3;
    return `<rect x="${px}" y="${py}" width="${tw}" height="${th}" rx="18" fill="#ffffff" fill-opacity=".05" stroke="${color.line}"/>
<text class="sans" x="${px + 22}" y="${py + (word ? 50 : 56)}" font-size="${word ? 30 : 46}" font-weight="800" fill="${i === 0 ? p.accent : '#ffffff'}">${esc(value)}</text>
<text class="sans" x="${px + 22}" y="${py + 84}" font-size="15" fill="${color.muted}">${esc(label)}</text>`;
  }).join('\n');
  const [bx0, bx1, by, bamp] = L.band;
  const band = p.band === 'ecg'
    ? `<path d="${ecgPath(bx0, bx1, by, bamp)}" fill="none" stroke="${p.accent}" stroke-opacity=".28" stroke-width="2"/>
<path class="trace" d="${ecgPath(bx0, bx1, by, bamp)}" pathLength="1000" fill="none" stroke="${p.accent}" stroke-width="3" stroke-linecap="round" stroke-dasharray="90 910"/>`
    : `${barcode(bx0, bx1, by - bamp - 6, bamp * 2 + 12)}<rect class="scan" x="${bx0}" y="${by - bamp - 14}" width="3" height="${bamp * 2 + 28}" rx="1.5" fill="${p.accent}"/>`;
  const body = `
<defs>${cardDefs('card')}<clipPath id="clip"><rect width="${w}" height="${h}" rx="28"/></clipPath></defs>
<g clip-path="url(#clip)">
  <rect width="${w}" height="${h}" fill="url(#card)"/>
  ${rings(w - 40, 0, 60, 300, 30, 0.05)}
  <rect x="0" y="${mobile ? 40 : 56}" width="5" height="90" rx="2.5" fill="${p.accent}"/>
</g>
<rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="27" fill="none" stroke="${color.line}"/>
<text class="mono" x="${x}" y="${L.k}" font-size="14" font-weight="700" letter-spacing="3" fill="${p.accent}">${esc(p.kicker)}</text>
<text class="sans" x="${x}" y="${L.t}" font-size="${titleSize}" font-weight="800" letter-spacing="-1" fill="#ffffff">${esc(p.title)}</text>
<g><rect x="${pillX}" y="${L.pillY}" width="${pillW}" height="32" rx="16" fill="${p.accent}" fill-opacity=".12" stroke="${p.accent}" stroke-opacity=".5"/>
<circle cx="${pillX + 18}" cy="${L.pillY + 16}" r="5" fill="${p.accent}"/><circle class="pulse" cx="${pillX + 18}" cy="${L.pillY + 16}" r="5" fill="${p.accent}"/>
<text class="mono" x="${pillX + 34}" y="${L.pillY + 21}" font-size="13" font-weight="700" fill="${p.accent}">${esc(p.pill)}</text></g>
<text class="sans" font-size="20" fill="${color.muted}">${lines(wrap(p.desc, mobile ? 54 : 58), x, L.d, 30)}</text>
${chipRows(p.chips, x, L.chips, mobile ? w - x : 700, { height: 30 })}
${band}
${tiles}
`;
  const css = `
  .trace{animation:trace 3.2s linear infinite}
  @keyframes trace{from{stroke-dashoffset:1000}to{stroke-dashoffset:0}}
  .scan{animation:scan 3.6s ease-in-out infinite alternate}
  @keyframes scan{from{transform:translateX(0)}to{transform:translateX(${bx1 - bx0 - 3}px)}}
  @media (prefers-reduced-motion: reduce){.scan{animation:none}}
`;
  return svg(w, h, `${p.title} · ${p.kicker} · ${p.desc}`, body, css);
}

const featured = [
  {
    id: 'hemodinamica', title: 'Hemodinâmica', kicker: 'SAÚDE · PROTÓTIPO HOSPITALAR', accent: accent.saude, pill: 'em evolução', band: 'ecg',
    desc: 'Cada procedimento de cardiologia intervencionista, do pedido médico ao faturamento, com estoque rastreável, regras clínicas e copilot de IA para o médico.',
    chips: ['React 19', 'TypeScript', 'Vite', 'Zod', 'Claude API', 'node:test'],
    tiles: [['8', 'etapas até o faturamento'], ['90', 'testes automatizados'], ['3', 'perfis de acesso'], ['IA', 'copilot com Claude']],
  },
  {
    id: 'patrimonio', title: 'Patrimônio Ops', kicker: 'GESTÃO · SISTEMA PUBLICADO', accent: accent.gestao, pill: 'demo online', band: 'barcode',
    desc: 'Controle patrimonial por núcleo: inventário de ativos, importação de planilhas, termos de custódia e trilha de auditoria, com acesso autenticado.',
    chips: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase', 'GitHub Actions'],
    tiles: [['Inventário', 'ativos por núcleo'], ['Custódia', 'emissão de termos'], ['Auditoria', 'histórico de movimentações'], ['Excel', 'importação e exportação']],
  },
];
// Os cartões com link ficam só na versão larga: no GitHub, um <picture> dentro de <a> perde o link.
for (const p of featured) save(`feature-${p.id}.svg`, feature(p, false));

// ---------------- Cartões de projeto ----------------
export const projects = [
  { id: 'cobreflow', repo: 'cobreflow-finance-ops', title: 'CobreFlow', kicker: 'FINANÇAS', accent: accent.financas, demo: 'https://cobreflow-finance.dadosepesquisa.chatgpt.site', desc: 'Conciliação de recebíveis, cobrança ativa e automações comerciais.', chips: ['Node.js', 'Testes', 'Docker', 'CI'] },
  { id: 'fieldops', repo: 'fieldops-margin-control', title: 'FieldOps', kicker: 'SERVIÇOS EM CAMPO', accent: accent.campo, demo: 'https://fieldops-margin.dadosepesquisa.chatgpt.site', desc: 'Margem de serviços em campo, risco de SLA e automação de cobrança.', chips: ['PHP', 'TypeScript', 'Docker', 'CI'] },
  { id: 'leadops', repo: 'leadops-campaign-attribution', title: 'LeadOps', kicker: 'MARKETING', accent: accent.marketing, demo: 'https://leadops-attribution.dadosepesquisa.chatgpt.site', desc: 'Atribuição de campanhas, pontuação de leads, ROI e automações.', chips: ['Node.js', 'Testes', 'Docker', 'CI'] },
  { id: 'returnops', repo: 'returnops-rma-command-center', title: 'ReturnOps', kicker: 'PÓS-VENDA', accent: accent.posvenda, demo: 'https://returnops-rma-control.dadosepesquisa.chatgpt.site', desc: 'Devoluções, reembolsos, reposição de estoque e controle de SLA.', chips: ['Node.js', 'Testes', 'Docker', 'CI'] },
  { id: 'servicehub', repo: 'servicehub-agendamentos-crm', title: 'ServiceHub', kicker: 'CRM DE SERVIÇOS', accent: accent.crm, demo: 'https://servicehub-crm-ops.dadosepesquisa.chatgpt.site', desc: 'CRM com agenda, funil, cobranças e automações para serviços.', chips: ['Node.js', 'Testes', 'Docker', 'CI'] },
  { id: 'logixops', repo: 'logix-ops-control-tower', title: 'LogixOps', kicker: 'LOGÍSTICA', accent: accent.logistica, desc: 'Torre de controle da última milha: SLA, incidentes e automações.', chips: ['Node.js', 'Testes', 'Docker'] },
  { id: 'clinicflow', repo: 'clinicflow-no-show-recovery', title: 'ClinicFlow', kicker: 'SAÚDE', accent: accent.saude, desc: 'Recupera a receita perdida com faltas em clínicas, com API e painel.', chips: ['Node.js', 'API REST', 'Testes', 'Docker'] },
  { id: 'vendoraudit', repo: 'vendoraudit-compliance-portal', title: 'VendorAudit', kicker: 'COMPLIANCE', accent: accent.compliance, desc: 'Risco de fornecedores, renovações, documentos e SLA.', chips: ['Node.js', 'Testes', 'Docker'] },
  { id: 'helpdesk', repo: 'helpdesk-node-fullstack', title: 'Helpdesk', kicker: 'SUPORTE', accent: accent.suporte, desc: 'Suporte com API REST, painel web, risco de SLA e testes.', chips: ['Node.js', 'API REST', 'Testes', 'Docker'] },
  { id: 'erp', repo: 'erp-estoque-node', title: 'ERP Estoque', kicker: 'ESTOQUE', accent: accent.estoque, desc: 'Estoque com API, painel web e reposição inteligente, com testes.', chips: ['Node.js', 'API REST', 'Testes', 'Docker'] },
  { id: 'encurtador', repo: 'encurtador-url-node', title: 'Encurtador de URL', kicker: 'LINKS E CAMPANHAS', accent: accent.links, desc: 'Links curtos com painel e análise de campanhas, com testes.', chips: ['Node.js', 'Testes', 'Docker'] },
  { id: 'taskflow', repo: 'devops-atividade', title: 'TaskFlow', kicker: 'DEVOPS', accent: accent.devops, desc: 'CRUD em contêiner com deploy automático pelo GitHub Actions.', chips: ['Node.js', 'Docker Compose', 'GitHub Actions'] },
  { id: 'vendas', repo: 'dashboard-vendas-pro', title: 'Dashboard Vendas Pro', kicker: 'PAINEL COMERCIAL', accent: accent.front, desc: 'KPIs, filtros, metas, gráficos, tema e exportação CSV.', chips: ['JavaScript', 'HTML', 'CSS'] },
  { id: 'crm', repo: 'crm-pipeline-js', title: 'CRM Pipeline', kicker: 'VENDAS', accent: accent.marketing, desc: 'Funil de vendas, previsão, acompanhamentos e exportação CSV.', chips: ['JavaScript', 'HTML', 'CSS'] },
  { id: 'planner', repo: 'planner-pro-js', title: 'Planner Pro', kicker: 'PRODUTIVIDADE', accent: accent.posvenda, desc: 'Kanban com arrastar e soltar, linha do tempo, capacidade e métricas.', chips: ['JavaScript', 'HTML', 'CSS'] },
  { id: 'kanban', repo: 'kanban-board', title: 'Kanban Board', kicker: 'PRODUTIVIDADE', accent: accent.financas, desc: 'Quadro Kanban responsivo com arrastar e soltar e dados locais.', chips: ['JavaScript', 'HTML', 'CSS'] },
];

for (const p of projects) {
  const status = p.demo ? 'demo' : 'código';
  const sw = Math.round(status.length * 7.6 + (p.demo ? 40 : 26));
  const sx = 420 - 24 - sw;
  const body = `
<defs>${cardDefs('card')}<clipPath id="clip"><rect width="420" height="236" rx="20"/></clipPath></defs>
<g clip-path="url(#clip)">
  <rect width="420" height="236" fill="url(#card)"/>
  ${rings(410, 0, 40, 200, 26, 0.06)}
  <rect x="0" y="28" width="4" height="64" rx="2" fill="${p.accent}"/>
</g>
<rect x="1" y="1" width="418" height="234" rx="19" fill="none" stroke="${color.line}"/>
<text class="mono" x="28" y="46" font-size="12" font-weight="700" letter-spacing="2.5" fill="${p.accent}">${esc(p.kicker)}</text>
<g><rect x="${sx}" y="26" width="${sw}" height="26" rx="13" fill="${p.demo ? '#3ee0a0' : '#ffffff'}" fill-opacity="${p.demo ? 0.14 : 0.07}" stroke="${p.demo ? '#3ee0a0' : '#ffffff'}" stroke-opacity="${p.demo ? 0.5 : 0.18}"/>
${p.demo ? `<circle cx="${sx + 15}" cy="39" r="4" fill="#3ee0a0"/><circle class="pulse" cx="${sx + 15}" cy="39" r="4" fill="#3ee0a0"/>` : ''}
<text class="mono" x="${sx + (p.demo ? 26 : 13)}" y="43.5" font-size="12" font-weight="700" fill="${p.demo ? '#3ee0a0' : '#dfe4ff'}">${status}</text></g>
<text class="sans" x="28" y="92" font-size="28" font-weight="800" letter-spacing="-.5" fill="#ffffff">${esc(p.title)}</text>
<text class="sans" font-size="16" fill="${color.muted}">${lines(wrap(p.desc, 44).slice(0, 2), 28, 124, 23)}</text>
${chips(p.chips, 28, 180, { size: 12, height: 26 }).svg}
`;
  save(`card-${p.id}.svg`, svg(420, 236, `${p.title} · ${p.kicker.toLowerCase()} · ${p.desc}${p.demo ? ' · com demonstração' : ''}`, body));
}

// ---------------- Como trabalho ----------------
const steps = [
  ['Entender o fluxo', 'Mapeio o processo real, quem participa e onde ele trava.'],
  ['Modelar as regras', 'Regras de negócio em funções puras, cobertas por testes.'],
  ['Construir interface e API', 'Telas responsivas e API com validação dos dados.'],
  ['Testar o que é crítico', 'Cenários críticos testados antes de cada entrega.'],
];
function process(mobile) {
  const w = mobile ? 720 : 1280, h = mobile ? 760 : 330;
  const pos = (i) => (mobile ? { x: 88, y: 96 + i * 170 } : { x: 160 + i * 320, y: 84 });
  const first = pos(0), last = pos(3);
  const connector = mobile
    ? `<line x1="${first.x}" y1="${first.y + 36}" x2="${last.x}" y2="${last.y - 36}" stroke="${color.lime}" stroke-opacity=".25" stroke-width="2"/><line class="flow" x1="${first.x}" y1="${first.y + 36}" x2="${last.x}" y2="${last.y - 36}" stroke="${color.lime}" stroke-width="2" stroke-dasharray="6 12"/>`
    : `<line x1="${first.x + 36}" y1="${first.y}" x2="${last.x - 36}" y2="${last.y}" stroke="${color.lime}" stroke-opacity=".25" stroke-width="2"/><line class="flow" x1="${first.x + 36}" y1="${first.y}" x2="${last.x - 36}" y2="${last.y}" stroke="${color.lime}" stroke-width="2" stroke-dasharray="6 12"/>`;
  const items = steps.map(([title, desc], i) => {
    const { x, y } = pos(i);
    const text = mobile
      ? `<text class="sans" x="${x + 64}" y="${y - 6}" font-size="25" font-weight="700" fill="#ffffff">${esc(title)}</text>
<text class="sans" font-size="18" fill="${color.muted}">${lines(wrap(desc, 40), x + 64, y + 26, 26)}</text>`
      : `<text class="sans" x="${x}" y="${y + 86}" font-size="24" font-weight="700" fill="#ffffff" text-anchor="middle">${esc(title)}</text>
<text class="sans" font-size="20" fill="${color.muted}" text-anchor="middle">${lines(wrap(desc, 26), x, y + 124, 28)}</text>`;
    return `<circle class="glow g${i}" cx="${x}" cy="${y}" r="34" fill="${color.lime}" fill-opacity=".25"/>
<circle cx="${x}" cy="${y}" r="34" fill="#141f55" stroke="${color.lime}" stroke-width="2"/>
<text class="mono" x="${x}" y="${y + 7}" font-size="20" font-weight="700" fill="${color.lime}" text-anchor="middle">0${i + 1}</text>
${text}`;
  }).join('\n');
  const body = `
<defs>${cardDefs('card')}</defs>
<rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="27" fill="url(#card)" stroke="${color.line}"/>
${connector}
${items}
`;
  const css = `
  .flow{animation:flow 1.4s linear infinite}
  @keyframes flow{to{stroke-dashoffset:-36}}
  .glow{transform-box:fill-box;transform-origin:center;opacity:0;animation:glow 6s ease-out infinite}
  .g1{animation-delay:1.5s}.g2{animation-delay:3s}.g3{animation-delay:4.5s}
  @keyframes glow{0%{opacity:.9;transform:scale(1)}25%{opacity:0;transform:scale(1.9)}100%{opacity:0}}
`;
  return svg(w, h, 'Como trabalho: ' + steps.map(([t, d]) => `${t}. ${d}`).join(' '), body, css);
}
save('processo.svg', process(false));
save('processo-mobile.svg', process(true));

// ---------------- Contato ----------------
function contact(mobile) {
  const w = mobile ? 720 : 1280, h = mobile ? 420 : 260;
  const x = mobile ? 48 : 64;
  const btn = mobile ? { x: 48, y: 320, w: 300 } : { x: 960, y: 98, w: 256 };
  const title = mobile
    ? `<text class="sans" font-size="40" font-weight="800" letter-spacing="-1" fill="#ffffff">${lines(['Tem um processo que', 'precisa de sistema?'], x, 142, 50)}</text>`
    : `<text class="sans" x="${x}" y="146" font-size="40" font-weight="800" letter-spacing="-1" fill="#ffffff">Tem um processo que precisa de sistema?</text>`;
  const body = `
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#16239a"/><stop offset="1" stop-color="#2d4af0"/></linearGradient>
  <linearGradient id="edge" x1="0" y1="0" x2="1" y2="0" gradientTransform="rotate(0 .5 .5)">
    <stop offset="0" stop-color="${color.lime}"/><stop offset=".35" stop-color="${color.lime}" stop-opacity="0"/><stop offset=".65" stop-color="#7d93ff" stop-opacity="0"/><stop offset="1" stop-color="#7d93ff"/>
    <animateTransform attributeName="gradientTransform" type="rotate" from="0 .5 .5" to="360 .5 .5" dur="8s" repeatCount="indefinite"/>
  </linearGradient>
  <clipPath id="clip"><rect width="${w}" height="${h}" rx="28"/></clipPath>
</defs>
<g clip-path="url(#clip)">
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  ${rings(w - 60, h, 60, 320, 32, 0.08)}
</g>
<rect x="1.5" y="1.5" width="${w - 3}" height="${h - 3}" rx="27" fill="none" stroke="url(#edge)" stroke-width="3"/>
<text class="mono" x="${x}" y="${mobile ? 74 : 80}" font-size="14" font-weight="700" letter-spacing="3" fill="${color.lime}">CONTATO</text>
${title}
<text class="sans" font-size="${mobile ? 19 : 21}" fill="#dbe2ff">${lines(mobile ? ['Clique para abrir uma proposta no GitHub', 'e conte como o processo funciona hoje.'] : ['Clique para abrir uma proposta no GitHub e conte como o processo funciona hoje.'], x, mobile ? 252 : 196, 28)}</text>
<rect class="pulse-btn" x="${btn.x}" y="${btn.y}" width="${btn.w}" height="60" rx="30" fill="${color.lime}" fill-opacity=".35"/>
<rect x="${btn.x}" y="${btn.y}" width="${btn.w}" height="60" rx="30" fill="${color.lime}"/>
<text class="sans" x="${btn.x + btn.w / 2}" y="${btn.y + 38}" font-size="21" font-weight="800" fill="#0a1033" text-anchor="middle">Abrir proposta ↗</text>
`;
  const css = `
  .pulse-btn{transform-box:fill-box;transform-origin:center;animation:btn 2.6s ease-out infinite}
  @keyframes btn{0%{transform:scale(1);opacity:.8}100%{transform:scale(1.18,1.5);opacity:0}}
  @media (prefers-reduced-motion: reduce){.pulse-btn{animation:none;opacity:0}}
`;
  return svg(w, h, 'Contato: tem um processo que precisa de sistema? Clique para abrir uma proposta no GitHub.', body, css);
}
save('contato.svg', contact(false));
