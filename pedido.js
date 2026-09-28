/* =========================================================
   Página de pedido — monta o carrinho e gera a mensagem
   do WhatsApp. Sem dependências externas.
   ========================================================= */
(function () {
    'use strict';

    const P = window.SOS;
    const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
    const CHAVE = 'pedido-sos-lanches';

    /* ---------- Estado ---------- */
    const carrinho = new Map(); // id do item -> quantidade

    const $ = (sel) => document.querySelector(sel);
    const form = $('#form-pedido');
    const barra = $('#barra-pedido');
    const barraQtd = $('#barra-qtd');
    const barraTotal = $('#barra-total');
    const erro = $('#pedido-erro');

    /* ---------- Utilidades ---------- */
    function slug(texto) {
        return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
            .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }

    function centavosParaReais(c) {
        return brl.format(c / 100);
    }

    // Converte "4591234567" ou "(51) 8202-2624" em 555182022624
    function telefoneParaLink(valor) {
        const digitos = valor.replace(/\D/g, '');
        if (digitos.startsWith('55')) return digitos;
        if (digitos.length <= 11) return '55' + digitos;
        return digitos;
    }

    /* ---------- Monta o catálogo ---------- */
    const catalogo = [];

    function registrar(grupo, categorias) {
        categorias.forEach((cat) => {
            cat.itens.forEach((item, indice) => {
                catalogo.push({
                    id: `${slug(cat.categoria)}-${indice}`,
                    grupo: grupo,
                    categoria: cat.categoria,
                    nome: item.nome,
                    preco: item.preco,
                });
            });
        });
    }

    // Os grupos vêm da ordem das chaves em dados-menu.js: incluir um
    // bloco novo lá cria a seção correspondente aqui, sem tocar neste arquivo.
    const GRUPOS = Object.keys(P.cardapio);
    GRUPOS.forEach((grupo) => registrar(grupo, P.cardapio[grupo]));

    /* ---------- Render: cardápio selecionável ---------- */
    function tituloGrupo(grupo) {
        const mapa = P.titulosMenu || {};
        if (mapa[grupo]) return mapa[grupo];
        return grupo.charAt(0).toUpperCase() + grupo.slice(1);
    }

    function renderizarMenu() {
        const raiz = $('#lista-menu');
        if (!raiz) return;
        raiz.innerHTML = '';

        GRUPOS.forEach((grupo, indice) => {
            const porCategoria = new Map();

            catalogo.filter((i) => i.grupo === grupo).forEach((item) => {
                if (!porCategoria.has(item.categoria)) porCategoria.set(item.categoria, []);
                porCategoria.get(item.categoria).push(item);
            });

            const bloco = document.createElement('div');
            // o painel dourado alterna entre os blocos para separar os grupos
            bloco.className = indice % 2 ? 'bloco-menu bloco-menu-doces' : 'bloco-menu';

            const tituloBloco = document.createElement('h2');
            tituloBloco.className = 'bloco-menu-titulo';
            tituloBloco.textContent = tituloGrupo(grupo);
            bloco.appendChild(tituloBloco);

            const alvo = document.createElement('div');
            alvo.className = 'grade-selecao';
            alvo.id = `lista-${grupo}`;
            bloco.appendChild(alvo);

            porCategoria.forEach((itens, categoria) => {
                const grupoEl = document.createElement('div');
                grupoEl.className = 'grupo-selecao';

                const titulo = document.createElement('h3');
                titulo.className = 'grupo-selecao-titulo';
                titulo.textContent = categoria;
                grupoEl.appendChild(titulo);

                itens.forEach((item) => {
                    const linha = document.createElement('div');
                    linha.className = 'linha-item';
                    linha.dataset.id = item.id;

                    const info = document.createElement('div');
                    info.className = 'linha-info';
                    info.innerHTML =
                        `<span class="linha-nome"></span><span class="linha-preco">${centavosParaReais(item.preco)}</span>`;
                    info.querySelector('.linha-nome').textContent = item.nome;

                    const ctrl = document.createElement('div');
                    ctrl.className = 'contador';

                    const menos = botaoContador('−', 'Menos um ' + item.nome, () => mudar(item.id, -1));
                    const valor = document.createElement('span');
                    valor.className = 'contador-valor';
                    valor.textContent = '0';
                    valor.setAttribute('aria-live', 'polite');
                    const mais = botaoContador('+', 'Mais um ' + item.nome, () => mudar(item.id, 1));

                    ctrl.append(menos, valor, mais);
                    linha.append(info, ctrl);
                    grupoEl.appendChild(linha);
                });

                alvo.appendChild(grupoEl);
            });

            raiz.appendChild(bloco);
        });
    }

    function botaoContador(texto, rotulo, aoClicar) {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'contador-botao';
        b.textContent = texto;
        b.setAttribute('aria-label', rotulo);
        b.addEventListener('click', aoClicar);
        return b;
    }

    /* ---------- Render: unidades e pagamentos ---------- */
    function renderizarUnidades() {
        const alvo = $('#opcoes-unidade');
        const modalidade = form.modalidade.value;

        // Guarda a escolha antes de destruir o DOM: senão trocar entre
        // entrega e retirada limpa a unidade que o cliente já tinha escolhido.
        const anterior = form.unidade ? form.unidade.value : '';
        alvo.innerHTML = '';

        P.unidades
            .filter((u) => (modalidade === 'entrega' ? u.entrega : u.retirada))
            .forEach((u) => {
                const label = document.createElement('label');
                label.className = 'opcao';
                label.innerHTML =
                    `<input type="radio" name="unidade" value="${u.id}" required>
                     <span class="opcao-corpo">
                       <span class="opcao-nome"></span>
                       <span class="opcao-detalhe"></span>
                     </span>`;
                label.querySelector('.opcao-nome').textContent = u.nome;
                label.querySelector('.opcao-detalhe').textContent = u.endereco + ' — ' + u.cidade;
                alvo.appendChild(label);
            });

        // Repõe a escolha, desde que a unidade ainda sirva para a modalidade
        if (anterior) {
            const aindaValida = alvo.querySelector(`input[value="${anterior}"]`);
            if (aindaValida) aindaValida.checked = true;
        }
        atualizarPagamento();
    }

    function renderizarPagamentos() {
        const alvo = $('#opcoes-pagamento');
        alvo.innerHTML = '';
        P.pagamentos.forEach((pag) => {
            const label = document.createElement('label');
            label.className = 'opcao';
            label.innerHTML =
                `<input type="radio" name="pagamento" value="${pag.id}" required>
                 <span class="opcao-corpo">
                   <span class="opcao-nome"></span>
                   <span class="opcao-detalhe"></span>
                 </span>`;
            label.querySelector('.opcao-nome').textContent = pag.nome;
            label.querySelector('.opcao-detalhe').textContent = pag.detalhe;
            alvo.appendChild(label);
        });
    }

    /* ---------- Carrinho ---------- */
    function mudar(id, delta) {
        const atual = carrinho.get(id) || 0;
        const novo = Math.max(0, Math.min(99, atual + delta));
        if (novo === 0) carrinho.delete(id);
        else carrinho.set(id, novo);
        sincronizarItem(id);
        atualizarTotais();
        salvar();
    }

    function sincronizarItem(id) {
        const linha = document.querySelector(`.linha-item[data-id="${id}"]`);
        if (!linha) return;
        const qtd = carrinho.get(id) || 0;
        linha.querySelector('.contador-valor').textContent = String(qtd);
        linha.classList.toggle('linha-ativa', qtd > 0);
    }

    /* ---------- Cupom ---------- */
    let cupom = null; // objeto já validado, ou null

    function cupomAtivo(c) {
        if (!c || c.ativo === false) return false;
        if (c.validoAte) {
            // comparação por data local, sem escorregar para o dia seguinte
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);
            if (new Date(c.validoAte + 'T00:00:00') < hoje) return false;
        }
        return true;
    }

    function validarCupom(codigo, subtotal) {
        const alvo = String(codigo || '').trim().toUpperCase();
        if (!alvo) return { erro: 'Digite um cupom.' };

        const achado = (P.cupons || []).find((c) => c.codigo.toUpperCase() === alvo);
        if (!achado) return { erro: 'Cupom inválido. Confira o código.' };
        if (!cupomAtivo(achado)) return { erro: 'Este cupom expirou.' };
        if (subtotal < (achado.minimo || 0)) {
            return { erro: 'Este cupom vale a partir de ' + centavosParaReais(achado.minimo) + '.' };
        }
        return { erro: null, cupom: achado };
    }

    // Quanto o cupom tira, em centavos. Nunca maior que o subtotal.
    function descontoDoCupom(c, subtotal) {
        if (!cupomAtivo(c)) return 0;
        switch (c.tipo) {
            case 'percentual':
                return Math.min(subtotal, Math.round(subtotal * c.desconto / 100));
            case 'valor':
                return Math.min(subtotal, c.desconto);
            case 'item': {
                let alvo = 0;
                catalogo.forEach((item) => {
                    if (item.nome !== c.alvo) return;
                    alvo += c.desconto * (carrinho.get(item.id) || 0);
                });
                return Math.min(subtotal, alvo);
            }
            case 'frete':
            default:
                return 0; // frete não desconta do subtotal, zera a taxa
        }
    }

    function totais() {
        let subtotal = 0;
        let quantidade = 0;
        catalogo.forEach((item) => {
            const qtd = carrinho.get(item.id) || 0;
            if (qtd > 0) {
                subtotal += item.preco * qtd;
                quantidade += qtd;
            }
        });

        const entrega = form.modalidade.value === 'entrega';
        let taxa = entrega ? P.config.taxaEntrega : 0;

        const desconto = descontoDoCupom(cupom, subtotal);
        // frete grátis só faz sentido se o cupom ainda for válido
        if (entrega && cupom && cupomAtivo(cupom) && cupom.tipo === 'frete') taxa = 0;

        return { subtotal, quantidade, taxa, desconto, cupom, total: subtotal - desconto + taxa };
    }

    function atualizarTotais() {
        const { quantidade, total, desconto } = totais();
        barra.hidden = quantidade === 0;
        barraQtd.textContent = quantidade === 1 ? '1 item' : `${quantidade} itens`;
        barraTotal.textContent = centavosParaReais(total);

        const linhaDesconto = $('#barra-desconto');
        linhaDesconto.hidden = desconto <= 0;
        if (desconto > 0) linhaDesconto.textContent = 'Desconto: −' + centavosParaReais(desconto);
    }

    /* ---------- Etapa de endereço (só para entrega) ---------- */
    const etapaEndereco = $('#etapa-endereco');

    function aplicarModalidade() {
        const entrega = form.modalidade.value === 'entrega';
        etapaEndereco.hidden = !entrega;
        renumerarEtapas();
        renderizarUnidades();
        atualizarTotais();
        salvar();
    }

    // some com a numeração pulada quando a etapa de endereço some
    function renumerarEtapas() {
        let n = 0;
        document.querySelectorAll('.etapa').forEach((etapa) => {
            if (etapa.hidden) return;
            etapa.querySelector('.etapa-num').textContent = String(++n);
        });
    }

    /* ---------- Taxa de entrega visível no pagamento ---------- */
    function atualizarPagamento() {
        const nota = $('#nota-pagamento');
        const entrega = form.modalidade.value === 'entrega';
        if (!entrega) {
            nota.hidden = true;
            return;
        }
        const partes = [];
        partes.push(P.config.taxaEntrega > 0
            ? `Taxa de entrega: ${centavosParaReais(P.config.taxaEntrega)}.`
            : 'A taxa de entrega é combinada no atendimento.');
        if (P.config.pedidoMinimo > 0) {
            partes.push(`Pedido mínimo de ${centavosParaReais(P.config.pedidoMinimo)}.`);
        }
        nota.textContent = partes.join(' ');
        nota.hidden = false;
    }

    /* ---------- Mensagem do WhatsApp ---------- */
    function montarMensagem() {
        const { subtotal, taxa, desconto, total, cupom: cup } = totais();
        const unidade = P.unidades.find((u) => u.id === form.unidade.value);
        const pagamento = P.pagamentos.find((p) => p.id === form.pagamento.value);
        const entrega = form.modalidade.value === 'entrega';

        const L = [];
        L.push('🍔 *PEDIDO — ' + P.nome + '*');
        L.push('');

        L.push('*ITENS*');
        catalogo.forEach((item) => {
            const qtd = carrinho.get(item.id) || 0;
            if (qtd > 0) {
                L.push(`${qtd}x ${item.nome} — ${centavosParaReais(item.preco * qtd)}`);
            }
        });
        L.push('');

        L.push(`*Subtotal:* ${centavosParaReais(subtotal)}`);
        if (desconto > 0) {
            L.push(`*Cupom ${cup.codigo}:* −${centavosParaReais(desconto)}`);
        }
        if (entrega) {
            // O cupom de frete vale mesmo com a taxa "a combinar": se a loja
            // prometeu frete grátis, o pedido vai com a taxa zerada e o
            // código visível, senão o desconto não serviria para nada.
            const freteGratis = cup && cup.tipo === 'frete' && cupomAtivo(cup);
            let linhaTaxa;
            if (freteGratis) linhaTaxa = 'grátis (cupom ' + cup.codigo + ')';
            else if (taxa > 0) linhaTaxa = centavosParaReais(taxa);
            else linhaTaxa = 'a combinar';
            L.push(`*Taxa de entrega:* ${linhaTaxa}`);
        }
        L.push(`*Total:* ${centavosParaReais(total)}`);
        L.push('');

        L.push(entrega ? '*ENTREGA*' : '*RETIRADA*');
        L.push('Unidade: ' + unidade.nome);
        L.push(unidade.endereco + ' — ' + unidade.cidade);
        if (entrega) {
            L.push('Cliente: ' + form.endereco.value.trim());
            L.push('Bairro: ' + form.bairro.value.trim());
            L.push('Cidade: ' + form.cidade.value.trim());
            const ref = form.referencia.value.trim();
            if (ref) L.push('Referência: ' + ref);
        }
        L.push('');

        L.push('*Pagamento:* ' + pagamento.nome);
        L.push('*Cliente:* ' + form.nome.value.trim());
        L.push('*Telefone:* ' + form.telefone.value.trim());

        const obs = form.observacoes.value.trim();
        if (obs) {
            L.push('');
            L.push('*Observações:* ' + obs);
        }
        if (P.config.aviso) {
            L.push('');
            L.push('_' + P.config.aviso + '_');
        }

        return L.join('\n');
    }

    /* ---------- Mensagens na tela ---------- */
    const aviso = $('#pedido-aviso');
    let avisoTimer = null;

    function mostrarErro(texto) {
        aviso.hidden = true;
        clearTimeout(avisoTimer);
        erro.textContent = texto;
        erro.hidden = false;
        erro.scrollIntoView({ block: 'center' });
    }

    // Aviso informativo: some sozinho, não é erro.
    function mostrarAviso(texto, ms = 7000) {
        clearTimeout(avisoTimer);
        aviso.textContent = texto;
        aviso.hidden = false;
        avisoTimer = setTimeout(() => { aviso.hidden = true; }, ms);
    }

    function validar() {
        if (!form.modalidade.value) return 'Escolha entrega ou retirada.';
        if (!form.unidade.value) return 'Escolha a unidade.';
        if (form.modalidade.value === 'entrega') {
            if (!form.endereco.value.trim()) return 'Informe o endereço de entrega.';
            if (!form.bairro.value.trim()) return 'Informe o bairro.';
            if (!form.cidade.value.trim()) return 'Informe a cidade.';
        }
        if (carrinho.size === 0) return 'Escolha pelo menos um item.';
        if (!form.pagamento.value) return 'Escolha a forma de pagamento.';
        if (!form.nome.value.trim()) return 'Informe seu nome.';
        if (telefoneParaLink(form.telefone.value).length < 12) return 'Informe um telefone válido com DDD.';
        return null;
    }

    /* ---------- Envio ---------- */
    const enviado = $('#pedido-enviado');
    const enviadoLink = $('#pedido-link');
    const enviadoAviso = $('#pedido-enviado-aviso');

    $('#botao-enviar').addEventListener('click', () => {
        erro.hidden = true;
        enviado.hidden = true;

        const problema = validar();
        if (problema) return mostrarErro(problema);

        const texto = montarMensagem();
        const url = `https://wa.me/${P.whatsapp}?text=${encodeURIComponent(texto)}`;

        // Link de escape sempre disponível: se o navegador bloquear a
        // janela, o pedido não se perde — o cliente clica aqui.
        enviadoLink.href = url;

        const janela = window.open(url, '_blank', 'noopener');
        enviadoAviso.hidden = Boolean(janela);

        // Não limpa nada aqui. Perder o pedido porque o popup foi bloqueado
        // seria pior que manter o formulário preenchido.
        enviado.hidden = false;
        enviado.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    $('#pedido-limpar').addEventListener('click', () => {
        enviado.hidden = true;
        carrinho.clear();
        document.querySelectorAll('.linha-item').forEach((l) => {
            l.classList.remove('linha-ativa');
            l.querySelector('.contador-valor').textContent = '0';
        });
        form.reset();
        // form.reset() não dispara change, então reaplicamos o estado derivado
        renumerarEtapas();
        renderizarUnidades();
        atualizarPagamento();
        atualizarTotais();
        try { localStorage.removeItem(CHAVE); } catch (e) { /* modo privado */ }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ---------- Persistência ---------- */
    function salvar() {
        try {
            const dados = {};
            new FormData(form).forEach((v, k) => { dados[k] = v; });
            localStorage.setItem(CHAVE, JSON.stringify({
                campos: dados,
                carrinho: [...carrinho],
                cupom: cupom ? cupom.codigo : '',
            }));
        } catch (e) { /* localStorage indisponível: segue sem salvar */ }
    }

    function restaurar() {
        let bruto;
        try { bruto = localStorage.getItem(CHAVE); } catch (e) { return; }
        if (!bruto) return;
        try {
            const { campos, carrinho: itens } = JSON.parse(bruto);
            Object.entries(campos || {}).forEach(([k, v]) => {
                if (form.elements[k]) form.elements[k].value = v;
            });
            (itens || []).forEach(([id, qtd]) => {
                if (qtd > 0) carrinho.set(id, qtd);
            });
        } catch (e) { /* json corrompido: começa limpo */ }
    }

    /* ---------- Eventos ---------- */
    form.addEventListener('change', (e) => {
        if (e.target.name === 'modalidade') return aplicarModalidade();
        salvar();
    });
    form.addEventListener('input', salvar);

    /* ---------- Botão do cupom ---------- */
    const cupomInput = $('#cupom-codigo');
    const cupomFeedback = $('#cupom-feedback');

    function aplicarCupom() {
        const { subtotal } = totais();
        const r = validarCupom(cupomInput.value, subtotal);
        cupomFeedback.hidden = false;

        if (r.erro) {
            cupom = null;
            cupomFeedback.textContent = r.erro;
            cupomFeedback.className = 'cupom-feedback cupom-erro';
        } else {
            cupom = r.cupom;
            cupomInput.value = cupom.codigo;
            cupomFeedback.className = 'cupom-feedback cupom-ok';
            cupomFeedback.textContent = cupom.descricao + ' — aplicado.';
            mostrarAviso('Cupom ' + cupom.codigo + ' aplicado.');
        }
        atualizarTotais();
        salvar();
    }

    $('#cupom-aplicar').addEventListener('click', aplicarCupom);
    cupomInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); aplicarCupom(); }
    });
    // sair do campo depois de aplicado não deve sumir com o desconto
    cupomInput.addEventListener('change', () => {
        if (cupom && cupomInput.value.trim().toUpperCase() === cupom.codigo) return;
        if (!cupomInput.value.trim()) { cupom = null; atualizarTotais(); }
    });

    /* ---------- Início ---------- */
    renderizarMenu();
    renderizarPagamentos();
    restaurar();
    form.querySelectorAll('.linha-item').forEach((l) => sincronizarItem(l.dataset.id));
    aplicarModalidade();
    renumerarEtapas();
    atualizarTotais();

    // devolve o cupom aplicado antes, se ainda valer
    try {
        const guardado = (JSON.parse(localStorage.getItem(CHAVE) || '{}') || {}).cupom;
        if (guardado) {
            cupomInput.value = guardado;
            const r = validarCupom(guardado, totais().subtotal);
            if (!r.erro) {
                cupom = r.cupom;
                cupomFeedback.hidden = false;
                cupomFeedback.className = 'cupom-feedback cupom-ok';
                cupomFeedback.textContent = cupom.descricao + ' — aplicado.';
            }
        }
    } catch (e) { /* sem cupom guardado */ }

    atualizarTotais();
    if (carrinho.size > 0) mostrarAviso('Recuperamos seu pedido anterior. Confira os itens e ajuste o que quiser.');
})();
