const KEYS = {
  cashFlow: "ferramentaFacil.cashFlow.v1",
  inventory: "ferramentaFacil.inventory.v1",
  tasks: "ferramentaFacil.tasks.v1"
};
const $ = (selector) => document.querySelector(selector);
const brl = (value) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value) || 0);
const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
const readArray = (key) => { try { const value = JSON.parse(localStorage.getItem(key) || "[]"); return Array.isArray(value) ? value : []; } catch { return []; } };
const writeArray = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { alert("Não foi possível salvar. O armazenamento do navegador pode estar cheio ou bloqueado."); return false; } };

const fiscalContent = [
  { title: "NCM — Nomenclatura Comum do Mercosul", text: "Código usado na classificação fiscal de mercadorias. A classificação depende das características técnicas do produto e das regras legais; não deve ser escolhida só pelo nome comercial.", terms: "ncm mercadoria produto classificação código classif", url: "https://portalunico.siscomex.gov.br/classif/" },
  { title: "CFOP — Código Fiscal de Operações e Prestações", text: "Identifica a natureza da operação ou prestação em documentos fiscais. O código depende da operação, origem, destino e contexto da movimentação.", terms: "cfop venda compra devolução retorno remessa transferência", url: "https://www.nfe.fazenda.gov.br/portal/consulta.aspx/listaConteudo.aspx?AspxAutoDetectCookieSupport=1&tipoConteudo=%2FNJarYc9nus%3D" },
  { title: "CEST", text: "Código Especificador da Substituição Tributária. A análise de enquadramento exige conferir descrição, segmento e legislação aplicável.", terms: "cest substituição tributária mercadoria", url: "https://www.confaz.fazenda.gov.br/" },
  { title: "CST e CSOSN", text: "Códigos de situação tributária utilizados conforme o regime tributário e o documento/operação. A escolha não deve ser feita sem analisar o cenário.", terms: "cst csosn simples nacional regime tributário", url: "https://www.nfe.fazenda.gov.br/portal/consulta.aspx/listaConteudo.aspx?AspxAutoDetectCookieSupport=1&tipoConteudo=%2FNJarYc9nus%3D" },
  { title: "IBS e CBS — Reforma Tributária", text: "Tributos previstos no novo modelo de tributação sobre o consumo. Confira legislação, cronograma e regras de transição em fontes oficiais.", terms: "ibs cbs reforma tributária imposto seletivo transição", url: "https://www.gov.br/fazenda/pt-br/assuntos/reforma-tributaria" },
  { title: "NF-e e NFC-e", text: "Documentos fiscais eletrônicos. O Portal Nacional da NF-e reúne manuais, notas técnicas, tabelas e orientações de uso.", terms: "nfe nf-e nfc-e nota fiscal eletrônica cupom fiscal xml danfe rejeição", url: "https://www.nfe.fazenda.gov.br/portal/principal.aspx" },
  { title: "NFS-e", text: "Nota Fiscal de Serviço eletrônica. Regras e sistemas podem variar conforme o município e o modelo nacional aplicável.", terms: "nfse nfs-e nota serviço prefeitura município", url: "https://www.gov.br/nfse/pt-br" },
  { title: "MEI — obrigações e serviços", text: "Consulte serviços, orientações e obrigações oficiais para microempreendedores individuais.", terms: "mei DAS declaração anual faturamento empreendedor", url: "https://www.gov.br/empresas-e-negocios/pt-br/empreendedor" },
  { title: "ICMS-ST e DIFAL", text: "A aplicação depende da legislação pertinente, do estado, da mercadoria, da operação e do regime do contribuinte. Use fontes oficiais para confirmar o tratamento.", terms: "icms st difal mva gnre estado tributação", url: "https://www.confaz.fazenda.gov.br/" }
];

