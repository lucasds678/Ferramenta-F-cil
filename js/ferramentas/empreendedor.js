import { formatBRL } from "../utils.js";

const byId = (id) => document.getElementById(id);
const numberFrom = (id) => Number(byId(id)?.value);
const showError = (id, message = "") => {
  const element = byId(id);
  if (!element) return;
  element.textContent = message;
  element.hidden = !message;
};
const showResult = (id) => {
  const element = byId(id);
  if (element) element.hidden = false;
};
const setText = (id, value) => {
  const element = byId(id);
  if (element) element.textContent = value;
};
const isFiniteNonNegative = (value) => Number.isFinite(value) && value >= 0;
const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[char]));

export function initEntrepreneurTools() {
  initDiscountCalculator();
  initCommissionCalculator();
  initMarkupCalculator();
  initAverageCostCalculator();
  initBreakEvenCalculator();
  initSalesGoalCalculator();
  initReceiptGenerator();
  initCashFlow();
}

function initDiscountCalculator() {
  const form = byId("discountForm");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const base = numberFrom("discountBase");
    const percent = numberFrom("discountPercent");
    const mode = byId("discountMode").value;
    if (!Number.isFinite(base) || base <= 0 || !isFiniteNonNegative(percent) || percent > 1000 || (mode === "discount" && percent > 100)) {
      showError("discountError", "Informe um preço maior que zero e um percentual válido. Desconto não pode ultrapassar 100%.");
      return;
    }
    const difference = base * percent / 100;
    const finalPrice = mode === "discount" ? base - difference : base + difference;
    showError("discountError");
    setText("discountFinal", formatBRL(finalPrice));
    setText("discountDifference", `${mode === "discount" ? "−" : "+"} ${formatBRL(difference)}`);
    setText("discountExplanation", mode === "discount" ? `O desconto de ${percent.toLocaleString("pt-BR")} % reduz o preço original.` : `O acréscimo de ${percent.toLocaleString("pt-BR")} % aumenta o preço original.`);
    showResult("discountResultBox");
  });
}

function initCommissionCalculator() {
  const form = byId("commissionForm");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const sales = numberFrom("commissionSales");
    const rate = numberFrom("commissionRate");
    if (!isFiniteNonNegative(sales) || !Number.isFinite(rate) || rate < 0 || rate > 100) {
      showError("commissionError", "Informe um total de vendas válido e uma comissão entre 0% e 100%.");
      return;
    }
    const commission = sales * rate / 100;
    showError("commissionError");
    setText("commissionResult", formatBRL(commission));
    setText("commissionNet", formatBRL(sales - commission));
    showResult("commissionResultBox");
  });
}

function initMarkupCalculator() {
  const form = byId("markupForm");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const cost = numberFrom("markupCost");
    const rate = numberFrom("markupRate");
    if (!Number.isFinite(cost) || cost <= 0 || !isFiniteNonNegative(rate) || rate > 10000) {
      showError("markupError", "Informe um custo maior que zero e um percentual de markup válido.");
      return;
    }
    const gain = cost * rate / 100;
    showError("markupError");
    setText("markupPrice", formatBRL(cost + gain));
    setText("markupGain", formatBRL(gain));
    showResult("markupResultBox");
  });
}

function initAverageCostCalculator() {
  const form = byId("averageCostForm");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const qty1 = numberFrom("purchaseQty1");
    const cost1 = numberFrom("purchaseCost1");
    const qty2 = numberFrom("purchaseQty2");
    const cost2 = numberFrom("purchaseCost2");
    if (![qty1, cost1, qty2, cost2].every(Number.isFinite) || qty1 <= 0 || qty2 <= 0 || cost1 < 0 || cost2 < 0) {
      showError("averageCostError", "Informe quantidades maiores que zero e custos iguais ou maiores que zero.");
      return;
    }
    const totalQty = qty1 + qty2;
    const totalCost = qty1 * cost1 + qty2 * cost2;
    showError("averageCostError");
    setText("averageCostResult", formatBRL(totalCost / totalQty));
    setText("averageTotalQty", totalQty.toLocaleString("pt-BR", { maximumFractionDigits: 2 }));
    setText("averageTotalCost", formatBRL(totalCost));
    showResult("averageCostResultBox");
  });
}

