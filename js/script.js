// Sistema de Carrinho
let cart = [];

function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    const count = cart.length;
    if (count > 0) {
        badge.textContent = count;
        badge.style.display = 'flex';
    } else {
        badge.style.display = 'none';
    }
}

function addToCart(item) {
    cart.push(item);
    updateCartBadge();
    
    // Analytics tracking
    if (window.analytics) {
        analytics.trackAddToCart({
            name: item.tipo,
            category: item.categoria || 'bolo',
            price: item.preco || 0
        });
    }
    
    alert('✅ Item adicionado ao carrinho!');
    closeProductModal();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartBadge();
    openCart();
}

function openCart() {
    const modal = document.getElementById('productModal');
    const content = document.getElementById('modalContent');
    
    if (cart.length === 0) {
        content.innerHTML = `
            <h2 class="modal-title">Carrinho Vazio</h2>
            <p style="text-align: center; color: #666; margin: 40px 0;">Seu carrinho está vazio. Adicione produtos para fazer seu pedido!</p>
        `;
    } else {
        let itemsHTML = cart.map((item, index) => `
            <div style="background: #f8f8f8; padding: 20px; border-radius: 12px; margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div style="flex: 1;">
                        <h3 style="margin: 0 0 10px 0; font-size: 18px;">${item.tipo}</h3>
                        ${item.detalhes}
                    </div>
                    <button onclick="removeFromCart(${index})" style="background: #ff3b30; color: white; border: none; padding: 8px 12px; border-radius: 8px; cursor: pointer; font-size: 14px;">Remover</button>
                </div>
            </div>
        `).join('');
        
        content.innerHTML = `
            <h2 class="modal-title">Meu Carrinho (${cart.length} ${cart.length === 1 ? 'item' : 'itens'})</h2>
            <div style="margin: 30px 0;">${itemsHTML}</div>
            <div style="margin: 20px 0;">
                <label style="display: block; margin-bottom: 10px; font-weight: 500;">👤 Nome completo: *</label>
                <input type="text" id="cart-name" placeholder="Seu nome completo" required
                       style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; font-size: 14px;">
            </div>
            <div style="margin: 20px 0;">
                <label style="display: block; margin-bottom: 10px; font-weight: 500;">📍 Endereço completo: *</label>
                <textarea id="cart-address" placeholder="Rua, número, bairro, cidade..." required
                          style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; font-size: 14px; min-height: 80px; font-family: inherit; resize: vertical;"></textarea>
            </div>
            <div style="margin: 20px 0;">
                <label style="display: block; margin-bottom: 10px; font-weight: 500;">📝 Observações adicionais (opcional):</label>
                <textarea id="cart-observations" placeholder="Ex: Data de entrega, horário, detalhes especiais..." 
                          style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; font-size: 14px; min-height: 80px; font-family: inherit; resize: vertical;"></textarea>
            </div>
            <button class="modal-cta" onclick="sendCartOrder()">
                Enviar Pedido Completo pelo WhatsApp
            </button>
            <button onclick="closeProductModal()" style="width: 100%; padding: 15px; background: #f0f0f0; color: #333; border: none; border-radius: 12px; font-size: 16px; font-weight: 500; cursor: pointer; margin-top: 10px;">
                Continuar Comprando
            </button>
        `;
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function sendCartOrder() {
    const name = document.getElementById('cart-name');
    const address = document.getElementById('cart-address');
    
    if (!name || !name.value.trim()) {
        alert('⚠️ Por favor, informe seu nome completo.');
        if (name) name.focus();
        return;
    }
    
    if (!address || !address.value.trim()) {
        alert('⚠️ Por favor, informe seu endereço completo.');
        if (address) address.focus();
        return;
    }
    
    // Analytics tracking
    if (window.analytics) {
        const totalValue = cart.reduce((sum, item) => sum + (item.preco || 80), 0);
        analytics.trackBeginCheckout(totalValue, cart);
        analytics.trackWhatsAppClick('cart_order');
    }
    
    let message = '🛒 *Pedido Completo*\n\n';
    message += `👤 *Nome:* ${name.value.trim()}\n`;
    message += `📍 *Endereço:* ${address.value.trim()}\n\n`;
    message += '*--- ITENS DO PEDIDO ---*\n\n';
    
    let totalValue = 0;
    
    cart.forEach((item, index) => {
        message += `*${index + 1}. ${item.tipo}*\n${item.mensagem}\n\n`;
        if (item.price) {
            totalValue += parseFloat(item.price);
        }
    });
    
    message += `📦 *Total de itens:* ${cart.length}`;
    
    if (totalValue > 0) {
        message += `\n💰 *Valor Total:* R$ ${totalValue.toFixed(2)}`;
    }
    
    const observations = document.getElementById('cart-observations');
    if (observations && observations.value.trim()) {
        message += `\n\n📝 *Observações:*\n${observations.value.trim()}`;
    }
    
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=5519971307912&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    cart = [];
    updateCartBadge();
    closeProductModal();
}

// Dark Mode Toggle
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Toggle icons
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    
    if (newTheme === 'dark') {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    } else {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
    }
}

// Load saved theme
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    if (savedTheme === 'dark') {
        const sunIcon = document.querySelector('.sun-icon');
        const moonIcon = document.querySelector('.moon-icon');
        if (sunIcon && moonIcon) {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        }
    }
});

// Smooth scroll para links de navegação
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background on scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.8)';
    }
});

// Parallax effect no hero
const heroImage = document.querySelector('.hero-image');
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    if (heroImage) {
        heroImage.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Fade in ao rolar
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observar todos os elementos com fade-in
document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Lazy load galeria com Intersection Observer
const galleryObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target.querySelector('img');
            if (img && img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            galleryObserver.unobserve(entry.target);
        }
    });
}, { rootMargin: '50px' });

const galleryItems = document.querySelectorAll('.gallery-item');
galleryItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    galleryObserver.observe(item);
});

// Parallax suave nas imagens dos produtos
window.addEventListener('scroll', () => {
    const productImages = document.querySelectorAll('.product-image img');
    productImages.forEach(img => {
        const rect = img.getBoundingClientRect();
        const scrollPercent = (window.innerHeight - rect.top) / window.innerHeight;
        if (scrollPercent > 0 && scrollPercent < 1) {
            img.style.transform = `scale(${1 + scrollPercent * 0.1})`;
        }
    });
});

