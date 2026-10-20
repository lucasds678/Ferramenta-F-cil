const cfops = [
  { code: "1102", title: "Compra para comercialização", group: "Entrada", desc: "Compra de mercadoria para revenda, quando a operação se enquadra no âmbito interno." },
  { code: "2102", title: "Compra para comercialização", group: "Entrada", desc: "Compra de mercadoria para revenda em operação interestadual." },
  { code: "1202", title: "Devolução de venda de mercadoria adquirida ou recebida de terceiros", group: "Entrada", desc: "Usado, em regra, para registrar entrada decorrente de devolução de venda interna." },
  { code: "2202", title: "Devolução de venda de mercadoria adquirida ou recebida de terceiros", group: "Entrada", desc: "Usado, em regra, para registrar entrada decorrente de devolução de venda interestadual." },
  { code: "5102", title: "Venda de mercadoria adquirida ou recebida de terceiros", group: "Saída", desc: "Venda de mercadoria comprada ou recebida de terceiros, em operação interna." },
  { code: "6102", title: "Venda de mercadoria adquirida ou recebida de terceiros", group: "Saída", desc: "Venda de mercadoria comprada ou recebida de terceiros, em operação interestadual." },
  { code: "5405", title: "Venda de mercadoria adquirida ou recebida de terceiros sujeita à ST", group: "Saída", desc: "Código frequentemente relacionado à venda interna de mercadoria adquirida de terceiros sujeita à substituição tributária, na condição indicada pela tabela oficial." },
  { code: "6404", title: "Venda de mercadoria sujeita à ST cujo imposto já tenha sido retido anteriormente", group: "Saída", desc: "Pode se aplicar a determinadas vendas interestaduais de mercadorias sujeitas à substituição tributária; confira o enquadramento e a legislação aplicável." },
  { code: "5901", title: "Remessa para industrialização por encomenda", group: "Remessa", desc: "Remessa de insumos ou mercadorias para industrialização por encomenda em operação interna." },
  { code: "6901", title: "Remessa para industrialização por encomenda", group: "Remessa", desc: "Remessa para industrialização por encomenda em operação interestadual." },
  { code: "5902", title: "Retorno de mercadoria utilizada na industrialização por encomenda", group: "Retorno", desc: "Código associado ao retorno de mercadoria remetida para industrialização por encomenda, conforme a operação." },
  { code: "6902", title: "Retorno de mercadoria utilizada na industrialização por encomenda", group: "Retorno", desc: "Código associado ao retorno em operação interestadual, conforme a operação." },
  { code: "5910", title: "Remessa em bonificação, doação ou brinde", group: "Remessa", desc: "Remessa interna em bonificação, doação ou brinde, conforme a natureza real da operação." },
  { code: "6910", title: "Remessa em bonificação, doação ou brinde", group: "Remessa", desc: "Remessa interestadual em bonificação, doação ou brinde, conforme a natureza real da operação." },
  { code: "5929", title: "Lançamento efetuado a título de simples faturamento decorrente de emissão de cupom fiscal", group: "Saída", desc: "Código usado em situações específicas de lançamento relacionado a documento fiscal emitido anteriormente; valide as regras do estado e do caso." },
  { code: "6929", title: "Lançamento efetuado a título de simples faturamento decorrente de emissão de cupom fiscal", group: "Saída", desc: "Código associado a operação interestadual de simples faturamento decorrente de emissão de cupom fiscal, conforme regras aplicáveis." }
];

