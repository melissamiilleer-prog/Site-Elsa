// ─── WATER CANVAS ANIMATION ─────────────────────────────────────────────────
const canvas = document.getElementById('waterCanvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [];

function resizeCanvas() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
}

function createParticles() {
    particles = [];
    const count = Math.floor(W / 12);
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * W,
            y: Math.random() * H,
            r: Math.random() * 3 + 1,
            speed: Math.random() * 0.4 + 0.1,
            opacity: Math.random() * 0.5 + 0.1,
            phase: Math.random() * Math.PI * 2
        });
    }
}

function drawWater(t) {
    ctx.clearRect(0, 0, W, H);

    // Wave layers
    const waves = [
        { amp: 18, freq: 0.008, speed: 0.0008, color: 'rgba(135,206,235,0.18)', yOff: H * 0.55 },
        { amp: 12, freq: 0.012, speed: 0.0013, color: 'rgba(135,206,235,0.12)', yOff: H * 0.65 },
        { amp: 22, freq: 0.006, speed: 0.0006, color: 'rgba(212,160,23,0.08)', yOff: H * 0.70 },
    ];

    waves.forEach(w => {
        ctx.beginPath();
        ctx.moveTo(0, H);
        for (let x = 0; x <= W; x += 4) {
            const y = w.yOff + Math.sin(x * w.freq + t * w.speed * 10000) * w.amp;
            ctx.lineTo(x, y);
        }
        ctx.lineTo(W, H);
        ctx.closePath();
        ctx.fillStyle = w.color;
        ctx.fill();
    });

    // Floating sparkles
    particles.forEach(p => {
        p.y -= p.speed;
        p.x += Math.sin(t * 0.001 + p.phase) * 0.3;
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(247,220,111,${p.opacity})`;
        ctx.fill();
    });
}

let lastT = 0;
function animate(t) {
    drawWater(t);
    requestAnimationFrame(animate);
}

window.addEventListener('resize', () => { resizeCanvas(); createParticles(); });
resizeCanvas();
createParticles();
requestAnimationFrame(animate);

// ─── NAV SCROLL BEHAVIOR ────────────────────────────────────────────────────
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 80);
});

// ─── MOBILE NAV TOGGLE ──────────────────────────────────────────────────────
const toggle = document.querySelector('.nav-toggle');
const navUl = document.querySelector('nav ul');
toggle.addEventListener('click', () => {
    navUl.classList.toggle('open');
});
document.querySelectorAll('nav a').forEach(a => {
    a.addEventListener('click', () => navUl.classList.remove('open'));
});

// ─── SMOOTH SCROLL ──────────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ─── SCROLL REVEAL ──────────────────────────────────────────────────────────
const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObs.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ─── CARD RIPPLE EFFECT ─────────────────────────────────────────────────────
document.querySelectorAll('.card, .atend-card').forEach(card => {
    card.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        const rect = this.getBoundingClientRect();
        ripple.style.left = (e.clientX - rect.left) + 'px';
        ripple.style.top = (e.clientY - rect.top) + 'px';
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 700);
    });
});

// ─── CARRINHO DE COMPRAS ────────────────────────────────────────────────────
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

// Salva o carrinho no localStorage
function salvarCarrinho() {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

// Adiciona produto ao carrinho
function adicionarAoCarrinho(nome, preco) {
    const itemExistente = carrinho.find(item => item.nome === nome);
    
    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        carrinho.push({
            id: Date.now(),
            nome: nome,
            preco: preco,
            quantidade: 1
        });
    }
    
    salvarCarrinho();
    atualizarCarrinho();
    mostrarNotificacao(`${nome} adicionado ao carrinho!`);
}

// ─── SELETOR DE COR DAS VELAS ──────────────────────────────────────────────
const catalogoCoresVelas = {
    palito: {
        nome: 'Vela de Palito',
        preco: 6,
        titulo: 'Vela de Palito — Escolha a cor',
        cores: [
            { nome: 'Laranja', hex: '#f0762b' },
            { nome: 'Vermelha', hex: '#d92b2b' },
            { nome: 'Verde', hex: '#1e8f3e' },
            { nome: 'Azul', hex: '#1f5fbf' },
            { nome: 'Branca', hex: '#f7f7f2' },
            { nome: 'Vinho', hex: '#6e1b2b' },
            { nome: 'Rosa', hex: '#e87fb0' },
            { nome: 'Magenta', hex: '#a4116f' },
            { nome: 'Marrom', hex: '#6b3d20' },
            { nome: 'Preta', hex: '#1a1a1a' },
            { nome: 'Amarela', hex: '#f2c60f' },
            { nome: 'Azul Claro', hex: '#7ec6e6' },
        ]
    },
    '7dias': {
        nome: 'Vela de 7 Dias',
        preco: 13.55,
        titulo: 'Vela de 7 Dias — Escolha a cor',
        cores: [
            { nome: 'Vermelha', hex: '#c8272c' },
            { nome: 'Branca', hex: '#f7f7f2' },
            { nome: 'Azul', hex: '#1e3f8f' },
            { nome: 'Verde', hex: '#1e6b34' },
            { nome: 'Amarela', hex: '#f2c60f' },
            { nome: 'Preta', hex: '#1a1a1a' },
        ]
    }
};

let corSelecionadaAtual = null;
let produtoCorAtual = null;

function abrirSeletorCor(tipo) {
    const produto = catalogoCoresVelas[tipo];
    if (!produto) return;

    produtoCorAtual = tipo;
    corSelecionadaAtual = null;

    document.getElementById('corModalTitulo').textContent = produto.titulo;
    document.getElementById('corSelecionadaTexto').textContent = '';

    const leque = document.getElementById('corLeque');
    leque.innerHTML = produto.cores.map(c => `
        <button class="cor-opcao" data-cor="${c.nome}" onclick="selecionarCor('${c.nome}')">
            <span class="cor-swatch" style="background:${c.hex}"></span>
            <span>${c.nome}</span>
        </button>
    `).join('');

    const btnConfirmar = document.getElementById('corConfirmarBtn');
    btnConfirmar.disabled = true;

    const modal = document.getElementById('corModal');
    modal.classList.add('open');
}

function selecionarCor(cor) {
    corSelecionadaAtual = cor;

    document.querySelectorAll('#corLeque .cor-opcao').forEach(btn => {
        btn.classList.toggle('selecionada', btn.dataset.cor === cor);
    });

    document.getElementById('corSelecionadaTexto').textContent = `Cor selecionada: ${cor}`;
    document.getElementById('corConfirmarBtn').disabled = false;
}

function confirmarCorEAdicionar() {
    if (!produtoCorAtual || !corSelecionadaAtual) return;

    const produto = catalogoCoresVelas[produtoCorAtual];
    const nomeCompleto = `${produto.nome} — ${corSelecionadaAtual}`;

    adicionarAoCarrinho(nomeCompleto, produto.preco);
    fecharSeletorCor();
}

function fecharSeletorCor() {
    const modal = document.getElementById('corModal');
    modal.classList.remove('open');
    produtoCorAtual = null;
    corSelecionadaAtual = null;
}

// Fecha modal de cor ao clicar fora
document.addEventListener('DOMContentLoaded', () => {
    const corModal = document.getElementById('corModal');
    if (corModal) {
        corModal.addEventListener('click', (e) => {
            if (e.target === corModal) {
                fecharSeletorCor();
            }
        });
    }
});

// Remove produto do carrinho
function removerDoCarrinho(id) {
    carrinho = carrinho.filter(item => item.id !== id);
    salvarCarrinho();
    atualizarCarrinho();
}

// Atualiza quantidade
function atualizarQuantidade(id, quantidade) {
    const item = carrinho.find(item => item.id === id);
    if (item) {
        item.quantidade = Math.max(1, quantidade);
        if (item.quantidade === 0) {
            removerDoCarrinho(id);
        } else {
            salvarCarrinho();
            atualizarCarrinho();
        }
    }
}

// Atualiza a exibição do carrinho
function atualizarCarrinho() {
    const total = carrinho.length;
    const contador = document.querySelector('.cart-count');
    if (contador) {
        contador.textContent = total;
        contador.style.display = total > 0 ? 'flex' : 'none';
    }
    
    // Atualiza lista do modal
    const listaCarrinho = document.getElementById('listaCarrinho');
    if (listaCarrinho) {
        if (carrinho.length === 0) {
            listaCarrinho.innerHTML = '<p style="text-align: center; color: #999;">Seu carrinho está vazio</p>';
        } else {
            listaCarrinho.innerHTML = carrinho.map(item => `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.nome}</h4>
                        <p class="cart-price">R$ ${item.preco.toFixed(2)}</p>
                    </div>
                    <div class="cart-item-controls">
                        <button class="qty-btn" onclick="atualizarQuantidade(${item.id}, ${item.quantidade - 1})">−</button>
                        <span class="qty">${item.quantidade}</span>
                        <button class="qty-btn" onclick="atualizarQuantidade(${item.id}, ${item.quantidade + 1})">+</button>
                        <button class="remove-btn" onclick="removerDoCarrinho(${item.id})">🗑</button>
                    </div>
                    <p class="cart-subtotal">R$ ${(item.preco * item.quantidade).toFixed(2)}</p>
                </div>
            `).join('');
        }
    }
    
    atualizarResumo();
}

// Atualiza resumo do pedido
function atualizarResumo() {
    const subtotal = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
    const frete = subtotal > 100 ? 0 : 15;
    const total = subtotal + frete;
    
    const resumoSubtotal = document.getElementById('resumoSubtotal');
    const resumoFrete = document.getElementById('resumoFrete');
    const resumoTotal = document.getElementById('resumoTotal');
    
    if (resumoSubtotal) {
        resumoSubtotal.textContent = `R$ ${subtotal.toFixed(2)}`;
    }
    if (resumoFrete) {
        resumoFrete.innerHTML = frete === 0 ? '<span style="color: green;">Grátis!</span>' : `R$ ${frete.toFixed(2)}`;
    }
    if (resumoTotal) {
        resumoTotal.textContent = `R$ ${total.toFixed(2)}`;
    }
}

// Abre/fecha modal do carrinho
function toggleCarrinho() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.classList.toggle('open');
    }
}

// Mostra notificação
function mostrarNotificacao(mensagem) {
    const notif = document.createElement('div');
    notif.className = 'notificacao';
    notif.textContent = mensagem;
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notif.classList.remove('show');
        setTimeout(() => notif.remove(), 300);
    }, 2000);
}

// Inicializa carrinho
function inicializarCarrinho() {
    atualizarCarrinho();
    
    const cartBtn = document.querySelector('.cart-btn');
    if (cartBtn) {
        cartBtn.addEventListener('click', toggleCarrinho);
    }
    
    const closeBtn = document.getElementById('closeCart');
    if (closeBtn) {
        closeBtn.addEventListener('click', toggleCarrinho);
    }
    
    // Fecha modal ao clicar fora
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                toggleCarrinho();
            }
        });
    }
    
    // Setup do input de CEP
    const inputCep = document.getElementById('checkoutCep');
    if (inputCep) {
        inputCep.addEventListener('input', (e) => {
            e.target.value = formatarCEP(e.target.value);
        });
    }
}

// ─── WHATSAPP HELPER ────────────────────────────────────────────────────────
function abrirWhatsApp(produto) {
    const msg = encodeURIComponent(`Olá! Tenho interesse em: ${produto}`);
    window.open(`https://wa.me/5511999999999?text=${msg}`, '_blank');
}

// ─── FORM SUBMIT ────────────────────────────────────────────────────────────
function enviarMensagem() {
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const mensagem = document.getElementById('mensagem').value.trim();
    const fb = document.getElementById('formFeedback');

    if (!nome || !email || !mensagem) {
        fb.textContent = '⚠️ Por favor, preencha nome, email e mensagem.';
        fb.className = 'form-feedback error';
        return;
    }
    fb.textContent = '✦ Mensagem enviada com sucesso! Entraremos em contato em breve.';
    fb.className = 'form-feedback success';
    document.getElementById('nome').value = '';
    document.getElementById('email').value = '';
    document.getElementById('assunto').value = '';
    document.getElementById('mensagem').value = '';
    setTimeout(() => { fb.textContent = ''; fb.className = 'form-feedback'; }, 5000);
}

// ─── SISTEMA DE FRETE ─────────────────────────────────────────────────────
// Tabela de zonas de São Paulo para Sedex
const tabelaSedex = {
    'zona-centro': { nome: 'Centro SP', cep_inicio: 1000, cep_fim: 1999, preco: 18 },
    'zona-norte': { nome: 'Zona Norte', cep_inicio: 2000, cep_fim: 2999, preco: 22 },
    'zona-sul': { nome: 'Zona Sul', cep_inicio: 4000, cep_fim: 5999, preco: 22 },
    'zona-leste': { nome: 'Zona Leste', cep_inicio: 3000, cep_fim: 3999, preco: 24 },
    'zona-oeste': { nome: 'Zona Oeste', cep_inicio: 6000, cep_fim: 6999, preco: 20 },
    'abc': { nome: 'Grande ABC', cep_inicio: 9000, cep_fim: 9999, preco: 28 },
};

// Coordenadas aproximadas do centro de São Paulo (origem do Motoboy)
const lojaOrigin = { lat: -23.5505, lng: -46.6333 };

// Função para extrair os 5 primeiros dígitos do CEP
function getCepZona(cep) {
    const cepNum = parseInt(cep.replace(/\D/g, ''));
    const primeiroDigito = Math.floor(cepNum / 10000);
    
    for (const [key, zona] of Object.entries(tabelaSedex)) {
        if (cepNum >= zona.cep_inicio * 100 && cepNum <= zona.cep_fim * 100) {
            return { key, zona };
        }
    }
    
    return { key: 'abc', zona: tabelaSedex['abc'] };
}

// Função para calcular frete Sedex
function calcularFreteSedex(cep) {
    const { zona } = getCepZona(cep);
    return zona.preco;
}

// Função para calcular frete Motoboy (por km aproximado baseado em zona)
function calcularFreteMotoboy(cep) {
    const distanciaKmPorZona = {
        'zona-centro': 3,
        'zona-norte': 8,
        'zona-sul': 8,
        'zona-leste': 10,
        'zona-oeste': 6,
        'abc': 25,
    };
    
    const { key } = getCepZona(cep);
    const distancia = distanciaKmPorZona[key] || 10;
    const valorPorKm = 3.50;
    const taxaBase = 10;
    
    return Math.round((taxaBase + (distancia * valorPorKm)) * 100) / 100;
}

// Função para atualizar opções de frete
function atualizarOpcoesFretes(cep) {
    if (!cep || cep.length < 8) {
        mostrarNotificacao('⚠️ CEP inválido!');
        return null;
    }
    
    const sedex = calcularFreteSedex(cep);
    const motoboy = calcularFreteMotoboy(cep);
    
    return { sedex, motoboy };
}

// Função para formatar CEP com máscara
function formatarCEP(cep) {
    cep = cep.replace(/\D/g, '');
    if (cep.length > 5) {
        cep = cep.slice(0, 5) + '-' + cep.slice(5, 8);
    }
    return cep;
}

// ─── CHECKOUT ───────────────────────────────────────────────────────────────
function abrirCheckout() {
    if (carrinho.length === 0) {
        mostrarNotificacao('⚠️ Seu carrinho está vazio!');
        return;
    }
    
    const checkoutModal = document.getElementById('checkoutModal');
    if (checkoutModal) {
        checkoutModal.classList.add('open');
        atualizarResumoCheckout();
    }
}

function fecharCheckout() {
    const checkoutModal = document.getElementById('checkoutModal');
    if (checkoutModal) {
        checkoutModal.classList.remove('open');
    }
}

// Atualiza resumo do checkout com opções de frete
function atualizarResumoCheckout() {
    const cep = document.getElementById('checkoutCep')?.value;
    const metodoFrete = document.getElementById('metodoFrete')?.value || 'sedex';
    
    const subtotal = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
    
    let frete = 0;
    
    if (cep && cep.length >= 8) {
        const fretes = atualizarOpcoesFretes(cep);
        if (fretes) {
            frete = metodoFrete === 'motoboy' ? fretes.motoboy : fretes.sedex;
            
            // Atualizar opções de frete visíveis
            const sedexBtn = document.getElementById('freteSedex');
            const motoboyBtn = document.getElementById('freteMotoboy');
            
            if (sedexBtn) sedexBtn.textContent = `📦 Sedex - R$ ${fretes.sedex.toFixed(2)}`;
            if (motoboyBtn) motoboyBtn.textContent = `🏍️ Motoboy - R$ ${fretes.motoboy.toFixed(2)}`;
        }
    }
    
    const total = subtotal + frete;
    
    const resumoSubtotal = document.getElementById('checkoutSubtotal');
    const resumoFrete = document.getElementById('checkoutFrete');
    const resumoTotal = document.getElementById('checkoutTotal');
    
    if (resumoSubtotal) resumoSubtotal.textContent = `R$ ${subtotal.toFixed(2)}`;
    if (resumoFrete) resumoFrete.textContent = `R$ ${frete.toFixed(2)}`;
    if (resumoTotal) resumoTotal.textContent = `R$ ${total.toFixed(2)}`;
}

function finalizarCompra(metodo) {
    const nome = document.getElementById('checkoutNome')?.value.trim();
    const email = document.getElementById('checkoutEmail')?.value.trim();
    const telefone = document.getElementById('checkoutTelefone')?.value.trim();
    const cep = document.getElementById('checkoutCep')?.value.trim();
    const metodoFrete = document.getElementById('metodoFrete')?.value || 'sedex';
    
    if (!nome || !email || !telefone || !cep) {
        mostrarNotificacao('⚠️ Preencha todos os campos!');
        return;
    }
    
    const itemsTexto = carrinho.map(item => `${item.quantidade}x ${item.nome} - R$ ${(item.preco * item.quantidade).toFixed(2)}`).join('\n');
    const subtotal = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
    const fretes = atualizarOpcoesFretes(cep);
    const frete = metodoFrete === 'motoboy' ? fretes.motoboy : fretes.sedex;
    const total = subtotal + frete;
    
    const nomeMetodo = metodoFrete === 'motoboy' ? '🏍️ Motoboy' : '📦 Sedex';
    
    let mensagem = `Olá! Gostaria de fazer um pedido:\n\n${itemsTexto}\n\nSubtotal: R$ ${subtotal.toFixed(2)}\nFrete (${nomeMetodo}): R$ ${frete.toFixed(2)}\nTotal: R$ ${total.toFixed(2)}\n\nDados da Entrega:\nNome: ${nome}\nEmail: ${email}\nTelefone: ${telefone}\nCEP: ${cep}\nMétodo: ${nomeMetodo}`;
    
    const msg = encodeURIComponent(mensagem);
    window.open(`https://wa.me/5511999999999?text=${msg}`, '_blank');
    
    carrinho = [];
    salvarCarrinho();
    atualizarCarrinho();
    fecharCheckout();
    mostrarNotificacao('✓ Pedido enviado! Aguarde nosso contato.');
}

// ─── INICIALIZAÇÃO ──────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    inicializarCarrinho();
});