function initSearch() {
  const form = $("#centralSearchForm");
  const queryInput = $("#centralQuery");
  const cx = window.FERRAMENTA_FACIL_CONFIG?.googleCx?.trim();
  const googleContainer = $("#googleCseContainer");
  if (cx && cx !== "COLE_SEU_ID_CX_AQUI") {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://cse.google.com/cse.js?cx=${encodeURIComponent(cx)}`;
    document.head.appendChild(script);
    googleContainer.innerHTML = '<div class="gcse-search" data-gname="ffsearch"></div>';
    $("#googleSetupMessage").textContent = "Pesquisa do Google incorporada. Os resultados são fornecidos pelo mecanismo configurado no Google.";
  }
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = queryInput.value.trim();
    if (!query) return;
    const useGoogle = $("#searchGoogle").checked;
    const useOfficial = $("#searchOfficial").checked;
    const useLocal = $("#searchLocal").checked;
    const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    $("#googleFallback").href = googleUrl;
    $("#googleFallback").hidden = !useGoogle;
    $("#googleSearchArea").hidden = !useGoogle;
    if (useGoogle && googleContainer.firstElementChild && window.google?.search?.cse?.element) {
      try { window.google.search.cse.element.getElement("ffsearch")?.execute(query); } catch { /* O usuário ainda pode usar o link de pesquisa. */ }
    }
    const localResults = $("#localSearchResults");
    if (useLocal) {
      const normalized = normalize(query);
      const words = normalized.split(/\s+/).filter((word) => word.length > 2);
      const matches = fiscalContent.map((item) => ({ ...item, score: words.reduce((score, word) => score + (normalize(`${item.title} ${item.text} ${item.terms}`).includes(word) ? 1 : 0), 0) })).filter((item) => item.score > 0).sort((a, b) => b.score - a.score).slice(0, 5);
      localResults.innerHTML = `<h3>Resultados na base local</h3>${matches.length ? matches.map((item) => `<article class="local-result"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p><a href="${item.url}" target="_blank" rel="noopener noreferrer">Conferir fonte de referência ↗</a></article>`).join("") : '<div class="empty-results">Não encontrei uma correspondência na pequena base local atual. Tente o Google e as fontes oficiais abaixo.</div>'}`;
      localResults.hidden = false;
    } else { localResults.hidden = true; localResults.innerHTML = ""; }
    const official = $("#officialSearchLinks");
    if (useOfficial) {
      const sources = [
        ["Receita Federal", "site:gov.br/receitafederal"],
        ["Portal da NF-e", "site:nfe.fazenda.gov.br"],
        ["CONFAZ", "site:confaz.fazenda.gov.br"],
        ["Portal do Empreendedor", "site:gov.br/empresas-e-negocios"]
      ];
      official.innerHTML = `<h3>Pesquisar nas fontes oficiais</h3><div class="official-grid">${sources.map(([name, filter]) => `<a class="official-card" href="https://www.google.com/search?q=${encodeURIComponent(`${query} ${filter}`)}" target="_blank" rel="noopener noreferrer"><strong>${name}</strong><span>Pesquisar “${escapeHtml(query)}” neste domínio</span></a>`).join("")}</div>`;
      official.hidden = false;
    } else { official.hidden = true; official.innerHTML = ""; }
    const target = useLocal ? localResults : (useOfficial ? official : $("#googleSearchArea"));
    target?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}
