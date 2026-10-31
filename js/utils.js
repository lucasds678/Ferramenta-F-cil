
/**
 * Formata um número como moeda brasileira.
 * Exemplo: 1250.5 -> R$ 1.250,50
 */
export function formatBRL(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
}

/**
 * Lê o valor de um campo numérico.
 */
export function getNumber(input) {
  return Number(input.value);
}

/**
 * Verifica se um número é válido e finito.
 */
export function isValidNumber(value) {
  return Number.isFinite(value);
}
