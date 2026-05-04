# Saúde IA — Frontend

Frontend do **Plano de Saúde Especulativo (MVP)** — experimento crítico sobre estratificação algorítmica em saúde. Aplicação em **React + Vite + TypeScript** que consome a API Java em outro repositório.

## Conceito

O sistema demonstra como o capital econômico dita a velocidade do diagnóstico:

- **Classe B+ (VIP):** diagnóstico instantâneo via IA, agendamento automático, prioridade na fila, UI dourada/royal.
- **Classe C− (Base):** apenas dados brutos, lista de espera manual, paywalls educativos, UI cinza/azul frio.

A classe é calculada a partir de três pilares: **profissão**, **renda** e **CEP**.

## Stack

- React 19 + Vite 8 + TypeScript 6
- React Router 7
- Axios
- ESLint + Prettier
- CSS vanilla com variáveis (duas paletas: VIP e Base)

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

| Comando             | O que faz                          |
| ------------------- | ---------------------------------- |
| `npm run dev`       | Sobe o servidor de desenvolvimento |
| `npm run build`     | Faz o build de produção em `dist/` |
| `npm run preview`   | Pré-visualiza o build de produção  |
| `npm run lint`      | Roda o ESLint                      |
| `npm run lint:fix`  | Roda o ESLint corrigindo o que der |
| `npm run format`    | Formata o código com Prettier      |
| `npm run typecheck` | Checa tipos sem emitir arquivos    |

## Estrutura

```
src/
├── components/    Layout, PriorityBadge, PaywallCard
├── hooks/         useUser (estado do usuário em localStorage)
├── pages/         Home, Cadastro, Dashboard, About, NotFound
├── services/      api (axios) e userClass (classificação social)
├── types/         tipos compartilhados (User, UserClass, Hemograma, ...)
├── routes.tsx     definição das rotas
├── main.tsx       entry point
└── index.css      estilos globais com paletas VIP / Base
```

Alias `@/` aponta para `src/`.

## Backend

O backend Java (Spring Boot + Supabase + motor de IA) está em outro repositório. Ajuste `VITE_API_URL` no `.env` para apontar para a URL onde ele estiver rodando.

A lógica de classificação social está duplicada em `services/userClass.ts` apenas como mock para o MVP do front — em produção, o backend será a fonte da verdade e o front só consumirá a propriedade `userClass` do usuário.
