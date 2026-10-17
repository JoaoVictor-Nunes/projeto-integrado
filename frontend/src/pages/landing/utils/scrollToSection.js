/**
 * Rola suavemente até a seção com o id informado, respeitando a
 * preferência de "reduzir movimento" do sistema (acessibilidade).
 */
export function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}