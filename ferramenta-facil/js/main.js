import { initEntrepreneurTools } from "./ferramentas/empreendedor.js";

import { initPriceCalculator } from "./ferramentas/preco-venda.js";
import { initProfitCalculator } from "./ferramentas/lucro-margem.js";

document.addEventListener("DOMContentLoaded", () => {
  initPriceCalculator();
  initProfitCalculator();
  initEntrepreneurTools();

  initSearch();
  initCategoryFilters();
  initToolNavigation();
  initComingSoonMessages();
  initFooterYear();
});

// Busca ferramentas pelo título, descrição e palavras-chave.
function initSearch() {
  const searchInput = document.querySelector("#searchInput");

  if (!searchInput) return;

  searchInput.addEventListener("input", filterTools);
}

// Configura os filtros de categoria.
function initCategoryFilters() {
  // Seleciona somente os botões de filtro.
  const filterButtons = document.querySelectorAll(
    ".filter-button[data-category]"
  );

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((item) => {
        item.classList.remove("active");
        item.setAttribute("aria-pressed", "false");
      });

      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");

      filterTools();
    });
  });
}

// Aplica simultaneamente a busca e o filtro selecionado.
function filterTools() {
  const searchInput = document.querySelector("#searchInput");

  const activeFilter = document.querySelector(
    ".filter-button.active[data-category]"
  );

  const cards = document.querySelectorAll(".tool-card");
  const count = document.querySelector("#toolsCount");
  const emptyState = document.querySelector("#emptyState");

  const searchTerm = (searchInput?.value || "")
    .trim()
    .toLocaleLowerCase("pt-BR");

  const category = activeFilter?.dataset.category || "todas";

  let visibleCount = 0;

  cards.forEach((card) => {
    const title = card.querySelector("h3")?.textContent || "";
    const description = card.querySelector("p")?.textContent || "";
    const keywords = card.dataset.search || "";

    const searchableText =
      `${title} ${description} ${keywords}`.toLocaleLowerCase("pt-BR");

    const matchesSearch = searchableText.includes(searchTerm);

    const matchesCategory =
      category === "todas" || card.dataset.category === category;

    const visible = matchesSearch && matchesCategory;

    card.hidden = !visible;

    if (visible) {
      visibleCount++;
    }
  });

  if (count) {
    count.textContent =
      `${visibleCount} ${
        visibleCount === 1 ? "ferramenta" : "ferramentas"
      }`;
  }

  if (emptyState) {
    emptyState.hidden = visibleCount > 0;
  }
}

// Configura os cliques nos cards e nos botões das ferramentas.
function initToolNavigation() {
  const cards = document.querySelectorAll(".tool-card");

  document.querySelectorAll("button[data-scroll-target]").forEach((button) => {
    button.addEventListener("click", () => {
      scrollToSection(button.dataset.scrollTarget);
    });
  });

  cards.forEach((card) => {
    card.addEventListener("click", (event) => {
      // Se clicou no botão ou em outro elemento interativo,
      // deixa o comportamento original desse elemento funcionar.
      if (event.target.closest("button, a, input")) {
        return;
      }

      const target = card.dataset.toolTarget;

      // Cards com calculadoras: desloca até a seção correspondente.
      if (target) {
        scrollToSection(target);
        return;
      }

      // Cards ainda em desenvolvimento: mostra a mensagem de aviso.
      const comingSoonButton = card.querySelector(
        "button[data-coming='true']"
      );

      comingSoonButton?.click();
    });
  });

  // Mantém funcionando os botões originais.
  const openCalculator = document.querySelector("#openCalculator");
  const openProfitCalculator = document.querySelector(
    "#openProfitCalculator"
  );

  openCalculator?.addEventListener("click", () => {
    scrollToSection("#calculadora");
  });

  openProfitCalculator?.addEventListener("click", () => {
    scrollToSection("#lucro-margem");
  });
}

// Desloca a página até uma seção existente.
function scrollToSection(selector) {
  const section = document.querySelector(selector);

  if (!section) {
    console.warn(`Não foi encontrada a seção: ${selector}`);
    return;
  }

  section.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

// Exibe avisos para ferramentas ainda não disponíveis.
function initComingSoonMessages() {
  const buttons = document.querySelectorAll(
    "button[data-coming='true']"
  );

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      showToast(
        "Essa ferramenta ainda está sendo desenvolvida. Em breve teremos novidades!"
      );
    });
  });
}

// Controla a duração da mensagem temporária.
let toastTimeout;

function showToast(message) {
  const toast = document.querySelector("#toast");

  if (!toast) return;

  window.clearTimeout(toastTimeout);

  toast.textContent = message;
  toast.hidden = false;

  toastTimeout = window.setTimeout(() => {
    toast.hidden = true;
  }, 3500);
}

// Atualiza o ano do rodapé automaticamente.
function initFooterYear() {
  const year = document.querySelector("#year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }
}

// Atalho "/" para acessar rapidamente a busca.
document.addEventListener("keydown", (event) => {
  const searchInput = document.querySelector("#searchInput");
  const activeElement = document.activeElement;

  const isTyping = activeElement?.matches(
    "input, textarea, select, [contenteditable='true']"
  );

  if (
    event.key === "/" &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.altKey &&
    !event.shiftKey &&
    !isTyping
  ) {
    event.preventDefault();
    searchInput?.focus();
  }
});