// Dados dos produtos
const productsData = {
    'bolos-decorados': {
        title: 'Bolos Decorados',
        description: 'Criamos bolos únicos e personalizados para aniversários, casamentos, batizados e eventos especiais. R$ 80,00/kg (massas tradicionais).',
        features: [
            '💰 R$ 80,00 / Kg (Massas tradicionais)',
            '',
            '🍰 MASSAS DISPONÍVEIS:',
            'Tradicional baunilha 🍰 | Coco 🥥 | Leite Ninho 🥛',
            'Churros 🍮 | Brigadeiro 🍫 | Brigadeiro branco 🍫🥛',
            '4 Leites 🥛🧈 | Doce de Leite 🍯 | Paçoca 🥜',
            'Beijinho 🥥 | Ameixa 🍑 | Pêssego 🍑',
            'Abacaxi com coco 🍍🥥 | Morango 🍓',
            'Red Velvet ❤️ | Chocolate 🍫 | Café ☕',
            '',
            '🎨 COBERTURAS:',
            'Limão 🍋 | Leite Ninho 🥛 | Chocolate 🍫',
            'Leite Condensado 🥛🍯 | Laranja 🍊 | Morango 🍓',
            '',
            '🍫 RECHEIOS TRADICIONAL:',
            'Massas e recheios clássicos',
            '',
            '⭐ RECHEIOS PREMIUM:',
            'Leite ninho trufado 🥛🍫',
            'Trufado de chocolate ao leite 🍫',
            'Trufado de chocolate meio amargo 🍫',
            'Trufado de chocolate branco 🍫🥛',
            'Alpino 🍫',
            'Oreo 🍪',
            'Maracujá 🍹',
            'Chocolate amargo 🍫',
            '',
            '✨ RECHEIOS ESPECIAL:',
            'Ganache 🍫',
            'Maracujá trufado 🍹🍫',
            'Nutella 🍫',
            'Sonho de Valsa 🍫',
            'Kinder Bueno 🍫',
            'Ouro Branco 🍫',
            'Pistache 🌿',
            'Doce de leite com nozes 🍯🌰',
            'Chocolate com morango 🍫🍓',
            '',
            '⏰ Prazo: 7 dias',
            '📸 Foto comestível opcional'
        ],
        images: [
            'images/downloadgram.org_461696459_1165667781194474_2951026535375491126_n.jpg',
            'images/downloadgram.org_491441920_17941518353989810_7528810505330933416_n.jpg',
            'images/downloadgram.org_491445179_17941298519989810_5302708275154565688_n.jpg',
            'images/downloadgram.org_500326630_17944514105989810_8843742206483996231_n.jpg',
            'images/downloadgram.org_500658581_17944514078989810_5785383886066996581_n.jpg',
            'images/downloadgram.org_501058622_17944514033989810_8970938834600463667_n.jpg',
            'images/downloadgram.org_501264420_17944514096989810_8872102859826452961_n.jpg',
            'images/downloadgram.org_501542616_17944514021989810_343356933580456667_n.jpg',
            'images/downloadgram.org_537499987_17954578145989810_7172687175539727990_n.jpg'
        ]
    },
    'bolos-simples': {
        title: 'Bolos Caseirinhos',
        description: 'Bolos caseiros deliciosos, perfeitos para o dia a dia, café da tarde ou aquela visita especial. R$ 30,00 cada.',
        features: [
            '🥥 Coco',
            '🥜 Paçoca',
            '🥛 Leite Ninho',
            '🍫 Chocolate',
            '🌽🍓 Fubá com goiabada',
            '🌽 Milho',
            '🍋 Limão',
            '🍊 Laranja',
            '🍍 Abacaxi',
            '☕ Café',
            '☕🍫 Capuccino',
            '💰 R$ 30,00 cada',
            '⏰ Prazo: 2 dias'
        ],
        images: [
            'images/downloadgram.org_457356707_1023632335977435_2778840969806108359_n.jpg',
            'images/downloadgram.org_457383571_506368645434009_3148807429923215423_n.jpeg',
            'images/downloadgram.org_457503858_483408134487583_8024968526927135757_n (1).jpeg',
            'images/downloadgram.org_457522063_866805058333348_7268343729862773615_n.jpg'
        ]
    },
    'doces': {
        title: 'Doces Finos',
        description: 'Doces artesanais perfeitos para festas, eventos corporativos ou presentear. Feitos com chocolate de qualidade e muito capricho.',
        features: [
            '🍫 Brigadeiros gourmet',
            '🥥 Beijinhos',
            '🥜 Cajuzinhos',
            '🍓 Doces de frutas',
            '🍬 Trufas',
            '🍫 Bombons',
            '🎁 Embalagens personalizadas',
            '📦 Mínimo: 50 unidades',
            '⏰ Prazo: 3 dias'
        ],
        images: [
            'images/downloadgram.org_533006895_17953898972989810_7697639675988125191_n.jpg',
            'images/downloadgram.org_533051578_17953898990989810_8430620167436077601_n.jpg'
        ]
    },
    'paes': {
        title: 'Pães Artesanais',
        description: 'Pães artesanais feitos com fermentação natural, processo tradicional que garante sabor único e textura perfeita.',
        features: [
            '🍞 Pão de fermentação natural',
            '⚖️ 500g',
            '💰 R$ 15,00',
            '🌾 Ingredientes naturais',
            '🥖 Crocante por fora, macio por dentro',
            '⏰ Prazo: sob consulta'
        ],
        images: [
            'images/Pao-caseiro-simples-e-rapido.jpg'
        ]
    },
    'salgados': {
        title: 'Salgados',
        description: 'Salgados fresquinhos e crocantes para suas festas e eventos. Assados ou fritos, sempre deliciosos!',
        features: [
            '🥟 Coxinhas, risoles, empadas',
            '🥐 Esfirras e pasteis',
            '🍞 Pães recheados',
            '🔥 Assados ou fritos',
            '📦 Mínimo: 50 unidades',
            '⏰ Prazo: 2 dias'
        ],
        images: [
            'images/downloadgram.org_503480362_17947666901989810_550666901866757478_n.jpg'
        ]
    }
};