function normalize(value) { return String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR"); }

function initXmlReader() {
  $("#xmlFile").addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    const status = $("#xmlStatus");
    const results = $("#xmlResults");
    results.hidden = true; results.innerHTML = "";
    if (!file) { status.textContent = "Nenhum arquivo selecionado."; return; }
    if (file.size > 15 * 1024 * 1024) { status.textContent = "Arquivo maior que 15 MB. Escolha um XML menor."; return; }
    try {
      const text = await file.text();
      const xml = new DOMParser().parseFromString(text, "application/xml");
      if (xml.querySelector("parsererror")) throw new Error("O arquivo não parece ser um XML válido.");
      const all = [...xml.getElementsByTagName("*")];
      const first = (name, root = xml) => [...root.getElementsByTagName("*")].find((node) => node.localName === name)?.textContent?.trim() || "—";
      const findNode = (name, root = xml) => [...root.getElementsByTagName("*")].find((node) => node.localName === name);
      const ide = findNode("ide"); const emit = findNode("emit"); const dest = findNode("dest"); const total = findNode("ICMSTot");
      const details = all.filter((node) => node.localName === "det");
      const rows = [
        ["Número da nota", first("nNF", ide || xml)], ["Série", first("serie", ide || xml)], ["Data de emissão", first("dhEmi", ide || xml) !== "—" ? first("dhEmi", ide || xml) : first("dEmi", ide || xml)],
        ["Emitente", first("xNome", emit || xml)], ["CNPJ emitente", first("CNPJ", emit || xml)], ["Destinatário", first("xNome", dest || xml)], ["CNPJ/CPF destinatário", first("CNPJ", dest || xml) !== "—" ? first("CNPJ", dest || xml) : first("CPF", dest || xml)],
        ["Valor total da NF", first("vNF", total || xml)], ["ICMS informado", first("vICMS", total || xml)], ["PIS informado", first("vPIS", total || xml)], ["COFINS informado", first("vCOFINS", total || xml)]
      ];
      const itemRows = details.map((detail) => {
        const prod = [...detail.getElementsByTagName("*")].find((node) => node.localName === "prod");
        const get = (name) => first(name, prod || detail);
        return [get("cProd"), get("xProd"), get("NCM"), get("CFOP"), get("qCom"), get("vUnCom"), get("vProd")];
      });
      results.innerHTML = `<h3>Resumo do documento</h3><table class="data-table"><tbody>${rows.map(([label, value]) => `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`).join("")}</tbody></table><h3 style="margin-top:22px">Itens (${itemRows.length})</h3>${itemRows.length ? `<table class="data-table"><thead><tr><th>Código</th><th>Descrição</th><th>NCM</th><th>CFOP</th><th>Qtd.</th><th>Valor unit.</th><th>Total item</th></tr></thead><tbody>${itemRows.map((row) => `<tr>${row.map((value) => `<td>${escapeHtml(value)}</td>`).join("")}</tr>`).join("")}</tbody></table>` : '<p>Não foram encontrados itens no formato esperado.</p>'}`;
      results.hidden = false;
      status.textContent = `Arquivo lido localmente: ${file.name}. Confira os campos exibidos; formatos e campos podem variar.`;
    } catch (error) { status.textContent = error.message || "Não foi possível ler o XML."; }
  });
}

function initInventory() {
  const form = $("#productForm"); let products = readArray(KEYS.inventory);
  const render = () => {
    const table = $("#inventoryTable");
    const summary = $("#inventorySummary");
    const totalStockValue = products.reduce((sum, p) => sum + p.quantity * p.cost, 0);
    summary.textContent = `${products.length} produto(s) • custo estimado do estoque: ${brl(totalStockValue)}`;
    if (!products.length) { table.innerHTML = '<p class="empty-results">Nenhum produto cadastrado ainda.</p>'; return; }
    table.innerHTML = `<table class="data-table"><thead><tr><th>Produto</th><th>Código</th><th>Qtd.</th><th>Custo unit.</th><th>Preço venda</th><th>Valor em estoque</th><th>Ação</th></tr></thead><tbody>${products.map((p) => `<tr><td>${escapeHtml(p.name)}</td><td>${escapeHtml(p.code || "—")}</td><td class="${p.quantity <= 2 ? "stock-low" : ""}">${p.quantity}</td><td>${brl(p.cost)}</td><td>${brl(p.price)}</td><td>${brl(p.quantity * p.cost)}</td><td><button class="small-button" type="button" data-delete-product="${p.id}">Excluir</button></td></tr>`).join("")}</tbody></table>`;
  };
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    products.push({ id: Date.now(), name: $("#productName").value.trim(), code: $("#productCode").value.trim(), quantity: Number($("#productQuantity").value), cost: Number($("#productCost").value), price: Number($("#productPrice").value) });
    if (writeArray(KEYS.inventory, products)) { form.reset(); $("#productQuantity").value = "0"; $("#productCost").value = "0"; $("#productPrice").value = "0"; render(); }
  });
  $("#inventoryTable").addEventListener("click", (event) => { const button = event.target.closest("[data-delete-product]"); if (!button) return; products = products.filter((p) => p.id !== Number(button.dataset.deleteProduct)); writeArray(KEYS.inventory, products); render(); });
  $("#exportInventoryCsv").addEventListener("click", () => downloadFile("estoque-ferramenta-facil.csv", toCsv([["Produto", "Código", "Quantidade", "Custo unitário", "Preço venda", "Valor em estoque"], ...products.map((p) => [p.name, p.code, p.quantity, p.cost, p.price, p.quantity * p.cost])]), "text/csv;charset=utf-8"));
  render();
}

