# 🧠 Notion Blog

Um projeto experimental e educacional que explora a **construção de um blog integrado ao Notion** como CMS, utilizando **Node.js**, **Next.js**, **TypeScript** e **arquitetura modular** em um **monorepo**.
O repositório documenta a **evolução completa** do sistema — desde o protótipo inicial até uma aplicação refinada em design e experiência de usuário.

---

## 🎯 Objetivo do Projeto

Criar um blog dinâmico baseado em conteúdos do Notion, explorando boas práticas de:

- Arquitetura escalável (Node.js + Next.js + TypeScript)
- Deploy e automação com **Vercel**
- Testes automatizados e refatoração progressiva
- Evolução de design, acessibilidade e UX

Cada versão representa uma **etapa prática de aprendizado** e aprimoramento incremental do código e da experiência.

---

## 🧩 Estrutura Geral do Repositório

```
notion-blog/
├── v1/   → Estrutura inicial (API + App base)
├── v2/   → SSG + Deploy automatizado (Vercel)
├── v3/   → Testes com Jest
├── v4/   → Refatoração de arquitetura
├── v5/   → Melhoria de design e UX
└── README.md  → (este arquivo)
```

---

## 📚 Evolução por Versão

|  Versão   | Foco Principal                                               | Link                               |
| :-------: | :----------------------------------------------------------- | :--------------------------------- |
| 🧱 **v1** | Construção inicial do projeto (API e App base)               | [Ler README da v1](./v1/README.md) |
| ⚙️ **v2** | Implementação de **SSG** e **deploy automatizado** na Vercel | [Ler README da v2](./v2/README.md) |
| 🧪 **v3** | Introdução de **testes automatizados com Jest**              | [Ler README da v3](./v3/README.md) |
| 🧩 **v4** | **Refatoração** e organização do código em camadas           | [Ler README da v4](./v4/README.md) |
| 🎨 **v5** | **Melhoria de design e UX**, criação de design system        | [Ler README da v5](./v5/README.md) |

---

## 🧠 Tecnologias Principais

- **Next.js 15** — Front-end React com SSG/ISR
- **Node.js 18+ / Express** — API e servidor
- **TypeScript** — Tipagem estática e robustez
- **Jest** — Testes automatizados
- **Vercel** — CI/CD e hospedagem
- **Notion API** — Fonte de conteúdo
- **Monorepo com Workspaces** — Estrutura modular (`packages/api` e `packages/app`)

---

## 🪄 Como navegar

Cada pasta de versão (`v1`, `v2`, etc.) contém:

- O código daquela etapa
- Seu próprio `README.md` detalhando decisões técnicas, estrutura e próximos passos

Para estudar a evolução:

1. Comece por [`v1`](./v1/README.md) para entender a base do projeto.
2. Siga sequencialmente até [`v5`](./v5/README.md), observando como arquitetura, testes e design amadurecem.

---

## 🧭 Roadmap Geral

- **v1:** estrutura inicial e API base
- **v2:** geração estática + deploy contínuo
- **v3:** automação de testes e confiabilidade
- **v4:** refatoração arquitetural e organização
- **v5:** refinamento visual e experiência de usuário

> Cada versão mantém o aprendizado anterior, servindo como exemplo real de **evolução incremental de software**.

---

## 🪪 Licença

Este projeto é de caráter educacional e pessoal.
Consulte a licença completa na raiz do repositório.