// Abrir modal
function openProductModal(productId) {
    const product = productsData[productId];
    const modal = document.getElementById('productModal');
    const content = document.getElementById('modalContent');
    
    let imagesHTML = '';
    product.images.forEach(img => {
        imagesHTML += `<img src="${img}" alt="${product.title}">`;
    });
    
    let featuresHTML = '';
    product.features.forEach(feature => {
        featuresHTML += `<li>${feature}</li>`;
    });
    
    content.innerHTML = `
        <h2 class="modal-title">${product.title}</h2>
        <p class="modal-description">${product.description}</p>
        
        <div class="modal-features">
            <h3>Características</h3>
            <ul>${featuresHTML}</ul>
        </div>
        
        <div class="modal-gallery">${imagesHTML}</div>
        
        <button class="modal-cta" onclick="addSimpleProductToCart('${productId}')">
            Adicionar ao Carrinho
        </button>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function addSimpleProductToCart(productId) {
    const product = productsData[productId];
    
    let detalhes = `<p style="margin: 5px 0; font-size: 14px; color: #666;">${product.description}</p>`;
    let mensagem = product.title;
    
    addToCart({
        tipo: product.title,
        detalhes: detalhes,
        mensagem: mensagem
    });
}

// Fechar modal
function closeProductModal() {
    const modal = document.getElementById('productModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Fechar modal com ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeProductModal();
    }
});

// Configurador de Bolo
const cakeConfig = {
    massa: '',
    recheios: [],
    tipoCobertura: '',
    coresCobertura: [],
    peso: 0,
    topper: false,
    temaTopper: ''
};

const massas = [
    'Tradicional baunilha', 'Coco', 'Leite Ninho', 'Churros',
    'Red Velvet', 'Chocolate', 'Café'
];

const recheios = {
    tradicional: [
        'Brigadeiro branco',
        'Brigadeiro coco',
        'Brigadeiro de ninho',
        'Brigadeiro tradicional',
        'Brigadeiro de paçoca',
        'Doce de leite',
        'Coco',
        'Abacaxi com coco',
        '4 leite',
        'Paçoca'
    ],
    premium: [
        'Leite ninho trufado', 'Trufado de chocolate ao leite',
        'Trufado de chocolate meio amargo', 'Trufado de chocolate branco',
        'Alpino', 'Oreo', 'Trufado de maracujá', 'Chocolate amargo',
        'Doce de leite com morango', 'Doce de leite com cereja'
    ],
    especial: [
        'Nutella', 'Sonho de Valsa', 'Kinder Bueno', 'Ouro Branco', 
        'Pistache', 'Doce de leite com nozes', 'Chocolate com morango'
    ]
};

const coberturas = [
    'Chantininho ⭐',
    'Choconinho ⭐ (recomendado para massas escuras de chocolate)'
];



const coresCoberturas = [
    'Branco', 'Rosa', 'Azul', 'Amarelo', 'Verde', 'Lilás', 'Vermelho',
    'Laranja', 'Dourado', 'Prateado', 'Nude', 'Degradê'
];

function openCakeBuilder() {
    const modal = document.getElementById('productModal');
    const content = document.getElementById('modalContent');
    
    content.innerHTML = `
        <h2 class="modal-title">Monte seu Bolo Personalizado</h2>
        <p class="modal-description">Escolha cada detalhe do seu bolo dos sonhos</p>
        
        <div class="cake-builder">
            <div class="builder-step">
                <h3>1. Escolha a Massa 🍰</h3>
                <div class="options-grid">
                    ${massas.map(m => `<button class="option-btn" onclick="selectMassa('${m}')">${m}</button>`).join('')}
                </div>
                <p class="selected">Selecionado: <span id="selected-massa">Nenhum</span></p>
            </div>
            
            <div class="builder-step">
                <h3>2. Escolha os Recheios 🍫 (até 2)</h3>
                <p style="font-size: 14px; color: #666; margin-bottom: 15px;">💡 Você pode escolher 1 ou 2 recheios. Se escolher 2, o preço será a média dos dois</p>
                
                <h4 style="margin-top: 20px;">Tradicional (R$ 80/kg)</h4>
                <div class="options-grid">
                    ${recheios.tradicional.map(r => `<button class="option-btn" onclick="selectRecheio('${r}', 'tradicional')">${r}</button>`).join('')}
                </div>
                
                <h4 style="margin-top: 20px;">Premium ⭐ (R$ 90/kg)</h4>
                <div class="options-grid">
                    ${recheios.premium.map(r => `<button class="option-btn" onclick="selectRecheio('${r}', 'premium')">${r}</button>`).join('')}
                </div>
                
                <h4 style="margin-top: 20px;">Especial ✨ (R$ 100/kg)</h4>
                <div class="options-grid">
                    ${recheios.especial.map(r => `<button class="option-btn" onclick="selectRecheio('${r}', 'especial')">${r}</button>`).join('')}
                </div>
                
                <p class="selected" style="margin-top: 20px;">Selecionados (<span id="recheio-count">0</span>/2): <span id="selected-recheios">Nenhum</span></p>
            </div>
            
            <div class="builder-step">
                <h3>3. Escolha a Cobertura 🎂</h3>
                <p style="font-size: 14px; color: #ff3b30; font-weight: 600; margin-bottom: 15px;">⭐ Especialidades da Casa</p>
                <div class="options-grid">
                    ${coberturas.map(c => `<button class="option-btn specialty-btn" onclick="selectTipoCobertura('${c}')">${c}</button>`).join('')}
                </div>
                <p class="selected">Selecionado: <span id="selected-tipo-cobertura">Nenhum</span></p>
            </div>
            
            <div class="builder-step">
                <h3>4. Escolha as Cores da Cobertura 🌈</h3>
                <p style="font-size: 14px; color: #666; margin-bottom: 15px;">Você pode selecionar até 4 cores</p>
                <div class="options-grid">
                    ${coresCoberturas.map(cor => `<button class="option-btn color-btn" onclick="selectCor('${cor}')">${cor}</button>`).join('')}
                </div>
                <p class="selected">Selecionado: <span id="selected-cor">Nenhum</span></p>
            </div>
            
            <div class="builder-step">
                <h3>5. Quantos Kg? ⚖️</h3>
                <p style="font-size: 14px; color: #666; margin-bottom: 15px;">Mínimo: 1 kg | Máximo: 20 kg | Aceita vírgula ou ponto (Ex: 2,5 ou 2.5)</p>
                <input type="text" id="cake-weight" placeholder="Ex: 2,5 ou 2.5" 
                       style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; font-size: 16px;"
                       oninput="updateCakeWeight()" maxlength="5">
                <p class="selected">Peso: <span id="selected-weight">Não definido</span> | Preço: <span id="selected-price">R$ 0,00</span></p>
            </div>
            
            <div class="builder-step">
                <h3>6. Deseja Topper? 🎂</h3>
                <p style="font-size: 14px; color: #666; margin-bottom: 15px;">Valor definido de acordo com o tema</p>
                <div class="options-grid">
                    <button class="option-btn" onclick="selectTopper(true)">Sim</button>
                    <button class="option-btn" onclick="selectTopper(false)">Não</button>
                </div>
                <p class="selected">Selecionado: <span id="selected-topper">Não definido</span></p>
                
                <div id="topper-tema" style="display: none; margin-top: 20px;">
                    <h4>Tema do Topper</h4>
                    <input type="text" id="tema-input" placeholder="Ex: Unicórnio, Futebol, Princesa..." 
                           style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px;">
                </div>
            </div>
            
            <div class="builder-summary">
                <h3>Resumo do Pedido 📋</h3>
                <div id="order-summary"></div>
            </div>
            
            <button class="modal-cta" onclick="sendCakeOrder()" id="send-order-btn" disabled>
                Adicionar ao Carrinho
            </button>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function selectMassa(massa) {
    cakeConfig.massa = massa;
    document.getElementById('selected-massa').textContent = massa;
    document.querySelectorAll('.builder-step:nth-child(1) .option-btn').forEach(btn => {
        btn.classList.remove('selected');
        if (btn.textContent === massa) btn.classList.add('selected');
    });
    updateSummary();
}

function selectRecheio(sabor, tipo) {
    const index = cakeConfig.recheios.findIndex(r => r.sabor === sabor);
    
    if (index > -1) {
        cakeConfig.recheios.splice(index, 1);
    } else {
        if (cakeConfig.recheios.length >= 2) {
            alert('⚠️ Você pode escolher no máximo 2 recheios!');
            return;
        }
        cakeConfig.recheios.push({ sabor, tipo });
    }
    
    document.querySelectorAll('.builder-step:nth-child(2) .option-btn').forEach(btn => {
        const isSelected = cakeConfig.recheios.some(r => r.sabor === btn.textContent);
        if (isSelected) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }
    });
    
    document.getElementById('recheio-count').textContent = cakeConfig.recheios.length;
    document.getElementById('selected-recheios').textContent = cakeConfig.recheios.length > 0 
        ? cakeConfig.recheios.map(r => r.sabor).join(' + ') 
        : 'Nenhum';
    
    updateSummary();
}

