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
  const form = $("#productForm");
  let products = readArray(KEYS.inventory).map((p) => ({ ...p, minStock: Number(p.minStock) || 0 }));
  const movementKey = "ferramentaFacil.stockMovements.v1";
  let movements = readArray(movementKey);
  const saveProducts = () => writeArray(KEYS.inventory, products);
  const saveMovements = () => writeArray(movementKey, movements.slice(-500));
  const render = () => {
    const table = $("#inventoryTable");
    const summary = $("#inventorySummary");
    const totalStockValue = products.reduce((sum, p) => sum + Number(p.quantity || 0) * Number(p.cost || 0), 0);
    const low = products.filter((p) => Number(p.quantity || 0) <= Number(p.minStock || 0));
    summary.textContent = `${products.length} produto(s) • ${low.length} abaixo/no estoque mínimo • custo estimado: ${brl(totalStockValue)}`;
    if (!products.length) { table.innerHTML = '<p class="empty-results">Nenhum produto cadastrado ainda.</p>'; }
    else table.innerHTML = `<table class="data-table"><thead><tr><th>Produto</th><th>Código</th><th>Qtd.</th><th>Mínimo</th><th>Custo unit.</th><th>Preço venda</th><th>Valor em estoque</th><th>Ações</th></tr></thead><tbody>${products.map((p) => `<tr><td>${escapeHtml(p.name)}</td><td>${escapeHtml(p.code || "—")}</td><td class="${Number(p.quantity) <= Number(p.minStock || 0) ? "stock-low" : ""}">${Number(p.quantity).toLocaleString("pt-BR")}</td><td>${Number(p.minStock || 0).toLocaleString("pt-BR")}</td><td>${brl(p.cost)}</td><td>${brl(p.price)}</td><td>${brl(Number(p.quantity) * Number(p.cost))}</td><td><button class="small-button" type="button" data-edit-product="${p.id}">Editar</button> <button class="small-button" type="button" data-delete-product="${p.id}">Excluir</button></td></tr>`).join("")}</tbody></table>`;
    const select = $("#movementProduct");
    if (select) select.innerHTML = '<option value="">Selecione um produto</option>' + products.map((p) => `<option value="${p.id}">${escapeHtml(p.name)}${p.code ? ` (${escapeHtml(p.code)})` : ""} — saldo ${Number(p.quantity).toLocaleString("pt-BR")}</option>`).join("");
    const history = $("#movementHistory");
    if (history) history.innerHTML = movements.length ? `<table class="data-table"><thead><tr><th>Data</th><th>Produto</th><th>Tipo</th><th>Quantidade</th><th>Observação</th><th>Saldo após</th></tr></thead><tbody>${[...movements].reverse().slice(0,100).map((m) => `<tr><td>${escapeHtml(m.date)}</td><td>${escapeHtml(m.productName)}</td><td>${m.type === "in" ? "Entrada" : "Saída"}</td><td>${Number(m.quantity).toLocaleString("pt-BR")}</td><td>${escapeHtml(m.note || "—")}</td><td>${Number(m.balance).toLocaleString("pt-BR")}</td></tr>`).join("")}</tbody></table>` : '<p class="empty-results">Nenhuma movimentação registrada.</p>';
  };
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = $("#productName").value.trim();
    const code = $("#productCode").value.trim();
    const quantity = Number($("#productQuantity").value), cost = Number($("#productCost").value), price = Number($("#productPrice").value), minStock = Number($("#productMin")?.value || 0);
    if (!name || ![quantity,cost,price,minStock].every(Number.isFinite) || quantity < 0 || cost < 0 || price < 0 || minStock < 0) { alert("Confira os campos. Quantidades e valores não podem ser negativos."); return; }
    if (code && products.some((p) => String(p.code || "").toLowerCase() === code.toLowerCase() && p.id !== Number(form.dataset.editId))) { alert("Já existe um produto com esse código."); return; }
    const editId = Number(form.dataset.editId);
    if (editId) {
      const old = products.find((p) => Number(p.id) === editId);
      if (old) Object.assign(old, { name, code, quantity, cost, price, minStock });
      delete form.dataset.editId;
      const submit = form.querySelector('button[type="submit"]'); if (submit) submit.textContent = "Cadastrar produto";
    } else products.push({ id: Date.now(), name, code, quantity, cost, price, minStock });
    if (saveProducts()) { form.reset(); $("#productQuantity").value = "0"; $("#productCost").value = "0"; $("#productPrice").value = "0"; if ($("#productMin")) $("#productMin").value = "0"; render(); }
  });
  $("#inventoryTable").addEventListener("click", (event) => {
    const edit = event.target.closest("[data-edit-product]");
    if (edit) { const p = products.find((item) => Number(item.id) === Number(edit.dataset.editProduct)); if (!p) return; $("#productName").value=p.name; $("#productCode").value=p.code||""; $("#productQuantity").value=p.quantity; $("#productCost").value=p.cost; $("#productPrice").value=p.price; if ($("#productMin")) $("#productMin").value=p.minStock||0; form.dataset.editId=p.id; const submit=form.querySelector('button[type="submit"]'); if(submit)submit.textContent="Salvar alterações"; form.scrollIntoView({behavior:"smooth",block:"center"}); return; }
    const del = event.target.closest("[data-delete-product]"); if (!del) return; const id=Number(del.dataset.deleteProduct); const prod=products.find(p=>Number(p.id)===id); if(!prod)return; if(!confirm(`Excluir o produto “${prod.name}”? O histórico de movimentações será mantido.`))return; products=products.filter(p=>Number(p.id)!==id); if(saveProducts())render();
  });
  $("#exportInventoryCsv").addEventListener("click", () => downloadFile("estoque-ferramenta-facil.csv", toCsv([["Produto", "Código", "Quantidade", "Estoque mínimo", "Custo unitário", "Preço venda", "Valor em estoque"], ...products.map((p) => [p.name, p.code, p.quantity, p.minStock||0, p.cost, p.price, p.quantity * p.cost])]), "text/csv;charset=utf-8"));
  $("#exportMovementsCsv")?.addEventListener("click", () => downloadFile("movimentos-estoque-ferramenta-facil.csv", toCsv([["Data", "Produto", "Tipo", "Quantidade", "Observação", "Saldo após"], ...movements.map((m) => [m.date, m.productName, m.type === "in" ? "Entrada" : "Saída", m.quantity, m.note || "", m.balance])]), "text/csv;charset=utf-8"));
  const moveForm = $("#stockMovementForm");
  if (moveForm) moveForm.addEventListener("submit", (event) => {
    event.preventDefault(); const id=Number($("#movementProduct").value), type=$("#movementType").value, qty=Number($("#movementQty").value), product=products.find(p=>Number(p.id)===id);
    if(!product || !Number.isFinite(qty) || qty<=0){$("#movementStatus").textContent="Selecione um produto e informe uma quantidade maior que zero.";return;}
    const next=Number(product.quantity)+(type==="in"?qty:-qty); if(next<0){$("#movementStatus").textContent="Saída não registrada: o saldo ficaria negativo.";return;}
    product.quantity=Number(next.toFixed(4)); const m={id:Date.now(),date:new Date().toLocaleString("pt-BR"),productId:id,productName:product.name,type,quantity:qty,note:$("#movementNote").value.trim(),balance:product.quantity};
    if(saveProducts()){movements.push(m);if(saveMovements()){$("#movementStatus").textContent=`Movimento registrado. Novo saldo: ${product.quantity.toLocaleString("pt-BR")}.`;moveForm.reset();render();}else {movements.pop();product.quantity=Number((next+(type==="in"?-qty:qty)).toFixed(4));saveProducts();}}
  });
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
  const movementKey = "ferramentaFacil.stockMovements.v1";
  const allKeys = [...Object.values(KEYS), movementKey, "ferramentaFacil.favorites.v1", "ferramentaFacil.recent.v1"];
  $("#downloadBackup").addEventListener("click", () => {
    const data = { app: "Ferramenta Fácil", version: 2, exportedAt: new Date().toISOString(), data: {} };
    for (const key of allKeys) { try { const value=JSON.parse(localStorage.getItem(key)||"[]");data.data[key]=Array.isArray(value)?value:[]; } catch { data.data[key]=[]; } }
    downloadFile(`backup-ferramenta-facil-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(data, null, 2), "application/json");
    $("#backupStatus").textContent = "Backup gerado. Guarde o arquivo em local seguro; ele contém dados do seu negócio.";
  });
  $("#backupFile").addEventListener("change", async (event) => {
    const file=event.target.files?.[0];if(!file)return;
    try {
      if(file.size>10*1024*1024)throw new Error("O arquivo excede o limite de 10 MB.");
      const backup=JSON.parse(await file.text());
      if(backup.app!=="Ferramenta Fácil"||!backup.data||typeof backup.data!=="object"||Array.isArray(backup.data))throw new Error("Este arquivo não parece ser um backup válido do Ferramenta Fácil.");
      for(const key of allKeys){if(backup.data[key]!==undefined&&!Array.isArray(backup.data[key]))throw new Error(`O campo ${key} está inválido. Nenhum dado foi alterado.`);}
      if(!confirm("Restaurar este backup substituirá os dados locais incluídos no arquivo. Recomendamos baixar um backup atual antes. Deseja continuar?"))return;
      const previous={};for(const key of allKeys)previous[key]=localStorage.getItem(key);
      try{for(const key of allKeys){if(Array.isArray(backup.data[key]))localStorage.setItem(key,JSON.stringify(backup.data[key]));}$("#backupStatus").textContent="Backup restaurado. Atualize a página para recarregar as listas.";}
      catch(error){for(const key of allKeys){if(previous[key]===null)localStorage.removeItem(key);else localStorage.setItem(key,previous[key]);}throw error;}
    }catch(error){$("#backupStatus").textContent=error.message||"Não foi possível importar o backup.";}
    finally{event.target.value="";}
  });
}
function initFooter() { const year = $("#centralYear"); if (year) year.textContent = new Date().getFullYear(); }

document.addEventListener("DOMContentLoaded", () => { initSearch(); initXmlReader(); initInventory(); initTasks(); initBackup(); initFooter(); });
