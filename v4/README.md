# v4 — Refatoração de Código

Nesta versão do projeto, o foco é melhorar a qualidade da base de código, reduzir acoplamento, introduzir separação de responsabilidades e preparar o sistema para manutenção e crescimento sustentado.

---

## 🚀 Visão Geral

- O monorepo continua com dois pacotes principais:

  - **API** — `packages/api/`
  - **App (Next.js)** — `packages/app/`

- A meta é aplicar boas práticas de design e engenharia:

  - Separar camadas (serviços, adaptadores, controladores, rotas).
  - Promover modularização e reutilização de código.
  - Garantir que o sistema esteja pronto para evoluções de UI/UX e novas funcionalidades.

---

## 📂 Estrutura de Pastas (Exemplo de organização melhorada)

```
v4/
  packages/
    api/
      src/
        services/            # Lógica de negócios
        repositories/        # Acesso a dados (CMS / Notion)
        index.ts             # Ponto de entrada da API
    app/
      (arquivos do App em NextJS)
```

---

## 🧩 Principais Mudanças nesta Versão

- Introdução de camadas claras na API: **handler → service → repository**.
- Refatoração de endpoints para que handlers sejam finos, delegando lógica para serviços.
- Melhoria dos “adapters” ou “repositories” que interagem com o CMS (ex: Notion SDK) ou outras APIs externas.
- No frontend (Next.js):

  - Componentização mais refinada.
  - Criação de hooks customizados para lógica de dados.
  - Bibliotecas de utilitários movidas para `lib/` ou `hooks/`.

- Atualização de tipagens TypeScript e organização de `tsconfig` com `paths` ou `aliases`.

---

## 💻 Como Rodar Localmente

### Pré‑requisitos

- Node.js 18+
- Yarn ou npm

### Passos

```bash
# Na raiz de v4/
yarn install    # ou npm install

# Iniciar API
cd packages/api
yarn dev        # ou npm run dev

# Iniciar App (Next.js)
cd ../app
yarn dev        # ou npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) para ver o app em execução.

---

## 📈 Benefícios desta Versão

- Código mais limpo, modular e fácil de manter.
- Redução de acoplamento entre camadas → mais segurança para evoluções.
- Base sólida para adição de novas funcionalidades e melhorias de UX/UI.
- Facilita a adoção de testes mais profundos e pipelines mais organizados.

---

## ⚠️ Limitações e Dívidas Técnicas

- Embora a estrutura esteja melhorada, **algumas funcionalidades podem ainda usar o padrão antigo** e precisar migração.
- Design e experiência de uso ainda não foram totalmente abordados (serão foco da v5).
- Cobertura de testes pode precisar de expansão para refletir toda refatoração.

---

## 🛣️ Próximos Passos

- **v5:** foco em **melhoria de design e experiência de usuário**.
- Expandir testes unitários e de integração para refletir a nova estrutura.
- Monitorar performance e possíveis pontos de otimização.

---

## 🪪 Licença

Este projeto é de caráter educacional. Consulte a licença na raiz do repositório.
