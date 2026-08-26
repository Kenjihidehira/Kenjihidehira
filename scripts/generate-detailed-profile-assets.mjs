import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const assetsDir = resolve(here, "..", "assets");

const colors = {
  background: "#080C0A",
  surface: "#101713",
  surfaceAlt: "#151F19",
  border: "#2A3930",
  grid: "#1A241E",
  text: "#F4F7F2",
  muted: "#9FB0A5",
  quiet: "#65736A",
  green: "#35C99A",
  blue: "#6F9EFF",
  yellow: "#F2C14E",
  coral: "#FF6B4A",
};

const projects = [
  {
    id: "01",
    title: "PATRIMÔNIO OPS",
    domain: "GESTÃO PATRIMONIAL",
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

function chip(label, x, y, accent, compact = false) {
  const width = Math.max(compact ? 54 : 66, label.length * (compact ? 5.2 : 6.15) + (compact ? 18 : 24));
  const height = compact ? 22 : 28;
  return {
    width,
    svg: `${rect({ x, y, width, height, fill: colors.surfaceAlt, stroke: accent, radius: 4 })}${text({ x: x + width / 2, y: y + (compact ? 15 : 19), value: label, fill: colors.text, size: compact ? 8 : 9.5, weight: 850, mono: true, anchor: "middle" })}`,
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
        ? `${text({ x: x + flowWidth + 9, y: 171, value: "→", fill: project.accent, size: 14, weight: 900, mono: true, anchor: "middle" })}`
        : "";
      return `${rect({ x, y: 147, width: flowWidth, height: 42, fill: colors.background, stroke: colors.border, radius: 4 })}${text({ x: x + flowWidth / 2, y: 172, value: step, fill: index === project.flow.length - 1 ? project.accent : colors.text, size: 7.7, weight: 850, mono: true, anchor: "middle" })}${arrow}`;
    })
    .join("");

  const evidence = project.evidence
    .map(([value, label], index) => {
      const y = 148 + index * 30;
      return `${text({ x: 690, y, value, fill: index === 0 ? project.accent : colors.text, size: 13, weight: 950, mono: index > 0 })}${text({ x: 790, y, value: label, fill: colors.muted, size: 9, weight: 750, mono: true })}`;
    })
    .join("");

  let chipX = 44;
  const chips = project.stack
    .map((label) => {
      const current = chip(label, chipX, 272, project.accent);
      chipX += current.width + 10;
      return current.svg;
    })
    .join("");

  return `<svg width="900" height="332" viewBox="0 0 900 332" fill="none" xmlns="http://www.w3.org/2000/svg">
  <style>text{letter-spacing:0}</style>
  ${rect({ x: 1, y: 1, width: 898, height: 330, fill: colors.background, stroke: colors.border, radius: 8, strokeWidth: 2 })}
  <rect x="0" y="0" width="8" height="332" rx="4" fill="${project.accent}"/>
  <path d="M28 46H876M28 236H876" stroke="${colors.grid}"/>
  ${text({ x: 26, y: 29, value: `${project.id} / FICHA DE SISTEMA`, fill: project.accent, size: 10.5, weight: 850, mono: true })}
  ${text({ x: 874, y: 29, value: project.status, fill: colors.muted, size: 10, weight: 750, mono: true, anchor: "end" })}
  ${text({ x: 26, y: 79, value: project.title, size: 28, weight: 950 })}
  ${text({ x: 874, y: 76, value: project.domain, fill: colors.muted, size: 11, weight: 800, mono: true, anchor: "end" })}

  ${rect({ x: 24, y: 98, width: 258, height: 126, fill: colors.surface, stroke: colors.border, radius: 6 })}
  ${text({ x: 40, y: 121, value: "PROBLEMA", fill: project.accent, size: 9.5, weight: 850, mono: true })}
  ${text({ x: 40, y: 147, value: project.problem[0], size: 12.5, weight: 800 })}
  ${text({ x: 40, y: 166, value: project.problem[1], size: 12.5, weight: 800 })}
  <path d="M40 180H264" stroke="${colors.border}"/>
  ${text({ x: 40, y: 199, value: project.delivery[0], fill: colors.muted, size: 10.5, weight: 650 })}
  ${text({ x: 40, y: 215, value: project.delivery[1], fill: colors.muted, size: 10.5, weight: 650 })}

  ${rect({ x: 296, y: 98, width: 354, height: 126, fill: colors.surface, stroke: colors.border, radius: 6 })}
  ${text({ x: 312, y: 121, value: "FLUXO OPERACIONAL", fill: project.accent, size: 9.5, weight: 850, mono: true })}
  ${flow}

  ${rect({ x: 664, y: 98, width: 212, height: 126, fill: colors.surface, stroke: colors.border, radius: 6 })}
  ${text({ x: 680, y: 121, value: "EVIDÊNCIAS", fill: project.accent, size: 9.5, weight: 850, mono: true })}
  ${evidence}

  ${rect({ x: 24, y: 248, width: 852, height: 68, fill: colors.surface, stroke: colors.border, radius: 6 })}
  ${text({ x: 40, y: 265, value: "ARQUITETURA E ENTREGA", fill: colors.muted, size: 8.5, weight: 800, mono: true })}
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
        ? text({ x: x + flowWidth + 8, y: 320, value: "→", fill: project.accent, size: 11, weight: 900, mono: true, anchor: "middle" })
        : "";
      return `${rect({ x, y: 298, width: flowWidth, height: 38, fill: colors.background, stroke: colors.border, radius: 4 })}${text({ x: x + flowWidth / 2, y: 321, value: step, fill: index === 3 ? project.accent : colors.text, size: 6.9, weight: 850, mono: true, anchor: "middle" })}${arrow}`;
    })
    .join("");

  const evidence = project.evidence
    .map(([value, label], index) => {
      const x = 27 + index * 108;
      return `${text({ x, y: 401, value, fill: index === 0 ? project.accent : colors.text, size: 13, weight: 950, mono: index > 0 })}${text({ x, y: 420, value: label, fill: colors.muted, size: 8, weight: 750, mono: true })}`;
    })
    .join("");

  let chipX = 26;
  let chipY = 479;
  const chips = project.stack
    .map((label) => {
      let current = chip(label, chipX, chipY, project.accent, true);
      if (chipX + current.width > 336) {
        chipX = 26;
        chipY += 28;
        current = chip(label, chipX, chipY, project.accent, true);
      }
      chipX += current.width + 7;
      return current.svg;
    })
    .join("");

  return `<svg width="360" height="542" viewBox="0 0 360 542" fill="none" xmlns="http://www.w3.org/2000/svg">
  <style>text{letter-spacing:0}</style>
  ${rect({ x: 1, y: 1, width: 358, height: 540, fill: colors.background, stroke: colors.border, radius: 8, strokeWidth: 2 })}
  <rect x="0" y="0" width="7" height="542" rx="3.5" fill="${project.accent}"/>
  ${text({ x: 18, y: 28, value: `${project.id} / FICHA DE SISTEMA`, fill: project.accent, size: 9, weight: 850, mono: true })}
  ${text({ x: 342, y: 28, value: project.status, fill: colors.muted, size: 8, weight: 750, mono: true, anchor: "end" })}
  <path d="M18 43H342" stroke="${colors.grid}"/>
  ${text({ x: 18, y: 76, value: project.title, size: 23, weight: 950 })}
  ${text({ x: 18, y: 98, value: project.domain, fill: colors.muted, size: 9, weight: 800, mono: true })}

  ${rect({ x: 16, y: 112, width: 328, height: 132, fill: colors.surface, stroke: colors.border, radius: 6 })}
  ${text({ x: 28, y: 134, value: "PROBLEMA", fill: project.accent, size: 8.5, weight: 850, mono: true })}
  ${text({ x: 28, y: 160, value: project.problem[0], size: 12.5, weight: 800 })}
  ${text({ x: 28, y: 180, value: project.problem[1], size: 12.5, weight: 800 })}
  <path d="M28 194H332" stroke="${colors.border}"/>
  ${text({ x: 28, y: 215, value: project.delivery[0], fill: colors.muted, size: 10.5, weight: 650 })}
  ${text({ x: 28, y: 232, value: project.delivery[1], fill: colors.muted, size: 10.5, weight: 650 })}

  ${rect({ x: 16, y: 256, width: 328, height: 92, fill: colors.surface, stroke: colors.border, radius: 6 })}
  ${text({ x: 28, y: 280, value: "FLUXO OPERACIONAL", fill: project.accent, size: 8.5, weight: 850, mono: true })}
  ${flow}

  ${rect({ x: 16, y: 360, width: 328, height: 78, fill: colors.surface, stroke: colors.border, radius: 6 })}
  ${text({ x: 28, y: 382, value: "EVIDÊNCIAS", fill: project.accent, size: 8.5, weight: 850, mono: true })}
  ${evidence}

  ${rect({ x: 16, y: 450, width: 328, height: 76, fill: colors.surface, stroke: colors.border, radius: 6 })}
  ${text({ x: 28, y: 469, value: "ARQUITETURA E ENTREGA", fill: colors.muted, size: 8, weight: 800, mono: true })}
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
      return `${rect({ x, y: 67, width: 204, height: 72, fill: colors.surface, stroke: colors.border, radius: 6 })}<rect x="${x}" y="67" width="5" height="72" rx="2.5" fill="${accent}"/>${text({ x: x + 18, y: 101, value, fill: accent, size: 22, weight: 950 })}${text({ x: x + 18, y: 123, value: label, fill: colors.muted, size: 8.5, weight: 800, mono: true })}`;
    })
    .join("");

  const columns = [24, 270, 410, 545, 660, 750];
  const rows = matrixRows
    .map((row, index) => {
      const y = 194 + index * 39;
      const fill = index % 2 === 0 ? colors.surface : colors.surfaceAlt;
      const accent = projects[index].accent;
      return `${rect({ x: 24, y, width: 852, height: 34, fill, stroke: colors.border, radius: 3 })}<rect x="24" y="${y}" width="4" height="34" rx="2" fill="${accent}"/>${text({ x: columns[0] + 14, y: y + 22, value: row[0], fill: colors.text, size: 10.5, weight: 900 })}${text({ x: columns[1], y: y + 22, value: row[1], fill: colors.muted, size: 9, weight: 750, mono: true })}${text({ x: columns[2], y: y + 22, value: row[2], fill: colors.text, size: 9, weight: 750, mono: true })}${text({ x: columns[3], y: y + 22, value: row[3], fill: colors.text, size: 9, weight: 750, mono: true })}${text({ x: columns[4], y: y + 22, value: row[4], fill: colors.green, size: 9, weight: 900, mono: true })}${text({ x: columns[5], y: y + 22, value: row[5], fill: colors.green, size: 9, weight: 900, mono: true })}`;
    })
    .join("");

  return `<svg width="900" height="454" viewBox="0 0 900 454" fill="none" xmlns="http://www.w3.org/2000/svg">
  <style>text{letter-spacing:0}</style>
  ${rect({ x: 1, y: 1, width: 898, height: 452, fill: colors.background, stroke: colors.border, radius: 8, strokeWidth: 2 })}
  <rect x="0" y="0" width="8" height="454" rx="4" fill="${colors.blue}"/>
  ${text({ x: 26, y: 28, value: "PORTFÓLIO / MATRIZ DE ENTREGA", fill: colors.blue, size: 10.5, weight: 850, mono: true })}
  ${text({ x: 26, y: 56, value: "Seis sistemas. Evidências comparáveis.", size: 20, weight: 950 })}
  ${kpis}
  ${rect({ x: 24, y: 156, width: 852, height: 30, fill: colors.surface, stroke: colors.border, radius: 3 })}
  ${text({ x: 38, y: 176, value: "PROJETO", fill: colors.quiet, size: 8.5, weight: 850, mono: true })}
  ${text({ x: 270, y: 176, value: "DOMÍNIO", fill: colors.quiet, size: 8.5, weight: 850, mono: true })}
  ${text({ x: 410, y: 176, value: "API", fill: colors.quiet, size: 8.5, weight: 850, mono: true })}
  ${text({ x: 545, y: 176, value: "DADOS", fill: colors.quiet, size: 8.5, weight: 850, mono: true })}
  ${text({ x: 660, y: 176, value: "CI", fill: colors.quiet, size: 8.5, weight: 850, mono: true })}
  ${text({ x: 750, y: 176, value: "DEMO", fill: colors.quiet, size: 8.5, weight: 850, mono: true })}
  ${rows}
  ${text({ x: 26, y: 442, value: "LEITURA ATUAL: APIs DOCUMENTADAS / PERSISTÊNCIA ISOLADA / PIPELINES VERIFICADOS", fill: colors.quiet, size: 8.5, weight: 750, mono: true })}
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
      const y = 77 + row * 64;
      return `${rect({ x, y, width: 156, height: 54, fill: colors.surface, stroke: colors.border, radius: 5 })}<rect x="${x}" y="${y}" width="4" height="54" rx="2" fill="${accent}"/>${text({ x: x + 14, y: y + 27, value, fill: accent, size: 17, weight: 950 })}${text({ x: x + 14, y: y + 44, value: label, fill: colors.muted, size: 7.5, weight: 800, mono: true })}`;
    })
    .join("");

  const cards = matrixRows
    .map((row, index) => {
      const y = 228 + index * 73;
      const accent = projects[index].accent;
      return `${rect({ x: 16, y, width: 328, height: 62, fill: index % 2 === 0 ? colors.surface : colors.surfaceAlt, stroke: colors.border, radius: 5 })}<rect x="16" y="${y}" width="5" height="62" rx="2.5" fill="${accent}"/>${text({ x: 30, y: y + 23, value: row[0], size: 13, weight: 950 })}${text({ x: 330, y: y + 22, value: row[1], fill: colors.muted, size: 7.5, weight: 800, mono: true, anchor: "end" })}${text({ x: 30, y: y + 46, value: `${row[2]}  /  ${row[3]}`, fill: colors.muted, size: 8.5, weight: 750, mono: true })}${text({ x: 330, y: y + 46, value: "CI PASS  •  ONLINE", fill: colors.green, size: 8, weight: 900, mono: true, anchor: "end" })}`;
    })
    .join("");

  return `<svg width="360" height="692" viewBox="0 0 360 692" fill="none" xmlns="http://www.w3.org/2000/svg">
  <style>text{letter-spacing:0}</style>
  ${rect({ x: 1, y: 1, width: 358, height: 690, fill: colors.background, stroke: colors.border, radius: 8, strokeWidth: 2 })}
  <rect x="0" y="0" width="7" height="692" rx="3.5" fill="${colors.blue}"/>
  ${text({ x: 18, y: 27, value: "PORTFÓLIO / MATRIZ DE ENTREGA", fill: colors.blue, size: 9, weight: 850, mono: true })}
  ${text({ x: 18, y: 57, value: "Seis sistemas. Evidências comparáveis.", size: 15.5, weight: 950 })}
  ${kpis}
  ${text({ x: 18, y: 214, value: "PROJETOS / ARQUITETURA / ESTADO", fill: colors.quiet, size: 8.5, weight: 800, mono: true })}
  ${cards}
  ${text({ x: 18, y: 682, value: "DADOS VERIFICADOS NOS REPOSITÓRIOS PÚBLICOS", fill: colors.quiet, size: 7.8, weight: 750, mono: true })}
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

await Promise.all(outputs.map(([filename, content]) => writeFile(resolve(assetsDir, filename), `${content}\n`, "utf8")));

console.log(`Generated ${outputs.length} detailed profile assets in ${assetsDir}`);
