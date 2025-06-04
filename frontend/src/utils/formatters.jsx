// frontend/src/utils/formatters.jsx

/**
 * Formata um valor numérico para o formato de moeda brasileira (BRL).
 * @param {number} price - O valor numérico a ser formatado.
 * @returns {string} O valor formatado como string de moeda.
 */
export function formatPrice(price) {
  // Verificação básica para garantir que é um número
  if (typeof price !== 'number') {
    // Você pode retornar um valor padrão, lançar um erro, ou logar um aviso
    console.warn("formatPrice: Valor não é um número válido.", price);
    return 'R$ 0,00'; // Ou outro valor padrão
  }

  // Cria um formatador de número para moeda brasileira
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2, // Garante pelo menos 2 casas decimais
    maximumFractionDigits: 2, // Garante no máximo 2 casas decimais
  });

  return formatter.format(price);
}

// Se você tiver outras funções de formatação, pode exportá-las aqui também:
// export function formatDate(dateString) { ... }