# Moneymap — Design System
> Referência visual para implementação com Tailwind CSS + shadcn/ui.
> Consulte este arquivo antes de criar qualquer componente, tela ou layout.

---

## Identidade Visual

**Nome do tema:** Obsidian Precision
**Conceito:** Interface financeira de alta precisão. Dados como protagonistas, UI como suporte. Fundo escuro profundo com accent teal cirúrgico.
**Modo:** Dark only — não há light mode no MVP.
**Fontes:** Manrope (títulos e números grandes) + Inter (labels, dados, tabelas)

---

## Paleta de Cores

### Configuração no Tailwind (`tailwind.config.ts`)

```typescript
colors: {
  surface: {
    base:    '#10141A', // fundo geral da aplicação
    low:     '#0D1117', // inputs, "wells" recuados
    card:    '#1C2026', // cards e painéis
    high:    '#24282F', // cards elevados, hover states
    bright:  '#2C3039', // elementos destacados
  },
  accent: {
    DEFAULT: '#70D8C8', // teal — ações primárias, valores positivos
    dark:    '#003731', // texto em botões com fundo teal
    dim:     '#058A7C', // gradient end, estados secundários
  },
  text: {
    primary:   '#DFE2EB', // texto principal
    secondary: '#8F9095', // labels, metadados, placeholders
    teal:      '#70D8C8', // indicadores de crescimento
  },
  status: {
    error:    '#FFB4AB', // saídas, valores negativos, erros
    warning:  '#8F9095', // avisos financeiros (cinza, não vermelho)
    success:  '#70D8C8', // entradas, valores positivos
  },
  outline: {
    DEFAULT: '#8F9095', // bordas padrão
    ghost:   'rgba(143, 144, 149, 0.15)', // "ghost border" — fallback acessível
  }
}
```

### Referência visual rápida

| Token | Hex | Uso |
|---|---|---|
| `surface-base` | `#10141A` | Fundo da aplicação |
| `surface-low` | `#0D1117` | Inputs, campos recuados |
| `surface-card` | `#1C2026` | Cards, painéis |
| `surface-high` | `#24282F` | Cards elevados, hover |
| `accent` | `#70D8C8` | Botão primário, valor positivo, sparkline |
| `text-primary` | `#DFE2EB` | Texto padrão |
| `text-secondary` | `#8F9095` | Labels, metadados |
| `status-error` | `#FFB4AB` | Saídas, negativos |

---

## Tipografia

### Fontes
```typescript
// next/font ou import direto no layout.tsx
fontFamily: {
  display: ['Manrope', 'sans-serif'],  // títulos, números grandes
  body:    ['Inter', 'sans-serif'],    // todo o resto
}
```

### Hierarquia

| Classe | Fonte | Tamanho | Uso |
|---|---|---|---|
| Display | Manrope | `text-4xl` / `text-5xl` | Saldo total, número principal da tela |
| Headline | Manrope | `text-2xl` / `text-3xl` | Títulos de seção |
| Title | Manrope | `text-xl` | Títulos de card |
| Body | Inter | `text-sm` / `text-base` | Conteúdo geral |
| Label | Inter | `text-xs` | Metadados, categorias, datas |
| Mono | Inter | `text-sm font-mono` | Valores monetários em tabelas |

### Regras
- **Nunca use branco puro** (`#FFFFFF`) — use `text-primary` (`#DFE2EB`)
- Valores positivos: `text-teal` (`#70D8C8`)
- Valores negativos: `text-status-error` (`#FFB4AB`)
- Labels de categoria: `text-secondary` em `uppercase tracking-wider text-xs`

---

## Componentes

### Botões

```tsx
// Primário — ação principal
<Button className="bg-accent text-accent-dark rounded-md hover:bg-accent/90">
  Entrar com Google
</Button>

// Secundário — ação auxiliar
<Button variant="outline" className="border-outline/15 text-text-secondary hover:bg-surface-high">
  Cancelar
</Button>

// Ghost — ação terciária
<Button variant="ghost" className="text-text-secondary hover:text-text-primary hover:bg-surface-high">
  Ver todos
</Button>
```

### Cards

```tsx
// Card padrão — sem borda, apenas shift de cor
<div className="bg-surface-card rounded-xl p-6">
  {/* conteúdo */}
</div>

// Card elevado — para hover ou estado ativo
<div className="bg-surface-high rounded-xl p-6">
  {/* conteúdo */}
</div>
```

**Regra:** nunca use `border` em cards. Separe seções por mudança de `background-color`, não por linhas.

### Inputs

```tsx
<Input className="bg-surface-low border-0 border-l-2 border-l-accent 
                  focus:ring-0 focus:border-l-accent text-text-primary 
                  placeholder:text-text-secondary" />
```

O destaque de foco é uma barra vertical teal na esquerda (`border-l-2 border-l-accent`), não um outline completo.

### Listas e tabelas

- **Nunca use linhas divisórias** (`<hr>` ou `border-b`) entre itens de lista
- Separe itens por espaçamento (`gap-4` ou `space-y-4`)
- Em tabelas densas, alterne: `bg-surface-base` e `bg-surface-card` por linha

### Valores monetários

```tsx
// Positivo
<span className="font-mono text-accent">+R$ 5.200,00</span>

// Negativo
<span className="font-mono text-status-error">-R$ 350,00</span>

// Neutro / saldo
<span className="font-display text-4xl text-text-primary">R$ 2.340,15</span>
```

---

## Layout & Espaçamento

### Sidebar
- Largura expandida: `w-56` (224px)
- Largura colapsada (icon-only): `w-14` (56px)
- Background: `bg-surface-card` — leve shift em relação ao `surface-base` do fundo, sem borda
- Item ativo: `bg-surface-high text-text-primary`
- Item inativo: `text-text-secondary hover:bg-surface-high hover:text-text-primary`

### Grid do dashboard
- Layout: sidebar fixa + área de conteúdo com `flex-1`
- Padding interno do conteúdo: `p-6` ou `p-8`
- Gap entre cards: `gap-4` ou `gap-6`
- Máximo de 4 cards por linha em tela cheia

### Espaçamento editorial
- Entre seções conceituais diferentes: `mt-12` ou `mt-16`
- Entre elementos relacionados: `gap-2` ou `gap-4`
- Não use `p-4` em tudo — varie para criar tensão visual

---

## Logo

- Arquivo: `public/logo.png`
- Conceito: gráfico de linha ascendente com eixos L e 3 data points em teal, dentro de squircle navy
- Cores: `#70D8C8` (elementos) sobre `#10141A` (fundo)
- Uso na sidebar expandida: logo + nome "Moneymap" em `font-display`
- Uso na sidebar colapsada: só o ícone SVG

---

## Do's e Don'ts

### ✅ Faça
- Use `surface-card` para cards e `surface-base` para o fundo — a diferença sutil cria profundidade
- Use `accent` (`#70D8C8`) exclusivamente para ações primárias e valores positivos
- Use `font-mono` para qualquer valor monetário em tabela ou lista
- Use `text-secondary` em uppercase + tracking para labels de categoria

### ❌ Não faça
- Não use `border` em cards — use mudança de background
- Não use `#FFFFFF` — sempre `text-primary` (`#DFE2EB`)
- Não use vermelho vivo para saídas — use `status-error` (`#FFB4AB`)
- Não use `accent` para texto geral — é reservado para accent e dados positivos
- Não use `console.log` no código (regra do projeto, não de design)