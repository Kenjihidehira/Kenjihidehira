import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const assetsDir = resolve(here, "..", "assets");

const colors = {
  background: "#060A12",
  surface: "#0D1420",
  surfaceAlt: "#111B2A",
  border: "#263651",
  grid: "#152238",
  text: "#F4F7FF",
  muted: "#A7B4C9",
  quiet: "#687994",
  green: "#39E6B0",
  blue: "#7197FF",
  yellow: "#FFC857",
  coral: "#FF705C",
  cyan: "#42D8FF",
};

const projects = [
  {
    id: "01",
    title: "PATRIMÔNIO OPS",
    domain: "GESTÃO PATRIMONIAL",
    summary: "CONTROLE / CUSTÓDIA / AUDITORIA",
    accent: colors.yellow,
    status: "PROJETO PRINCIPAL",
    problem: ["Inventário, custódia e auditoria", "fragmentados entre núcleos."],
    delivery: ["Rastreabilidade ponta a ponta", "com controle de acesso e histórico."],
    flow: ["AUTENTICAÇÃO", "INVENTÁRIO", "OPERAÇÃO", "AUDITORIA"],
    evidence: [
      ["v0.10.0", "RELEASE"],
      ["153", "TESTES"],
      ["PASS", "CI"],
    ],
    stack: ["NEXT.JS 16", "REACT 19", "TYPESCRIPT", "SUPABASE", "PLPGSQL", "VERCEL"],
  },
  {
    id: "02",
    title: "COBREFLOW",
    domain: "OPERAÇÕES FINANCEIRAS",
    summary: "RECEBÍVEIS / RISCO / CONCILIAÇÃO",
    accent: colors.coral,
    status: "DEMO COMERCIAL",
    problem: ["Recebíveis e cobranças sem", "prioridade ou conciliação única."],
    delivery: ["Carteira com risco, automações", "e visão rápida do caixa."],
    flow: ["CARTEIRA", "RISCO", "COBRANÇA", "CONCILIAÇÃO"],
    evidence: [
      ["ONLINE", "DEMO"],
      ["PASS", "CI"],
      ["D1", "DADOS"],
    ],
    stack: ["NODE NATIVO", "JAVASCRIPT", "TYPESCRIPT", "VINEXT", "D1", "DOCKER"],
  },
  {
    id: "03",
    title: "FIELDOPS",
    domain: "SERVIÇOS DE CAMPO",
    summary: "MARGEM / CAMPO / FATURAMENTO",
    accent: colors.green,
    status: "DEMO COMERCIAL",
    problem: ["Custos, equipes, materiais e SLA", "ocultam a margem real do projeto."],
    delivery: ["Torre de controle para margem,", "execução e prontidão de faturamento."],
    flow: ["PROJETO", "ORDEM", "CUSTO", "FATURAMENTO"],
    evidence: [
      ["ONLINE", "DEMO"],
      ["PASS", "CI"],
      ["D1", "DADOS"],
    ],
    stack: ["PHP 8.2", "TYPESCRIPT", "API REST", "VINEXT", "D1", "DOCKER"],
  },
  {
    id: "04",
    title: "LEADOPS",
    domain: "MARKETING E VENDAS",
    summary: "CAMPANHAS / SCORE / ROI",
    accent: colors.yellow,
    status: "DEMO COMERCIAL",
    problem: ["Investimento em campanhas sem", "atribuição e prioridade comercial."],
    delivery: ["ROI, scoring e funil ponderado", "para orientar verba e atendimento."],
    flow: ["CAMPANHA", "LEAD", "SCORE", "ROI"],
    evidence: [
      ["ONLINE", "DEMO"],
      ["PASS", "CI"],
      ["D1", "DADOS"],
    ],
    stack: ["NODE NATIVO", "JAVASCRIPT", "TYPESCRIPT", "VINEXT", "D1", "DOCKER"],
  },
  {
    id: "05",
    title: "RETURNOPS",
    domain: "PÓS-VENDA E RMA",
    summary: "RMA / SLA / REPOSIÇÃO",
    accent: colors.blue,
    status: "DEMO COMERCIAL",
    problem: ["Devoluções dispersas atrasam", "reembolso, SLA e retorno ao estoque."],
    delivery: ["Fila priorizada, playbooks e", "exposição financeira por caso."],
    flow: ["SOLICITAÇÃO", "TRIAGEM", "RMA", "REPOSIÇÃO"],
    evidence: [
      ["ONLINE", "DEMO"],
      ["PASS", "CI"],
      ["D1", "DADOS"],
    ],
    stack: ["NODE NATIVO", "JAVASCRIPT", "TYPESCRIPT", "VINEXT", "D1", "DOCKER"],
  },
  {
    id: "06",
    title: "SERVICEHUB",
    domain: "AGENDA E CRM",
    summary: "AGENDA / FUNIL / COBRANÇA",
    accent: colors.green,
    status: "DEMO COMERCIAL",
    problem: ["Agenda, vendas e cobranças", "desconectadas reduzem receita."],
    delivery: ["CRM operacional com funil,", "ocupação, ROI e lembretes."],
    flow: ["LEAD", "AGENDA", "SERVIÇO", "COBRANÇA"],
    evidence: [
      ["ONLINE", "DEMO"],
      ["PASS", "CI"],
      ["D1", "DADOS"],
    ],
    stack: ["NODE NATIVO", "JAVASCRIPT", "TYPESCRIPT", "VINEXT", "D1", "DOCKER"],
  },
];

