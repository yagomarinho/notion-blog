# v1 — Construção inicial

Este README documenta a **versão 1** do projeto, focada em levantar a base do blog (API mínima + aplicação Next.js) em um monorepo simples.

> **Escopo da v1:** colocar o projeto de pé com a estrutura de pastas, pontos de entrada e rotas/páginas essenciais. Sem SSG/ISR, sem pipeline de deploy e sem testes ainda.

---

## Visão geral

- **Monorepo** com dois pacotes principais:

  - **API**: `packages/api/` — ponto de entrada em `src/index.ts`.
  - **Aplicação web (Next.js)**: `packages/app/` — UI do blog.

- **Linguagem:** TypeScript.
- **Objetivo:** viabilizar iterações futuras mantendo a base simples e funcional.

---

## Estrutura do projeto

```
v1/
  packages/
    api/
      (arquivos da API em NodeJS)
    app/
      (arquivos do App em Next.js)
```

> Observação: nomes de arquivos/diretórios podem variar levemente; a convenção é manter **API** e **App** bem separados.

---

## Tecnologias & decisões

- **TypeScript** para tipagem e DX melhor.
- **Next.js** no `packages/app/` para a camada de UI (sem SSG/ISR na v1).
- **API Node/Express (ou similar)** iniciando em `packages/api/src/index.ts`.
- **ESLint/Prettier** (opcional) para padronização.
- **Variáveis de ambiente:** **não obrigatórias** Se necessário, use `.env` na raiz do pacote correspondente.

---

## Como rodar localmente

### Pré‑requisitos

- Node.js 18+ (recomendado)
- npm ou yarn pnpm (qualquer gerenciador de pacotes de sua preferência)

### Passos

1. **Instalar dependências** na raiz de `v1/`:

   ```bash
   # dentro de v1/
   npm install
   # ou
   yarn
   # ou
   pnpm install
   ```

2. **Subir a API**:

   ```bash
   # dentro de v1/packages/api
   npm run dev
   # ou yarn dev / pnpm dev
   ```

3. **Subir o App (Next.js)**:

   ```bash
   # dentro de v1/packages/app
   npm run dev
   # ou yarn dev / pnpm dev
   ```

4. Acesse o app em `http://localhost:3000` (porta padrão do Next.js). A API geralmente sobe em `http://localhost:3333` (ou conforme `PORT`).

> Dica: rode API e App em terminais separados, ou crie scripts na raiz para orquestrar ambos.

---

## Convenções (v1)

- **Organização de código**

  - **API**: rotas/handlers no `src/`, separar utilitários e middlewares conforme necessidade.
  - **App**: páginas/rotas Next.js no diretório padrão, componentes em `components/` e estilos em `styles/`.

- **Commits**: mensagens claras (ex.: Conventional Commits) ajudam a rastrear evolução.
- **Imports absolutos** (opcional): configure `paths` no `tsconfig` para DX melhor.

---

## Status de features

- ✅ Estrutura inicial do monorepo (API + App)
- ✅ Ponto de entrada da **API** em `packages/api/src/index.ts`
- ✅ App Next.js inicial em `packages/app/`
- 🚫 **Sem SSG/ISR** (chega na v2)
- 🚫 **Sem testes** (Jest chega na v3)
- 🚫 **Sem refatoração estrutural** (v4)
- 🚫 **Sem melhorias de design** (v5)

---

## Roadmap imediato

- [v2] Habilitar SSG/ISR e configurar deploy automatizado (Vercel).
- [v3] Adicionar Jest e cobertura mínima para componentes/serviços críticos.
- [v4] Refatorar para reduzir acoplamento e padronizar camadas.
- [v5] Polir design, acessibilidade e consistência visual.

---

## Troubleshooting

- **Porta em uso**: exporte `PORT` para a API ou mude a porta do Next.
- **Tipos quebrando build**: ajuste `tsconfig` (ex.: `strict: true` recomendado; alivie se necessário na v1).
- **Imports**: confira paths relativos/absolutos conforme configuração do `tsconfig`.

---

## Licença

Este projeto é de caráter educacional. Verifique a licença na raiz do repositório.