function selectTipoCobertura(tipo) {
    cakeConfig.tipoCobertura = tipo;
    document.getElementById('selected-tipo-cobertura').textContent = tipo;
    document.querySelectorAll('.builder-step:nth-child(3) .option-btn').forEach(btn => {
        btn.classList.remove('selected');
        if (btn.textContent === tipo) btn.classList.add('selected');
    });
    updateSummary();
}

function selectCor(cor) {
    const index = cakeConfig.coresCobertura.indexOf(cor);
    if (index > -1) {
        cakeConfig.coresCobertura.splice(index, 1);
    } else {
        if (cakeConfig.coresCobertura.length >= 4) {
            alert('Você pode selecionar no máximo 4 cores!');
            return;
        }
        cakeConfig.coresCobertura.push(cor);
    }
    
    document.getElementById('selected-cor').textContent = cakeConfig.coresCobertura.length > 0 ? cakeConfig.coresCobertura.join(', ') : 'Nenhum';
    document.querySelectorAll('.builder-step:nth-child(4) .option-btn').forEach(btn => {
        if (cakeConfig.coresCobertura.includes(btn.textContent)) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }
    });
    updateSummary();
}

function updateCakeWeight() {
    const weightInput = document.getElementById('cake-weight');
    let value = weightInput.value.replace(',', '.');
    
    // Se tiver mais de 2 dígitos antes do ponto/vírgula, adicionar ponto decimal
    // Ex: 2200 -> 2.200 (2.2kg), 350 -> 3.50 (3.5kg)
    if (!value.includes('.') && value.length >= 2) {
        const numValue = parseInt(value);
        if (numValue >= 100) {
            value = (numValue / 1000).toFixed(3).replace(/0+$/, '').replace(/\.$/, '');
            weightInput.value = value.replace('.', ',');
        }
    }
    
    let weight = parseFloat(value) || 0;
    
    // Limitar peso máximo a 20kg
    if (weight > 20) {
        alert('⚠️ Peso máximo: 20kg. Para bolos maiores, entre em contato pelo WhatsApp.');
        weightInput.value = '20';
        weight = 20;
    }
    
    if (weight < 1 && weight > 0) {
        weightInput.value = '1';
        cakeConfig.peso = 1;
    } else {
        cakeConfig.peso = weight;
    }
    
    if (cakeConfig.recheios.length > 0) {
        const precosPorKg = {
            'tradicional': 80,
            'premium': 90,
            'especial': 100
        };
        const avgPrice = cakeConfig.recheios.reduce((sum, r) => sum + precosPorKg[r.tipo], 0) / cakeConfig.recheios.length;
        const totalPrice = cakeConfig.peso * avgPrice;
        const price = totalPrice.toFixed(2);
        console.log('DEBUG - Peso:', cakeConfig.peso, '| Preço médio/kg:', avgPrice, '| Total:', totalPrice);
        document.getElementById('selected-weight').textContent = cakeConfig.peso > 0 ? `${cakeConfig.peso} kg` : 'Não definido';
        document.getElementById('selected-price').textContent = cakeConfig.peso > 0 ? `R$ ${price}` : 'R$ 0,00';
    } else {
        document.getElementById('selected-weight').textContent = cakeConfig.peso > 0 ? `${cakeConfig.peso} kg` : 'Não definido';
        document.getElementById('selected-price').textContent = 'Selecione o recheio primeiro';
    }
    
    updateSummary();
}

function selectTopper(hasTopper) {
    cakeConfig.topper = hasTopper;
    document.getElementById('selected-topper').textContent = hasTopper ? 'Sim' : 'Não';
    document.getElementById('topper-tema').style.display = hasTopper ? 'block' : 'none';
    document.querySelectorAll('.builder-step:nth-child(6) .option-btn').forEach(btn => {
        btn.classList.remove('selected');
        if ((btn.textContent === 'Sim' && hasTopper) || (btn.textContent === 'Não' && !hasTopper)) {
            btn.classList.add('selected');
        }
    });
    updateSummary();
}

function updateSummary() {
    const summary = document.getElementById('order-summary');
    const temaInput = document.getElementById('tema-input');
    
    if (temaInput) {
        cakeConfig.temaTopper = temaInput.value;
    }
    
    const tipoNomes = {
        'tradicional': 'Tradicional',
        'premium': 'Premium',
        'especial': 'Especial'
    };
    
    const precosPorKg = {
        'tradicional': 80,
        'premium': 90,
        'especial': 100
    };
    
    let html = '<ul style="text-align: left;">';
    if (cakeConfig.massa) html += `<li><strong>Massa:</strong> ${cakeConfig.massa}</li>`;
    if (cakeConfig.recheios.length > 0) {
        html += `<li><strong>Recheios:</strong> ${cakeConfig.recheios.map(r => `${r.sabor} (${tipoNomes[r.tipo]})`).join(' + ')}</li>`;
    }
    if (cakeConfig.tipoCobertura) html += `<li><strong>Cobertura:</strong> ${cakeConfig.tipoCobertura}</li>`;
    if (cakeConfig.coresCobertura.length > 0) html += `<li><strong>Cores da Cobertura:</strong> ${cakeConfig.coresCobertura.join(', ')}</li>`;
    if (cakeConfig.peso > 0 && cakeConfig.recheios.length > 0) {
        const avgPrice = cakeConfig.recheios.reduce((sum, r) => sum + precosPorKg[r.tipo], 0) / cakeConfig.recheios.length;
        const totalPrice = cakeConfig.peso * avgPrice;
        html += `<li><strong>Peso:</strong> ${cakeConfig.peso} kg</li>`;
        html += `<li><strong>Preço/kg:</strong> R$ ${avgPrice.toFixed(2)} (média dos recheios)</li>`;
        html += `<li><strong>Preço Total:</strong> R$ ${totalPrice.toFixed(2)}</li>`;
    }

    html += '</ul>';
    
    summary.innerHTML = html;
    
    const isComplete = cakeConfig.massa && cakeConfig.recheios.length > 0 && cakeConfig.tipoCobertura && cakeConfig.coresCobertura.length > 0 && cakeConfig.peso >= 1;
    document.getElementById('send-order-btn').disabled = !isComplete;
}

