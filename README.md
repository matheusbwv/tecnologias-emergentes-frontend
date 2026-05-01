# Frontend

Aplicação web em **React + Vite + TypeScript**. Consome a API Java que vive em outro repositório.

## Stack

- React 19
- Vite 8
- TypeScript 6
- React Router 7
- Axios
- ESLint + Prettier

## Pré-requisitos

- Node.js 20+ (recomendado: 24)
- npm 10+

## Como rodar

```bash
npm install
cp .env.example .env
npm run dev
```

A aplicação abre em http://localhost:5173.

## Variáveis de ambiente

| Variável       | Descrição                               | Padrão                  |
| -------------- | --------------------------------------- | ----------------------- |
| `VITE_API_URL` | URL base da API Java (backend separado) | `http://localhost:8080` |

## Scripts

| Comando             | O que faz                            |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Sobe o servidor de desenvolvimento   |
| `npm run build`     | Faz o build de produção em `dist/`   |
| `npm run preview`   | Pré-visualiza o build de produção    |
| `npm run lint`      | Roda o ESLint                        |
| `npm run lint:fix`  | Roda o ESLint corrigindo o que der   |
| `npm run format`    | Formata o código com Prettier        |
| `npm run typecheck` | Checa tipos sem emitir arquivos      |

## Estrutura de pastas

```
src/
├── components/   componentes reutilizáveis (Layout etc.)
├── hooks/        hooks customizados (useApi etc.)
├── pages/        páginas/rotas (Home, About, NotFound)
├── services/     instância do Axios e chamadas à API
├── types/        tipos TypeScript compartilhados
├── routes.tsx    definição das rotas
├── main.tsx      entry point
└── index.css     estilos globais
```

Alias `@/` aponta para `src/` (configurado em `vite.config.ts` e `tsconfig.app.json`).

## Backend

O backend Java está em outro repositório. Ajuste `VITE_API_URL` no `.env` para apontar para a URL onde ele estiver rodando.