function initBreakEvenCalculator() {
  const form = byId("breakEvenForm");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const fixed = numberFrom("fixedCosts");
    const price = numberFrom("unitPrice");
    const variable = numberFrom("variableCost");
    if (![fixed, price, variable].every(Number.isFinite) || fixed < 0 || price <= 0 || variable < 0) {
      showError("breakEvenError", "Confira os valores. O preço precisa ser maior que zero e os custos não podem ser negativos.");
      return;
    }
    const contribution = price - variable;
    if (contribution <= 0) {
      showError("breakEvenError", "O preço de venda precisa ser maior que o custo variável por unidade para cobrir os custos fixos.");
      return;
    }
    const units = Math.ceil(fixed / contribution);
    showError("breakEvenError");
    setText("breakEvenUnits", `${units.toLocaleString("pt-BR")} ${units === 1 ? "unidade" : "unidades"}`);
    setText("breakEvenRevenue", formatBRL(units * price));
    setText("breakEvenExplanation", `Com ${units} unidades, a contribuição estimada cobre os custos fixos informados. O resultado não inclui outros custos que não foram registrados.`);
    showResult("breakEvenResultBox");
  });
}

function initSalesGoalCalculator() {
  const form = byId("salesGoalForm");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const goal = numberFrom("salesGoal");
    const profit = numberFrom("profitPerUnit");
    if (!Number.isFinite(goal) || goal <= 0 || !Number.isFinite(profit) || profit <= 0) {
      showError("salesGoalError", "Informe uma meta e um lucro por unidade maiores que zero.");
      return;
    }
    const units = Math.ceil(goal / profit);
    showError("salesGoalError");
    setText("salesGoalUnits", `${units.toLocaleString("pt-BR")} ${units === 1 ? "unidade" : "unidades"}`);
    setText("salesGoalTotal", formatBRL(units * profit));
    showResult("salesGoalResultBox");
  });
}

function initReceiptGenerator() {
  const form = byId("receiptForm");
  if (!form) return;
  const dateInput = byId("receiptDate");
  if (dateInput && !dateInput.value) dateInput.value = new Date().toISOString().slice(0, 10);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const issuer = byId("receiptIssuer").value.trim();
    const payer = byId("receiptPayer").value.trim();
    const amount = numberFrom("receiptAmount");
    const description = byId("receiptDescription").value.trim();
    const date = byId("receiptDate").value;
    const location = byId("receiptLocation").value.trim();
    if (!issuer || !payer || !Number.isFinite(amount) || amount <= 0 || !description || !date) {
      showError("receiptError", "Preencha os campos obrigatórios e informe um valor maior que zero.");
      return;
    }
    const [year, month, day] = date.split("-");
    const formattedDate = `${day}/${month}/${year}`;
    const preview = byId("receiptPreview");
    preview.innerHTML = `<div class="receipt-paper"><h2>RECIBO</h2><p>Recebi de <strong>${escapeHTML(issuer)}</strong> a quantia de <strong>${escapeHTML(formatBRL(amount))}</strong>, referente a: ${escapeHTML(description)}.</p><p>Recebedor: <strong>${escapeHTML(payer)}</strong></p><p>${location ? `${escapeHTML(location)}, ` : ""}${formattedDate}</p><div class="receipt-signature"><span>________________________________</span><strong>${escapeHTML(payer)}</strong><small>Assinatura do recebedor</small></div></div>`;
    showError("receiptError");
    showResult("receiptResultBox");
  });
  byId("printReceipt")?.addEventListener("click", () => {
    const paper = byId("receiptPreview")?.innerHTML;
    if (!paper) return;
    const printWindow = window.open("", "_blank", "width=800,height=650");
    if (!printWindow) {
      showError("receiptError", "O navegador bloqueou a janela de impressão. Permita pop-ups para este site e tente novamente.");
      return;
    }
    printWindow.document.open();
    printWindow.document.write(`<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Recibo</title><style>body{font-family:Arial,sans-serif;color:#222;padding:40px}.receipt-paper{max-width:700px;margin:30px auto;border:1px solid #ddd;padding:36px;line-height:1.8}.receipt-paper h2{text-align:center;letter-spacing:2px;margin-bottom:36px}.receipt-signature{display:flex;flex-direction:column;align-items:center;margin-top:70px}.receipt-signature small{color:#555}</style></head><body>${paper}<script>window.onload=()=>{window.print();};<\/script></body></html>`);
    printWindow.document.close();
  });
}

