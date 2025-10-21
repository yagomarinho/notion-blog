# v3 — Testes com Jest

Nesta versão do projeto, adicionamos **testes automatizados** para a camada de backend (API) usando **Jest**. O objetivo é aumentar a confiabilidade, facilitar refatorações futuras e prevenir regressões.

---

## 🚀 Visão geral

- Monorepo com dois pacotes principais:

  - **API** — `packages/api/`
  - **App (Next.js)** — `packages/app/`

- **Jest** configurado globalmente para testar tanto a API quanto o frontend.
- Inclusão de testes unitários e possivelmente testes de integração leves para os fluxos críticos (ex.: consulta de posts).

---

## 📂 Estrutura de pastas relevante

```
v3/
  packages/
    api/
      src/
        index.ts             # Ponto de entrada da API
        ...                   # Lógica de serviço, rotas e utilitários
      __tests__/              # Pasta de testes da API
    app/
      (arquivos do App em NextJS)
```

---

## ✅ Principais arquivos e configurações

- `jest.config.jts`: define ambiente de testes, presets (`ts-jest`), e cobertura.
- `__tests__/`: diretório que contém os testes para rotas da API e componentes do App.
- Scripts no `package.json`:

  ```json
  "scripts": {
    "test": "jest"
  }
  ```

- Configuração de cobertura mínima para garantir qualidade.

---

## 🔧 O que mudou nesta versão

- Adição de testes unitários para a **API** (funções de fetch de posts, endpoints de listagem, etc.).
- Configuração de **coverage mínimo** (ex.: 70–80%) para garantir qualidade.

---

## 💻 Como rodar os testes localmente

### Pré-requisitos

- Node.js 18+
- Yarn ou npm
- Dependências instaladas (`yarn install` ou `npm install` na raiz de v3)

### Passos

```bash
# Na raiz de v3/
yarn install

# Executar todos os testes
yarn test

# Executar em modo watch
yarn test:watch

# Ver relatório de cobertura
yarn test --coverage
```

---

## 📈 Benefícios desta versão

- Maior **confiança** em mudanças de código e refatorações.
- **Feedback rápido** quando algo quebra.
- Base sólida para refatorações e evolução contínua.

---

## ⚠️ Limitações

- Cobertura de testes ainda parcial, focada nos fluxos principais.
- Arquitetura ainda não refatorada (será abordada na v4).
- Design/UX ainda básico (melhorias planejadas para v5).

---

## 🛣️ Próximos passos

- **v4:** refatorar o código, separar camadas, melhorar manutenção e aplicar padrões arquiteturais.
- **v5:** aprimorar **UI/UX**, adicionando design system, acessibilidade e microinterações.

---

## 🪪 Licença

Projeto de caráter educacional. Consulte a licença na raiz do repositório.
