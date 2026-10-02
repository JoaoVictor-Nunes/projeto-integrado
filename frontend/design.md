# Sistema Integrado de Biblioteca Virtual (SIBV) — Design System & Style Guide

Este documento define os padrões visuais, tokens de design, regras de experiência de usuário (UX) e componentes de interface para o ecossistema do **SIBV (Sistema Integrado de Biblioteca Virtual)**, projetado especificamente para instituições de ensino superior e técnico (alunos, professores, pesquisadores e bibliotecários).

A referência estética direta é a interface de autenticação do sistema, unindo seriedade acadêmica, ergonomia de leitura prolongada e toques modernos de interação com microtransições suaves.

## 1. Princípios do Produto & Filosofia de Design

1. **Foco Acadêmico e Imersão Cognitiva:**
   O ambiente deve transmitir clareza, confiança e silêncio visual, facilitando a consulta de acervos, leitura de e-books, pesquisas bibliográficas e artigos científicos sem distrações sensoriais.

2. **Acessibilidade e Ergonomia de Leitura (WCAG 2.1 AA):**
   Contraste rigoroso em textos informativos e metadados de livros (ISBN, autores, ano, classificação decimal), suporte a leitores de tela e estados de foco nítidos para navegação por teclado.

3. **Fluidez e Feedback Tátil:**
   Interações inspiradas nos campos dinâmicos da autenticação: foco expansivo com elevação (`scale: 1.02`), transições suaves (`cubic-bezier(.65, 0, .25, 1)`) e feedback contextual em tempo real.

4. **Hierarquia Institucional Clássica:**
   Destaque para títulos com peso `600/700`, cartões com raios confortáveis (`16px` a `20px`) e sombras sutis tingidas pelo tom institucional escuro (`rgba(15, 95, 89, ...)`).

## 2. Tokens de Design (Design Tokens)

### 2.1 Paleta de Cores

A cor mestre é o tom institucional **Teal (`#2A9D8F`)**, enriquecido por suas variantes tonais e semânticas. Nenhuma cor externa deve competir com a família de tons verde-petróleo/teal.

#### Escala Principal (Teal & Ink)

| Token | Hex | Papel e Aplicação | 
 | ----- | ----- | ----- | 
| `--teal-deep` | `#0F5F59` | Superfícies institucionais escuras, gradientes de destaque, cabeçalhos de tabelas, títulos hero | 
| `--teal-dark` | `#16403C` (`--ink`) | Cor primária para textos, títulos, elementos de altíssimo contraste e menus laterais recolhidos | 
| `--teal-mid` | `#1B7F76` | Estado hover de botões primários, gradientes intermediários e bordas ativas | 
| `--teal-primary` | `#2A9D8F` | **Cor Mestre do Sistema**. Botões primários, foco de campos, badges de destaque, links ativos | 
| `--teal-soft` | `#4EADA2` | Estados de hover em ícones, sublinhados interativos e gráficos de empréstimos | 
| `--teal-light` | `#A8D7D2` | Bordas ativas secundárias, barras de progresso (trilhas), seletores sutis | 
| `--teal-surface` | `#E8F1F0` | Fundo principal da aplicação (`body bg`), painéis de visualização neutros | 
| `--teal-ghost` | `#F2F7F6` | Fundo de cartões de leitura, hover de listas e linhas alternadas de tabelas | 

#### Neutros e Superfícies

| Token | Hex | Papel e Aplicação | 
 | ----- | ----- | ----- | 
| `--white` | `#FFFFFF` | Superfície de cartões, modais, dropdowns, texto sobre fundos escuros | 
| `--rest` | `#F3F4F6` | Fundo de campos em repouso (`input fields`), áreas desabilitadas | 
| `--rest-border` | `#DCE3E2` | Bordas neutras de cartões, divisores e inputs em estado natural | 
| `--muted` | `#6B7C7A` | Textos de apoio, metadados de livros (autor, ano, ISBN), placeholders | 
| `--muted-subtle` | `#8A9896` | Ícones inativos, contadores secundários e tooltips neutros | 

#### Semântica & Alertas

| Token | Hex | Fundo Associado | Aplicação no Contexto da Biblioteca | 
 | ----- | ----- | ----- | ----- | 
