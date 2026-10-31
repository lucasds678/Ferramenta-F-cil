import { initEntrepreneurTools } from "./ferramentas/empreendedor.js";

import { initPriceCalculator } from "./ferramentas/preco-venda.js";
import { initProfitCalculator } from "./ferramentas/lucro-margem.js";

document.addEventListener("DOMContentLoaded", () => {
  initPriceCalculator();
  initProfitCalculator();
  initEntrepreneurTools();

  initSearch();
  initCategoryFilters();
  initFavoritesAndRecent();
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

    const state = window.__ffToolMode?.();
    const modeMatches = !state || state.mode === "all" || (state.mode === "favorites" ? state.favs.includes(card.dataset.toolId) : state.recents.includes(card.dataset.toolId));
    const visible = matchesSearch && matchesCategory && modeMatches;

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
    if (visibleCount === 0) emptyState.textContent = "Não encontramos ferramentas com esse termo ou filtro. Tente outra opção.";
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


function initFavoritesAndRecent() {
  const grid = document.querySelector("#toolsGrid");
  if (!grid) return;
  const favKey = "ferramentaFacil.favorites.v1";
  const recentKey = "ferramentaFacil.recent.v1";
  const get = (key) => { try { const x=JSON.parse(localStorage.getItem(key)||"[]"); return Array.isArray(x)?x:[]; } catch { return []; } };
  const set = (key,value) => { try { localStorage.setItem(key,JSON.stringify(value)); } catch {} };
  const cards = [...grid.querySelectorAll(".tool-card")];
  cards.forEach((card,index)=>{
    if(!card.dataset.toolId) card.dataset.toolId = card.dataset.toolTarget || card.querySelector("h3")?.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g,"-") || `tool-${index}`;
    const btn=document.createElement("button");btn.type="button";btn.className="favorite-toggle";btn.setAttribute("aria-label","Adicionar aos favoritos");btn.title="Adicionar aos favoritos";btn.textContent="☆";
    const update=()=>{const yes=get(favKey).includes(card.dataset.toolId);btn.textContent=yes?"★":"☆";btn.classList.toggle("is-favorite",yes);btn.setAttribute("aria-pressed",String(yes));btn.setAttribute("aria-label",yes?"Remover dos favoritos":"Adicionar aos favoritos");btn.title=yes?"Remover dos favoritos":"Adicionar aos favoritos";};
    btn.addEventListener("click",e=>{e.stopPropagation();let fav=get(favKey);fav=fav.includes(card.dataset.toolId)?fav.filter(x=>x!==card.dataset.toolId):[...fav,card.dataset.toolId];set(favKey,fav);update();if(mode==="favorites")applyMode();});
    card.appendChild(btn);update();
    card.addEventListener("click",()=>{const r=get(recentKey).filter(x=>x!==card.dataset.toolId);r.unshift(card.dataset.toolId);set(recentKey,r.slice(0,8));});
  });
  const bar=document.createElement("div");bar.className="tool-view-controls";bar.innerHTML='<button type="button" data-view="all" class="active" aria-pressed="true">Todas</button><button type="button" data-view="favorites" aria-pressed="false">★ Favoritas</button><button type="button" data-view="recent" aria-pressed="false">Recentes</button>';
  grid.parentElement.insertBefore(bar,grid);
  let mode="all";
  function applyMode(){bar.querySelectorAll("button").forEach(b=>{const active=b.dataset.view===mode;b.classList.toggle("active",active);b.setAttribute("aria-pressed",String(active));});const ids=mode==="favorites"?get(favKey):mode==="recent"?get(recentKey):null;cards.forEach(c=>{c.dataset.modeHidden=String(Boolean(ids&&!ids.includes(c.dataset.toolId)));});filterTools();}
  bar.addEventListener("click",e=>{const b=e.target.closest("button[data-view]");if(!b)return;mode=b.dataset.view;applyMode();});
  window.__ffToolMode = () => ({mode, favs:get(favKey), recents:get(recentKey)});
  applyMode();
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

