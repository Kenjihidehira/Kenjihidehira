import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const assets = join(root, "assets");
mkdirSync(assets, { recursive: true });

const C = {
  bg: "#080C0A",
  surface: "#101713",
  surface2: "#151F19",
  border: "#2A3930",
  grid: "#1A241E",
  text: "#F4F7F2",
  muted: "#9FB0A5",
  dim: "#65736A",
  green: "#35C99A",
  greenDark: "#123B2F",
  coral: "#FF6B4A",
  coralDark: "#54261C",
  yellow: "#F2C14E",
  yellowDark: "#4A3C18",
  blue: "#6F9EFF",
  blueDark: "#21375F",
};

const FONT = "Inter, Segoe UI, Arial, sans-serif";
const MONO = "Consolas, Cascadia Mono, Segoe UI, monospace";

function text(x, y, value, size, color = C.text, weight = 700, family = FONT, extra = "") {
  return `<text x="${x}" y="${y}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" letter-spacing="0" ${extra}>${value}</text>`;
}

function line(x1, y1, x2, y2, color = C.border, width = 1, extra = "") {
  return `<path d="M${x1} ${y1}H${x2}" stroke="${color}" stroke-width="${width}" ${extra}/>`;
}

function safeBox(x, y, width, height, content, { fill = C.surface, stroke = C.border, radius = 6, accent = "", extra = "" } = {}) {
  return `<g transform="translate(${x} ${y})" data-box="true">
    <rect data-bound="true" x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="${radius}" fill="${fill}" stroke="${stroke}" ${extra}/>
    ${accent ? `<rect x="0" y="0" width="6" height="${height}" rx="3" fill="${accent}"/>` : ""}
    ${content}
  </g>`;
}