function xml(value) {
  let result = "";
  for (const character of String(value)) {
    if (character === "&") result += "&amp;";
    else if (character === "<") result += "&lt;";
    else if (character === ">") result += "&gt;";
    else if (character === '"') result += "&quot;";
    else if (character === "'") result += "&apos;";
    else if (character.codePointAt(0) > 127) result += `&#${character.codePointAt(0)};`;
    else result += character;
  }
  return result;
}

function text({ x, y, value, fill = colors.text, size = 12, weight = 700, mono = false, anchor = "start" }) {
  const family = mono
    ? "Consolas, Cascadia Mono, Segoe UI, monospace"
    : "Inter, Segoe UI, Arial, sans-serif";
  return `<text x="${x}" y="${y}" fill="${fill}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${xml(value)}</text>`;
}

function rect({ x, y, width, height, fill = colors.surface, stroke = colors.border, radius = 6, strokeWidth = 1 }) {
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
}

function visualDefs(accent) {
  return `<defs>
    <linearGradient id="background" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#070C15"/>
      <stop offset="0.55" stop-color="#09111D"/>
      <stop offset="1" stop-color="#050810"/>
    </linearGradient>
    <linearGradient id="panel" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#111B2B"/>
      <stop offset="1" stop-color="#0A111D"/>
    </linearGradient>
    <linearGradient id="chip" x1="0" y1="0" x2="1" y2="0">
      <stop stop-color="${accent}" stop-opacity="0.16"/>
      <stop offset="1" stop-color="#111B2A" stop-opacity="0.92"/>
    </linearGradient>
    <linearGradient id="accent-line" x1="0" y1="0" x2="1" y2="0">
      <stop stop-color="${accent}" stop-opacity="0"/>
      <stop offset="0.18" stop-color="${accent}"/>
      <stop offset="0.78" stop-color="${colors.cyan}"/>
      <stop offset="1" stop-color="${colors.cyan}" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="accent-glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(0 0) rotate(34) scale(620 360)">
      <stop stop-color="${accent}" stop-opacity="0.18"/>
      <stop offset="0.58" stop-color="${accent}" stop-opacity="0.04"/>
      <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="micro-grid" width="28" height="28" patternUnits="userSpaceOnUse">
      <path d="M28 0H0V28" fill="none" stroke="${colors.grid}" stroke-width="0.7"/>
      <circle cx="1" cy="1" r="0.8" fill="${colors.quiet}" fill-opacity="0.32"/>
    </pattern>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="150%">
      <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000000" flood-opacity="0.42"/>
    </filter>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="2.4" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>`;
}

function backdrop(width, height, accent) {
  return `${visualDefs(accent)}
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="12" fill="url(#background)" stroke="${colors.border}" stroke-width="2"/>
  <rect x="2" y="2" width="${width - 4}" height="${height - 4}" rx="11" fill="url(#micro-grid)" opacity="0.62"/>
  <rect x="2" y="2" width="${width - 4}" height="${height - 4}" rx="11" fill="url(#accent-glow)"/>
  <rect x="22" y="1" width="${width - 44}" height="3" rx="1.5" fill="url(#accent-line)" filter="url(#glow)"/>
  <path d="M18 26V16H28M${width - 18} 26V16H${width - 28}M18 ${height - 26}V${height - 16}H28M${width - 18} ${height - 26}V${height - 16}H${width - 28}" stroke="${accent}" stroke-opacity="0.58" stroke-width="1.2"/>
  <circle cx="${width - 24}" cy="${height - 22}" r="2.5" fill="${accent}" filter="url(#glow)"/>`;
}

function chip(label, x, y, accent, compact = false) {
  const width = Math.max(compact ? 58 : 70, label.length * (compact ? 5.05 : 5.9) + (compact ? 27 : 34));
  const height = compact ? 23 : 28;
  return {
    width,
    svg: `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${height / 2}" fill="url(#chip)" stroke="${accent}" stroke-opacity="0.58"/>
      <circle cx="${x + (compact ? 10 : 12)}" cy="${y + height / 2}" r="${compact ? 2.5 : 3}" fill="${accent}" filter="url(#glow)"/>
      ${text({ x: x + (compact ? 18 : 22), y: y + (compact ? 15.5 : 18.5), value: label, fill: colors.text, size: compact ? 7.8 : 9, weight: 850, mono: true })}`,
  };
}

