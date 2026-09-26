/* =========================================================
   Dados da pizzaria — fonte única de verdade.
   Consumido por pedido.html. O index.html mantém o cardápio
   em HTML estático de propósito: é o que o Google rastreia.
   Se mudar um preço aqui, mude também no index.html.
   ========================================================= */

window.PIZZARIA = {
    nome: 'Pizzas da Rosaura',
    whatsapp: '5551995074006',
    telefone: '(51) 3178.8425',
    atendimento: 'Sex a Dom, das 19h às 00h',

    /* ---------- Ajuste o que valer para a casa ---------- */
    config: {
        // 0 = a combinar no atendimento. Se a taxa for fixa, ponha o valor (ex.: 8).
        taxaEntrega: 0,
        // 0 = sem mínimo. Ex.: 30 para "pedido mínimo de R$ 30".
        pedidoMinimo: 0,
        // Mensagem opcional que entra no final do pedido.
        aviso: 'Pedido feito pelo site. Por favor confirmar disponibilidade e prazo.',
    },

    /* ---------- Unidades ---------- */
    unidades: [
        {
            id: 'eldorado',
            nome: 'Eldorado do Sul — Centro',
            endereco: 'R. Oito de Junho, 156 - Centro',
            cidade: 'Eldorado do Sul - RS, 92990-000',
            entrega: true,
            retirada: true,
            mapa: 'https://www.google.com/maps/search/?api=1&query=R.+Oito+de+Junho,+156+-+Centro,+Eldorado+do+Sul+-+RS,+92990-000',
        },
        {
            id: 'colina',
            nome: 'Guaíba — Colina',
            endereco: 'Av. Antenor Caldas, 282 - Colina',
            cidade: 'Guaíba - RS',
            entrega: true,
            retirada: true,
            mapa: 'https://www.google.com/maps/search/?api=1&query=Av.+Antenor+Caldas,+282+-+Colina,+Gua%C3%ADba+-+RS',
        },
        {
            id: 'iolanda',
            nome: 'Guaíba — Jardim Iolanda',
            endereco: 'Av. Adão Foques, 1284 - Jardim Iolanda',
            cidade: 'Guaíba - RS, 92500-000',
            entrega: true,
            retirada: true,
            mapa: 'https://www.google.com/maps/search/?api=1&query=Av.+Ad%C3%A3o+Foques,+1284+-+Jardim+Iolanda,+Gua%C3%ADba+-+RS,+92500-000',
        },
    ],

    /* ---------- Cupons de desconto ----------
       Para ativar um cupom: ponha ativo: true e ajuste a data.
       Para criar um novo, copie um bloco e troque código e valor.

       tipo:
         'percentual' → desconto é a % (ex.: 10 = 10% no subtotal)
         'valor'     → desconto em centavos (ex.: 1000 = R$ 10,00)
         'frete'     → entrega grátis, ignora o desconto
         'item'      → desconto em centavos, aplicado por pizza,
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
            codigo: 'CALABRESA6',
            tipo: 'item',
            alvo: 'Calabresa',
            desconto: 600,
            descricao: 'R$ 6,00 de desconto em toda pizza de calabresa',
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
       Isso evita erro de ponto flutuante na soma do carrinho. */
    cardapio: {
        salgadas: [
            {
                categoria: 'Tradicionais',
                itens: [
                    { nome: 'Alho e Óleo', preco: 2600 },
                    { nome: 'Atum', preco: 3300 },
                    { nome: 'Bacon', preco: 2500 },
                    { nome: 'Calabresa', preco: 2800 },
                    { nome: 'Cebola na Manteiga', preco: 2800 },
                    { nome: 'Frango', preco: 2800 },
                    { nome: 'Frango com Catupiry', preco: 3200 },
                    { nome: 'Linguiça', preco: 3200 },
                    { nome: 'Margherita', preco: 2500 },
                    { nome: 'Portuguesa', preco: 3200 },
                    { nome: 'Quatro Queijos', preco: 3300 },
                    { nome: 'Tropicana', preco: 2700 },
                    { nome: 'Presunto', preco: 2800 },
                ],
            },
            {
                categoria: 'Especiais',
                itens: [
                    { nome: 'Brócolis, Salmão e Milho', preco: 3500 },
                    { nome: 'Calabresa c/ Cheddar', preco: 3200 },
                    { nome: 'Brócolis c/ Bacon', preco: 3200 },
                ],
            },
            {
                categoria: 'Super Especiais',
                itens: [
                    { nome: 'Bacon c/ Molho Branco', preco: 3500 },
                    { nome: '4 Queijos c/ Bacon', preco: 3700 },
                    { nome: 'Siciliana', preco: 3400 },
                    { nome: 'Napolitana', preco: 3300 },
                    { nome: 'Bacon c/ Milho', preco: 3100 },
                    { nome: 'Bacon', preco: 3200 },
                    { nome: 'Cebola c/ Bacon', preco: 3000 },
                ],
            },
            {
                categoria: 'Super Especiais II',
                itens: [
                    { nome: 'Filé c/ Queijo', preco: 3300 },
                    { nome: 'Filé e Calabresa c/ Molho Branco', preco: 3500 },
                    { nome: 'Filé c/ Nata', preco: 3200 },
                    { nome: 'Filé c/ Catupiry', preco: 3200 },
                    { nome: 'Peperoni c/ Catupiry', preco: 3000 },
                    { nome: 'Strogonoff de Carne', preco: 3800 },
                    { nome: 'Strogonoff de Frango', preco: 3600 },
                    { nome: 'Four Cheeses', preco: 3500 },
                ],
            },
        ],

        doces: [
            {
                categoria: 'Doces Especiais',
                itens: [
                    { nome: 'Doce de Leite c/ Sorvete', preco: 2500 },
                    { nome: 'Brigadeiro', preco: 2300 },
                    { nome: 'Chocolate Branco c/ Morango', preco: 3000 },
                    { nome: 'Chocolate Preto c/ Morango', preco: 3000 },
                    { nome: 'Chocolate Branco c/ Avelã', preco: 2500 },
                    { nome: 'Pistache c/ Chocolate Branco', preco: 3100 },
                ],
            },
            {
                categoria: 'Doces',
                itens: [
                    { nome: 'Chocos', preco: 2100 },
                    { nome: 'Brigadeiro', preco: 2300 },
                    { nome: 'Bomba de Leite Ninho c/ Branco', preco: 3000 },
                    { nome: 'Chocolate Preto c/ Avelã', preco: 2500 },
                    { nome: 'Doce de Leite c/ Doce de Leite', preco: 2500 },
                    { nome: 'Prestígio', preco: 2400 },
                ],
            },
        ],
    },
};