function shell(width, height, accent, content) {
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <style>text{letter-spacing:0}</style>
  <g data-box="true">
    <rect data-bound="true" x="1" y="1" width="${width - 2}" height="${height - 2}" rx="7" fill="${C.bg}" stroke="${C.border}" stroke-width="2"/>
    <rect x="0" y="0" width="8" height="${height}" rx="4" fill="${accent}"/>
    <path d="M30 0V${height}M${width - 26} 0V${height}" stroke="${C.grid}"/>
    <path d="M0 42H${width}M0 ${height - 24}H${width}" stroke="${C.grid}"/>
    ${content}
  </g>
</svg>\n`;
}

function write(name, value) {
  writeFileSync(join(assets, name), value.replace(/[ \t]+$/gm, ""), "utf8");
}

function icon(type, x, y, color) {
  const common = `stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`;
  const paths = {
    grid: `<g transform="translate(${x} ${y})" ${common}><rect x="1" y="1" width="6" height="6"/><rect x="11" y="1" width="6" height="6"/><rect x="1" y="11" width="6" height="6"/><rect x="11" y="11" width="6" height="6"/></g>`,
    case: `<g transform="translate(${x} ${y})" ${common}><rect x="1" y="5" width="18" height="13" rx="2"/><path d="M7 5V2h6v3M1 10h18"/></g>`,
    code: `<g transform="translate(${x} ${y})" ${common}><path d="M7 3L1 10l6 7M13 3l6 7-6 7"/></g>`,
    flow: `<g transform="translate(${x} ${y})" ${common}><circle cx="4" cy="4" r="3"/><circle cx="16" cy="16" r="3"/><circle cx="4" cy="16" r="3"/><path d="M4 7v6M7 4h4a5 5 0 015 5v4M7 16h6"/></g>`,
    mail: `<g transform="translate(${x} ${y})" ${common}><rect x="1" y="3" width="19" height="14" rx="2"/><path d="M2 5l8.5 7L19 5"/></g>`,
    arrow: `<g transform="translate(${x} ${y})" ${common}><path d="M3 10h14M12 5l5 5-5 5"/></g>`,
    check: `<g transform="translate(${x} ${y})" ${common}><circle cx="10" cy="10" r="9"/><path d="M6 10l3 3 6-7"/></g>`,
  };
  return paths[type];
}

function navAsset(name, width, label, accent, iconName) {
  const content = `${icon(iconName, 12, 12, accent)}${text(40, 29, label, 12, C.text, 850)}<rect x="0" y="0" width="5" height="44" rx="2.5" fill="${accent}"/>`;
  write(name, shell(width, 44, accent, safeBox(0, 0, width, 44, content, { fill: C.surface, stroke: C.border, radius: 4 })));
}

function actionAsset(name, width, label, accent, iconName, filled = false) {
  const fill = filled ? accent : C.surface;
  const textColor = filled ? C.bg : C.text;
  const iconColor = filled ? C.bg : accent;
  const content = `${icon(iconName, 12, 12, iconColor)}${text(40, 29, label, 12, textColor, 850)}${icon("arrow", width - 29, 12, iconColor)}`;
  write(name, shell(width, 44, accent, safeBox(0, 0, width, 44, content, { fill, stroke: accent, radius: 4 })));
}

navAsset("nav-overview.svg", 112, "VIS&#195;O", C.green, "grid");
navAsset("nav-cases.svg", 132, "PROJETOS", C.blue, "case");
navAsset("nav-engineering.svg", 142, "ENGENHARIA", C.yellow, "code");
navAsset("nav-process.svg", 116, "PROCESSO", C.green, "flow");
navAsset("nav-contact.svg", 105, "CONTATO", C.coral, "mail");

actionAsset("action-proposal.svg", 196, "SOLICITAR PROPOSTA", C.green, "mail", true);
actionAsset("action-repositories.svg", 190, "VER REPOSIT&#211;RIOS", C.blue, "grid");
actionAsset("action-status.svg", 168, "FREELANCE ATIVO", C.coral, "check");

const bannerLeft = `
  ${text(24, 34, "DESENVOLVEDOR WEB / FREELANCE", 13, C.coral, 850, MONO)}
  ${text(24, 92, "Kenji Hidehira", 50, C.text, 950)}
  <rect x="24" y="110" width="76" height="5" rx="2.5" fill="${C.coral}"/>
  ${text(24, 150, "Sistemas web para opera&#231;&#245;es", 21, C.text, 800)}
  ${text(24, 178, "que precisam vender, medir e escalar.", 21, C.text, 800)}
  ${text(24, 220, "Interface pr&#243;pria. Regras reais. Entrega verific&#225;vel.", 14, C.muted, 550)}
  ${safeBox(24, 246, 124, 34, `${text(15, 22, "SISTEMAS", 11, C.text, 850, MONO)}`, { fill: C.greenDark, stroke: C.green, radius: 4 })}
  ${safeBox(158, 246, 108, 34, `${text(15, 22, "APIS REST", 11, C.text, 850, MONO)}`, { fill: C.blueDark, stroke: C.blue, radius: 4 })}
  ${safeBox(276, 246, 132, 34, `${text(15, 22, "AUTOMA&#199;&#213;ES", 11, C.text, 850, MONO)}`, { fill: C.yellowDark, stroke: C.yellow, radius: 4 })}`;

const bannerRight = `
  <circle cx="18" cy="18" r="4" fill="${C.coral}"/><circle cx="32" cy="18" r="4" fill="${C.yellow}"/><circle cx="46" cy="18" r="4" fill="${C.green}"/>
  ${text(68, 23, "ops.control / execu&#231;&#227;o", 11, C.muted, 500, MONO)}
  ${safeBox(18, 46, 160, 72, `${text(14, 24, "RECEITA", 10, C.dim, 700, MONO)}${text(14, 54, "R$ 84,2 mil", 22, C.text, 900)}${text(116, 54, "+12%", 10, C.green, 800, MONO)}`, { fill: C.surface2, stroke: C.border, radius: 5 })}
  ${safeBox(188, 46, 160, 72, `${text(14, 24, "CONVERS&#195;O", 10, C.dim, 700, MONO)}${text(14, 54, "31,8%", 22, C.blue, 900)}${text(103, 54, "META", 10, C.muted, 700, MONO)}`, { fill: C.surface2, stroke: C.border, radius: 5 })}
  ${safeBox(18, 128, 220, 112, `${text(14, 24, "DESEMPENHO / 7 DIAS", 10, C.muted, 700, MONO)}<path d="M16 88L48 70L78 79L108 47L140 59L170 35L202 44" stroke="${C.green}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 96H202M16 64H202" stroke="${C.grid}"/>`, { fill: C.surface2, stroke: C.border, radius: 5 })}
  ${safeBox(248, 128, 100, 112, `${text(12, 24, "FUNIL", 10, C.muted, 700, MONO)}<rect x="12" y="42" width="72" height="12" rx="3" fill="${C.green}"/><rect x="12" y="62" width="56" height="12" rx="3" fill="${C.blue}"/><rect x="12" y="82" width="38" height="12" rx="3" fill="${C.yellow}"/>`, { fill: C.surface2, stroke: C.border, radius: 5 })}
  ${safeBox(18, 250, 330, 38, `${text(13, 24, "> fluxo executado sem pend&#234;ncias", 11, C.green, 700, MONO)}${text(274, 24, "OK", 10, C.bg, 900, MONO)}`, { fill: C.greenDark, stroke: C.green, radius: 4 })}`;

write("profile-banner.svg", shell(900, 390, C.green,
  `${safeBox(24, 58, 432, 304, bannerLeft, { fill: "transparent", stroke: "transparent", radius: 0 })}
   ${safeBox(486, 58, 372, 304, bannerRight, { fill: C.surface, stroke: C.border, radius: 6 })}
   ${safeBox(24, 12, 834, 34, `${safeBox(10, 5, 24, 24, `${text(5, 17, "KH", 11, C.bg, 950)}`, { fill: C.green, stroke: C.green, radius: 3 })}${text(48, 23, "PORTF&#211;LIO DE SISTEMAS WEB", 12, C.text, 850)}${text(682, 23, "PARAN&#193; / BRASIL", 10, C.dim, 600, MONO)}`, { fill: C.surface, stroke: C.border, radius: 5 })}`));

const metric = (x, y, accent, number, label, note, width = 246) => safeBox(x, y, width, 104,
  `${text(18, 43, number, 36, accent, 950)}${text(82, 35, label, 13, C.text, 850)}${text(82, 60, note, 11, C.muted, 500, MONO)}<rect x="18" y="78" width="${width - 36}" height="5" rx="2.5" fill="${C.grid}"/><rect x="18" y="78" width="${Math.round((width - 36) * (number === "21" ? 0.85 : number === "29" ? 0.99 : 0.66))}" height="5" rx="2.5" fill="${accent}"/>`,
  { fill: C.surface2, stroke: C.border, radius: 5 });

write("proof-panel.svg", shell(900, 300, C.coral,
  `${safeBox(26, 58, 294, 214, `${text(22, 30, "PORTF&#211;LIO EM N&#218;MEROS", 12, C.coral, 850, MONO)}${text(22, 78, "Evid&#234;ncia", 30, C.text, 950)}${text(22, 112, "antes de promessa.", 30, C.text, 950)}${text(22, 154, "Projetos publicados, interfaces", 13, C.muted, 550)}${text(22, 176, "distintas e valida&#231;&#227;o objetiva.", 13, C.muted, 550)}${text(22, 201, "AUDITORIA / 2026.07", 10, C.dim, 700, MONO)}`, { fill: C.surface, stroke: C.border, radius: 6, accent: C.coral })}
   ${metric(342, 58, C.green, "29", "REPOSIT&#211;RIOS", "portf&#243;lio p&#250;blico")}
   ${metric(600, 58, C.blue, "21", "INTERFACES", "desktop + mobile")}
   ${metric(342, 168, C.yellow, "10", "DESTAQUES", "cases + sistemas", 504)}
   ${text(28, 28, "01 / PROVA DE EXECU&#199;&#195;O", 11, C.dim, 700, MONO)}`));

const capability = (x, y, number, accent, title, line1, line2) => safeBox(x, y, 410, 128,
  `${text(18, 34, number, 18, accent, 900, MONO)}${text(58, 34, title, 17, C.text, 900)}${line(18, 52, 390, 52, C.border)}${text(18, 82, line1, 13, C.muted, 550)}${text(18, 104, line2, 13, C.muted, 550)}<circle cx="382" cy="28" r="7" fill="${accent}"/>`,
  { fill: C.surface, stroke: C.border, radius: 6 });

write("service-map.svg", shell(900, 410, C.green,
  `${text(28, 30, "02 / CAPACIDADE COMERCIAL", 11, C.dim, 700, MONO)}
   ${text(28, 72, "Do problema operacional ao sistema em uso.", 28, C.text, 950)}
   ${text(28, 101, "Cada entrega conecta interface, regras, dados e automa&#231;&#227;o.", 14, C.muted, 550)}
   ${capability(28, 126, "01", C.green, "INTERFACE", "Fluxos claros para uso recorrente", "e tomada de decis&#227;o r&#225;pida.")}
   ${capability(462, 126, "02", C.blue, "BACKEND", "APIs, valida&#231;&#227;o e persist&#234;ncia", "organizadas por regra de neg&#243;cio.")}
   ${capability(28, 266, "03", C.yellow, "AUTOMA&#199;&#195;O", "Alertas, c&#225;lculos e tarefas", "executados de forma consistente.")}
   ${capability(462, 266, "04", C.coral, "ENTREGA", "Seed, testes, README e deploy", "preparado para demonstra&#231;&#227;o.")}`));

function chart(kind, accent) {
  if (kind === "bars") return `<rect x="18" y="82" width="146" height="14" rx="3" fill="${C.grid}"/><rect x="18" y="82" width="112" height="14" rx="3" fill="${accent}"/><rect x="18" y="108" width="146" height="14" rx="3" fill="${C.grid}"/><rect x="18" y="108" width="78" height="14" rx="3" fill="${C.yellow}"/><rect x="18" y="134" width="146" height="14" rx="3" fill="${C.grid}"/><rect x="18" y="134" width="45" height="14" rx="3" fill="${C.coral}"/>`;
  if (kind === "line") return `<path d="M18 148H166M18 112H166M18 76H166" stroke="${C.grid}"/><path d="M20 146L46 126L72 134L98 88L126 104L164 62" fill="none" stroke="${accent}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="164" cy="62" r="6" fill="${C.coral}"/>`;
  if (kind === "queue") return `<g transform="translate(18 70)"><rect width="148" height="32" rx="4" fill="${C.surface2}"/><circle cx="16" cy="16" r="6" fill="${C.coral}"/><rect x="32" y="11" width="82" height="7" rx="3" fill="${C.dim}"/></g><g transform="translate(18 112)"><rect width="148" height="32" rx="4" fill="${C.surface2}"/><circle cx="16" cy="16" r="6" fill="${C.yellow}"/><rect x="32" y="11" width="102" height="7" rx="3" fill="${C.dim}"/></g>`;
  return `<circle cx="92" cy="112" r="54" stroke="${C.grid}" stroke-width="18"/><path d="M92 58a54 54 0 0149 78" stroke="${accent}" stroke-width="18" stroke-linecap="round"/><text x="69" y="120" fill="${C.text}" font-family="${FONT}" font-size="22" font-weight="900">84%</text>`;
}

