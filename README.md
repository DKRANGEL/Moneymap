# Moneymap

Personal finance dashboard — PDF statement parsing, Open Finance sync via Pluggy, and smart transaction deduplication.

---

## O que é

Moneymap é um sistema de controle financeiro pessoal web-first. O problema que resolve: ferramentas como Organizze têm integração Open Finance mas os dados chegam imprecisos e desatualizados. O Moneymap resolve isso com ingestão híbrida — extrato PDF como fonte de verdade + sync via Pluggy — com deduplicação automática entre as duas fontes.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 14 (App Router) |
| Linguagem | TypeScript strict |
| Banco de dados | Supabase (PostgreSQL) |
| ORM | Prisma 6 |
| Auth | Supabase Auth (Google OAuth) |
| Storage | Supabase Storage |
| UI | Tailwind CSS + shadcn/ui |
| Testes unitários | Vitest |
| Testes e2e | Playwright |
| Open Finance | Pluggy (v0.7) |
| PDF Parsing | pdfjs-dist (v0.6) |

---

## Como rodar localmente

### Pré-requisitos
- Node.js 18+
- Conta no [Supabase](https://supabase.com)
- Projeto configurado no Google Cloud Console (OAuth)

### Setup
```bash
# 1. Clone o repositório
git clone https://github.com/DKRANGEL/Moneymap.git
cd moneymap

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env.local
# Preencha .env.local com suas credenciais do Supabase

# 4. Rode as migrations do banco
npx prisma migrate dev

# 5. Suba o servidor de desenvolvimento
npm run dev
```

Acessa `http://localhost:3000`.

### Scripts disponíveis
```bash
npm run dev          # servidor de desenvolvimento
npm run build        # build de produção
npm run lint         # ESLint
npm run typecheck    # TypeScript sem emitir arquivos
npm test             # testes unitários (Vitest)
npm run test:e2e     # testes end-to-end (Playwright)
```

---

## Estrutura do projeto
```
src/
├── app/
│   ├── (auth)/          # rotas públicas (login)
│   ├── (dashboard)/     # rotas protegidas (dashboard, accounts, transactions)
│   └── api/             # route handlers (accounts, cards, transactions, auth)
├── components/
│   ├── auth/            # componentes de autenticação
│   ├── dashboard/        # componentes do dashboard
│   └── transactions/    # componentes de listagem e edição de transações
└── lib/
    ├── supabase/        # clientes Supabase (browser e server)
    ├── prisma.ts        # singleton do PrismaClient
    └── transactions/    # lógica de negócio de transações
```

---

## Milestones

| Versão | Feature | Status |
|---|---|---|
| v0.1 | Auth & Estrutura Base | ✅ Concluído |
| v0.2 | Contas | ✅ Concluído |
| v0.3 | Cartões & Transações | ✅ Concluído |
| v0.4 | Categorias & Regras | 🔲 Pendente |
| v0.5 | Dashboard | 🔲 Pendente |
| v0.6 | Upload de PDF | 🔲 Pendente |
| v0.7 | Integração Pluggy | 🔲 Pendente |
| v0.8 | Review de Merges | 🔲 Pendente |
| v1.0 | MVP Completo | 🔲 Pendente |

---

## Contribuindo

Veja [CONTRIBUTING.md](./CONTRIBUTING.md) para o workflow de desenvolvimento, padrões de commit, issues e PRs.