function initTasks() {
  const form = $("#taskForm"); let tasks = readArray(KEYS.tasks);
  $("#taskDate").value = new Date().toISOString().slice(0, 10);
  const render = () => {
    const list = $("#taskList");
    tasks.sort((a, b) => a.date.localeCompare(b.date));
    if (!tasks.length) { list.innerHTML = '<p class="empty-results">Nenhum lembrete cadastrado.</p>'; return; }
    const today = new Date().toISOString().slice(0, 10);
    list.innerHTML = tasks.map((task) => `<article class="task-item ${task.date < today ? "task-overdue" : ""}"><div><strong>${escapeHtml(task.title)}</strong><small>${escapeHtml(task.category)} • ${escapeHtml(task.date)}${task.date < today ? " • data passada" : ""}</small></div><button class="small-button" type="button" data-delete-task="${task.id}">Concluir/remover</button></article>`).join("");
  };
  form.addEventListener("submit", (event) => { event.preventDefault(); tasks.push({ id: Date.now(), title: $("#taskTitle").value.trim(), date: $("#taskDate").value, category: $("#taskCategory").value }); if (writeArray(KEYS.tasks, tasks)) { form.reset(); $("#taskDate").value = new Date().toISOString().slice(0, 10); render(); } });
  $("#taskList").addEventListener("click", (event) => { const button = event.target.closest("[data-delete-task]"); if (!button) return; tasks = tasks.filter((task) => task.id !== Number(button.dataset.deleteTask)); writeArray(KEYS.tasks, tasks); render(); });
  render();
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type }); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = filename; document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
}
function toCsv(rows) { return "\uFEFF" + rows.map((row) => row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(";")).join("\r\n"); }
function initBackup() {
  $("#downloadBackup").addEventListener("click", () => {
    const data = { app: "Ferramenta Fácil", version: 1, exportedAt: new Date().toISOString(), data: {} };
    for (const key of Object.values(KEYS)) { try { data.data[key] = JSON.parse(localStorage.getItem(key) || "[]"); } catch { data.data[key] = []; } }
    downloadFile(`backup-ferramenta-facil-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(data, null, 2), "application/json");
    $("#backupStatus").textContent = "Backup gerado. Guarde o arquivo em local seguro.";
  });
  $("#backupFile").addEventListener("change", async (event) => {
    const file = event.target.files?.[0]; if (!file) return;
    try {
      const backup = JSON.parse(await file.text());
      if (backup.app !== "Ferramenta Fácil" || !backup.data || typeof backup.data !== "object") throw new Error("Este arquivo não parece ser um backup válido do Ferramenta Fácil.");
      if (!confirm("Restaurar este backup substituirá os dados locais de fluxo de caixa, estoque e lembretes. Deseja continuar?")) return;
      for (const key of Object.values(KEYS)) { if (Array.isArray(backup.data[key])) localStorage.setItem(key, JSON.stringify(backup.data[key])); }
      $("#backupStatus").textContent = "Backup restaurado. Atualize a página para atualizar todas as telas.";
    } catch (error) { $("#backupStatus").textContent = error.message || "Não foi possível importar o backup."; }
    event.target.value = "";
  });
}
function initFooter() { const year = $("#centralYear"); if (year) year.textContent = new Date().getFullYear(); }

document.addEventListener("DOMContentLoaded", () => { initSearch(); initXmlReader(); initInventory(); initTasks(); initBackup(); initFooter(); });
