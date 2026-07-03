# Comunidade Elis Nhaia - Página de Vendas

Landing page estática em HTML, CSS e JavaScript puro para vender a assinatura da Comunidade Elis Nhaia, com posicionamento premium, consultivo e foco em conversão mobile.

## Antes de publicar

O projeto está estruturalmente pronto, mas alguns dados comerciais precisam ser preenchidos em `config.json`:

| Campo | O que falta |
| --- | --- |
| `oferta.linkCheckout` | URL real do checkout |
| `contato.whatsapp` | Número com DDI e DDD para o botão "Falar com a equipe" |
| `contato.instagram` / `contato.email` | Canais reais, se forem usados |
| `depoimentos` | Depoimentos, prints ou comentários reais |

Os planos já estão configurados:

| Plano | Valor | Condição |
| --- | --- | --- |
| Mensal | R$ 67,00 | Cobrança recorrente mensal |
| Trimestral | R$ 150,00 | Parcelamento em até 3x no cartão |

## Estrutura

```
comunidadeelisnhaia/
├── index.html
├── config.json
├── css/
│   └── styles.css
├── js/
│   ├── main.js
│   └── variables.js
└── assets/
    ├── hero-elis-nhaia.jpg
    └── produto-comunidade-elis-nhaia.jpg
```

## Como rodar localmente

O `main.js` carrega `config.json` via `fetch()`, então a página deve ser aberta por servidor HTTP.

```bash
python -m http.server 8000
```

Depois acesse:

```text
http://localhost:8000
```

## Jornada da landing

1. Hero com promessa, benefícios rápidos e CTA duplo.
2. Problema com identificação objetiva da empresária.
3. Solução com posicionamento da comunidade como apoio estratégico.
4. Entregas com cards curtos e escaneáveis.
5. Hotseat como diferencial.
6. Funcionamento organizado por canais.
7. Autoridade da Elis com métricas de credibilidade.
8. Prova social preparada para comentários e resultados reais.
9. Comparativo "sem a comunidade" versus "com a comunidade".
10. Oferta com plano mensal e trimestral.
11. Garantia, FAQ e CTA final.

## Decisões de UX e copy

- Mobile first, com CTA fixo inferior apenas em telas pequenas.
- CTAs recorrentes com duas opções: entrar na comunidade ou falar com a equipe.
- Textos curtos, consultivos e sem promessa de faturamento.
- Manutenção da identidade visual: azul escuro, petróleo, terracota, bege editorial, Montserrat e Lato.
- Animações leves apenas para reforçar a experiência.

## Próximos passos

1. Inserir o link real do checkout.
2. Inserir o WhatsApp real da equipe.
3. Trocar os placeholders de prova social por depoimentos reais.
4. Testar a página com os dados finais antes da publicação.
