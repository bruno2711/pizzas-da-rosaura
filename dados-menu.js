/* =========================================================
   S.O.S Lanches — fonte única de verdade.
   Consumido por pedido.html e promocoes.html. O index.html mantém
   o cardápio em HTML estático de propósito: é o que o Google rastreia.
   Se mudar um item ou preço aqui, mude também no index.html.
   ========================================================= */

window.SOS = {
    nome: 'S.O.S Lanches',
    whatsapp: '555182022624',
    telefone: '(51) 8202-2624',
    instagram: 'https://www.instagram.com/s.o.s.lanchees/',
    atendimento: 'Consulte horários e disponibilidade no Instagram',

    /* Rótulo de cada seção do cardápio, na ordem em que aparecem em cardapio */
    titulosMenu: {
        lanches: 'Lanches',
        porcoes: 'Porções e acompanhamentos',
        bebidas: 'Bebidas',
    },

    /* ---------- Ajuste o que valer para a casa ---------- */
    config: {
        // 0 = a combinar no atendimento. Se a taxa for fixa, ponha o valor (ex.: 8).
        taxaEntrega: 0,
        // 0 = sem mínimo. Ex.: 30 para "pedido mínimo de R$ 30".
        pedidoMinimo: 0,
        // Mensagem opcional que entra no final do pedido.
        aviso: 'Pedido feito pelo site. Por favor confirmar disponibilidade, valores e prazo.',
    },

    /* ---------- Endereço ---------- */
    unidades: [
        {
            id: 'principal',
            nome: 'S.O.S Lanches — Delivery e retirada',
            endereco: 'Av. Castelo Branco, 2805 - Colina',
            cidade: 'Guaíba - RS, 92500-000',
            entrega: true,
            retirada: true,
            mapa: 'https://www.google.com/maps/search/?api=1&query=Av.+Castelo+Branco,+2805+-+Colina,+Gua%C3%ADba+-+RS,+92500-000',
        },
    ],

    /* ---------- Cupons de desconto ----------
       Para ativar um cupom: ponha ativo: true e ajuste a data.
       Para criar um novo, copie um bloco e troque código e valor.

       tipo:
         'percentual' → desconto é a % (ex.: 10 = 10% no subtotal)
         'valor'     → desconto em centavos (ex.: 1000 = R$ 10,00)
         'frete'     → entrega grátis, ignora o desconto
         'item'      → desconto em centavos, aplicado por item,
                       em TODO item cujo nome case com 'alvo'
       alvo: nome do item, só no tipo 'item'
       minimo: pedido mínimo em centavos para o cupom valer
       validoAte: data (AAAA-MM-DD). Depois dela o cupom é ignorado. */
    cupons: [
        {
            codigo: 'BEMVINDO10',
            tipo: 'percentual',
            desconto: 10,
            descricao: '10% de desconto no seu primeiro pedido',
            minimo: 0,
            validoAte: '2027-12-31',
            ativo: true,
        },
        {
            codigo: 'DEZREAIS',
            tipo: 'valor',
            desconto: 1000,
            descricao: 'R$ 10,00 de desconto em qualquer pedido',
            minimo: 4000,
            validoAte: '2027-12-31',
            ativo: true,
        },
        {
            codigo: 'FRETEGRATIS',
            tipo: 'frete',
            desconto: 0,
            descricao: 'Entrega grátis acima de R$ 100,00',
            minimo: 10000,
            validoAte: '2027-12-31',
            ativo: true,
        },
        {
            codigo: 'BIGSOS5',
            tipo: 'item',
            alvo: 'X-Big S.O.S',
            desconto: 500,
            descricao: 'R$ 5,00 de desconto no X-Big S.O.S',
            minimo: 0,
            validoAte: '2027-12-31',
            ativo: true,
        },
    ],

    /* ---------- Formas de pagamento ----------
       Deixe só o que a casa aceita. As redes citadas são as mais
       comuns no Brasil. */
    pagamentos: [
        { id: 'pix', nome: 'Pix', detalhe: 'Aprovação na hora' },
        { id: 'dinheiro', nome: 'Dinheiro', detalhe: 'Na entrega ou na retirada' },
        { id: 'credito', nome: 'Cartão de crédito', detalhe: 'Visa, Mastercard, Elo, Amex, Hipercard' },
        { id: 'debito', nome: 'Cartão de débito', detalhe: 'Visa, Mastercard, Elo' },
        { id: 'virtual', nome: 'Cartão virtual / QR', detalhe: 'Mercado Pago, PicPay, Google Pay, Apple Pay' },
    ],

    /* ---------- Cardápio ----------
       Preços em CENTAVOS (inteiro). 26.00 reais = 2600.
       Isso evita erro de ponto flutuante na soma do carrinho.

       ATENÇÃO: os preços ainda não foram cadastrados — estão em 0.
       Troque cada 0 pelo valor real em centavos antes de publicar. */
    cardapio: {
        lanches: [
            {
                categoria: 'Clássicos',
                itens: [
                    { nome: 'X-Salada', preco: 0 },
                    { nome: 'X-Bacon', preco: 0 },
                    { nome: 'X-Egg', preco: 0 },
                    { nome: 'X-Frango', preco: 0 },
                    { nome: 'X-Calabresa', preco: 0 },
                ],
            },
            {
                categoria: 'Especiais',
                itens: [
                    { nome: 'X-Tudo', preco: 0 },
                    { nome: 'X-Big S.O.S', preco: 0 },
                    { nome: 'X-Bacon Egg', preco: 0 },
                    { nome: 'X-Frango Defumado', preco: 0 },
                    { nome: 'X-Egg Salad', preco: 0 },
                ],
            },
        ],

        porcoes: [
            {
                categoria: 'Porções',
                itens: [
                    { nome: 'Batata frita', preco: 0 },
                    { nome: 'Batata com cheddar e bacon', preco: 0 },
                    { nome: 'Onion rings', preco: 0 },
                    { nome: 'Nuggets de frango', preco: 0 },
                    { nome: 'Mandioca frita', preco: 0 },
                ],
            },
            {
                categoria: 'Combos',
                itens: [
                    { nome: 'Combo S.O.S — lanche, batata e refri', preco: 0 },
                    { nome: 'Combo Duplo — dois lanches e porção', preco: 0 },
                ],
            },
        ],

        bebidas: [
            {
                categoria: 'Refrigerantes',
                itens: [
                    { nome: 'Coca-Cola', preco: 0 },
                    { nome: 'Guaraná', preco: 0 },
                    { nome: 'Fanta Laranja', preco: 0 },
                    { nome: 'Sprite', preco: 0 },
                ],
            },
            {
                categoria: 'Sucos e águas',
                itens: [
                    { nome: 'Suco de laranja', preco: 0 },
                    { nome: 'Suco de maracujá', preco: 0 },
                    { nome: 'Suco de limão', preco: 0 },
                    { nome: 'Água sem gás', preco: 0 },
                    { nome: 'Água com gás', preco: 0 },
                ],
            },
        ],
    },
};
