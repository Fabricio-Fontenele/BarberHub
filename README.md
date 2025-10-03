<div align="center">
  <img src="public/logo.svg" alt="BarberHub" height="70" />
  <h1>BarberHub</h1>
  <p><strong>Plataforma de agendamento para barbearias</strong></p>
  <p>
    <em>Next.js 14 (App Router) • PostgreSQL • Prisma • NextAuth (Google) • TailwindCSS • Shadcn UI • React Hook Form • Zod • Date-fns</em>
  </p>
  <p>
    <a href="#visao-geral">Visão Geral</a> •
    <a href="#stack">Stack</a> •
    <a href="#iniciando">Iniciando</a> •
    <a href="#variaveis-de-ambiente">Env</a> •
    <a href="#banco-de-dados">Banco</a> •
    <a href="#arquitetura">Arquitetura</a> •
    <a href="#fluxo-de-reserva">Fluxo de Reserva</a> •
    <a href="#roadmap">Roadmap</a> •
    <a href="#boas-praticas">Boas Práticas</a>
  </p>
</div>

---

## 📌 Visão Geral

O BarberHub é uma aplicação web que permite usuários encontrarem barbearias, visualizar serviços e realizar reservas (bookings) em horários disponíveis. O projeto utiliza o ecossistema moderno do Next.js 14 com Server Components, Prisma para ORM e autenticação via Google (NextAuth).

Atualmente a aplicação inclui:

* Listagem de barbearias (home + página de busca) com filtro por nome ou tipo de serviço
* Página detalhada da barbearia com serviços e telefones
* Fluxo de reserva (seleção de data e horário) — gravação na tabela `Booking`
* Autenticação Social (Google) com extensão de sessão para incluir `user.id`
* UI responsiva com Tailwind + componentes shadcn
* Estrutura preparada para escalabilidade (actions server-side, providers, constants)

> Status: MVP funcional inicial (há melhorias listadas no roadmap).

## 🧱 Stack

| Camada | Tecnologia |
|--------|------------|
| Framework | Next.js 14 (App Router) |
| Linguagem | TypeScript |
| UI | TailwindCSS + shadcn/ui + Radix Primitives |
| Autenticação | NextAuth (Google Provider) |
| ORM | Prisma |
| Banco | PostgreSQL (Docker) |
| Validação | Zod + React Hook Form |
| Datas | date-fns (locale pt-BR) |
| Design System | Tokens via CSS vars em `globals.css` + Tailwind config |

## 🚀 Iniciando

### Pré-requisitos

* Node.js 18+ (recomendado LTS)
* Docker + Docker Compose (ou um PostgreSQL local)
* Conta Google Cloud (para OAuth) caso use login em desenvolvimento

### Clonar e instalar

```bash
git clone https://github.com/fnetgit/BarberHub.git
cd BarberHub
npm install
```

### Subir banco via Docker

```bash
docker compose up -d
```

### Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz:

```bash
cp .env.example .env  # (caso você crie o .env.example depois)
```

