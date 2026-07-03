# Comunidade Elis Nhaia — Página de Vendas

Landing page estática (HTML/CSS/JS puro, sem build tool e sem dependências de runtime) para a Comunidade Elis Nhaia — Gestão Estratégica para Negócios Lucrativos.

## ⚠️ Antes de publicar — o que ainda falta

Este projeto foi entregue **estruturalmente completo**, mas o briefing original não trazia dados comerciais essenciais. Eles estão marcados como `TODO_*` em `config.json` e **precisam ser preenchidos antes do lançamento**:

| Campo em `config.json`            | O que falta                                              |
|------------------------------------|-----------------------------------------------------------|
| `oferta.preco` / `precoParcelado`  | Preço de venda                                             |
| `oferta.linkCheckout`              | URL real do checkout (Hotmart, Kiwify, Stripe etc.)        |
| `oferta.garantia`                  | Dias e texto da garantia (ou remover a seção se não houver)|
| `oferta.vagas.textoUrgencia`       | Texto de urgência, se houver vagas limitadas                |
| `depoimentos`                      | Depoimentos/prova social (a página ainda não exibe esta seção — ver "Próximos passos") |
| `contato`                          | WhatsApp, Instagram, e-mail                                 |

**Sem esses dados a página funciona, mas converte pior.** Preço, prova social e garantia são os três elementos que mais influenciam decisão de compra — não lance sem eles.

## Estrutura do projeto

```
elis-nhaia/
├── index.html          # Estrutura semântica da página (sem estilo ou lógica embutida)
├── config.json          # Dados de NEGÓCIO: preço, links, textos, depoimentos, FAQ, canais
├── css/
│   └── styles.css       # Todo o estilo: tokens de design, layout, componentes, responsivo
├── js/
│   ├── main.js           # Lógica: carrega config.json, popula o DOM, liga interações
│   └── variables.js      # Constantes TÉCNICAS: seletores, breakpoints, durações de animação
├── assets/
│   └── hero-elis-nhaia.jpg
└── README.md
```

### Por que dois arquivos de configuração?

- **`config.json`** — dados de **negócio**. Preço, link de checkout, textos de oferta, lista de entregáveis, canais da comunidade, FAQ, contato. É o arquivo que a equipe de marketing/vendas edita.
- **`js/variables.js`** — constantes de **front-end**. Seletores CSS usados pelo JS, breakpoints, durações de transição, nomes de classes de estado. É o arquivo que um desenvolvedor edita ao mexer em comportamento, não em conteúdo.

Essa separação existe para que ninguém precise tocar em código para trocar um preço, e ninguém precise editar JSON de negócio para ajustar uma animação.

## Como rodar localmente

O `main.js` usa `fetch()` para carregar `config.json`. **Isso não funciona abrindo o `index.html` direto no navegador** (protocolo `file://` bloqueia `fetch` por CORS). É necessário servir os arquivos por HTTP:

```bash
# Opção 1 — Python (já vem instalado na maioria dos sistemas)
cd elis-nhaia
python3 -m http.server 8000
# depois abra http://localhost:8000

# Opção 2 — Node
npx serve elis-nhaia
```

## Arquitetura da página

1. **Header** — fixo, com estado "compacto" ao rolar (`data-header`, controlado por `variables.js:TIMING.headerScrollOffset`).
2. **Hero** — foto de perfil da marca (P&B, já fornecida) com overlay em gradiente, headline e CTA duplo.
3. **Problema** — bloco de contexto/dor, texto estático em `index.html` (conteúdo editorial, não dado de negócio).
4. **Entrega** — grid de cards, populado via JS a partir de `config.json → entregaveis`.
5. **Hotseat (elemento de assinatura)** — bloco de destaque com barra vertical laranja, reproduzindo o mesmo elemento gráfico já usado na imagem de marca do produto. É o único bloco com tratamento visual diferenciado, porque o hotseat é citado no briefing como o maior ativo de prova social da comunidade.
6. **Canais** — grid populado via JS a partir de `config.json → canais`, refletindo exatamente a estrutura de canais descrita no briefing (Avisos, Comunidade, Dúvidas, Resultados, Materiais, Sugestões).
7. **Oferta** — bloco de conversão final: preço, botão de checkout, garantia e (opcionalmente) urgência — todos populados via JS a partir de `config.json → oferta`.
8. **FAQ** — acordeão acessível (`aria-expanded`, teclado, um item aberto por vez), populado via JS a partir de `config.json → faq`.
9. **Footer**.

## Decisões de design

- **Paleta**: preto/carvão (`#121110`, `#1C1A18`) + laranja de destaque (`#E85D2C`) — deriva diretamente da imagem de marca já fornecida, não é uma escolha genérica.
- **Tipografia**: `Oswald` (condensada, caixa alta) para headlines — ecoa o "ELIS NHAIA" já usado na peça gráfica original — e `Inter` para corpo de texto, por legibilidade em blocos de conteúdo mais longos. `JetBrains Mono` é usado pontualmente em preço e "eyebrows" para reforçar o tom de gestão/dado.
- **Elemento de assinatura**: a barra vertical laranja do bloco "Hotseat" replica o mesmo grafismo já presente na imagem de produto (a linha laranja ao lado de "COMUNIDADE"), criando consistência entre a peça de origem e a página.
- **Acessibilidade**: contraste AA em todos os textos sobre fundo escuro, foco visível (`:focus-visible`), `prefers-reduced-motion` respeitado, FAQ com semântica de acordeão (`aria-expanded`).

## Convenções de código

- **CSS**: metodologia baseada em componente (`.card`, `.canal-card`, `.faq-item`, …), sem aninhamento profundo, para evitar conflitos de especificidade entre seletores de seção e de elemento.
- **JS**: módulos ES (`type="module"`), sem dependências externas, sem frameworks. `main.js` só orquestra; `variables.js` só declara constantes.
- **HTML**: `<template>` nativo para os blocos repetidos (entregáveis, canais, FAQ), evitando strings de HTML dentro do JS.

## Próximos passos sugeridos

1. Preencher todos os `TODO_*` em `config.json`.
2. Adicionar seção de depoimentos/prova social — a estrutura de `config.json → depoimentos` já existe, mas a seção correspondente em `index.html`/`main.js` ainda não foi construída porque não havia conteúdo real para preencher.
3. Ligar o botão de CTA a um pixel de conversão (Meta/Google Ads) se a comunidade for divulgada via tráfego pago.
4. Testar `config.json` com dados reais antes de publicar — o layout foi construído para textos de tamanhos variáveis, mas vale conferir visualmente após a troca dos `TODO_*`.