function desktopDetail(project) {
  const flowWidth = 70;
  const flowGap = 18;
  const flowStart = 308;
  const flow = project.flow
    .map((step, index) => {
      const x = flowStart + index * (flowWidth + flowGap);
      const arrow = index < project.flow.length - 1
        ? `<path d="M${x + flowWidth + 4} 177H${x + flowWidth + 14}" stroke="${project.accent}" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M${x + flowWidth + 11} 173L${x + flowWidth + 15} 177L${x + flowWidth + 11} 181" stroke="${project.accent}" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
        : "";
      return `<rect x="${x}" y="151" width="${flowWidth}" height="54" rx="7" fill="url(#chip)" stroke="${index === project.flow.length - 1 ? project.accent : colors.border}" stroke-opacity="${index === project.flow.length - 1 ? 0.92 : 1}"/>
        <circle cx="${x + 13}" cy="165" r="7" fill="${project.accent}" fill-opacity="0.18" stroke="${project.accent}" stroke-opacity="0.6"/>
        ${text({ x: x + 13, y: 168, value: String(index + 1).padStart(2, "0"), fill: project.accent, size: 6.5, weight: 900, mono: true, anchor: "middle" })}
        ${text({ x: x + flowWidth / 2, y: 190, value: step, fill: index === project.flow.length - 1 ? project.accent : colors.text, size: 7.3, weight: 850, mono: true, anchor: "middle" })}${arrow}`;
    })
    .join("");

  const evidence = project.evidence
    .map(([value, label], index) => {
      const x = 678 + index * 62;
      const valueSize = value.length > 5 ? 8.6 : 11;
      return `<rect x="${x}" y="152" width="56" height="58" rx="7" fill="url(#chip)" stroke="${project.accent}" stroke-opacity="${index === 0 ? 0.7 : 0.34}"/>
        ${text({ x: x + 28, y: 178, value, fill: index === 0 ? project.accent : colors.text, size: valueSize, weight: 950, mono: true, anchor: "middle" })}
        ${text({ x: x + 28, y: 198, value: label, fill: colors.muted, size: 7, weight: 800, mono: true, anchor: "middle" })}`;
    })
    .join("");

  let chipX = 42;
  const chips = project.stack
    .map((label) => {
      const current = chip(label, chipX, 287, project.accent);
      chipX += current.width + 9;
      return current.svg;
    })
    .join("");

  const statusWidth = project.status === "PROJETO PRINCIPAL" ? 158 : 146;
  const statusX = 876 - statusWidth;

  return `<svg width="900" height="350" viewBox="0 0 900 350" fill="none" xmlns="http://www.w3.org/2000/svg">
  <style>text{letter-spacing:0}</style>
  ${backdrop(900, 350, project.accent)}
  ${text({ x: 26, y: 31, value: `${project.id} / FICHA DE SISTEMA`, fill: project.accent, size: 10.5, weight: 900, mono: true })}
  <rect x="${statusX}" y="15" width="${statusWidth}" height="26" rx="13" fill="url(#chip)" stroke="${project.accent}" stroke-opacity="0.5"/>
  <circle cx="${statusX + 14}" cy="28" r="3.5" fill="${colors.green}" filter="url(#glow)"/>
  ${text({ x: statusX + 26, y: 32, value: project.status, fill: colors.text, size: 8.5, weight: 850, mono: true })}
  <path d="M24 50H876" stroke="${colors.border}"/>
  ${text({ x: 26, y: 83, value: project.title, size: 29, weight: 950 })}
  ${text({ x: 874, y: 80, value: project.domain, fill: colors.muted, size: 10.5, weight: 850, mono: true, anchor: "end" })}

  <rect x="24" y="102" width="258" height="136" rx="9" fill="url(#panel)" stroke="${colors.border}" filter="url(#shadow)"/>
  <rect x="24" y="102" width="5" height="136" rx="2.5" fill="${project.accent}"/>
  ${text({ x: 42, y: 127, value: "PROBLEMA", fill: project.accent, size: 9, weight: 900, mono: true })}
  ${text({ x: 42, y: 151, value: project.problem[0], size: 12.2, weight: 820 })}
  ${text({ x: 42, y: 170, value: project.problem[1], size: 12.2, weight: 820 })}
  <path d="M42 184H264" stroke="${colors.border}"/>
  ${text({ x: 42, y: 202, value: "ENTREGA", fill: colors.quiet, size: 7.5, weight: 850, mono: true })}
  ${text({ x: 42, y: 220, value: project.delivery[0], fill: colors.muted, size: 10.2, weight: 680 })}
  ${text({ x: 42, y: 234, value: project.delivery[1], fill: colors.muted, size: 10.2, weight: 680 })}

  <rect x="296" y="102" width="354" height="136" rx="9" fill="url(#panel)" stroke="${colors.border}" filter="url(#shadow)"/>
  ${text({ x: 312, y: 127, value: "FLUXO OPERACIONAL", fill: project.accent, size: 9, weight: 900, mono: true })}
  <path d="M322 177H626" stroke="${project.accent}" stroke-opacity="0.2" stroke-width="2"/>
  ${flow}

  <rect x="664" y="102" width="212" height="136" rx="9" fill="url(#panel)" stroke="${colors.border}" filter="url(#shadow)"/>
  ${text({ x: 680, y: 127, value: "EVIDÊNCIAS", fill: project.accent, size: 9, weight: 900, mono: true })}
  ${evidence}

  <rect x="24" y="252" width="852" height="76" rx="9" fill="url(#panel)" stroke="${colors.border}" filter="url(#shadow)"/>
  ${text({ x: 42, y: 274, value: "ARQUITETURA E ENTREGA", fill: colors.muted, size: 8.2, weight: 850, mono: true })}
  ${chips}
  </svg>`;
}

function mobileDetail(project) {
  const flowWidth = 64;
  const flowGap = 16;
  const flowStart = 24;
  const flow = project.flow
    .map((step, index) => {
      const x = flowStart + index * (flowWidth + flowGap);
      const arrow = index < project.flow.length - 1
        ? `<path d="M${x + flowWidth + 3} 341H${x + flowWidth + 12}" stroke="${project.accent}" stroke-width="1.2"/>
          <path d="M${x + flowWidth + 9} 338L${x + flowWidth + 13} 341L${x + flowWidth + 9} 344" stroke="${project.accent}" stroke-width="1.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
        : "";
      return `<rect x="${x}" y="318" width="${flowWidth}" height="48" rx="7" fill="url(#chip)" stroke="${index === 3 ? project.accent : colors.border}"/>
        <circle cx="${x + 12}" cy="330" r="6" fill="${project.accent}" fill-opacity="0.18" stroke="${project.accent}" stroke-opacity="0.62"/>
        ${text({ x: x + 12, y: 333, value: String(index + 1).padStart(2, "0"), fill: project.accent, size: 5.8, weight: 900, mono: true, anchor: "middle" })}
        ${text({ x: x + flowWidth / 2, y: 356, value: step, fill: index === 3 ? project.accent : colors.text, size: 6.5, weight: 850, mono: true, anchor: "middle" })}${arrow}`;
    })
    .join("");

  const evidence = project.evidence
    .map(([value, label], index) => {
      const x = 26 + index * 106;
      const valueSize = value.length > 5 ? 9.4 : 12;
      return `<rect x="${x}" y="425" width="96" height="48" rx="7" fill="url(#chip)" stroke="${project.accent}" stroke-opacity="${index === 0 ? 0.7 : 0.32}"/>
        ${text({ x: x + 48, y: 447, value, fill: index === 0 ? project.accent : colors.text, size: valueSize, weight: 950, mono: true, anchor: "middle" })}
        ${text({ x: x + 48, y: 463, value: label, fill: colors.muted, size: 7, weight: 800, mono: true, anchor: "middle" })}`;
    })
    .join("");

  let chipX = 26;
  let chipY = 527;
  const chips = project.stack
    .map((label) => {
      let current = chip(label, chipX, chipY, project.accent, true);
      if (chipX + current.width > 336) {
        chipX = 26;
        chipY += 29;
        current = chip(label, chipX, chipY, project.accent, true);
      }
      chipX += current.width + 7;
      return current.svg;
    })
    .join("");

  const statusWidth = project.status === "PROJETO PRINCIPAL" ? 135 : 126;
  const statusX = 342 - statusWidth;

  return `<svg width="360" height="598" viewBox="0 0 360 598" fill="none" xmlns="http://www.w3.org/2000/svg">
  <style>text{letter-spacing:0}</style>
  ${backdrop(360, 598, project.accent)}
  ${text({ x: 18, y: 30, value: `${project.id} / FICHA DE SISTEMA`, fill: project.accent, size: 8.5, weight: 900, mono: true })}
  <rect x="${statusX}" y="14" width="${statusWidth}" height="25" rx="12.5" fill="url(#chip)" stroke="${project.accent}" stroke-opacity="0.5"/>
  <circle cx="${statusX + 12}" cy="26.5" r="3" fill="${colors.green}" filter="url(#glow)"/>
  ${text({ x: statusX + 22, y: 30, value: project.status, fill: colors.text, size: 7.1, weight: 850, mono: true })}
  <path d="M18 48H342" stroke="${colors.border}"/>
  ${text({ x: 18, y: 82, value: project.title, size: 23.5, weight: 950 })}
  ${text({ x: 18, y: 104, value: project.domain, fill: colors.muted, size: 8.7, weight: 850, mono: true })}

  <rect x="16" y="119" width="328" height="146" rx="9" fill="url(#panel)" stroke="${colors.border}" filter="url(#shadow)"/>
  <rect x="16" y="119" width="5" height="146" rx="2.5" fill="${project.accent}"/>
  ${text({ x: 30, y: 143, value: "PROBLEMA", fill: project.accent, size: 8.5, weight: 900, mono: true })}
  ${text({ x: 30, y: 169, value: project.problem[0], size: 12.2, weight: 820 })}
  ${text({ x: 30, y: 189, value: project.problem[1], size: 12.2, weight: 820 })}
  <path d="M30 203H332" stroke="${colors.border}"/>
  ${text({ x: 30, y: 222, value: "ENTREGA", fill: colors.quiet, size: 7.3, weight: 850, mono: true })}
  ${text({ x: 30, y: 241, value: project.delivery[0], fill: colors.muted, size: 10.2, weight: 680 })}
  ${text({ x: 30, y: 257, value: project.delivery[1], fill: colors.muted, size: 10.2, weight: 680 })}

  <rect x="16" y="278" width="328" height="102" rx="9" fill="url(#panel)" stroke="${colors.border}" filter="url(#shadow)"/>
  ${text({ x: 28, y: 303, value: "FLUXO OPERACIONAL", fill: project.accent, size: 8.5, weight: 900, mono: true })}
  <path d="M36 341H326" stroke="${project.accent}" stroke-opacity="0.2" stroke-width="2"/>
  ${flow}

  <rect x="16" y="392" width="328" height="93" rx="9" fill="url(#panel)" stroke="${colors.border}" filter="url(#shadow)"/>
  ${text({ x: 28, y: 415, value: "EVIDÊNCIAS", fill: project.accent, size: 8.5, weight: 900, mono: true })}
  ${evidence}

  <rect x="16" y="497" width="328" height="84" rx="9" fill="url(#panel)" stroke="${colors.border}" filter="url(#shadow)"/>
  ${text({ x: 28, y: 518, value: "ARQUITETURA E ENTREGA", fill: colors.muted, size: 7.8, weight: 850, mono: true })}
  ${chips}
  </svg>`;
}

