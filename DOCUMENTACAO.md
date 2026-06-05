# Documentação Frontend — Atlas Saúde

> Plataforma especulativa de saúde que demonstra estratificação algorítmica no acesso a serviços médicos. Experimento crítico sobre como o capital econômico influencia a velocidade do diagnóstico.

---

## Sumário

1. [Visão Geral do Projeto](#1-visão-geral-do-projeto)
2. [Stack Tecnológica](#2-stack-tecnológica)
3. [Estrutura de Diretórios](#3-estrutura-de-diretórios)
4. [Roteamento e Navegação](#4-roteamento-e-navegação)
5. [Gerenciamento de Estado](#5-gerenciamento-de-estado)
6. [Páginas e Funcionalidades](#6-páginas-e-funcionalidades)
7. [Componentes Reutilizáveis](#7-componentes-reutilizáveis)
8. [Hooks Customizados](#8-hooks-customizados)
9. [Serviços e Integração com API](#9-serviços-e-integração-com-api)
10. [Algoritmo de Classificação de Usuário](#10-algoritmo-de-classificação-de-usuário)
11. [Sistema de Design e Temas Visuais](#11-sistema-de-design-e-temas-visuais)
12. [Variáveis de Ambiente](#12-variáveis-de-ambiente)
13. [Build e Deploy](#13-build-e-deploy)
14. [Detalhes de Implementação Notáveis](#14-detalhes-de-implementação-notáveis)

---

## 1. Visão Geral do Projeto

**Atlas Saúde** é um MVP experimental de plataforma de saúde que ilustra como algoritmos podem reforçar desigualdades econômicas. O sistema classifica usuários em classes (A, B, C, D, E) com base em profissão, renda e CEP. Usuários de classes premium (A e B) recebem diagnóstico assistido por IA, agendamento prioritário e análises avançadas. Usuários de classes padrão (C, D, E) recebem apenas dados brutos e encontram paywalls para funcionalidades avançadas.

O frontend conecta-se a uma API Java hospedada no Heroku.

---

## 2. Stack Tecnológica

| Tecnologia | Versão | Finalidade |
|---|---|---|
| React | 19.2.5 | Framework UI principal |
| TypeScript | 6.0.2 | Tipagem estática |
| Vite | 8.0.10 | Build tool e servidor de desenvolvimento |
| React Router DOM | 7.1.3 | Roteamento client-side (hash-based) |
| Recharts | 3.8.1 | Visualização de dados (gráficos e charts) |
| Lucide React | 1.14.0 | Biblioteca de ícones |
| Axios | 1.7.9 | Cliente HTTP com interceptor de erros |
| CSS Vanilla | — | Estilização com variáveis CSS (sem framework) |
| ESLint | 10.2.1 | Linting com plugins React hooks e refresh |
| Prettier | 3.4.2 | Formatação de código |

---

## 3. Estrutura de Diretórios

```
tecnologias-emergentes-frontend/
├── public/
│   └── .nojekyll                  # Compatibilidade com GitHub Pages
├── src/
│   ├── assets/
│   │   ├── humanoid.png           # Avatar do scanner biométrico
│   │   └── humanoid.webp
│   ├── components/
│   │   ├── Layout.tsx             # Wrapper principal (header, nav, footer)
│   │   ├── PriorityBadge.tsx      # Badge de tier do usuário (Crown / Clock)
│   │   ├── PaywallCard.tsx        # Card de funcionalidade bloqueada
│   │   └── GoogleAd.tsx           # Mock visual dos slots de anúncio do plano básico
│   ├── hooks/
│   │   ├── useUser.ts             # Estado do usuário via localStorage
│   │   └── useHemogram.ts         # Busca de dados de hemograma
│   ├── pages/
│   │   ├── Home.tsx               # Landing page com hero e CTA
│   │   ├── About.tsx              # Info da clínica e comparação de planos
│   │   ├── Cadastro.tsx           # Formulário de registro/onboarding
│   │   ├── Dashboard.tsx          # Dashboard principal (duas variantes)
│   │   ├── Pacientes.tsx          # Admin: listagem e gestão de pacientes
│   │   ├── Hospitais.tsx          # Admin: gestão da rede hospitalar
│   │   ├── Agenda.tsx             # Admin: agendamento de consultas
│   │   ├── Exames.tsx             # Histórico e relatórios de exames
│   │   └── NotFound.tsx           # Página 404
│   ├── services/
│   │   ├── api.ts                 # Instância Axios + tratamento de erros
│   │   ├── customer.ts            # CRUD de pacientes
│   │   ├── exam.ts                # Endpoints de exames/hemograma
│   │   ├── hospital.ts            # Gestão de hospitais
│   │   ├── schedule.ts            # Agendamento de consultas
│   │   ├── address.ts             # Gestão de endereços
│   │   └── userClass.ts           # Algoritmo de classificação + mapeamentos
│   ├── types/
│   │   └── index.ts               # Tipos TypeScript compartilhados
│   ├── routes.tsx                 # Definição das rotas
│   ├── main.tsx                   # Entry point do React
│   └── index.css                  # Estilos globais
├── index.html                     # Template HTML (root #root)
├── vite.config.ts                 # Configuração do Vite
├── tsconfig.json                  # Configuração TypeScript
├── eslint.config.js               # Configuração ESLint (flat config)
├── .prettierrc                    # Configuração Prettier
└── package.json
```

---

## 4. Roteamento e Navegação

O projeto utiliza **hash-based routing** (`createHashRouter`) do React Router DOM, o que permite deploy no GitHub Pages sem configuração de servidor.

### Rotas Definidas

| Caminho | Componente | Descrição |
|---|---|---|
| `/` | `Home` | Landing page com hero cards e chamada para ação |
| `/cadastro` | `Cadastro` | Formulário de registro de paciente |
| `/dashboard` | `Dashboard` | Dashboard principal adaptado ao plano do usuário |
| `/pacientes` | `Pacientes` | Listagem administrativa de pacientes com CRUD |
| `/hospitais` | `Hospitais` | Gestão administrativa da rede hospitalar |
| `/agenda` | `Agenda` | Agendamento de consultas e relatórios |
| `/exames` | `Exames` | Histórico de exames e relatórios |
| `/sobre` | `About` | Sobre a clínica e comparação de planos |
| `*` | `NotFound` | Página 404 |

### Layout

O componente `Layout.tsx` envolve todas as rotas e fornece:
- **Header sticky** com logo e botão de toggle do menu mobile
- **Menu de navegação responsivo** com links principais
- **Footer** com copyright
- **Toggle de tema escuro** disponível nas rotas de dashboard

---

## 5. Gerenciamento de Estado

O projeto adota gerenciamento de estado simples e direto, sem bibliotecas externas como Redux ou Zustand.

### Estado do Usuário — `useUser.ts`

Persiste via **localStorage** e armazena:

```ts
{
  id: string
  customerId: string
  nome: string
  email: string
  profissao: string
  renda: number
  cep: string
  userClass: 'A' | 'B' | 'C' | 'D' | 'E'
}
```

- `setUser(data)` — salva o usuário no localStorage
- `logout()` — define o usuário como `null`, removendo-o do localStorage (o redirecionamento é feito pelo componente que chama o hook)

### Estado do Hemograma — `useHemogram.ts`

- Busca dados de hemograma do backend via `exam.ts`
- Suporta **modo mock** (`VITE_USE_MOCK=true`) para testes offline
- Gerencia estados de `loading` e `error`
- Cacheia dados no estado React da sessão atual

### Estado de Formulários

- `useState` no nível do componente (formulários controlados)
- Validação inline com atributos HTML5
- Sem biblioteca de formulários externa

---

## 6. Páginas e Funcionalidades

### 6.1 Home (`Home.tsx`)

Landing page da plataforma.

- Hero section com headline e subtítulo
- Cards de destaque das funcionalidades
- Botão CTA direcionando para `/cadastro`
- Link para a página `/sobre`

---

### 6.2 Cadastro (`Cadastro.tsx`)

Formulário de onboarding do paciente.

**Campos:**
- Nome completo
- E-mail
- Profissão (select com opções predefinidas)
- Renda mensal (select com faixas)
- CEP (com máscara automática `XXXXX-XXX`)
- Rua, cidade, número

**Fluxo:**
1. Usuário preenche o formulário
2. O algoritmo de classificação calcula a classe (A–E) com base em profissão + renda + CEP
3. Uma requisição `POST /customer` cria o paciente no backend
4. Os dados são salvos no localStorage via `useUser`
5. Redirecionamento automático para `/dashboard`

**Validações:**
- Campos obrigatórios com feedback visual
- CEP limitado a 8 dígitos com formatação automática
- Tratamento de erros da API com mensagens amigáveis

---

### 6.3 Dashboard (`Dashboard.tsx`)

Principal funcionalidade do sistema. Renderiza **duas variantes** distintas com base na classe do usuário.

#### Dashboard Premium (Classes A e B)

Tema escuro com estética futurista/holográfica.

**Scanner Biométrico:**
- Figura humanoide SVG com marcadores interativos
- Quatro pontos vitais com animações de pulso:
  - **Pescoço** — Sistema Imunológico (Leucócitos/WBC)
  - **Tórax** — Cardiopulmonar (Hemoglobina)
  - **Abdômen** — Circulação (Hemácias/RBC)
  - **Medula** — Plaquetas
- Cores por status: `baixo` (azul), `normal` (verde), `alto` (vermelho)

**Gráfico de Evolução Clínica:**
- Gráfico de área (12 meses) com `Recharts`
- Exibe tendência de Hemoglobina e Hemácias
- Gradiente visual e tooltip interativo customizado

**Índices de Referência:**
- Barras de progresso para cada indicador
- Exibe % dentro do intervalo clínico normal
- Score clínico (ex: A+)
- Cores: vermelho (hemoglobina), violeta (RBC), verde (WBC), dourado (plaquetas)

**Relatório com IA:**
- Relatório gerado por IA com badge de confiança de 97%
- Exibido em card de destaque

**Gráfico de Aderência Semanal:**
- Gráfico de barras com destaque no pico da semana

**Outros:**
- Badge de prioridade (Crown)
- Exibição da hora atual em tempo real
- Botão de logout

#### Dashboard Padrão (Classes C, D e E)

Tema claro com estética simples e profissional.

**Conteúdo:**
- Card com resultados brutos do hemograma
- Banner informativo sobre tempo de espera (14–28 dias)
- Slots de anúncio mockados (banner, in-feed, lateral) para simular a experiência do plano gratuito
- Cards bloqueados (paywall) com CTA para upgrade Premium
- Botão de confirmação da próxima consulta

---

### 6.4 Pacientes (`Pacientes.tsx`)

Painel administrativo para gestão de pacientes.

- Tabela paginada com todos os pacientes cadastrados
- Colunas: ID, Nome, E-mail, Plano (Premium/Standard), Cidade
- Botão de exclusão com confirmação
- Controles de paginação

---

### 6.5 Hospitais (`Hospitais.tsx`)

Painel administrativo para gestão da rede hospitalar.

**Formulário de cadastro:**
- Nome / Categoria do hospital
- Tipo: Público ou Privado
- Endereço: Cidade, Rua, Número

**Lista de hospitais:**
- Tabela paginada com unidades cadastradas
- Exclusão com confirmação

---

### 6.6 Agenda (`Agenda.tsx`)

Gestão de agendamentos de consultas.

**Criação de agendamento:**
- Campos: Código de serviço, Paciente (select), Hospital (select), Data e hora
- Requer ao menos um paciente e um hospital cadastrados

**Listagem:**
- Tabela de consultas agendadas ordenada por data
- Relatório unificado de agendamentos

---

### 6.7 Exames (`Exames.tsx`)

Histórico e relatórios de exames.

- Tabela com todos os exames: tipo, paciente, data, status
- Pills de status: `Normal` (verde) ou `Alterado` (laranja)
- Relatório separado com hemogramas normais e seus resultados

---

### 6.8 Sobre (`About.tsx`)

Página institucional da clínica.

- Informações sobre a clínica
- Tabela comparativa dos planos Premium vs. Standard
- Destaque das funcionalidades exclusivas de cada plano

---

### 6.9 NotFound (`NotFound.tsx`)

Página 404 com link de retorno para a home.

---

## 7. Componentes Reutilizáveis

### `Layout.tsx`

Wrapper de layout global. Envolve todas as rotas via `<Outlet />`.

- Header com logo e menu de navegação
- Menu mobile com toggle (hamburger) e fechamento ao clicar fora
- Footer com copyright
- Suporte a toggle de tema escuro para rotas do dashboard

### `PriorityBadge.tsx`

Badge visual que indica o tier do usuário.

- **Premium (A/B):** ícone de coroa dourada + label "Priority"
- **Standard (C/D/E):** ícone de relógio + label "Standard"

### `PaywallCard.tsx`

Card de funcionalidade bloqueada para usuários Standard.

- Ícone de cadeado
- Título e descrição da funcionalidade bloqueada
- Botão CTA para upgrade de plano

### `GoogleAd.tsx`

Mock visual dos slots de anúncio exibidos no plano básico.

- Renderiza um placeholder estilizado no lugar de um anúncio real
- Serve para demonstrar a diferença de experiência entre o plano gratuito (com anúncios) e o Premium (sem anúncios)
- Recebe `slot`, `format`, `label` e `style` via props para simular diferentes formatos

---

## 8. Hooks Customizados

### `useUser.ts`

```ts
const { user, setUser, logout } = useUser()
```

- Lê e escreve no localStorage com a chave `currentUser`
- `user` é `null` quando não há usuário logado
- `logout()` define o usuário como `null`, o que remove a entrada do localStorage via `useEffect`

### `useHemogram.ts`

```ts
const { data, loading, error } = useHemogram(customerId)
```

- Busca `GET /exam/customer/{customerId}/hemogram`
- Em modo mock (`VITE_USE_MOCK=true`), retorna dados simulados com delay de 400ms
- Os dados históricos mock são gerados deterministicamente com base no `customerId`

---

## 9. Serviços e Integração com API

### URL Base

```
https://stark-cliffs-43839-e9065399f0e4.herokuapp.com/
```

Configurável via variável de ambiente `VITE_API_URL`.

### Tratamento de Erros (`api.ts`)

O interceptor Axios converte todos os erros em `ApiRequestError`:

```ts
class ApiRequestError extends Error {
  status?: number
  path?: string
  raw?: ApiErrorResponse
}
```

### Endpoints

#### Pacientes (`customer.ts`)

| Método | Endpoint | Descrição |
|---|---|---|
| `POST` | `/customer` | Criar paciente |
| `GET` | `/customer` | Listar pacientes (paginado) |
| `GET` | `/customer/{id}` | Obter paciente por ID |
| `PUT` | `/customer/{id}` | Atualizar paciente |
| `DELETE` | `/customer/{id}` | Excluir paciente |

#### Exames (`exam.ts`)

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/exam/customer/{customerId}/hemogram` | Hemograma do usuário logado |
| `GET` | `/exam` | Listar todos os exames |
| `GET` | `/exam/reports/normal` | Relatório de exames normais |

#### Hospitais (`hospital.ts`)

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/hospital` | Listar hospitais |
| `POST` | `/hospital` | Criar hospital |
| `DELETE` | `/hospital/{id}` | Excluir hospital |

#### Agendamentos (`schedule.ts`)

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/schedule` | Listar agendamentos |
| `POST` | `/schedule` | Criar agendamento |
| `GET` | `/schedule/reports` | Relatório de agendamentos |

#### Endereços (`address.ts`)

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/address` | Listar endereços |
| `POST` | `/address` | Criar endereço |

---

## 10. Algoritmo de Classificação de Usuário

Arquivo: `src/services/userClass.ts`

O score final (0–100) é calculado com base em três fatores ponderados:

### Peso por Profissão (35%)

| Profissão | Peso |
|---|---|
| Médico | 100 |
| Advogado | 95 |
| Engenheiro | 90 |
| Empresário | 90 |
| Professor | 70 |
| Enfermeiro | 60 |
| ... (13 profissões) | ... |
| Desempregado | 0 |

### Peso por Renda (45%)

| Faixa de Renda | Peso |
|---|---|
| R$ 20.000+ | 100 |
| R$ 10.000 – R$ 19.999 | 80 |
| R$ 5.000 – R$ 9.999 | 60 |
| R$ 3.000 – R$ 4.999 | 40 |
| R$ 1.500 – R$ 2.999 | 20 |
| Abaixo de R$ 1.500 | 10 |

### Peso por CEP (20%)

| Faixa de CEP | Peso |
|---|---|
| < 5.000 | 90 (regiões afluentes) |
| 5.000 – 9.999 | 60 |
| 10.000 – 29.999 | 50 |
| 30.000 – 59.999 | 40 |
| 60.000+ | 30 |

### Score Final → Classe

| Score | Classe | Acesso |
|---|---|---|
| >= 80 | **A** | Premium + IA |
| 60 – 79 | **B** | Premium + IA |
| 40 – 59 | **C** | Standard |
| 20 – 39 | **D** | Basic |
| < 20 | **E** | Basic |

### Mapeamento para o Backend

| Classe Frontend | Tipo Backend | `temAcessoIA()` |
|---|---|---|
| A, B | `PREMIUM` | `true` |
| C, D, E | `STANDARD` | `false` |

---

## 11. Sistema de Design e Temas Visuais

### Tema Premium (Classes A e B)

Estética futurista e holográfica com tema escuro.

**Paleta de Cores:**
- Fundo: gradiente `#243a66` → `#050810`
- Cards: `#08122a`, `#11203f`, `#1a2547`
- Destaque: dourado `#d8b25f`, `#e0bd5b`
- Blobs de aurora para interesse visual dinâmico

### Tema Standard (Classes C, D e E)

Estética limpa e profissional com tema claro.

**Paleta de Cores:**
- Fundo: `#f7f9fb`
- Acentos: teal `#0f766e`, `#14a098`
- Texto: slate `#5b6c80`, `#324053`

### Tipografia

Fontes carregadas via Google Fonts (declaradas no `index.html`):

| Tipo | Fonte | Pesos |
|---|---|---|
| Sans-serif | Outfit | 300, 400, 500, 600, 700, 800 |
| Sans-serif | Space Grotesk | 300, 400, 500, 600, 700 |

### Elementos de UI

- Botões com estados hover/active e sombras
- Cards com sombra sutil e bordas arredondadas
- Pills/badges de status
- Tabelas com linhas alternadas
- Formulários com campos rotulados e validação visual

---

## 12. Variáveis de Ambiente

Arquivo `.env` na raiz do projeto:

```bash
# URL base da API backend (padrão: Heroku staging)
VITE_API_URL=https://stark-cliffs-43839-e9065399f0e4.herokuapp.com/

# Ativa modo mock/offline para desenvolvimento frontend sem backend
VITE_USE_MOCK=true

# (Sem variáveis de anúncio: os slots do plano básico são mockados em GoogleAd.tsx)
```

---

## 13. Build e Deploy

### Desenvolvimento

```bash
npm install          # Instalar dependências
npm run dev          # Inicia servidor de desenvolvimento Vite com HMR
```

### Produção

```bash
npm run build        # Compila TypeScript + minifica com Vite → dist/
npm run preview      # Pré-visualiza o build de produção localmente
npm run lint         # Executa ESLint
```

### Output do Build

O diretório `dist/` contém:
- `index.html` com o app montado em `#root`
- Assets JS/CSS minificados com hash de conteúdo
- `.nojekyll` para compatibilidade com GitHub Pages

### Configuração do Vite

- **Base path:** `/tecnologias-emergentes-frontend/` (para GitHub Pages)
- **Alias:** `@` aponta para `./src`
- Plugin React com Fast Refresh habilitado

---

## 14. Detalhes de Implementação Notáveis

### Scanner Biométrico Interativo

Implementado com SVG customizado, posicionamento absoluto de marcadores e animações CSS de pulso. Cada marcador de ponto vital muda de cor e animação com base no status retornado pelo hemograma (`baixo`, `normal`, `alto`).

### Tooltip Customizado nos Gráficos

Componente `ChartTooltip` criado para padronizar a aparência dos tooltips do Recharts em todos os gráficos da aplicação.

### Máscara de CEP

Formatação client-side que aceita apenas dígitos, limita a 8 caracteres e insere o hífen automaticamente (`XXXXX-XXX`) via handler no evento `onChange`.

### Menu Mobile Responsivo

Menu hamburger com backdrop que fecha ao clicar fora ou ao rolar a página, implementado com listener de `click` e `scroll` no `document`.

### Dados Mock do Hemograma

O hook `useHemogram` em modo mock retorna um objeto estático com valores de hemograma fixos. Apenas os campos `examId` (calculado como `9000 + customerId`) e `customerId` variam por usuário. O retorno simula um delay de 400ms para reproduzir o comportamento assíncrono real.

### Cobertura de Tipos TypeScript

Todos os modelos de domínio, respostas de API e props de componentes são tipados via `src/types/index.ts`. Sem uso de `any` nas interfaces públicas.

### Mock de Anúncios do Plano Básico

O componente `GoogleAd` renderiza um placeholder visual estilizado no lugar de uma rede de anúncios real. A escolha por mock é deliberada: o projeto é acadêmico e o objetivo é apenas demonstrar visualmente a diferença entre o plano gratuito (com anúncios) e o plano Premium (sem anúncios), sem depender de credenciais de publisher nem de aprovação de rede de anúncios.
