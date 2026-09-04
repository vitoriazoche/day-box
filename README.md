# Day Box

O **Day Box** é um acompanhador de metas de 30 dias. Você dá um nome a um
projeto ou hábito ("30 dias de código", "publicar o app", "treinar todo dia") e
vai marcando cada um dos 30 dias, um de cada vez, registrando o que fez.

## Objetivo

Ajudar a manter consistência em algo por 30 dias seguidos, deixando o progresso
visível e fácil de retomar. Em vez de uma lista de tarefas infinita, você tem um
recorte fechado — 30 quadradinhos — que mostra de relance o quanto já andou e o
que ainda falta. Tudo fica salvo no seu navegador, sem conta e sem servidor.

## Principais funcionalidades

1. **Vários projetos ao mesmo tempo** — cada um com sua própria grade de 30 dias.
2. **Marcar o dia como feito** — com barra de progresso, porcentagem e contagem
   da sequência atual (dias concluídos seguidos).
3. **Nota e link por dia** — registre o que fez e guarde um link de referência;
   uma bolinha no dia sinaliza quando há algo anotado.
4. **Compartilhar como imagem** — gera um PNG da grade do projeto para salvar ou
   compartilhar (usa o compartilhamento nativo no celular).
5. **Tema claro/escuro e layout responsivo** — alterna no botão do cabeçalho
   (a escolha é lembrada) e se adapta de celular a desktop.

## Feito com v0, desenvolvimento manual daqui pra frente

A primeira versão foi gerada no [v0.dev](https://v0.app) a partir de um prompt.
A partir daí o desenvolvimento passou a ser **manual**, direto no código deste
repositório — o v0 não é mais a fonte das mudanças.

## Rodando localmente

### Pré-requisitos

- **Node.js 20.9 ou superior** (recomendado: 20 LTS ou 22 LTS).
- **pnpm** — o projeto usa pnpm como gerenciador de pacotes. A forma mais simples
  é pelo [Corepack](https://nodejs.org/api/corepack.html), que já vem com o
  Node: basta usar `corepack pnpm ...` nos comandos abaixo. Para deixar o `pnpm`
  disponível de forma permanente, rode uma vez (no Windows, num terminal como
  administrador):

  ```bash
  corepack enable pnpm
  ```

- **Git**, para clonar o repositório.

### Passo a passo

```bash
git clone https://github.com/vitoriazoche/day-box.git
cd day-box
corepack pnpm install
corepack pnpm dev
```

Abra <http://localhost:3000> no navegador. A página recarrega sozinha ao editar
os arquivos.

> Na primeira instalação o pnpm pode pedir para aprovar os scripts de build de
> `sharp` e `msw` — isso já está pré-autorizado no `pnpm-workspace.yaml`.

### Build de produção

```bash
corepack pnpm build   # gera a build otimizada
corepack pnpm start   # sobe a build em http://localhost:3000
```

Se você rodou `corepack enable pnpm`, pode usar `pnpm ...` direto, sem o prefixo
`corepack`.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack) + [React 19](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS v4](https://tailwindcss.com)
- [lucide-react](https://lucide.dev) para os ícones
- Sem backend: os dados ficam no `localStorage` do navegador
