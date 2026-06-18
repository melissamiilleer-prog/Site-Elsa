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

// ─── CHECKOUT ───────────────────────────────────────────────────────────────
function abrirCheckout() {
    if (carrinho.length === 0) {
        mostrarNotificacao('⚠️ Seu carrinho está vazio!');
        return;
    }
    
    const total = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0) + (total > 100 ? 0 : 15);
    const checkoutModal = document.getElementById('checkoutModal');
    
    if (checkoutModal) {
        checkoutModal.classList.add('open');
        document.getElementById('checkoutTotal').textContent = `R$ ${total.toFixed(2)}`;
    }
}

function fecharCheckout() {
    const checkoutModal = document.getElementById('checkoutModal');
    if (checkoutModal) {
        checkoutModal.classList.remove('open');
    }
}

function finalizarCompra(metodo) {
    const nome = document.getElementById('checkoutNome').value.trim();
    const email = document.getElementById('checkoutEmail').value.trim();
    const telefone = document.getElementById('checkoutTelefone').value.trim();
    
    if (!nome || !email || !telefone) {
        mostrarNotificacao('⚠️ Preencha todos os campos!');
        return;
    }
    
    const itemsTexto = carrinho.map(item => `${item.quantidade}x ${item.nome} - R$ ${(item.preco * item.quantidade).toFixed(2)}`).join('\n');
    const subtotal = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
    const frete = subtotal > 100 ? 0 : 15;
    const total = subtotal + frete;
    
    let mensagem = `Olá! Gostaria de fazer um pedido:\n\n${itemsTexto}\n\nSubtotal: R$ ${subtotal.toFixed(2)}\nFrete: R$ ${frete.toFixed(2)}\nTotal: R$ ${total.toFixed(2)}\n\nMétodo: ${metodo}\nNome: ${nome}\nEmail: ${email}\nTelefone: ${telefone}`;
    
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