Conteúdo sugerido:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/postgres?schema=public"
GOOGLE_CLIENT_ID=seu_client_id
GOOGLE_CLIENT_SECRET=seu_client_secret
NEXTAUTH_SECRET=chave_segura_gerada
NEXTAUTH_URL=http://localhost:3000
```

Gere um `NEXTAUTH_SECRET` (exemplo):

```bash
openssl rand -base64 32
```

### Rodar migrações e seed

```bash
npx prisma migrate dev
npx prisma db seed
```

> Observação: O script de seed atualmente importa de `../src/generated/prisma`, mas o schema usa o gerador padrão (`@prisma/client`). Ajuste o import para `@prisma/client` ou personalize o output no `schema.prisma` se necessário (ver seção Ajustes Recomendados).

### Iniciar aplicação

```bash
npm run dev
```

Acesse: http://localhost:3000

## 🔐 Autenticação

* Implementada com NextAuth e Google Provider
* Extensão do objeto `session.user` para incluir `id`
* Login acionado via Sidebar (Dialog + signIn("google"))
* Toast de boas-vindas controlado por `sessionStorage` para evitar repetição
* Logout com feedback via `sonner`

### Permissões Futuras (Sugestão)

* Restringir agendamentos a usuários autenticados (hoje o botão permite fluxo mas já valida se há `user`)
* Criar papéis (admin/barbearia/usuário)

## 🗃️ Banco de Dados

Entidades principais:

* `User`, `Account`, `Session`, `VerificationToken` (NextAuth)
* `Barbershop` (contém `phones` como array de string)
* `BarbershopService` (serviços com preço decimal)
* `Booking` (reserva vinculada a usuário e serviço)

Relações:

* `Barbershop` 1—N `BarbershopService`
* `BarbershopService` 1—N `Booking`
* `User` 1—N `Booking`

### Migrations

Local: `prisma/migrations/*/migration.sql`

### Seed

Cria 10 barbearias + serviços base.

## 🧬 Arquitetura

```
src/
  app/
    _actions/        # Server Actions (ex: create-booking)
    _components/     # Componentes reutilizáveis (UI + domínio)
    _constants/      # Constantes (ex: quick search)
    _lib/            # Prisma client wrapper, utils (scalável para helpers)
    _providers/      # Providers de contexto (Auth)
    api/auth/...     # NextAuth route handler
    barbershops/     # Rotas /barbershops e /barbershops/[id]
    page.tsx         # Home (SSR + fetch direto via Prisma)
    layout.tsx       # Root Layout + fontes + Toaster
prisma/
  schema.prisma
  seed.ts
```

### Decisões Técnicas

* Uso de `Server Components` em páginas para data fetching direto (reduz sobrecarga de APIs internas)
* `Server Actions` para mutações (ex: `createBooking`)
* `db` encapsulado em `prisma.ts` com cache em dev evitando múltiplas instâncias
* UI modular com `shadcn/ui` gerando consistência visual
* `Zod + RHF` para validação progressiva no componente de busca

## 🧾 Fluxo de Reserva

1. Usuário navega até a barbearia
2. Seleciona um serviço (abre Sheet)
3. Escolhe data (Calendar) e horário (lista estática)
4. Clica em Confirmar → `createBooking` grava no banco
5. Toast de sucesso

### Melhorias Planejadas

* Bloquear horários já reservados (query filtrando `Booking` por intervalo)
* Validar timezone e impedir agendamentos no passado
* Enviar e-mail ou notificação (web push / email provider)

## 🧪 Qualidade & Scripts

Scripts NPM:

| Script | Descrição |
|--------|-----------|
| `dev`  | Inicia o servidor Next em dev |
| `build`| Compila para produção |
| `start`| Executa build compilado |
| `lint` | ESLint Next config |
| `prepare` | Husky (ganchos Git) |

> Sugestão: adicionar script `prisma:studio` e `typecheck`.

## 🎨 Design System / Tokens

Definidos em `globals.css` via CSS custom properties + integração com Tailwind (`tailwind.config.ts`).

Exemplos de tokens:

* `--primary`, `--secondary`, `--background`, `--radius`
* Suporte preparado para dark mode (classe `.dark` forçada atualmente)

## 🔧 Ajustes Recomendados

| Item | Descrição |
|------|-----------|
| Seed Import | Ajustar `import { PrismaClient } from "../src/generated/prisma"` → `@prisma/client` ou configurar generator custom output |
| Horários Reservados | Filtrar horários já usados (`Booking` por `date`) |
| Internacionalização | Substituir strings fixas e criar dicionário (ex: i18n) |
| Timezone | Garantir UTC no banco + conversão local no client |
| Acessibilidade | Incluir atributos ARIA e foco gerenciado em modais/Sheets |
| Testes | Adicionar Jest/Playwright para componentes críticos |
| Observabilidade | Adicionar logger estruturado (pino) e métricas |
| Segurança | Rate limit / proteção CSRF (NextAuth já cobre base) |

## 🛡️ Variáveis de Ambiente

| Nome | Uso |
|------|-----|
| `DATABASE_URL` | Conexão PostgreSQL |
| `GOOGLE_CLIENT_ID` | OAuth Google |
| `GOOGLE_CLIENT_SECRET` | OAuth Google |
| `NEXTAUTH_SECRET` | Criptografia JWT / sessão segura |
| `NEXTAUTH_URL` | URL base (produção) |

## 🧭 Roadmap

| Fase | Meta |
|------|------|
| 1 | Exibir reservas reais por usuário na Home (substituir placeholder) |
| 2 | Bloqueio de horário + disponibilidade dinâmica |
| 3 | Painel da Barbearia (CRUD serviços, agenda) |
| 4 | Avaliações e notas de serviços/barbearias |
| 5 | Notificações (email/push) |
| 6 | Suporte PWA / Mobile-like install |
| 7 | Multi-idioma (pt-BR/en) |
| 8 | Integração pagamento / checkout opcional |

## 🤝 Contribuindo

1. Faça um fork
2. Crie uma branch: `feat/minha-feature`
3. Commit: `git commit -m "feat: adiciona X"`
4. Push: `git push origin feat/minha-feature`
5. Abra um Pull Request

> Use mensagens de commit semânticas: `feat:`, `fix:`, `chore:`, `refactor:`, etc.

## 📂 Licença

Ainda não há licença definida. Sugestão: MIT para permitir uso amplo. Crie um arquivo `LICENSE` se desejar abrir.

## 🧪 Ideias de Testes Futuramente

* Unit: validação de busca (`search.tsx`)
* Integração: criação de booking (mock prisma)
* E2E: fluxo completo login → reserva (Playwright)

## 📈 Escalabilidade

* Separar domínios (`/domains/barbershop`, `/domains/booking`)
* Implementar Camada de cache (ex: Redis) para listagens mais acessadas
* Otimizar imagens (Next Image já ajuda, adicionar loader se necessário)

## ❓ FAQ Rápido

| Pergunta | Resposta |
|----------|----------|
| Como alterar porta do Next? | `PORT=4000 npm run dev` |
| Como ver o banco? | `npx prisma studio` |
| Erro no seed? | Ajustar import do Prisma / checar `DATABASE_URL` |
| Como resetar dados? | Derrubar container, remover volume `.postgres-data` |

## 🛠️ Exemplos de Comandos Úteis

```bash
# Rodar Prisma Studio
npx prisma studio

# Gerar cliente Prisma (após alterar schema)
npx prisma generate

# Criar nova migration
echo "modifique o schema.prisma" && npx prisma migrate dev --name add_x_field
```

## 🙌 Agradecimentos

* Comunidade Next.js & Prisma
* Biblioteca shadcn/ui pelos componentes acessíveis

---