| `--success` | `#2A9D8F` | `#E8F5F3` | Exemplar disponível para retirada imediata, devolução confirmada | 
| `--warning` | `#E76F51` | `#FDF3EF` | Reserva prestes a expirar, prazo de entrega próximo (48h) | 
| `--danger` | `#C0392B` | `#FDF3F1` | Multas pendentes, atraso na devolução, campos com erro de validação | 
| `--info` | `#264653` | `#EAF0F2` | Normas ABNT, comunicados de recesso acadêmico, manutenções | 

### 2.2 Variáveis CSS Globais (`:root`)

```
:root {
  /* Cores Principais */
  --teal-primary: #2A9D8F;
  --teal-deep: #0F5F59;
  --teal-mid: #1B7F76;
  --teal-soft: #4EADA2;
  --teal-light: #A8D7D2;
  --teal-surface: #E8F1F0;
  --teal-ghost: #F2F7F6;
  
  /* Textos e Neutros */
  --ink: #16403C;
  --muted: #6B7C7A;
  --muted-subtle: #8A9896;
  --rest: #F3F4F6;
  --rest-border: #DCE3E2;
  --white: #FFFFFF;
  
  /* Semântica */
  --success: #2A9D8F;
  --warning: #E76F51;
  --error: #C0392B;
  --info: #264653;

  /* Geometria e Raios */
  --radius-sm: 6px;
  --radius-field: 10px;
  --radius-md: 12px;
  --radius-card: 20px;
  --radius-pill: 9999px;

  /* Sombras Institucionais */
  --shadow-sm: 0 2px 8px -2px rgba(15, 95, 89, 0.08);
  --shadow-md: 0 8px 20px -6px rgba(15, 95, 89, 0.15);
  --shadow-lg: 0 16px 36px -12px rgba(15, 95, 89, 0.22);
  --shadow-card: 0 24px 60px -18px rgba(15, 95, 89, 0.35), 0 6px 18px -6px rgba(15, 95, 89, 0.18);
  --shadow-focus: 0 10px 24px -8px rgba(42, 157, 143, 0.6);
  --shadow-btn: 0 10px 22px -10px rgba(42, 157, 143, 0.8);

  /* Transições e Curvas */
  --ease: cubic-bezier(0.65, 0, 0.25, 1);
  --transition-fast: 0.15s ease;
  --transition-normal: 0.2s ease-in-out;
  --transition-smooth: 0.45s cubic-bezier(0.65, 0, 0.25, 1);
}

```

## 3. Tipografia

A fonte primária adotada é **Poppins** (Google Fonts), garantindo legibilidade geométrica precisa, modernidade e ótima definição em telas retina.

```
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">

```

### Escala Tipográfica

| Nível / Uso | Tamanho | Peso | Line Height | Letter Spacing | Elemento Exemplo | 
 | ----- | ----- | ----- | ----- | ----- | ----- | 
| **Display Hero** | `2.25rem` (36px) | 700 Bold | `1.15` | `-0.02em` | Boas-vindas, banner da biblioteca | 
| **Heading 1** | `1.75rem` (28px) | 700 Bold | `1.2` | `-0.015em` | Título de seções do acervo | 
| **Heading 2** | `1.5rem` (24px) | 600 SemiBold | `1.25` | `-0.01em` | Títulos de modais, título do livro | 
| **Heading 3** | `1.25rem` (20px) | 600 SemiBold | `1.3` | `0` | Subseções, categorias de pesquisa | 
| **Body Large** | `1rem` (16px) | 500 Medium | `1.5` | `0` | Botões, destaques de resenha | 
| **Body Base** | `0.95rem` (15.2px) | 400 Regular | `1.5` | `0` | Texto corrido, sinopses, inputs | 
| **Body Small** | `0.875rem` (14px) | 400/500 | `1.4` | `0.01em` | Metadados (ISBN, autor, editora) | 
| **Caption / Badge** | `0.75rem` (12px) | 600 SemiBold | `1.2` | `0.02em` | Etiquetas de status, badges, tags | 

## 4. Componentes de Interface (UI Library)

### 4.1 Campos de Entrada de Dados (Form Inputs)

Inspirados diretamente na interação da tela de autenticação do SIBV:

* **Estado Normal:** Fundo `--rest` (`#F3F4F6`), borda `--rest-border`, texto `--ink`.

* **Hover:** Expansão sutil `transform: scale(1.02)`, borda `--teal-primary` e sombra suave.

* **Focus-Within (Destaque Ativo SIBV):** Preenchimento total com `--teal-primary`, texto branco, ícone branco e cursor branco (`caret-color: #FFF`).

* **Estado Inválido:** Borda `--error`, fundo `#FDF3F1` quando fora de foco.

```
.field {
  position: relative;
  display: flex;
  align-items: center;
  height: 52px;
  padding: 0 16px;
  gap: 12px;
  background: var(--rest);
  border: 1px solid var(--rest-border);
  border-radius: var(--radius-field);
  color: var(--muted);
  transition: transform var(--transition-normal),
              box-shadow var(--transition-normal),
              background-color var(--transition-normal),
              border-color var(--transition-normal),
              color var(--transition-normal);
}

.field input, .field select {
  flex: 1;
  border: 0;
  outline: 0;
  background: transparent;
  font: inherit;
  font-size: 0.95rem;
  color: var(--ink);
  caret-color: var(--teal-primary);
}

.field:hover {
  transform: scale(1.015);
  background: var(--white);
  border-color: var(--teal-primary);
  box-shadow: 0 8px 20px -8px rgba(42, 157, 143, 0.45);
}

.field:focus-within {
  transform: scale(1.015);
  background: var(--teal-primary);
  border-color: var(--teal-primary);
  color: var(--white);
  box-shadow: var(--shadow-focus);
}

.field:focus-within input {
  color: var(--white);
  caret-color: var(--white);
}

.field:focus-within input::placeholder {
  color: rgba(255, 255, 255, 0.8);
}

```

### 4.2 Botões (Buttons)

1. **Primário (`.btn-primary`):** Ação de alta relevância (Reservar Livro, Renovar Empréstimo, Salvar, Entrar).

   * Fundo: `--teal-primary` (`#2A9D8F`)

   * Hover: `#23877B` + elevação `translateY(-1px)`

   * Sombra: `var(--shadow-btn)`

2. **Secundário / Outline (`.btn-outline`):** Ações complementares (Ver Detalhes, Baixar Ficha Catalográfica).

   * Borda: `1.5px solid var(--teal-primary)`, fundo transparente, texto `var(--teal-primary)`.

   * Hover: fundo `rgba(42, 157, 143, 0.08)`.

3. **Ghost (`.btn-ghost`):** Uso em cards de destaque ou painéis coloridos (como o Hero do Login).

   * Borda: `1.5px solid rgba(255, 255, 255, 0.9)`, texto branco, borda `pílula` (`9999px`).

4. **Alerta / Destrutivo (`.btn-danger`):** Cancelamento de reservas, exclusão de itens.

   * Fundo: `var(--error)`, hover: `#A93226`.

### 4.3 Cartão de Obra do Acervo (Book / Media Card)

O principal elemento do catálogo do SIBV.

```
+--------------------------------------------------------+
| [Capa do Livro / Thumbnail]              [Badge Status]|
|                                                        |
+--------------------------------------------------------+
| Título da Obra (SemiBold 16px, line-clamp 2)          |
| Autor Principal • Ano • Edição                         |
| Área: Engenharia de Software / CDU                     |
|                                                        |
| [Status: 3 Disponíveis]             [Btn: Reservar]   |
+--------------------------------------------------------+

```

* **Container:** Fundo `var(--white)`, borda `1px solid var(--rest-border)`, raio `var(--radius-md)`.

* **Efeito Hover:** Elevação sutil `transform: translateY(-4px)`, sombra `var(--shadow-md)` com acento teal.

* **Capas:** Proporção `3:4` para livros impressos/e-books; `16:9` para teses e videoaulas complementares.

### 4.4 Badges de Disponibilidade e Status

Formato pílula (`rounded-full`), altura `24px`, fonte `0.75rem` e peso `600`.

* **Disponível:** Fundo `#E8F5F3`, Texto `#0F5F59`, Borda `1px solid #A8D7D2`.

* **Emprestado:** Fundo `#F3F4F6`, Texto `#6B7C7A`, Borda `1px solid #DCE3E2`.

