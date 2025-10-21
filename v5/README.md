# v5 — Melhoria de Design & UX

Nesta versão do projeto, o foco é refinar a interface visual, a experiência de navegação, a consistência do design e a acessibilidade.
O objetivo é tornar o blog mais agradável para o usuário, com identidade visual, UI refinada e experiência mais profissional.

---

## 🚀 Visão Geral

- Monorepo com dois pacotes principais:

  - **API** — `packages/api/`
  - **App (Next.js)** — `packages/app/`

- Na versão v5, o foco se desloca da infraestrutura de código para o **front‑end** e a camada de apresentação.
- Melhorias contemplam: componentes visuais, responsividade, estados de carregamento, estilo consistente, e acessibilidade.

---

## 📂 Estrutura de pastas relevante (exemplo)

```
v5/
  packages/
    api/
      src/
        …                      # Estrutura permanece da v4
    app/
      (Arquivos do App em NextJS)
```

---

## 🧩 Principais Mudanças nesta Versão

- Componentes de UI reutilizáveis atualizados ou criados: Headers, Footers, Cards de post, Botões, Formulários de busca/filtragem, etc.
- Melhorias de **acessibilidade**: foco, contraste, semântica (ex: `aria‑labels`), navegação por teclado, leitores de tela.
- Responsividade reforçada para mobile/tablet/desktop.
- Imagens otimizadas (por exemplo usando `next/image`), fontes customizadas ou variáveis, e melhorias de performance front‑end.
- Padronização visual: alinhamento de estilo entre páginas, consistência de componentes e tema unificado.
- Ajustes no layout: cabeçalho fixo/scroll, navegação clara, rodapé bem definido, melhor hierarquia visual.

---

## 💻 Como Rodar e Visualizar as Mudanças

### Pré‑requisitos

- Node.js 18+
- Yarn ou npm

### Passos

```bash
# Na raiz de v5/
yarn install   # ou npm install

# Iniciar API (mesma estrutura da v4)
cd packages/api
yarn dev       # ou npm run dev

# Iniciar App (Next.js)
cd ../app
yarn dev       # ou npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador e explore o layout, estilos, interações e responsividade.

---

## 📈 Benefícios desta Versão

- Experiência de usuário significativamente melhorada: visual mais polido, sensação “completa”.
- Marca mais forte e identidade consistente: ajuda na fidelização de leitores.
- Componentes reutilizáveis facilitam futuras adições e manutenção.
- Acessibilidade e performance refinadas favorecem SEO e usuário final.
- Base pronta para foco em conteúdo e crescimento, com menor necessidade de retrabalho visual.

---

## ⚠️ Limitações / Considerações

- Ainda podem existir páginas ou componentes que usam estilos antigos — migração gradual pode continuar.
- Backend/API permanece estável, mas melhorias visuais não afetam lógica de dados ou rotas.
- Embora o design esteja mais polido, testes visuais automatizados (ex: snapshot tests visuais) podem estar ausentes ou incompletos — isso pode evoluir em versões futuras.

---

## 🛣️ Próximos Passos

- Refinar ainda mais a experiência mobile/tablet, micro‑interações e animações sutis.
- Implementar testes visuais ou de end‑to‑end (E2E) para UI.
- Expandir o design system com temas (modo escuro, customização).
- Monitorar métricas de performance (por exemplo, Web Vitals) e feedback de usuário para refinamentos contínuos.

---

## 🪪 Licença

Este projeto é de caráter educacional. Consulte a licença na raiz do repositório.