function projectCard(name, project) {
  const right = `${text(18, 28, project.panel, 11, C.muted, 750, MONO)}${text(18, 58, project.metric, 22, project.accent, 900)}${chart(project.chart, project.accent)}${text(18, 178, project.status, 10, project.accent, 750, MONO)}`;
  const left = `${text(22, 30, `${project.code} / ${project.category}`, 12, project.accent, 850, MONO)}${text(22, 76, project.title, 31, C.text, 950)}${text(22, 112, project.description[0], 15, C.muted, 550)}${text(22, 136, project.description[1], 15, C.muted, 550)}${text(22, 190, project.stack, 11, C.text, 800, MONO)}${text(344, 190, "ABRIR &#8599;", 11, project.accent, 850, MONO)}`;
  write(name, shell(720, 250, project.accent,
    `${safeBox(22, 34, 430, 194, left, { fill: "transparent", stroke: "transparent", radius: 0 })}${safeBox(474, 34, 222, 194, right, { fill: C.surface, stroke: C.border, radius: 6 })}${text(24, 23, "SISTEMA COMERCIAL", 10, C.dim, 700, MONO)}`));
}

const cases = [
  ["case-returnops.svg", { code: "CASE 01", category: "P&#211;S-VENDA", title: "ReturnOps", description: ["RMA, reembolso, estoque e risco", "de SLA em uma central operacional."], stack: "NODE.JS / API REST / PLAYBOOKS / TESTES", accent: C.coral, panel: "DEVOLU&#199;&#213;ES EM RISCO", metric: "12 priorit&#225;rias", chart: "queue", status: "SLA MONITORADO" }],
  ["case-servicehub.svg", { code: "CASE 02", category: "SERVI&#199;OS", title: "ServiceHub", description: ["Agenda, clientes, funil e cobran&#231;as", "conectados em um fluxo comercial."], stack: "NODE.JS / CRM / AGENDA / AUTOMA&#199;&#195;O", accent: C.blue, panel: "OCUPA&#199;&#195;O DA AGENDA", metric: "84%", chart: "ring", status: "LEMBRETES ATIVOS" }],
  ["case-leadops.svg", { code: "CASE 03", category: "MARKETING", title: "LeadOps", description: ["ROI, atribui&#231;&#227;o, pontua&#231;&#227;o", "e automa&#231;&#245;es para vendas."], stack: "NODE.JS / ANALYTICS / FUNIL / API", accent: C.yellow, panel: "ROI / 30 DIAS", metric: "+32,4%", chart: "line", status: "ATRIBUI&#199;&#195;O ATIVA" }],
  ["case-fieldops.svg", { code: "CASE 04", category: "OPERA&#199;&#213;ES", title: "FieldOps", description: ["Equipe, materiais, faturamento", "e margem de projetos de campo."], stack: "PHP / TYPESCRIPT / MARGEM / RELAT&#211;RIOS", accent: C.green, panel: "MARGEM POR PROJETO", metric: "28,6%", chart: "bars", status: "CUSTO CONTROLADO" }],
];
for (const [name, project] of cases) projectCard(name, project);

