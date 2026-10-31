
import { formatBRL, getNumber, isValidNumber } from "../utils.js";

export function initPriceCalculator() {
  const form = document.querySelector("#priceForm");

  if (!form) return;

  const costInput = document.querySelector("#cost");
  const expensesInput = document.querySelector("#expenses");
  const marginInput = document.querySelector("#margin");

  const error = document.querySelector("#priceError");
  const resultBox = document.querySelector("#resultBox");

  const resultPrice = document.querySelector("#resultPrice");
  const resultCost = document.querySelector("#resultCost");
  const resultExpenses = document.querySelector("#resultExpenses");
  const resultProfit = document.querySelector("#resultProfit");
  const explanation = document.querySelector("#priceExplanation");

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

    const cost = getNumber(costInput);
    const expenses = getNumber(expensesInput);
    const margin = getNumber(marginInput);

    if (![cost, expenses, margin].every(isValidNumber)) {
      showError("Confira os valores informados.");
      return;
    }

    if (cost <= 0) {
      showError("Informe um custo maior que zero.");
      return;
    }

    if (expenses < 0 || expenses > 99.99) {
      showError("As despesas devem estar entre 0% e 99,99%.");
      return;
    }

    if (margin < 0 || margin > 99.99) {
      showError("A margem deve estar entre 0% e 99,99%.");
      return;
    }

    if (expenses + margin >= 100) {
      showError(
        "A soma das despesas e da margem deve ser menor que 100%."
      );
      return;
    }

    const price = cost / (1 - (expenses + margin) / 100);
    const expensesValue = price * expenses / 100;
    const profitValue = price * margin / 100;

    resultPrice.textContent = formatBRL(price);
    resultCost.textContent = formatBRL(cost);
    resultExpenses.textContent = formatBRL(expensesValue);
    resultProfit.textContent = formatBRL(profitValue);

    explanation.textContent =
      `Consideramos ${expenses}% do preço para despesas e ` +
      `${margin}% como margem desejada. ` +
      "Confira se todos os seus custos foram considerados.";

    resultBox.hidden = false;
  });

  form.addEventListener("input", () => {
    clearError();
    resultBox.hidden = true;
  });
}