const glossary = [
  { code: "NCM", title: "Nomenclatura Comum do Mercosul", group: "Classificação", desc: "Código de oito dígitos usado para classificar mercadorias. A classificação depende das características técnicas do produto; não deve ser definida apenas pelo nome comercial." },
  { code: "CEST", title: "Código Especificador da Substituição Tributária", group: "Classificação", desc: "Código relacionado a mercadorias listadas nas regras de substituição tributária. A presença de CEST, sozinha, não confirma que toda operação terá ICMS-ST." },
  { code: "CST", title: "Código de Situação Tributária", group: "Tributação", desc: "Identifica o tratamento/situação tributária conforme o imposto e o regime aplicável. O significado deve ser lido no contexto correto." },
  { code: "CSOSN", title: "Código de Situação da Operação no Simples Nacional", group: "Tributação", desc: "Código usado em contextos de ICMS para contribuintes optantes pelo Simples Nacional, conforme as regras fiscais aplicáveis." },
  { code: "CFOP", title: "Código Fiscal de Operações e Prestações", group: "Operações", desc: "Identifica a natureza da circulação de mercadorias ou da prestação. O primeiro dígito indica, em linhas gerais, entrada/saída e origem/destino." },
  { code: "ICMS-ST", title: "ICMS por substituição tributária", group: "Tributação", desc: "Regime em que a responsabilidade pelo recolhimento do imposto é atribuída a outro contribuinte, conforme legislação aplicável." },
  { code: "DIFAL", title: "Diferencial de alíquotas", group: "Tributação", desc: "Diferença entre alíquotas interna e interestadual em situações previstas na legislação. A aplicação depende do tipo de operação e do destinatário." },
  { code: "MVA", title: "Margem de Valor Agregado", group: "Tributação", desc: "Percentual usado em determinadas fórmulas de cálculo de base de ICMS-ST. Percentuais e regras variam conforme produto e legislação." },
  { code: "NF-e", title: "Nota Fiscal eletrônica", group: "Documentos", desc: "Documento fiscal eletrônico normalmente usado para documentar operações com mercadorias." },
  { code: "NFC-e", title: "Nota Fiscal de Consumidor eletrônica", group: "Documentos", desc: "Documento eletrônico voltado, em geral, a operações de varejo destinadas ao consumidor final." },
  { code: "NFS-e", title: "Nota Fiscal de Serviços eletrônica", group: "Documentos", desc: "Documento eletrônico para registrar prestação de serviços, conforme o padrão e as regras do município ou sistema nacional aplicável." },
  { code: "CT-e", title: "Conhecimento de Transporte eletrônico", group: "Documentos", desc: "Documento fiscal eletrônico usado para documentar prestações de serviço de transporte, conforme a legislação." }
];

const officialLinks = [
  { key: "NCM", title: "Consultar NCM no Sistema Classif", desc: "Pesquisa oficial por código ou descrição, com tabela vigente, notas legais e histórico.", url: "https://portalunico.siscomex.gov.br/classif/" , label: "Abrir consulta oficial" },
  { key: "CEST", title: "Consultar regras de CEST e ICMS-ST", desc: "Consulte o Convênio ICMS 142/2018 e suas alterações, além das regras estaduais aplicáveis.", url: "https://www.confaz.fazenda.gov.br/legislacao/convenios/2018/CV142_18", label: "Abrir CONFAZ" },
  { key: "CST", title: "Consultar legislação e tabelas fiscais", desc: "Use a legislação e as tabelas oficiais aplicáveis ao imposto e ao regime da empresa.", url: "https://www.nfe.fazenda.gov.br/portal/principal.aspx", label: "Abrir Portal NF-e" },
  { key: "NF-e", title: "Portal Nacional da NF-e", desc: "Documentação, legislação, manuais e informações sobre Nota Fiscal eletrônica.", url: "https://www.nfe.fazenda.gov.br/portal/principal.aspx", label: "Abrir portal" },
  { key: "Reforma", title: "Reforma Tributária do Consumo", desc: "Acompanhe materiais e legislação publicados pela Receita Federal.", url: "https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/acoes-e-programas/programas-e-atividades/reforma-tributaria-do-consumo", label: "Abrir Receita Federal" }
];

const $ = (selector) => document.querySelector(selector);
const searchInput = $("#fiscalSearch");
const categorySelect = $("#fiscalCategory");
const results = $("#fiscalResults");
const resultCount = $("#fiscalResultCount");
const emptyState = $("#fiscalEmpty");
const normalise = (value) => String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");

function makeCard({ title, code, group, desc, url, label, kind }) {
  const article = document.createElement("article");
  article.className = "fiscal-result-card";
  const badge = document.createElement("span");
  badge.className = "fiscal-badge";
  badge.textContent = group || kind || "Consulta";
  const heading = document.createElement("h3");
  heading.textContent = code ? `${code} — ${title}` : title;
  const paragraph = document.createElement("p");
  paragraph.textContent = desc;
  article.append(badge, heading, paragraph);
  if (url) {
    const link = document.createElement("a");
    link.className = "button button-secondary";
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = label || "Consultar fonte oficial";
    article.append(link);
  }
  return article;
}

function render() {
  if (!results) return;
  const term = normalise(searchInput?.value);
  const category = categorySelect?.value || "todos";
  results.replaceChildren();
  const matches = [];

  if (category === "todos" || category === "cfop") {
    cfops.filter((item) => normalise(`${item.code} ${item.title} ${item.group} ${item.desc}`).includes(term))
      .forEach((item) => matches.push({ ...item, kind: "CFOP" }));
  }
  if (category === "todos" || category === "conceitos") {
    glossary.filter((item) => normalise(`${item.code} ${item.title} ${item.group} ${item.desc}`).includes(term))
      .forEach((item) => matches.push({ ...item, kind: "Conceito" }));
  }
  if (category === "todos" || category === "fontes") {
    officialLinks.filter((item) => normalise(`${item.key} ${item.title} ${item.desc}`).includes(term))
      .forEach((item) => matches.push({ ...item, group: "Fonte oficial", kind: item.key }));
  }

  matches.forEach((item) => results.append(makeCard(item)));
  if (resultCount) resultCount.textContent = `${matches.length} ${matches.length === 1 ? "resultado" : "resultados"}`;
  if (emptyState) emptyState.hidden = matches.length > 0;
}

