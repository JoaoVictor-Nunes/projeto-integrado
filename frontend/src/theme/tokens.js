/**
 * Tokens de design do SIBV, extraídos do design.md.
 * Centralizados aqui para não espalhar hex codes pelos componentes
 * (DRY) e manter a paleta institucional consistente em todo o app.
 */

export const colors = {
  tealDeep: '#0F5F59',
  ink: '#16403C',
  tealMid: '#1B7F76',
  tealPrimary: '#2A9D8F',
  tealSoft: '#4EADA2',
  tealLight: '#A8D7D2',
  tealSurface: '#E8F1F0',
  tealGhost: '#F2F7F6',
  white: '#FFFFFF',
  rest: '#F3F4F6',
  restBorder: '#DCE3E2',
  muted: '#6B7C7A',
  mutedSubtle: '#8A9896',
  success: '#2A9D8F',
  warning: '#E76F51',
  danger: '#C0392B',
  info: '#264653',
};

export const radius = {
  sm: '6px',
  field: '10px',
  md: '12px',
  card: '20px',
  pill: '9999px',
};

export const shadows = {
  sm: '0 2px 8px -2px rgba(15, 95, 89, 0.08)',
  md: '0 8px 20px -6px rgba(15, 95, 89, 0.15)',
  lg: '0 16px 36px -12px rgba(15, 95, 89, 0.22)',
};

export const easing = 'cubic-bezier(0.65, 0, 0.25, 1)';

export const transitions = {
  fast: '0.15s ease',
  normal: '0.2s ease-in-out',
  smooth: `0.45s ${easing}`,

  // Usado especificamente no drawer: largura e opacidade do rótulo
  // precisam da MESMA duração/curva para não dessincronizar a animação.
  sidebar: '0.3s ease-in-out',
};

/** Larguras do drawer, usadas por AppDrawer.jsx e HomePage.jsx. */
export const drawer = {
  collapsedWidth: 72,
  expandedWidth: 240,
};

export const header = {
  height: 70,
};