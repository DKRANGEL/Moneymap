# Contributing — Moneymap

> Padrões de desenvolvimento do projeto Moneymap.
> Stack: Next.js 14 · Supabase · Prisma 6 · TypeScript strict · Tailwind CSS · shadcn/ui

---

## Branches

| Prefixo | Uso | Exemplo |
|---|---|---|
| `feat/` | Nova feature | `feat/auth-login-middleware-layout` |
| `fix/` | Correção de bug | `fix/gitignore-idea` |
| `chore/` | Setup, config, infra | `chore/configurar-supabase` |
| `docs/` | Documentação | `docs/wiki-arquitetura` |
| `test/` | Testes | `test/unit-dedup` |
| `refactor/` | Refatoração | `refactor/parser-nubank` |

**Regra:** `prefixo/descricao-curta`. Sempre criada a partir de `develop`. Nunca commitar direto em `main` ou `develop`.

---

## Commits (Conventional Commits)

```
<tipo>(<escopo>): <descrição em minúsculo, imperativo, sem ponto final>

[corpo opcional — o quê e por quê, não o como]

Closes #N
```

| Tipo | Quando usar |
|---|---|
| `feat` | Adiciona comportamento novo |
| `fix` | Corrige comportamento incorreto |
| `chore` | Setup, dependências, config |
| `docs` | Documentação |
| `test` | Testes |
| `refactor` | Melhoria sem mudança de comportamento |
| `style` | Formatação sem mudança de lógica |

**✅ Correto:**
```
feat(auth): implementa login Google com callback OAuth

Cria fluxo completo de autenticação via Supabase Auth.
Upsert na tabela users do Prisma no primeiro login.

Closes #8
```

**❌ Errado:**
```
ajustes
fix bug
WIP
feat: várias coisas
```

---

## Issues

### Estrutura base

```markdown
## [Tipo] Título
**Ref:** link para issue pai (se houver)
**Milestone:** vX.X - Nome

### Objetivo
### Escopo
**Fora do escopo:**
### Dependências
### Critério de Aceite
```

### Variações por tipo

**[Fix]** — substitui Escopo por: `Problema`, `Causa`, `O que deve ser feito`, `Impacto`

**[Docs]** — adiciona: `Localização`

**[Test]** — adiciona: `Tipo de teste`, `Casos de teste planejados`

**[Refactor]** — adiciona: `O que NÃO muda`, `Risco`

---

## Pull Requests

**Título:** espelha o título da issue
```
[Tipo] Descrição da issue
```

**Corpo:**
```markdown
## O que foi feito
Resumo objetivo em 2–4 linhas.

---

## Checklist
- [ ] O código compila sem erros
- [ ] Nenhum `console.log` ou código de debug esquecido
- [ ] Variáveis de ambiente adicionadas no `.env.example`
- [ ] Sem secrets ou dados sensíveis no código

---

Closes #N
```

**Regras:**
- Sem seção de Tipo — para isso existem as labels
- `Closes #N` sempre no final
- Checklist varia conforme o tipo da issue

---

## Fluxo de Release por Milestone

```
feat/* → develop       PR por issue
develop → main         PR quando todas as issues da milestone estiverem fechadas
tag vX.X.0 em main     após merge develop → main
Fechar milestone       no GitHub
```

```bash
git tag v0.X.0
git push origin v0.X.0
```