searchInput?.addEventListener("input", render);
categorySelect?.addEventListener("change", render);
$("#clearFiscalSearch")?.addEventListener("click", () => {
  if (searchInput) searchInput.value = "";
  if (categorySelect) categorySelect.value = "todos";
  render();
  searchInput?.focus();
});
$("#fiscalYear").textContent = new Date().getFullYear();
render();


// Assistente de pesquisa: orienta quais dados e fontes precisam ser verificados; não decide o imposto automaticamente.
const operationForm = document.querySelector("#operationForm");
operationForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const item = document.querySelector("#operationItem").value.trim();
  const type = document.querySelector("#operationType").value;
  const origin = document.querySelector("#operationOrigin").value.trim().toUpperCase();
  const destination = document.querySelector("#operationDestination").value.trim().toUpperCase();
  const regime = document.querySelector("#operationRegime").value;
  const customer = document.querySelector("#operationCustomer").value;
  const result = document.querySelector("#operationResult");
  const steps = [];
  if (type === "servico") {
    steps.push("Identifique a atividade e o código de serviço aplicável; confirme as regras de NFS-e e ISS no município e o padrão nacional quando pertinente.");
    steps.push("NCM é classificação de mercadorias e não deve ser usada como classificação principal de um serviço.");
  } else {
    steps.push("Descreva tecnicamente a mercadoria (composição, uso, material, apresentação e características) antes de confirmar o NCM na consulta Classif.");
    steps.push("Pesquise o CFOP conforme a finalidade real da operação, se é entrada/saída e se a operação é interna ou interestadual.");
    steps.push("Verifique se há CEST e se a legislação do estado efetivamente aplica ICMS-ST ao produto e à operação; a presença de CEST não confirma, sozinha, a incidência.");
  }
  steps.push("Confirme o CST/CSOSN e o tratamento tributário de acordo com o imposto e o regime da empresa.");
  if (!origin || !destination) steps.push("Informe as UFs de origem e destino para avaliar regras internas ou interestaduais.");
  else if (origin !== destination) steps.push(`Como origem (${origin}) e destino (${destination}) são diferentes, confira regras interestaduais e eventual DIFAL/ST conforme a operação.`);
  else steps.push(`Como origem e destino foram informadas como ${origin}, confira as regras internas da UF e possíveis exceções.`);
  if (regime === "nao-informado") steps.push("Confirme o regime tributário da empresa antes de concluir a análise.");
  else steps.push(`Considere que o regime informado é ${({mei:"MEI",simples:"Simples Nacional",presumido:"Lucro Presumido",real:"Lucro Real"})[regime]}; verifique as regras específicas e a atividade efetiva.`);
  if (customer === "consumidor") steps.push("Confira regras para consumidor final, inclusive eventuais diferenças conforme a UF e o tipo de destinatário.");
  if (customer === "revenda") steps.push("Como o destinatário indicou revenda, confirme a finalidade declarada e o tratamento fiscal da circulação subsequente.");
  const list = steps.map((step) => `<li>${step}</li>`).join("");
  result.replaceChildren();
  const heading = document.createElement("strong"); heading.textContent = `Roteiro inicial para: ${item}`;
  const intro = document.createElement("p"); intro.textContent = "Use esta lista como preparação para a consulta. Ela não determina NCM, CFOP ou imposto sem análise das regras aplicáveis.";
  const ul = document.createElement("ol"); ul.innerHTML = list;
  const links = document.createElement("p"); links.innerHTML = '<a href="https://portalunico.siscomex.gov.br/classif/" target="_blank" rel="noopener noreferrer">NCM Classif</a> · <a href="https://www.nfe.fazenda.gov.br/portal/principal.aspx" target="_blank" rel="noopener noreferrer">Portal NF-e</a> · <a href="https://www.confaz.fazenda.gov.br/" target="_blank" rel="noopener noreferrer">CONFAZ</a> · <a href="https://www.gov.br/nfse/pt-br" target="_blank" rel="noopener noreferrer">Portal NFS-e</a>';
  result.append(heading, intro, ul, links); result.hidden = false;
});
