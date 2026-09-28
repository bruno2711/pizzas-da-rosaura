# S.O.S Lanches

Site estático de delivery da S.O.S Lanches — Av. Castelo Branco, 2805 - Colina, Guaíba - RS, 92500-000.
WhatsApp (51) 8202-2624 · Instagram [@s.o.s.lanchees](https://www.instagram.com/s.o.s.lanchees/)

## Páginas

| Arquivo | Função |
| --- | --- |
| `index.html` | Página inicial. Cardápio em HTML estático de propósito — é o que o Google rastreia. |
| `pedido.html` | Montagem do pedido. As seções do cardápio são geradas por JS a partir de `dados-menu.js`. |
| `promocoes.html` | Cupons ativos, lidos de `dados-menu.js`. |
| `dados-menu.js` | Fonte única de verdade: cardápio, preços, cupons, pagamento, endereço. |
| `pedido.js` | Lógica do carrinho, cupons e montagem da mensagem do WhatsApp. |
| `styles.css` | Sistema visual por tokens. Cores em `:root`. |

## Antes de publicar

- **Preços do cardápio estão zerados.** Em `dados-menu.js`, troque cada `preco: 0` pelo valor
  real **em centavos** (`25.00` → `2500`). O aviso dourado da seção "Cardápio" no
  `index.html` some quando os preços existirem.
- O cardápio do `index.html` é estático: se mudar item ou preço em `dados-menu.js`,
  reflita no `index.html` também.
- Horário de funcionamento não está no site — o perfil do Instagram não informa.
- Os cupons de `dados-menu.js` são de exemplo. Ajuste ou remova antes de publicar.

## Identidade visual

Tokens em `styles.css`:

| Token | Valor | Uso |
| --- | --- | --- |
| `--marca` | `#cb262d` | Vermelho principal, amostrado do logo do Instagram |
| `--marca-clara` / `--marca-escura` | `#e0333a` / `#8e151b` | Gradientes e texto sobre vermelho |
| `--dourado` | `#ffc233` | Destaque, botões, sublinhados |
| `--creme` / `--creme-escuro` | `#fffaf3` / `#fdf0e2` | Fundos |

Logotipos: `images/sos-logo.svg` (cabeçalho) e `images/sos-hero.svg` (hero).