const matrixRows = [
  ["PATRIMÔNIO OPS", "PATRIMÔNIO", "NEXT / REST", "SUPABASE", "PASS", "ONLINE"],
  ["COBREFLOW", "FINANCEIRO", "NODE / REST", "D1", "PASS", "ONLINE"],
  ["FIELDOPS", "CAMPO", "PHP / REST", "D1", "PASS", "ONLINE"],
  ["LEADOPS", "MARKETING", "NODE / REST", "D1", "PASS", "ONLINE"],
  ["RETURNOPS", "PÓS-VENDA", "NODE / REST", "D1", "PASS", "ONLINE"],
  ["SERVICEHUB", "SERVIÇOS", "NODE / REST", "D1", "PASS", "ONLINE"],
];

function desktopMatrix() {
  const kpis = [
    ["06 / 06", "DEMOS ONLINE", colors.green],
    ["06 / 06", "CI APROVADO", colors.blue],
    ["06 / 06", "COM TYPESCRIPT", colors.yellow],
    ["05 / 06", "COM DOCKER", colors.coral],
  ]
    .map(([value, label, accent], index) => {
      const x = 24 + index * 216;
      return `<rect x="${x}" y="82" width="204" height="76" rx="9" fill="url(#panel)" stroke="${colors.border}" filter="url(#shadow)"/>
        <rect x="${x}" y="82" width="204" height="3" rx="1.5" fill="${accent}"/>
        <circle cx="${x + 176}" cy="108" r="13" fill="${accent}" fill-opacity="0.1" stroke="${accent}" stroke-opacity="0.36"/>
        <circle cx="${x + 176}" cy="108" r="3.2" fill="${accent}" filter="url(#glow)"/>
        ${text({ x: x + 18, y: 119, value, fill: accent, size: 22, weight: 950 })}
        ${text({ x: x + 18, y: 141, value: label, fill: colors.muted, size: 8.3, weight: 850, mono: true })}`;
    })
    .join("");

  const columns = [24, 270, 410, 545, 660, 750];
  const rows = matrixRows
    .map((row, index) => {
      const y = 217 + index * 40;
      const accent = projects[index].accent;
      return `<rect x="24" y="${y}" width="852" height="35" rx="6" fill="${index % 2 === 0 ? "#0D1624" : "#101A2A"}" stroke="${colors.border}"/>
        <rect x="24" y="${y}" width="5" height="35" rx="2.5" fill="${accent}"/>
        ${text({ x: columns[0] + 14, y: y + 23, value: row[0], fill: colors.text, size: 10.3, weight: 900 })}
        ${text({ x: columns[1], y: y + 23, value: row[1], fill: colors.muted, size: 8.7, weight: 800, mono: true })}
        ${text({ x: columns[2], y: y + 23, value: row[2], fill: colors.text, size: 8.8, weight: 800, mono: true })}
        ${text({ x: columns[3], y: y + 23, value: row[3], fill: colors.text, size: 8.8, weight: 800, mono: true })}
        <rect x="650" y="${y + 8}" width="66" height="19" rx="9.5" fill="${colors.green}" fill-opacity="0.12" stroke="${colors.green}" stroke-opacity="0.48"/>
        <circle cx="661" cy="${y + 17.5}" r="2.6" fill="${colors.green}"/>
        ${text({ x: 669, y: y + 20.5, value: row[4], fill: colors.green, size: 7.6, weight: 900, mono: true })}
        <rect x="742" y="${y + 8}" width="112" height="19" rx="9.5" fill="${colors.green}" fill-opacity="0.12" stroke="${colors.green}" stroke-opacity="0.48"/>
        <circle cx="754" cy="${y + 17.5}" r="2.6" fill="${colors.green}" filter="url(#glow)"/>
        ${text({ x: 763, y: y + 20.5, value: row[5], fill: colors.green, size: 7.6, weight: 900, mono: true })}`;
    })
    .join("");

  return `<svg width="900" height="490" viewBox="0 0 900 490" fill="none" xmlns="http://www.w3.org/2000/svg">
  <style>text{letter-spacing:0}</style>
  ${backdrop(900, 490, colors.blue)}
  ${text({ x: 26, y: 30, value: "PORTFÓLIO / MATRIZ DE ENTREGA", fill: colors.blue, size: 10.5, weight: 900, mono: true })}
  <rect x="707" y="15" width="169" height="26" rx="13" fill="url(#chip)" stroke="${colors.green}" stroke-opacity="0.45"/>
  <circle cx="722" cy="28" r="3.5" fill="${colors.green}" filter="url(#glow)"/>
  ${text({ x: 734, y: 32, value: "PORTFÓLIO VERIFICADO", fill: colors.text, size: 8, weight: 850, mono: true })}
  ${text({ x: 26, y: 63, value: "Seis sistemas. Evidências comparáveis.", size: 21, weight: 950 })}
  ${kpis}
  <rect x="24" y="177" width="852" height="31" rx="6" fill="url(#panel)" stroke="${colors.border}"/>
  ${text({ x: 38, y: 198, value: "PROJETO", fill: colors.quiet, size: 8.3, weight: 900, mono: true })}
  ${text({ x: 270, y: 198, value: "DOMÍNIO", fill: colors.quiet, size: 8.3, weight: 900, mono: true })}
  ${text({ x: 410, y: 198, value: "API", fill: colors.quiet, size: 8.3, weight: 900, mono: true })}
  ${text({ x: 545, y: 198, value: "DADOS", fill: colors.quiet, size: 8.3, weight: 900, mono: true })}
  ${text({ x: 660, y: 198, value: "CI", fill: colors.quiet, size: 8.3, weight: 900, mono: true })}
  ${text({ x: 750, y: 198, value: "DEMO", fill: colors.quiet, size: 8.3, weight: 900, mono: true })}
  ${rows}
  ${text({ x: 26, y: 476, value: "LEITURA ATUAL: APIs DOCUMENTADAS / PERSISTÊNCIA ISOLADA / PIPELINES VERIFICADOS", fill: colors.quiet, size: 8.2, weight: 800, mono: true })}
  </svg>`;
}