function initCashFlow() {
  const form = byId("cashFlowForm");
  if (!form) return;
  // Os movimentos ficam salvos apenas neste navegador (localStorage), sem nuvem ou banco de dados.
  const storageKey = "ferramentaFacil.cashFlow.v1";
  let movements = [];
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
    if (Array.isArray(saved)) movements = saved.filter((item) => item && Number.isFinite(item.id) && typeof item.description === "string" && ["entrada", "saida"].includes(item.type) && Number.isFinite(item.amount) && item.amount > 0);
  } catch (error) {
    console.warn("Não foi possível recuperar o fluxo de caixa salvo neste navegador.", error);
  }
  let nextId = movements.reduce((max, item) => Math.max(max, item.id), 0) + 1;
  const saveMovements = () => {
    try { localStorage.setItem(storageKey, JSON.stringify(movements)); }
    catch (error) { console.warn("Não foi possível salvar o fluxo de caixa neste navegador.", error); }
  };

  const render = () => {
    const income = movements.filter((item) => item.type === "entrada").reduce((sum, item) => sum + item.amount, 0);
    const expenses = movements.filter((item) => item.type === "saida").reduce((sum, item) => sum + item.amount, 0);
    setText("cashIncome", formatBRL(income));
    setText("cashExpenses", formatBRL(expenses));
    setText("cashBalance", formatBRL(income - expenses));
    const list = byId("cashMovementList");
    if (!list) return;
    if (!movements.length) {
      list.innerHTML = '<li class="cash-empty">Nenhuma movimentação adicionada.</li>';
      return;
    }
    list.innerHTML = movements.map((item) => `<li><div><strong>${escapeHTML(item.description)}</strong><small>${item.type === "entrada" ? "Entrada" : "Saída"}</small></div><strong class="cash-${item.type}">${item.type === "entrada" ? "+" : "−"} ${formatBRL(item.amount)}</strong><button type="button" class="cash-remove" data-remove-movement="${item.id}" aria-label="Remover ${escapeHTML(item.description)}">Remover</button></li>`).join("");
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const description = byId("cashDescription").value.trim();
    const type = byId("cashType").value;
    const amount = numberFrom("cashAmount");
    if (!description || !Number.isFinite(amount) || amount <= 0) return;
    movements.push({ id: nextId++, description, type, amount });
    saveMovements();
    form.reset();
    byId("cashType").value = "entrada";
    byId("cashDescription").focus();
    render();
  });

  byId("cashMovementList")?.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-remove-movement]");
    if (!button) return;
    const id = Number(button.dataset.removeMovement);
    movements = movements.filter((item) => item.id !== id);
    saveMovements();
    render();
  });

  byId("exportCashFlowCsv")?.addEventListener("click", () => {
    const header = ["Descrição", "Tipo", "Valor (R$)"];
    const rows = movements.map((item) => [item.description, item.type === "entrada" ? "Entrada" : "Saída", item.amount.toFixed(2).replace(".", ",")]);
    const csv = "\uFEFF" + [header, ...rows].map((row) => row.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(";")).join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href=url; a.download="fluxo-de-caixa-ferramenta-facil.csv"; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  byId("clearCashFlow")?.addEventListener("click", () => {
    if (!window.confirm("Deseja apagar todas as movimentações salvas neste navegador?")) return;
    movements = [];
    saveMovements();
    render();
  });
  render();
}