const commercial = [
  ["card-vendoraudit.svg", { code: "01", category: "CONFORMIDADE", title: "VendorAudit", description: ["Risco, documentos e renova&#231;&#245;es", "de fornecedores sob controle."], stack: "NODE.JS / SLA / RISCO", accent: C.coral, panel: "MATRIZ DE RISCO", metric: "08 alertas", chart: "queue", status: "RENOVA&#199;&#195;O PROTEGIDA" }],
  ["card-cobreflow.svg", { code: "02", category: "FINANCEIRO", title: "CobreFlow", description: ["Receb&#237;veis, concilia&#231;&#227;o e", "cobran&#231;a ativa priorizada."], stack: "NODE.JS / FINAN&#199;AS / FILAS", accent: C.yellow, panel: "CARTEIRA", metric: "R$ 126 mil", chart: "bars", status: "RISCO PRIORIZADO" }],
  ["card-logixops.svg", { code: "03", category: "LOG&#205;STICA", title: "LogixOps", description: ["SLA, incidentes e &#250;ltima milha", "em uma torre de controle."], stack: "NODE.JS / ROTAS / SLA", accent: C.green, panel: "ROTAS ATIVAS", metric: "42 entregas", chart: "line", status: "OPERA&#199;&#195;O AO VIVO" }],
  ["card-erp.svg", { code: "04", category: "ESTOQUE", title: "StockPilot ERP", description: ["Ruptura, reposi&#231;&#227;o e compras", "guiadas por n&#237;vel de estoque."], stack: "NODE.JS / API / TESTES", accent: C.blue, panel: "N&#205;VEL DE ESTOQUE", metric: "17 SKUs", chart: "bars", status: "LOTE DE COMPRA PRONTO" }],
  ["card-helpdesk.svg", { code: "05", category: "ATENDIMENTO", title: "ResolveDesk", description: ["Chamados, prioridade e risco", "de SLA em uma fila operacional."], stack: "NODE.JS / SLA / AUTOMA&#199;&#195;O", accent: C.coral, panel: "FILA DE CHAMADOS", metric: "06 urgentes", chart: "queue", status: "SLA MONITORADO" }],
  ["card-linkpulse.svg", { code: "06", category: "MARKETING", title: "LinkPulse", description: ["Links, cliques, QR e convers&#227;o", "organizados por campanha."], stack: "NODE.JS / ANALYTICS / API", accent: C.blue, panel: "CLIQUES / 7 DIAS", metric: "+18,2%", chart: "line", status: "CONVERS&#195;O MEDIDA" }],
];
for (const [name, project] of commercial) projectCard(name, project);