function mobileMatrix() {
  const kpis = [
    ["06/06", "DEMOS", colors.green],
    ["06/06", "CI", colors.blue],
    ["06/06", "TYPESCRIPT", colors.yellow],
    ["05/06", "DOCKER", colors.coral],
  ]
    .map(([value, label, accent], index) => {
      const column = index % 2;
      const row = Math.floor(index / 2);
      const x = 16 + column * 166;
      const y = 88 + row * 67;
      return `<rect x="${x}" y="${y}" width="156" height="58" rx="8" fill="url(#panel)" stroke="${colors.border}" filter="url(#shadow)"/>
        <rect x="${x}" y="${y}" width="156" height="3" rx="1.5" fill="${accent}"/>
        <circle cx="${x + 133}" cy="${y + 20}" r="8" fill="${accent}" fill-opacity="0.1" stroke="${accent}" stroke-opacity="0.38"/>
        <circle cx="${x + 133}" cy="${y + 20}" r="2.4" fill="${accent}" filter="url(#glow)"/>
        ${text({ x: x + 14, y: y + 29, value, fill: accent, size: 17, weight: 950 })}
        ${text({ x: x + 14, y: y + 47, value: label, fill: colors.muted, size: 7.3, weight: 850, mono: true })}`;
    })
    .join("");

  const cards = matrixRows
    .map((row, index) => {
      const y = 252 + index * 74;
      const accent = projects[index].accent;
      return `<rect x="16" y="${y}" width="328" height="64" rx="8" fill="${index % 2 === 0 ? "#0D1624" : "#101A2A"}" stroke="${colors.border}" filter="url(#shadow)"/>
        <rect x="16" y="${y}" width="5" height="64" rx="2.5" fill="${accent}"/>
        ${text({ x: 30, y: y + 24, value: row[0], size: 12.6, weight: 950 })}
        ${text({ x: 330, y: y + 22, value: row[1], fill: colors.muted, size: 7.2, weight: 850, mono: true, anchor: "end" })}
        ${text({ x: 30, y: y + 48, value: `${row[2]}  /  ${row[3]}`, fill: colors.muted, size: 8, weight: 800, mono: true })}
        <rect x="244" y="${y + 35}" width="86" height="19" rx="9.5" fill="${colors.green}" fill-opacity="0.12" stroke="${colors.green}" stroke-opacity="0.48"/>
        <circle cx="255" cy="${y + 44.5}" r="2.6" fill="${colors.green}" filter="url(#glow)"/>
        ${text({ x: 263, y: y + 47.5, value: "CI PASS", fill: colors.green, size: 7.3, weight: 900, mono: true })}`;
    })
    .join("");

  return `<svg width="360" height="724" viewBox="0 0 360 724" fill="none" xmlns="http://www.w3.org/2000/svg">
  <style>text{letter-spacing:0}</style>
  ${backdrop(360, 724, colors.blue)}
  ${text({ x: 18, y: 29, value: "PORTFÓLIO / MATRIZ DE ENTREGA", fill: colors.blue, size: 8.8, weight: 900, mono: true })}
  <rect x="227" y="14" width="115" height="25" rx="12.5" fill="url(#chip)" stroke="${colors.green}" stroke-opacity="0.45"/>
  <circle cx="239" cy="26.5" r="3" fill="${colors.green}" filter="url(#glow)"/>
  ${text({ x: 249, y: 30, value: "VERIFICADO", fill: colors.text, size: 7.2, weight: 850, mono: true })}
  ${text({ x: 18, y: 65, value: "Seis sistemas. Evidências comparáveis.", size: 15.5, weight: 950 })}
  ${kpis}
  ${text({ x: 18, y: 238, value: "PROJETOS / ARQUITETURA / ESTADO", fill: colors.quiet, size: 8.2, weight: 850, mono: true })}
  ${cards}
  ${text({ x: 18, y: 711, value: "DADOS VERIFICADOS NOS REPOSITÓRIOS PÚBLICOS", fill: colors.quiet, size: 7.5, weight: 800, mono: true })}
  </svg>`;
}

