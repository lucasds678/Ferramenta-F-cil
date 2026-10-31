
import { formatBRL, getNumber, isValidNumber } from "../utils.js";

export function initProfitCalculator() {
  const form = document.querySelector("#profitForm");

  if (!form) return;

  const salePriceInput = document.querySelector("#salePrice");
  const costInput = document.querySelector("#productCost");
  const expensesInput = document.querySelector("#saleExpenses");

  const error = document.querySelector("#profitError");
  const resultBox = document.querySelector("#profitResultBox");

  const profitResult = document.querySelector("#profitResult");
  const profitStatus = document.querySelector("#profitStatus");
  const profitMargin = document.querySelector("#profitMargin");
  const costResult = document.querySelector("#profitCostResult");
  const expensesResult = document.querySelector("#profitExpensesResult");
  const explanation = document.querySelector("#profitExplanation");

  function showError(message) {
    error.textContent = message;
    error.hidden = false;
    resultBox.hidden = true;
  }

  function clearError() {
    error.textContent = "";
    error.hidden = true;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearError();

    if (!form.reportValidity()) return;

    const salePrice = getNumber(salePriceInput);
    const cost = getNumber(costInput);
    const expenses = getNumber(expensesInput);

    if (![salePrice, cost, expenses].every(isValidNumber)) {
      showError("Confira os valores informados.");
      return;
    }

    if (salePrice <= 0) {
      showError("O valor da venda deve ser maior que zero.");
      return;
    }

    if (cost < 0 || expenses < 0) {
      showError("Custo e despesas não podem ser negativos.");
      return;
    }

    const profit = salePrice - cost - expenses;
    const margin = (profit / salePrice) * 100;

    profitResult.textContent = formatBRL(profit);
    profitMargin.textContent =
      `${margin.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}%`;

    costResult.textContent = formatBRL(cost);
    expensesResult.textContent = formatBRL(expenses);

    if (profit > 0) {
      profitStatus.textContent = "A venda gerou um resultado positivo.";
      profitStatus.style.color = "#16794b";
      explanation.textContent =
        "Esse é o valor que sobra após descontar os custos e as despesas informados. Outros gastos não incluídos podem reduzir o lucro real.";
    } else if (profit < 0) {
      profitStatus.textContent = "A venda ficou abaixo dos custos informados.";
      profitStatus.style.color = "#b42318";
      explanation.textContent =
        "Você teve um prejuízo considerando esses valores. Avalie seus custos e o preço cobrado.";
    } else {
      profitStatus.textContent = "A venda cobriu exatamente os valores informados.";
      profitStatus.style.color = "#68756d";
      explanation.textContent =
        "Não houve lucro nem prejuízo considerando apenas os valores informados.";
    }

    resultBox.hidden = false;
  });

  form.addEventListener("input", () => {
    clearError();
    resultBox.hidden = true;
  });
}