function sendCakeOrder() {
    const temaInput = document.getElementById('tema-input');
    if (temaInput) cakeConfig.temaTopper = temaInput.value;
    
    const tipoNomes = {
        'tradicional': 'Tradicional',
        'premium': 'Premium',
        'especial': 'Especial'
    };
    
    const precosPorKg = {
        'tradicional': 80,
        'premium': 90,
        'especial': 100
    };
    
    const avgPrice = cakeConfig.recheios.reduce((sum, r) => sum + precosPorKg[r.tipo], 0) / cakeConfig.recheios.length;
    const totalPrice = cakeConfig.peso * avgPrice;
    const price = totalPrice.toFixed(2);
    
    const recheiosText = cakeConfig.recheios.map(r => `${r.sabor} (${tipoNomes[r.tipo]})`).join(' + ');
    
    let detalhes = `<p style="margin: 5px 0; font-size: 14px; color: #666;">🍰 ${cakeConfig.massa} | 🍫 ${recheiosText} | 🎂 ${cakeConfig.tipoCobertura} | ⚖️ ${cakeConfig.peso}kg | 💰 R$ ${price}</p>`;
    
    let mensagem = `🍰 Massa: ${cakeConfig.massa}\n`;
    mensagem += `🍫 Recheios: ${recheiosText}\n`;
    mensagem += `💰 Preço/kg: R$ ${avgPrice.toFixed(2)} (média dos recheios)\n`;
    mensagem += `🎂 Cobertura: ${cakeConfig.tipoCobertura}\n`;
    mensagem += `🌈 Cores: ${cakeConfig.coresCobertura.join(', ')}\n`;
    mensagem += `⚖️ Peso: ${cakeConfig.peso} kg\n`;
    mensagem += `💰 Preço do Bolo: R$ ${price}\n`;
    mensagem += `\n🎂 Topper: ${cakeConfig.topper ? 'Sim' : 'Não'}`;
    if (cakeConfig.topper && cakeConfig.temaTopper) {
        mensagem += ` - Tema: ${cakeConfig.temaTopper} (valor a definir)`;
    } else if (cakeConfig.topper) {
        mensagem += ` (valor a definir conforme tema)`;
    }
    
    addToCart({
        tipo: 'Bolo Decorado',
        detalhes: detalhes,
        mensagem: mensagem,
        price: price
    });
}

// Configurador de Bolo Caseirinho
const bolosCaseirinhos = [
    'Coco 🥥', 'Paçoca 🥜', 'Leite Ninho 🥛', 'Chocolate 🍫',
    'Fubá com goiabada 🌽🍓', 'Milho 🌽', 'Limão 🍋', 'Laranja 🍊',
    'Abacaxi 🍍', 'Café ☕', 'Capuccino ☕🍫'
];

const coberturasCaseirinhos = [
    'Limão 🍋', 'Leite Ninho 🥛', 'Chocolate 🍫',
    'Leite Condensado 🥛🍯', 'Laranja 🍊', 'Morango 🍓'
];

function openSimpleCakeBuilder() {
    const modal = document.getElementById('productModal');
    const content = document.getElementById('modalContent');
    
    content.innerHTML = `
        <h2 class="modal-title">Escolha seu Bolo Caseirinho</h2>
        <p class="modal-description">Bolos deliciosos por R$ 30,00 cada</p>
        
        <div class="cake-builder">
            <div class="builder-step">
                <h3>1. Escolha o Sabor 🍰</h3>
                <div class="options-grid">
                    ${bolosCaseirinhos.map(b => `<button class="option-btn" onclick="selectSimpleCake('${b}')">${b}</button>`).join('')}
                </div>
                <p class="selected">Selecionado: <span id="selected-simple-cake">Nenhum</span></p>
            </div>
            
            <div class="builder-step">
                <h3>2. Escolha a Cobertura 🎨</h3>
                <div class="options-grid">
                    ${coberturasCaseirinhos.map(c => `<button class="option-btn" onclick="selectSimpleCobertura('${c}')">${c}</button>`).join('')}
                </div>
                <p class="selected">Selecionado: <span id="selected-simple-cobertura">Nenhum</span></p>
            </div>
            
            <div class="builder-summary">
                <h3>Resumo do Pedido 📋</h3>
                <div id="simple-order-summary"></div>
            </div>
            
            <button class="modal-cta" onclick="sendSimpleCakeOrder()" id="send-simple-order-btn" disabled>
                Adicionar ao Carrinho
            </button>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

let selectedSimpleCake = '';
let selectedSimpleCobertura = '';

function selectSimpleCake(sabor) {
    selectedSimpleCake = sabor;
    document.getElementById('selected-simple-cake').textContent = sabor;
    document.querySelectorAll('.builder-step:nth-child(1) .option-btn').forEach(btn => {
        btn.classList.remove('selected');
        if (btn.textContent === sabor) btn.classList.add('selected');
    });
    updateSimpleSummary();
}

function selectSimpleCobertura(cobertura) {
    selectedSimpleCobertura = cobertura;
    document.getElementById('selected-simple-cobertura').textContent = cobertura;
    document.querySelectorAll('.builder-step:nth-child(2) .option-btn').forEach(btn => {
        btn.classList.remove('selected');
        if (btn.textContent === cobertura) btn.classList.add('selected');
    });
    updateSimpleSummary();
}

function updateSimpleSummary() {
    const summary = document.getElementById('simple-order-summary');
    let html = '<ul style="text-align: left;">';
    if (selectedSimpleCake) html += `<li><strong>Sabor:</strong> ${selectedSimpleCake}</li>`;
    if (selectedSimpleCobertura) html += `<li><strong>Cobertura:</strong> ${selectedSimpleCobertura}</li>`;
    html += '<li><strong>Preço:</strong> R$ 30,00</li>';
    html += '</ul>';
    summary.innerHTML = html;
    
    document.getElementById('send-simple-order-btn').disabled = !(selectedSimpleCake && selectedSimpleCobertura);
}

function sendSimpleCakeOrder() {
    let detalhes = `<p style="margin: 5px 0; font-size: 14px; color: #666;">🍫 ${selectedSimpleCake} | 🎨 ${selectedSimpleCobertura} | 💰 R$ 30,00</p>`;
    
    let mensagem = `🍫 Sabor: ${selectedSimpleCake}\n`;
    mensagem += `🎨 Cobertura: ${selectedSimpleCobertura}\n`;
    mensagem += `💰 Preço: R$ 30,00`;
    
    addToCart({
        tipo: 'Bolo Caseirinho',
        detalhes: detalhes,
        mensagem: mensagem,
        price: '30.00'
    });
}

// Calculadora de Bolo
function openCakeCalculator() {
    const modal = document.getElementById('productModal');
    const content = document.getElementById('modalContent');
    
    content.innerHTML = `
        <h2 class="modal-title">Calculadora de Bolo 🎂</h2>
        <p class="modal-description">Descubra o tamanho ideal do bolo para sua festa</p>
        
        <div class="cake-builder">
            <div class="builder-step">
                <h3>Quantas pessoas vão participar?</h3>
                
                <div style="margin: 20px 0;">
                    <label style="display: block; margin-bottom: 10px; font-weight: 500;">
                        👨‍👩‍👧 Adultos:
                    </label>
                    <input type="number" id="calc-adults" min="0" value="0" 
                           style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; font-size: 16px;"
                           oninput="calculateCake()">
                </div>
                
                <div style="margin: 20px 0;">
                    <label style="display: block; margin-bottom: 10px; font-weight: 500;">
                        🧒 Crianças:
                    </label>
                    <input type="number" id="calc-children" min="0" value="0" 
                           style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; font-size: 16px;"
                           oninput="calculateCake()">
                </div>
            </div>
            
            <div class="builder-summary">
                <h3>Resultado 📊</h3>
                <div id="calc-result" style="font-size: 1.1rem; line-height: 1.8;">
                    <p style="color: #666;">Preencha os campos acima para calcular</p>
                </div>
            </div>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #ffc107;">
                <p style="font-size: 0.9rem; color: #856404; margin: 0; line-height: 1.6;">
                    <strong>👰🤵 Casamentos e eventos especiais:</strong><br>
                    Se o bolo for o destaque principal da festa e houver poucas outras sobremesas, use 150g por pessoa.
                </p>
            </div>
            <p style="font-size: 0.9rem; color: #999; margin-top: 15px; text-align: center;">
                * Cálculo padrão: 100g por adulto e 80g por criança<br>
                Bolo decorado: R$ 80,00/kg
            </p>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Gallery Filter
function filterGallery(category) {
    const items = document.querySelectorAll('.gallery-item');
    const buttons = document.querySelectorAll('.filter-btn');
    
    // Update active button
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Filter items
    items.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
            item.style.display = 'block';
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 10);
        } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });
}

