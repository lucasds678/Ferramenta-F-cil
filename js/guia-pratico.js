const input = document.getElementById("guideSearch");
const cards = [...document.querySelectorAll(".guide-card")];
const normalise = (text) => String(text || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
function filter() {
 const term = normalise(input?.value);
 let visible = 0;
 cards.forEach((card) => { const text = normalise(`${card.dataset.search || ""} ${card.textContent}`); const show = text.includes(term); card.hidden = !show; if (show) visible++; });
 document.getElementById("guideCount").textContent = `${visible} ${visible === 1 ? "tópico encontrado" : "tópicos encontrados"}`;
 document.getElementById("guideEmpty").hidden = visible > 0;
}
input?.addEventListener("input", filter);
document.getElementById("guideYear").textContent = new Date().getFullYear();
filter();