function compactButton(width, label, marker, accent, primary = false) {
  const textColor = primary ? colors.background : colors.text;
  const markerColor = primary ? colors.background : accent;
  return `<svg width="${width}" height="48" viewBox="0 0 ${width} 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <style>text{letter-spacing:0}</style>
  ${visualDefs(accent)}
  <rect x="1" y="1" width="${width - 2}" height="46" rx="10" fill="${primary ? accent : "url(#panel)"}" stroke="${accent}" stroke-opacity="${primary ? 1 : 0.58}" stroke-width="2"/>
  <rect x="12" y="1" width="${width - 24}" height="2.5" rx="1.25" fill="url(#accent-line)"/>
  <circle cx="22" cy="24" r="10" fill="${primary ? colors.background : accent}" fill-opacity="${primary ? 0.14 : 0.13}" stroke="${markerColor}" stroke-opacity="0.65"/>
  ${text({ x: 22, y: 27.5, value: marker, fill: markerColor, size: 7.2, weight: 950, mono: true, anchor: "middle" })}
  ${text({ x: 41, y: 29, value: label, fill: textColor, size: 9.2, weight: 900, mono: true })}
  <path d="M${width - 21} 20L${width - 17} 24L${width - 21} 28" stroke="${markerColor}" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

function desktopToggle(project) {
  const statusLabel = project.id === "01" ? "PRINCIPAL" : "DEMO ONLINE";
  const statusWidth = project.id === "01" ? 112 : 122;
  const statusX = 682;
  return `<svg width="900" height="84" viewBox="0 0 900 84" fill="none" xmlns="http://www.w3.org/2000/svg">
  <style>text{letter-spacing:0}</style>
  ${visualDefs(project.accent)}
  <rect x="1" y="1" width="898" height="82" rx="11" fill="url(#background)" stroke="${colors.border}" stroke-width="2"/>
  <rect x="2" y="2" width="896" height="80" rx="10" fill="url(#micro-grid)" opacity="0.42"/>
  <rect x="1" y="1" width="6" height="82" rx="3" fill="${project.accent}"/>
  <rect x="22" y="1" width="850" height="2.5" rx="1.25" fill="url(#accent-line)"/>
  <circle cx="34" cy="42" r="17" fill="${project.accent}" fill-opacity="0.12" stroke="${project.accent}" stroke-opacity="0.58"/>
  ${text({ x: 34, y: 46, value: project.id, fill: project.accent, size: 9, weight: 950, mono: true, anchor: "middle" })}
  ${text({ x: 66, y: 36, value: project.title, size: 17, weight: 950 })}
  ${text({ x: 66, y: 58, value: project.summary, fill: colors.muted, size: 8.5, weight: 850, mono: true })}
  <rect x="${statusX}" y="29" width="${statusWidth}" height="26" rx="13" fill="url(#chip)" stroke="${project.accent}" stroke-opacity="0.52"/>
  <circle cx="${statusX + 14}" cy="42" r="3.2" fill="${colors.green}" filter="url(#glow)"/>
  ${text({ x: statusX + 25, y: 46, value: statusLabel, fill: colors.text, size: 7.6, weight: 900, mono: true })}
  ${text({ x: 826, y: 39, value: "ABRIR", fill: colors.quiet, size: 7, weight: 850, mono: true })}
  ${text({ x: 826, y: 53, value: "FICHA", fill: colors.text, size: 8.5, weight: 900, mono: true })}
  <path d="M872 35L879 42L872 49" stroke="${project.accent}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

function mobileToggle(project) {
  const statusLabel = project.id === "01" ? "PRINCIPAL" : "ONLINE";
  const statusWidth = project.id === "01" ? 103 : 82;
  const statusX = 342 - statusWidth;
  return `<svg width="360" height="98" viewBox="0 0 360 98" fill="none" xmlns="http://www.w3.org/2000/svg">
  <style>text{letter-spacing:0}</style>
  ${visualDefs(project.accent)}
  <rect x="1" y="1" width="358" height="96" rx="11" fill="url(#background)" stroke="${colors.border}" stroke-width="2"/>
  <rect x="2" y="2" width="356" height="94" rx="10" fill="url(#micro-grid)" opacity="0.42"/>
  <rect x="1" y="1" width="6" height="96" rx="3" fill="${project.accent}"/>
  <rect x="18" y="1" width="324" height="2.5" rx="1.25" fill="url(#accent-line)"/>
  ${text({ x: 18, y: 25, value: `${project.id} / SISTEMA`, fill: project.accent, size: 7.5, weight: 900, mono: true })}
  <rect x="${statusX}" y="12" width="${statusWidth}" height="23" rx="11.5" fill="url(#chip)" stroke="${project.accent}" stroke-opacity="0.5"/>
  <circle cx="${statusX + 12}" cy="23.5" r="2.8" fill="${colors.green}" filter="url(#glow)"/>
  ${text({ x: statusX + 22, y: 27, value: statusLabel, fill: colors.text, size: 6.8, weight: 900, mono: true })}
  ${text({ x: 18, y: 57, value: project.title, size: 17.5, weight: 950 })}
  ${text({ x: 18, y: 79, value: project.summary, fill: colors.muted, size: 7.5, weight: 850, mono: true })}
  <path d="M330 62L337 69L330 76" stroke="${project.accent}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

await mkdir(assetsDir, { recursive: true });

const outputs = [];
for (const project of projects) {
  outputs.push([`project-detail-${project.id}-desktop.svg`, desktopDetail(project)]);
  outputs.push([`project-detail-${project.id}-mobile.svg`, mobileDetail(project)]);
}
outputs.push(["portfolio-delivery-matrix-desktop.svg", desktopMatrix()]);
outputs.push(["portfolio-delivery-matrix-mobile.svg", mobileMatrix()]);

const navigationButtons = [
  ["profile-nav-01.svg", 126, "VISÃO", "01", colors.green],
  ["profile-nav-02.svg", 126, "STACK", "02", colors.blue],
  ["profile-nav-03.svg", 136, "PAINEL", "03", colors.coral],
  ["profile-nav-04.svg", 152, "PROJETOS", "04", colors.yellow],
  ["profile-nav-05.svg", 122, "ROTA", "05", colors.blue],
];
for (const [filename, width, label, marker, accent] of navigationButtons) {
  outputs.push([filename, compactButton(width, label, marker, accent)]);
}

const quickActions = [
  ["profile-quick-system.svg", 216, "ABRIR SISTEMA", "01", colors.yellow, true],
  ["profile-quick-code.svg", 218, "EXAMINAR CÓDIGO", "02", colors.blue, false],
  ["profile-quick-projects.svg", 222, "EXPLORAR PROJETOS", "03", colors.coral, false],
  ["project-action-demo.svg", 154, "ABRIR DEMO", "01", colors.yellow, true],
  ["project-action-repo.svg", 176, "REPOSITÓRIO", "02", colors.blue, false],
  ["project-action-architecture.svg", 188, "ARQUITETURA", "03", colors.cyan, false],
  ["project-action-ci.svg", 158, "CI APROVADO", "04", colors.green, false],
  ["profile-footer-github.svg", 184, "PERFIL GITHUB", "GH", colors.blue, false],
  ["profile-footer-repositories.svg", 224, "TODOS OS REPOSITÓRIOS", "↗", colors.coral, false],
];
for (const [filename, width, label, marker, accent, primary] of quickActions) {
  outputs.push([filename, compactButton(width, label, marker, accent, primary)]);
}

for (const project of projects) {
  outputs.push([`project-toggle-${project.id}-desktop.svg`, desktopToggle(project)]);
  outputs.push([`project-toggle-${project.id}-mobile.svg`, mobileToggle(project)]);
}

await Promise.all(outputs.map(([filename, content]) => writeFile(resolve(assetsDir, filename), `${content}\n`, "utf8")));

console.log(`Generated ${outputs.length} detailed profile assets in ${assetsDir}`);
