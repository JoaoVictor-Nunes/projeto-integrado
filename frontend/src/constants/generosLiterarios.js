export const GRUPOS_GENEROS_LITERARIOS = [
  {
    grupo: "Ficção e Narrativa",
    generos: [
      "Romance",
      "Conto",
      "Crônica",
      "Novela",
      "Fábula",
      "Fantasia",
      "Ficção Científica",
      "Distopia",
      "Aventura",
      "Suspense / Thriller",
      "Mistério / Policial",
      "Terror / Horror",
      "Ficção Histórica",
      "Realismo Mágico",
      "Epistolar / Diário",
      "Sátira / Humor",
    ],
  },
  {
    grupo: "Lírico, Épico e Dramático",
    generos: [
      "Poesia / Lírico",
      "Drama / Teatro",
      "Épico / Epopéia",
      "Mitologia / Folclore",
      "Cordel / Literatura Popular",
      "Clássicos da Literatura",
    ],
  },
  {
    grupo: "Infantojuvenil e Visual",
    generos: [
      "Literatura Infantil",
      "Infantojuvenil",
      "Quadrinhos / Mangá / Graphic Novel",
    ],
  },
  {
    grupo: "Não-Ficção e Acadêmico",
    generos: [
      "Didático / Acadêmico",
      "Biografia / Autobiografia",
      "Memórias",
      "Ensaio",
      "Artigo Científico",
      "Crítica Literária",
      "História e Ciências Humanas",
      "Filosofia e Sociologia",
      "Ciências Exatas e Naturais",
      "Técnico / Profissional",
      "Autoajuda / Desenvolvimento Pessoal",
      "Religioso / Espiritualidade",
    ],
  },
];

export const GENEROS_LITERARIOS = GRUPOS_GENEROS_LITERARIOS.flatMap(
  (item) => item.generos
);

export const ETAPAS_ENSINO = [
  { value: "FUNDAMENTAL", label: "Ensino Fundamental" },
  { value: "MEDIO", label: "Ensino Médio" },
  { value: "AMBOS", label: "Fundamental e Médio" },
];

export const etapaLabel = (valor) =>
  ETAPAS_ENSINO.find((e) => e.value === valor)?.label || "—";