const validationRow = (y, accent, label, status) => safeBox(548, y, 320, 58,
  `${circle(20, 29, 7, accent)}${text(40, 25, label, 13, C.text, 800)}${text(40, 44, status, 10, C.muted, 600, MONO)}${icon("check", 282, 18, accent)}`,
  { fill: C.surface2, stroke: C.border, radius: 5 });

function circle(cx, cy, r, fill) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>`;
}

write("engineering-panel.svg", shell(900, 430, C.yellow,
  `${text(28, 30, "03 / ENGENHARIA DE ENTREGA", 11, C.dim, 700, MONO)}${text(28, 73, "C&#243;digo que pode ser verificado.", 30, C.text, 950)}${text(28, 101, "Regras isoladas, respostas previs&#237;veis e evid&#234;ncia t&#233;cnica.", 14, C.muted, 550)}
   ${safeBox(28, 126, 496, 274, `<circle cx="20" cy="20" r="4" fill="${C.coral}"/><circle cx="34" cy="20" r="4" fill="${C.yellow}"/><circle cx="48" cy="20" r="4" fill="${C.green}"/>${text(70, 24, "src/services/operation-engine.js", 11, C.dim, 500, MONO)}${line(0, 40, 496, 40, C.border)}${text(22, 75, "01", 11, C.dim, 500, MONO)}${text(58, 75, "export function priorizarFila(itens) {", 14, C.text, 600, MONO)}${text(22, 107, "02", 11, C.dim, 500, MONO)}${text(78, 107, "return itens", 14, C.blue, 600, MONO)}${text(22, 139, "03", 11, C.dim, 500, MONO)}${text(98, 139, ".filter(item =&gt; item.status !== 'concluido')", 13, C.muted, 500, MONO)}${text(22, 171, "04", 11, C.dim, 500, MONO)}${text(98, 171, ".map(calcularRisco)", 13, C.green, 500, MONO)}${text(22, 203, "05", 11, C.dim, 500, MONO)}${text(98, 203, ".sort((a, b) =&gt; b.score - a.score);", 13, C.yellow, 500, MONO)}${text(22, 237, "06", 11, C.dim, 500, MONO)}${text(58, 237, "}", 14, C.text, 600, MONO)}`, { fill: C.surface, stroke: C.border, radius: 6 })}
   ${validationRow(126, C.green, "REGRAS DE NEG&#211;CIO", "TESTES / PASS")}${validationRow(194, C.blue, "API E INTERFACE", "SMOKE / PASS")}${validationRow(262, C.yellow, "SEED E README", "DOCS / READY")}${validationRow(330, C.coral, "DEPLOY", "CONFIG / READY")}`));

const step = (x, y, n, accent, title, note) => safeBox(x, y, 410, 92,
  `${safeBox(16, 16, 46, 46, `${text(14, 31, n, 20, C.bg, 950)}`, { fill: accent, stroke: accent, radius: 4 })}${text(82, 38, title, 17, C.text, 900)}${text(82, 62, note, 12, C.muted, 550)}`,
  { fill: C.surface, stroke: C.border, radius: 6 });

write("workflow-strip.svg", shell(900, 300, C.green,
  `${text(28, 30, "04 / PROCESSO DE TRABALHO", 11, C.dim, 700, MONO)}${text(28, 70, "Quatro etapas. Nenhuma caixa-preta.", 28, C.text, 950)}
   ${step(28, 96, "1", C.green, "ENTENDER", "processo, gargalos e resultado")}${step(462, 96, "2", C.coral, "MODELAR", "dados, estados e regras")}${step(28, 200, "3", C.yellow, "CONSTRUIR", "interface, API e automa&#231;&#245;es")}${step(462, 200, "4", C.blue, "VALIDAR", "cen&#225;rios, testes e entrega")}`));

const stackRow = (y, number, accent, title, tools) => safeBox(300, y, 568, 74,
  `${text(18, 31, number, 18, accent, 900, MONO)}${text(62, 29, title, 13, C.text, 900)}${text(62, 53, tools, 13, C.muted, 600, MONO)}<rect x="530" y="18" width="10" height="38" rx="5" fill="${accent}"/>`,
  { fill: C.surface2, stroke: C.border, radius: 5 });

write("skill-matrix.svg", shell(900, 350, C.blue,
  `${safeBox(28, 58, 246, 264, `${text(22, 30, "STACK APLICADA", 12, C.blue, 850, MONO)}${text(22, 82, "Tecnologia", 28, C.text, 950)}${text(22, 114, "a servi&#231;o", 28, C.text, 950)}${text(22, 146, "do processo.", 28, C.text, 950)}${text(22, 196, "Escolhas pragm&#225;ticas,", 13, C.muted, 550)}${text(22, 218, "sem complexidade sem retorno.", 13, C.muted, 550)}${text(22, 248, "FULL STACK / ENTREGA", 10, C.dim, 700, MONO)}`, { fill: C.surface, stroke: C.border, radius: 6, accent: C.blue })}
   ${stackRow(58, "01", C.green, "INTERFACE", "HTML / CSS / JAVASCRIPT / TYPESCRIPT")}${stackRow(144, "02", C.coral, "SERVIDOR E DADOS", "NODE.JS / PHP / API REST / JSON / SQL")}${stackRow(230, "03", C.yellow, "QUALIDADE E ENTREGA", "TESTES / GIT / DOCKER / DOCUMENTA&#199;&#195;O")}${text(28, 30, "05 / STACK", 11, C.dim, 700, MONO)}`));

write("footer-panel.svg", shell(900, 230, C.coral,
  `${safeBox(28, 54, 844, 148, `${text(24, 32, "DISPON&#205;VEL PARA PROJETOS FREELANCE", 12, C.green, 850, MONO)}${text(24, 76, "Seu processo ainda depende de planilhas", 28, C.text, 950)}${text(24, 108, "e tarefas manuais?", 28, C.text, 950)}${text(24, 136, "Vamos transformar a opera&#231;&#227;o em um sistema claro, rastre&#225;vel e pronto para crescer.", 14, C.muted, 550)}${safeBox(718, 24, 96, 96, `${text(22, 42, "VAMOS", 13, C.bg, 900, MONO)}${text(20, 64, "FALAR", 18, C.bg, 950)}${icon("arrow", 58, 66, C.bg)}`, { fill: C.coral, stroke: C.coral, radius: 5 })}`, { fill: C.surface, stroke: C.border, radius: 6, accent: C.green })}${text(30, 29, "06 / PR&#211;XIMO PROJETO", 11, C.dim, 700, MONO)}`));

console.log(`Generated ${25} SVG assets in ${assets}`);