* **Reserva Próxima / Atrasado:** Fundo `#FDF3EF`, Texto `#C0392B`, Borda `1px solid #F5C6CB`.

* **Exemplar Digital (E-book):** Fundo `var(--teal-primary)`, Texto `#FFFFFF`.

### 4.5 Barra de Pesquisa Avançada do Acervo (Search Bar)

A barra de busca deve ser robusta, permitindo pesquisa instantânea com filtros rápidos (Título, Autor, Assunto, ISBN).

* Altura: `58px`.

* Ícone de Lupa à esquerda em `var(--muted)`.

* Seletor de escopo (ex: "Todo o acervo", "Apenas E-books", "Artigos Acadêmicos").

* Atalho de teclado visível: `[Ctrl + K]`.

## 5. Estrutura de Layout e Navegação

### 5.1 Visão Geral do App Autenticado

```
+-------------------------------------------------------------------------------+
| SIBV [Logo]    [ Barra de Pesquisa Global Ctrl+K ]      [Avisos] [Perfil/Matrícula] |
+-------------------------------------------------------------------------------+
| MENU LATERAL   | CONTEÚDO PRINCIPAL (Fundo: #E8F1F0)                           |
|                |                                                              |
| • Início       | Hero Acadêmico / Destaques da Semana                         |
| • Meu Acervo   | +----------------------------------------------------------+ |
| • Empréstimos  | | Grid de Livros / Minhas Reservas Ativas                  | |
| • Renovações   | | [Card 1]   [Card 2]   [Card 3]   [Card 4]                | |
| • Artigos/TCC  | +----------------------------------------------------------+ |
| • Normas ABNT  |                                                              |
| • Histórico    | Tabela de Prazos de Devolução Próximos                      |
+----------------+--------------------------------------------------------------+

```

### 5.2 Header Institucional

* Fundo: `var(--white)` com borda inferior `1px solid var(--rest-border)`.

* Altura: `70px`.

* Itens: Identidade visual SIBV, campo de pesquisa central expandido e badge de empréstimos ativos do usuário.

### 5.3 Sidebar (Menu do Estudante/Docente)

* Estado recolhido: `72px` (apenas ícones).

* Estado expandido: `240px` (ícones + rótulos de navegação).

* Item selecionado: Fundo `var(--teal-ghost)`, borda lateral esquerda de `4px solid var(--teal-primary)`, texto e ícone em `var(--teal-deep)`.

## 6. Padrões de Conteúdo e Acessibilidade Institucional

1. **Denominação e Vocabulário:**

   * Usar termos acadêmicos padronizados: *Acervo Geral*, *Reserva de Obra*, *Renovação de Empréstimo*, *Ficha Catalográfica*, *Repositório Institucional*.

   * Mensagens de confirmação claras (ex.: *"Empréstimo renovado com sucesso até 14/11/2026"*).

2. **Acessibilidade por Teclado:**

   * Qualquer card, input ou botão deve possuir estado de foco nítido:
     `outline: 3px solid rgba(42, 157, 143, 0.45); outline-offset: 2px;`

3. **Redução de Movimento:**

   * Respeitar `@media (prefers-reduced-motion: reduce)` anulando durações de animações em conformidade com o código da tela de login.

## 7. Checklist para Implementação de Novas Telas

* \[ \] A cor predominante da ação é `#2A9D8F` ou suas variações diretas (`#0F5F59`, `#1B7F76`).

* \[ \] O fundo de tela utiliza `#E8F1F0` para áreas neutras e `#FFFFFF` para superfícies de leitura/cards.

* \[ \] Os inputs de formulário adotam o padrão interativo do SIBV (hover scale e preenchimento teal no foco).

* \[ \] A tipografia utiliza estritamente **Poppins** com pesos 400, 500, 600 ou 700.

* \[ \] Os estados de disponibilidade (livre, reservado, atrasado) seguem a paleta semântica documentada.

* \[ \] Sombras e raios de borda respeitam os tokens `--radius-card` (20px) e `--radius-field` (10px).

```

O arquivo `design.md` foi gerado e documenta o ecossistema visual do **SIBV**, mantendo a cor `#2A9D8F` como âncora, integrando a tipografia Poppins e replicando as dinâmicas de foco e botões presentes na tela de autenticação.

```