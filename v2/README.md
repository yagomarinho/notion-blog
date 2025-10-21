# v2 — SSG e Deploy Automatizado (Vercel)

Esta versão marca um passo importante na evolução do projeto: o blog agora utiliza **Static Site Generation (SSG)** com suporte a **Incremental Static Regeneration (ISR)** e possui **deploy automatizado** configurado na **Vercel**. O foco é melhorar performance, simplificar a publicação e preparar o projeto para escalar.

---

## 🚀 Visão geral

- Estrutura monorepo com dois pacotes principais:

  - **API** — `packages/api/` → fornece dados (posts, páginas, etc.).
  - **App (Next.js)** — `packages/app/` → renderiza páginas estaticamente.

- Deploy contínuo configurado na **Vercel**.
- Build otimizado com **Next.js 15** e **TypeScript**.

---

## 📂 Estrutura de pastas

```
v2/
  packages/
    api/
      src/
        index.ts           # Ponto de entrada principal da API
        ...                # Serviços, middlewares, utilitários
    app/
      (arquivos do App em NextJS)
```

---

## 🧩 Principais arquivos

### `packages/api/src/index.ts`

Ponto de entrada da API. Expõe rotas que o frontend consome para renderizar posts e conteúdos. Possivelmente integra-se com o Notion API.

### `packages/app/pages/`

Define rotas e páginas geradas estaticamente. Exemplo:

- `/index.tsx` → lista de posts.
- `/posts/[slug].tsx` → página individual de post.

---

## ⚙️ O que mudou na v2

- **SSG** implementado: páginas geradas estaticamente no momento do build.
- **ISR (Incremental Static Regeneration)** habilitado: atualiza páginas sem rebuild completo.
- **Deploy contínuo na Vercel**: cada atualização no arquivo no Notion dispara um hook que aciona o deploy automatizado na Vercel.
- **API** ajustada para suportar dados necessários no build.

---

## 💻 Como rodar localmente

### Pré-requisitos

- Node.js 18+
- Yarn ou npm

### Passos

```bash
# Instalar dependências
yarn install

# Iniciar API
yarn workspace @notion-blog/api run dev

# Iniciar App (Next.js)
yarn workspace @notion-blog/app run dev
```

Acesse [http://localhost:3000](http://localhost:3000) para visualizar o app.

> Certifique-se de que a API está rodando (ex: [http://localhost:3333](http://localhost:3333)) antes de iniciar o app.

---

## 📈 Benefícios da versão 2

- ⚡ **Performance:** páginas estáticas entregues via CDN.
- 🔁 **Automação:** deploys automáticos com CI/CD simples.
- 🧱 **Escalabilidade:** arquitetura preparada para alto tráfego.
- 🧩 **Organização:** separação clara entre API e App.

---

## ⚠️ Limitações

- Sem testes automatizados (v3 resolverá isso com Jest).
- Arquitetura ainda simples, antes da refatoração (v4).
- Design básico, sem aprimoramentos visuais (v5 tratará disso).

---

## 🛣️ Próximos passos

- **v3:** adicionar testes com Jest.
- **v4:** refatorar a arquitetura, separar camadas e aplicar princípios DDD.
- **v5:** aprimorar UI/UX e criar um design system leve.

---

## 🪪 Licença

Projeto de caráter educacional. Consulte a licença na raiz do repositório.