// Adicionar funcionalidade de orçamento similar às imagens da galeria
function addGalleryClickHandlers() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        const img = item.querySelector('img');
        if (img) {
            // Adicionar overlay com botão de orçamento
            const overlay = document.createElement('div');
            overlay.className = 'gallery-overlay';
            overlay.innerHTML = `
                <button class="gallery-quote-btn" onclick="requestSimilarQuote('${img.src}', '${img.alt}')">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14,2 14,8 20,8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                        <polyline points="10,9 9,9 8,9"/>
                    </svg>
                    Orçamento Similar
                </button>
            `;
            
            item.appendChild(overlay);
        }
    });
}

// Solicitar orçamento similar baseado na imagem selecionada
function requestSimilarQuote(imageSrc, imageAlt) {
    // Armazenar imagem selecionada
    window.selectedGalleryImage = {
        src: imageSrc,
        alt: imageAlt
    };
    
    // Abrir modal de orçamento similar
    openSimilarQuoteModal(imageSrc, imageAlt);
}

// Abrir modal de orçamento similar
function openSimilarQuoteModal(imageSrc, imageAlt) {
    const modal = document.getElementById('productModal');
    const content = document.getElementById('modalContent');
    
    content.innerHTML = `
        <h2 class="modal-title">📋 Orçamento Similar</h2>
        <p class="modal-description">Solicite um orçamento para um bolo similar a esta imagem</p>
        
        <div class="selected-image-preview">
            <img src="${imageSrc}" alt="${imageAlt}" style="max-width: 300px; border-radius: 8px; margin: 20px 0;">
            <p style="font-size: 14px; color: #666; margin-bottom: 20px;">Imagem selecionada: ${imageAlt}</p>
        </div>
        
        <form class="quote-form" onsubmit="sendSimilarQuote(event)">
            <div class="form-group">
                <label>Nome completo *</label>
                <input type="text" name="nome" required>
            </div>
            
            <div class="form-group">
                <label>WhatsApp *</label>
                <input type="tel" name="telefone" required placeholder="(19) 99999-9999">
            </div>
            
            <div class="form-group">
                <label>Email</label>
                <input type="email" name="email" placeholder="seu@email.com">
            </div>
            
            <div class="form-group">
                <label>Peso aproximado do bolo (kg) *</label>
                <select name="peso" required>
                    <option value="">Selecione o peso</option>
                    <option value="1.0">1,0 kg (8-10 pessoas)</option>
                    <option value="1.5">1,5 kg (12-15 pessoas)</option>
                    <option value="2.0">2,0 kg (16-20 pessoas)</option>
                    <option value="2.5">2,5 kg (20-25 pessoas)</option>
                    <option value="3.0">3,0 kg (25-30 pessoas)</option>
                    <option value="4.0">4,0 kg (35-40 pessoas)</option>
                    <option value="5.0">5,0 kg (45-50 pessoas)</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>Tipo de evento</label>
                <input type="text" name="evento" placeholder="Aniversário, casamento, etc.">
            </div>
            
            <div class="form-group">
                <label>Data do evento</label>
                <input type="date" name="dataEvento">
            </div>
            
            <div class="form-group">
                <label>Observações</label>
                <textarea name="observacoes" rows="3" placeholder="Detalhes específicos sobre o bolo desejado..."></textarea>
            </div>
            
            <button type="submit" class="modal-cta">
                📱 Enviar Orçamento via WhatsApp
            </button>
        </form>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Enviar orçamento similar
function sendSimilarQuote(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    if (!data.nome || !data.telefone || !data.peso) {
        alert('Por favor, preencha nome, telefone e peso do bolo.');
        return;
    }
    
    const selectedImage = window.selectedGalleryImage;
    const peso = parseFloat(data.peso);
    const precoEstimado = peso * 85; // Preço médio estimado
    
    // URL completa da imagem
    const imageUrl = selectedImage.src.startsWith('http') ? 
        selectedImage.src : 
        `${window.location.origin}/${selectedImage.src}`;
    
    let message = `🎂 *ORÇAMENTO SIMILAR - VERA LÚCIA CONFEITARIA*\n\n`;
    message += `👤 *Cliente:* ${data.nome}\n`;
    message += `📱 *WhatsApp:* ${data.telefone}\n`;
    if (data.email) message += `📧 *Email:* ${data.email}\n`;
    if (data.evento) message += `🎉 *Evento:* ${data.evento}\n`;
    if (data.dataEvento) message += `📅 *Data:* ${new Date(data.dataEvento).toLocaleDateString('pt-BR')}\n`;
    
    message += `\n🖼️ *IMAGEM DE REFERÊNCIA*\n`;
    message += `• ${selectedImage.alt}\n`;
    message += `• Ver imagem: ${imageUrl}\n`;
    
    message += `\n🎂 *DETALHES DO BOLO DESEJADO*\n`;
    message += `• Peso: ${peso}kg\n`;
    message += `• Tipo: Bolo Decorado Similar\n`;
    if (data.observacoes) message += `• Observações: ${data.observacoes}\n`;
    
    message += `\n💰 *VALOR ESTIMADO*\n`;
    message += `• Preço estimado: R$ ${precoEstimado.toFixed(2)}\n`;
    message += `• *(Valor final pode variar conforme complexidade)*\n`;
    
    message += `\n📋 *CONDIÇÕES*\n`;
    message += `• Orçamento válido por 7 dias\n`;
    message += `• Pagamento: 50% entrada + 50% entrega\n`;
    message += `• Prazo: 3-5 dias úteis\n`;
    message += `• Entrega gratuita em Campinas (pedidos R$ 150+)\n`;
    
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=5519971307912&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    closeProductModal();
}

// FAQ Toggle
function toggleFAQ(button) {
    const faqItem = button.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    // Fechar todos os outros FAQs
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Abrir o clicado se não estava ativo
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

let eventType = 'normal';

function selectEventType(type) {
    eventType = type;
    document.querySelectorAll('#event-normal, #event-special').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`event-${type}`).classList.add('active');
    calculateCake();
}

function calculateCake() {
    const adults = parseInt(document.getElementById('calc-adults').value) || 0;
    const children = parseInt(document.getElementById('calc-children').value) || 0;
    const result = document.getElementById('calc-result');
    
    if (adults === 0 && children === 0) {
        result.innerHTML = '<p style="color: #666;">Preencha os campos acima para calcular</p>';
        return;
    }
    
    // Porções por tipo de evento
    const adultPortion = eventType === 'special' ? 150 : 100;
    const childPortion = eventType === 'special' ? 120 : 80;
    
    const totalGrams = (adults * adultPortion) + (children * childPortion);
    const exactKg = totalGrams / 1000;
    
    // Arredondar para 0.5kg (1kg, 1.5kg, 2kg, 2.5kg, etc.)
    const roundedKg = Math.ceil(exactKg * 2) / 2;
    const finalKg = roundedKg < 1 ? 1 : roundedKg;
    
    const price = (finalKg * 80).toFixed(2);
    const eventLabel = eventType === 'special' ? 'Casamento/Especial' : 'Festa Normal';
    
    result.innerHTML = `
        <p><strong>🎉 Tipo:</strong> ${eventLabel}</p>
        <p><strong>👥 Total de pessoas:</strong> ${adults + children}</p>
        <p><strong>⚖️ Peso recomendado:</strong> ${finalKg} kg</p>
        <p><strong>💰 Valor estimado:</strong> R$ ${price}</p>
        <div style="margin-top: 20px; padding: 15px; background: #f0f0f0; border-radius: 8px;">
            <p style="font-size: 0.95rem; color: #666; margin: 0;">
                💡 <strong>Dica:</strong> Peso arredondado para garantir que todos sejam bem servidos! Vendemos em incrementos de 0,5kg (1kg, 1,5kg, 2kg, 2,5kg...)
            </p>
        </div>
    `;
}
// Funções da Calculadora Avançada
function updateCalculator() {
    const tipo = document.querySelector('input[name="tipo"]:checked').value;
    const adultos = parseInt(document.getElementById('calc-adults').value) || 0;
    const criancas = parseInt(document.getElementById('calc-children').value) || 0;
    
    // Mostrar/ocultar configurações
    document.getElementById('decorado-config').style.display = tipo === 'bolosDecorados' ? 'block' : 'none';
    document.getElementById('caseirinho-config').style.display = tipo === 'bolosCaseirinhos' ? 'block' : 'none';
    
    // Obter recomendações de peso
    const recommendations = window.priceCalculator.getRecommendations({adultos, criancas});
    
    // Configurar calculadora
    const config = {
        tipo,
        peso: recommendations.recomendado.peso,
        quantidade: 1,
        descontos: []
    };
    
    if (tipo === 'bolosDecorados') {
        config.massa = document.getElementById('calc-massa').value;
        config.recheio = document.getElementById('calc-recheio').value;
        config.decoracao = document.getElementById('calc-decoracao').value;
        config.cobertura = 'chantilly';
    } else {
        config.sabor = document.getElementById('calc-sabor').value;
        config.cobertura = 'chocolate';
    }
    
    // Calcular preços
    const pricing = window.priceCalculator.calculatePrice(config);
    
    // Atualizar interface
    updateRecommendations(recommendations, adultos + criancas);
    updatePricing(pricing, config);
}

function updateRecommendations(recommendations, totalPessoas) {
    const container = document.getElementById('calc-recommendations');
    container.innerHTML = `
        <h4>📏 Tamanhos Recomendados (${totalPessoas} pessoas)</h4>
        <div class="size-options">
            <div class="size-option" onclick="selectSize(${recommendations.minimo.peso})">
                <strong>${recommendations.minimo.peso.toFixed(1)}kg</strong>
                <span>${recommendations.minimo.descricao}</span>
                <small>${recommendations.minimo.situacao}</small>
            </div>
            <div class="size-option active" onclick="selectSize(${recommendations.recomendado.peso})">
                <strong>${recommendations.recomendado.peso.toFixed(1)}kg</strong>
                <span>${recommendations.recomendado.descricao}</span>
                <small>${recommendations.recomendado.situacao}</small>
            </div>
            <div class="size-option" onclick="selectSize(${recommendations.generoso.peso})">
                <strong>${recommendations.generoso.peso.toFixed(1)}kg</strong>
                <span>${recommendations.generoso.descricao}</span>
                <small>${recommendations.generoso.situacao}</small>
            </div>
        </div>
    `;
}

function updatePricing(pricing, config) {
    const container = document.getElementById('calc-pricing');
    const hasDiscount = pricing.discountAmount > 0;
    
    container.innerHTML = `
        <div class="pricing-summary">
            <div class="price-line">
                <span>Preço base:</span>
                <span>R$ ${pricing.pricePerKg.toFixed(2)}/kg</span>
            </div>
            <div class="price-line">
                <span>Peso:</span>
                <span>${config.peso.toFixed(1)}kg</span>
            </div>
            ${hasDiscount ? `
                <div class="price-line">
                    <span>Subtotal:</span>
                    <span>R$ ${pricing.totalPrice.toFixed(2)}</span>
                </div>
                <div class="price-line discount">
                    <span>Desconto (${pricing.totalDiscount.toFixed(0)}%):</span>
                    <span>-R$ ${pricing.discountAmount.toFixed(2)}</span>
                </div>
            ` : ''}
            <div class="price-total">
                <span>Total:</span>
                <span>R$ ${pricing.finalPrice.toFixed(2)}</span>
            </div>
        </div>
        ${hasDiscount ? '<p class="discount-info">🎉 Desconto aplicado automaticamente!</p>' : ''}
    `;
}

function selectSize(peso) {
    // Atualizar peso selecionado
    window.priceCalculator.currentConfig.peso = peso;
    
    // Remover classe active de todas as opções
    document.querySelectorAll('.size-option').forEach(el => el.classList.remove('active'));
    
    // Adicionar classe active na opção clicada
    event.target.closest('.size-option').classList.add('active');
    
    // Recalcular preços
    updateCalculator();
}

function requestQuote() {
    const customerInfo = {
        nome: '',
        telefone: '',
        email: '',
        evento: '',
        dataEvento: ''
    };
    
    const quote = window.priceCalculator.generateQuote(window.priceCalculator.currentConfig, customerInfo);
    
    // Abrir modal de orçamento
    openQuoteModal(quote);
}

function openQuoteModal(quote) {
    const modal = document.getElementById('productModal');
    const content = document.getElementById('modalContent');
    
    content.innerHTML = `
        <h2 class="modal-title">📋 Solicitar Orçamento</h2>
        <p class="modal-description">Preencha seus dados para receber o orçamento detalhado</p>
        
        <form class="quote-form" onsubmit="sendQuote(event)">
            <div class="form-group">
                <label>Nome completo *</label>
                <input type="text" name="nome" required>
            </div>
            <div class="form-group">
                <label>WhatsApp *</label>
                <input type="tel" name="telefone" required placeholder="(19) 99999-9999">
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" name="email" placeholder="seu@email.com">
            </div>
            <div class="form-group">
                <label>Tipo de evento</label>
                <select name="evento">
                    <option value="">Selecione...</option>
                    <option value="aniversario">Aniversário</option>
                    <option value="casamento">Casamento</option>
                    <option value="formatura">Formatura</option>
                    <option value="batizado">Batizado</option>
                    <option value="corporativo">Evento Corporativo</option>
                    <option value="outro">Outro</option>
                </select>
            </div>
            <div class="form-group">
                <label>Data do evento</label>
                <input type="date" name="dataEvento">
            </div>
            
            <div class="quote-summary">
                <h4>Resumo do Pedido</h4>
                <p><strong>Tipo:</strong> ${quote.config.tipo === 'bolosDecorados' ? 'Bolo Decorado' : 'Bolo Caseirinho'}</p>
                <p><strong>Peso:</strong> ${quote.config.peso.toFixed(1)}kg</p>
                <p><strong>Valor:</strong> R$ ${quote.pricing.finalPrice.toFixed(2)}</p>
            </div>
            
            <button type="submit" class="quote-cta">
                📱 Enviar via WhatsApp
            </button>
        </form>
    `;
}

function sendQuote(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    if (!data.nome || !data.telefone) {
        alert('Por favor, preencha nome e telefone.');
        return;
    }
    
    const config = window.priceCalculator.currentConfig;
    const pricing = window.priceCalculator.calculatePrice(config);
    
    let message = `🎂 *ORÇAMENTO - VERA LÚCIA CONFEITARIA*\n\n`;
    message += `👤 *Cliente:* ${data.nome}\n`;
    message += `📱 *WhatsApp:* ${data.telefone}\n`;
    if (data.email) message += `📧 *Email:* ${data.email}\n`;
    if (data.evento) message += `🎉 *Evento:* ${data.evento}\n`;
    if (data.dataEvento) message += `📅 *Data:* ${new Date(data.dataEvento).toLocaleDateString('pt-BR')}\n`;
    
    message += `\n🎂 *DETALHES DO BOLO*\n`;
    message += `• Tipo: ${config.tipo === 'bolosDecorados' ? 'Bolo Decorado' : 'Bolo Caseirinho'}\n`;
    message += `• Peso: ${config.peso.toFixed(1)}kg\n`;
    
    if (config.tipo === 'bolosDecorados') {
        message += `• Massa: ${config.massa}\n`;
        message += `• Recheio: ${config.recheio}\n`;
        message += `• Decoração: ${config.decoracao}\n`;
    } else {
        message += `• Sabor: ${config.sabor}\n`;
    }
    
    message += `\n💰 *VALORES*\n`;
    message += `• Preço base: R$ ${pricing.pricePerKg.toFixed(2)}/kg\n`;
    if (pricing.discountAmount > 0) {
        message += `• Subtotal: R$ ${pricing.totalPrice.toFixed(2)}\n`;
        message += `• Desconto: -R$ ${pricing.discountAmount.toFixed(2)}\n`;
    }
    message += `• *Total: R$ ${pricing.finalPrice.toFixed(2)}*\n`;
    
    message += `\n📋 *CONDIÇÕES*\n`;
    message += `• Orçamento válido por 7 dias\n`;
    message += `• Pagamento: 50% entrada + 50% entrega\n`;
    message += `• Prazo: 3-5 dias úteis\n`;
    message += `• Entrega gratuita em Campinas (pedidos R$ 150+)\n`;
    
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=5519971307912&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    closeProductModal();
}
// Inicializar Reviews quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    // Inserir seção de reviews
    const placeholder = document.getElementById('reviews-section-placeholder');
    if (placeholder && window.reviewsSystem) {
        placeholder.innerHTML = reviewsSystem.renderReviewsSection();
    }
    
    // Inicializar filtros da galeria
    // Removido: inicialização duplicada - já é feita no gallery-filters.js
    
    // Adicionar handlers de orçamento similar na galeria
    if (document.querySelector('.gallery-item')) {
        addGalleryClickHandlers();
    }
});
// Menu Mobile
function toggleMenu() {
    const menu = document.getElementById('nav-menu');
    const hamburger = document.getElementById('hamburger');
    
    menu.classList.toggle('active');
    hamburger.classList.toggle('active');
    
    // Prevenir scroll quando menu aberto
    if (menu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

function closeMenu() {
    const menu = document.getElementById('nav-menu');
    const hamburger = document.getElementById('hamburger');
    
    menu.classList.remove('active');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
}

// Fechar menu ao clicar fora
document.addEventListener('click', (e) => {
    const menu = document.getElementById('nav-menu');
    const hamburger = document.getElementById('hamburger');
    
    if (menu.classList.contains('active') && 
        !menu.contains(e.target) && 
        !hamburger.contains(e.target)) {
        closeMenu();
    }
});

// Fechar menu ao redimensionar tela
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        closeMenu();
    }
});
// PWA Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// PWA Install Prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallButton();
});

function showInstallButton() {
    // Criar botão de instalação se não existir
    if (!document.getElementById('install-btn')) {
        const installBtn = document.createElement('button');
        installBtn.id = 'install-btn';
        installBtn.innerHTML = '📱 Instalar App';
        installBtn.className = 'install-btn';
        installBtn.onclick = installPWA;
        
        // Adicionar ao hero ou floating buttons
        const hero = document.querySelector('.hero-content');
        if (hero) {
            hero.appendChild(installBtn);
        }
    }
}

function installPWA() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
                document.getElementById('install-btn').style.display = 'none';
            }
            deferredPrompt = null;
        });
    }
}
