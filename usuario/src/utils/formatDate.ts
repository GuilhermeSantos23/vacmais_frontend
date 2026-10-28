
/**
 * Formata uma data no padrão completo usado no Header.
 * Exemplo: "Terça-feira, 19 de maio de 2026".
 */
export function formatFullDate(date: Date): string {
  const formatted = date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

/**
 * Formata uma data no padrão curto dd/mm/aaaa, usado no popover de
 * alertas do sino do Header.
 * Exemplo: "19/05/2026".
 */
export function formatShortDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
