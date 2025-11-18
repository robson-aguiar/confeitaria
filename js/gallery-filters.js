// Sistema de Filtros Avançado - Galeria Vera Lúcia Confeitaria

const GALLERY_DATA = [
    // Bolos Decorados - Aniversários
    { src: "images/downloadgram.org_461696459_1165667781194474_2951026535375491126_n.jpg", category: "bolos", occasion: "aniversario", colors: ["rosa", "branco"], tags: ["flores", "elegante"], price: 120, complexity: "media" },
    { src: "images/downloadgram.org_491441920_17941518353989810_7528810505330933416_n.jpg", category: "bolos", occasion: "aniversario", colors: ["azul", "branco"], tags: ["infantil", "personagem"], price: 150, complexity: "alta" },
    { src: "images/downloadgram.org_500326630_17944514105989810_8843742206483996231_n.jpg", category: "bolos", occasion: "aniversario", colors: ["colorido"], tags: ["festa", "alegre"], price: 180, complexity: "alta" },
    { src: "images/IMG-20251013-WA0016.jpg", category: "bolos", occasion: "aniversario", colors: ["chocolate"], tags: ["simples", "caseiro"], price: 80, complexity: "baixa" },
    { src: "images/IMG-20251013-WA0020.jpg", category: "bolos", occasion: "aniversario", colors: ["rosa", "dourado"], tags: ["elegante", "flores"], price: 140, complexity: "media" },
    { src: "images/IMG-20251013-WA0025.jpg", category: "bolos", occasion: "aniversario", colors: ["branco", "azul"], tags: ["masculino", "esporte"], price: 110, complexity: "media" },
    
    // Bolos Decorados - Casamentos
    { src: "images/IMG-20251013-WA0030.jpg", category: "bolos", occasion: "casamento", colors: ["branco", "dourado"], tags: ["elegante", "flores", "luxo"], price: 250, complexity: "alta" },
    { src: "images/IMG-20251013-WA0038.jpg", category: "bolos", occasion: "casamento", colors: ["branco", "rosa"], tags: ["romantico", "flores"], price: 200, complexity: "media" },
    { src: "images/IMG-20251013-WA0043.jpg", category: "bolos", occasion: "casamento", colors: ["branco"], tags: ["minimalista", "elegante"], price: 180, complexity: "media" },
    { src: "images/IMG-20251013-WA0048.jpg", category: "bolos", occasion: "casamento", colors: ["branco", "verde"], tags: ["natural", "flores"], price: 220, complexity: "alta" },
    
    // Bolos Decorados - Formaturas
    { src: "images/IMG-20251013-WA0055.jpg", category: "bolos", occasion: "formatura", colors: ["azul", "dourado"], tags: ["diploma", "elegante"], price: 160, complexity: "media" },
    { src: "images/IMG-20251013-WA0063.jpg", category: "bolos", occasion: "formatura", colors: ["preto", "dourado"], tags: ["formal", "luxo"], price: 170, complexity: "media" },
    
    // Bolos Decorados - Batizados
    { src: "images/IMG-20251013-WA0070.jpg", category: "bolos", occasion: "batizado", colors: ["branco", "azul"], tags: ["religioso", "delicado"], price: 130, complexity: "media" },
    { src: "images/IMG-20251013-WA0075.jpg", category: "bolos", occasion: "batizado", colors: ["branco", "rosa"], tags: ["religioso", "delicado"], price: 130, complexity: "media" },
    
    // Bolos Decorados - Diversos
    { src: "images/IMG-20251013-WA0115.jpg", category: "bolos", occasion: "aniversario", colors: ["rosa", "branco"], tags: ["elegante", "flores"], price: 135, complexity: "media" },
    { src: "images/IMG-20251013-WA0120.jpg", category: "bolos", occasion: "aniversario", colors: ["colorido"], tags: ["festa", "alegre"], price: 145, complexity: "media" },
    { src: "images/IMG-20251013-WA0125.jpg", category: "bolos", occasion: "aniversario", colors: ["azul", "branco"], tags: ["decorado", "especial"], price: 155, complexity: "media" },
    
    // Bolos Caseirinhos
    { src: "images/optimized/downloadgram.org_457383571_506368645434009_3148807429923215423_n.webp", category: "caseirinhos", occasion: "casa", colors: ["chocolate"], tags: ["simples", "gostoso"], price: 45, complexity: "baixa" },
    { src: "images/optimized/downloadgram.org_457503858_483408134487583_8024968526927135757_n (1).webp", category: "caseirinhos", occasion: "casa", colors: ["baunilha"], tags: ["tradicional"], price: 40, complexity: "baixa" },
    { src: "images/optimized/downloadgram.org_457522063_866805058333348_7268343729862773615_n.webp", category: "caseirinhos", occasion: "casa", colors: ["cenoura"], tags: ["caseiro", "saudavel"], price: 50, complexity: "baixa" },
    
    // Pães
    { src: "images/pao.jpg", category: "paes", occasion: "casa", colors: ["dourado"], tags: ["artesanal", "fresco"], price: 25, complexity: "baixa" },
    { src: "images/IMG-20251013-WA0008.jpg", category: "paes", occasion: "casa", colors: ["dourado"], tags: ["tradicional", "caseiro"], price: 20, complexity: "baixa" },
    
    // Doces
    { src: "images/IMG-20251013-WA0003.jpg", category: "doces", occasion: "festa", colors: ["colorido"], tags: ["festa", "variados"], price: 60, complexity: "media" }
];

class GalleryFilters {
    constructor() {
        this.currentFilters = {
            category: 'all',
            occasion: 'all',
            color: 'all',
            priceRange: 'all',
            complexity: 'all',
            search: ''
        };
        this.filteredItems = GALLERY_DATA;
        this.currentPage = 1;
        this.itemsPerPage = 12;
    }

    init() {
        this.renderFilters();
        this.renderGallery();
        this.setupSearch();
    }

    renderFilters() {
        const filtersContainer = document.querySelector('.gallery-filters');
        
        filtersContainer.innerHTML = `
            <div class="filter-row">
                <div class="filter-group">
                    <label>Categoria:</label>
                    <select id="category-filter" onchange="galleryFilters.updateFilter('category', this.value)">
                        <option value="all">Todos</option>
                        <option value="bolos">Bolos Decorados</option>
                        <option value="caseirinhos">Bolos Caseirinhos</option>
                        <option value="paes">Pães</option>
                        <option value="doces">Doces</option>
                    </select>
                </div>
                
                <div class="filter-group">
                    <label>Ocasião:</label>
                    <select id="occasion-filter" onchange="galleryFilters.updateFilter('occasion', this.value)">
                        <option value="all">Todas</option>
                        <option value="aniversario">Aniversário</option>
                        <option value="casamento">Casamento</option>
                        <option value="formatura">Formatura</option>
                        <option value="batizado">Batizado</option>
                        <option value="casa">Casa/Família</option>
                        <option value="festa">Festa</option>
                    </select>
                </div>
                
                <div class="filter-group">
                    <label>Cor:</label>
                    <select id="color-filter" onchange="galleryFilters.updateFilter('color', this.value)">
                        <option value="all">Todas</option>
                        <option value="branco">Branco</option>
                        <option value="rosa">Rosa</option>
                        <option value="azul">Azul</option>
                        <option value="chocolate">Chocolate</option>
                        <option value="dourado">Dourado</option>
                        <option value="colorido">Colorido</option>
                    </select>
                </div>
                
                <div class="filter-group">
                    <label>Preço:</label>
                    <select id="price-filter" onchange="galleryFilters.updateFilter('priceRange', this.value)">
                        <option value="all">Todos</option>
                        <option value="0-50">Até R$ 50</option>
                        <option value="51-100">R$ 51-100</option>
                        <option value="101-150">R$ 101-150</option>
                        <option value="151-200">R$ 151-200</option>
                        <option value="201+">R$ 200+</option>
                    </select>
                </div>
                
                <div class="filter-group">
                    <label>Complexidade:</label>
                    <select id="complexity-filter" onchange="galleryFilters.updateFilter('complexity', this.value)">
                        <option value="all">Todas</option>
                        <option value="baixa">Simples</option>
                        <option value="media">Média</option>
                        <option value="alta">Elaborada</option>
                    </select>
                </div>
            </div>
            
            <div class="search-row">
                <div class="search-group">
                    <input type="text" id="gallery-search" placeholder="🔍 Buscar por palavra-chave..." 
                           onkeyup="galleryFilters.updateSearch(this.value)">
                    <button onclick="galleryFilters.clearFilters()" class="clear-btn">Limpar Filtros</button>
                </div>
            </div>
            
            <div class="filter-tags" id="active-filters"></div>
        `;
    }

    updateFilter(type, value) {
        this.currentFilters[type] = value;
        this.applyFilters();
        this.updateActiveFilters();
    }

    updateSearch(value) {
        this.currentFilters.search = value.toLowerCase();
        this.applyFilters();
    }

    applyFilters() {
        this.filteredItems = GALLERY_DATA.filter(item => {
            // Filtro por categoria
            if (this.currentFilters.category !== 'all' && item.category !== this.currentFilters.category) {
                return false;
            }
            
            // Filtro por ocasião
            if (this.currentFilters.occasion !== 'all' && item.occasion !== this.currentFilters.occasion) {
                return false;
            }
            
            // Filtro por cor
            if (this.currentFilters.color !== 'all' && !item.colors.includes(this.currentFilters.color)) {
                return false;
            }
            
            // Filtro por faixa de preço
            if (this.currentFilters.priceRange !== 'all') {
                const price = item.price || 0;
                const range = this.currentFilters.priceRange;
                
                if (range === '0-50' && price > 50) return false;
                if (range === '51-100' && (price < 51 || price > 100)) return false;
                if (range === '101-150' && (price < 101 || price > 150)) return false;
                if (range === '151-200' && (price < 151 || price > 200)) return false;
                if (range === '201+' && price < 201) return false;
            }
            
            // Filtro por complexidade
            if (this.currentFilters.complexity !== 'all' && item.complexity !== this.currentFilters.complexity) {
                return false;
            }
            
            // Filtro por busca
            if (this.currentFilters.search) {
                const searchTerms = this.currentFilters.search.split(' ');
                const itemText = [...item.tags, item.category, item.occasion, ...item.colors].join(' ').toLowerCase();
                
                return searchTerms.every(term => itemText.includes(term));
            }
            
            return true;
        });
        
        this.currentPage = 1;
        this.renderGallery();
        this.updateResultsCount();
    }

    renderGallery() {
        const galleryGrid = document.querySelector('.gallery-grid');
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const itemsToShow = this.filteredItems.slice(startIndex, endIndex);
        
        if (itemsToShow.length === 0) {
            galleryGrid.innerHTML = `
                <div class="no-results">
                    <h3>🔍 Nenhum resultado encontrado</h3>
                    <p>Tente ajustar os filtros ou buscar por outros termos.</p>
                    <button onclick="galleryFilters.clearFilters()" class="clear-btn">Limpar Filtros</button>
                </div>
            `;
            return;
        }
        
        galleryGrid.innerHTML = itemsToShow.map(item => `
            <div class="gallery-item" data-category="${item.category}" data-occasion="${item.occasion}">
                <img data-src="${item.src}" alt="${this.getAltText(item)}" 
                     class="lazy-image" loading="lazy"
                     onclick="openImageModal('${item.src}', '${this.getAltText(item)}')">
                <div class="item-overlay">
                    <div class="item-tags">
                        ${item.tags.slice(0, 2).map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <button onclick="requestSimilar('${item.src}', '${this.getAltText(item)}')" class="similar-btn">
                        ❤️ Quero Similar
                    </button>
                </div>
            </div>
        `).join('');
        
        this.renderPagination();
        this.animateItems();
        this.initLazyLoading();
    }

    initLazyLoading() {
        const lazyImages = document.querySelectorAll('.lazy-image');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.1
            });

            lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            lazyImages.forEach(img => this.loadImage(img));
        }
    }

    loadImage(img) {
        const src = img.dataset.src;
        if (!src) return;

        const newImg = new Image();
        
        newImg.onload = () => {
            img.src = src;
            img.classList.add('loaded');
            img.removeAttribute('data-src');
        };
        
        newImg.onerror = () => {
            img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbSBuw6NvIGVuY29udHJhZGE8L3RleHQ+PC9zdmc+';
            img.classList.add('error');
        };
        
        newImg.src = src;
    }
    }

    renderPagination() {
        const totalPages = Math.ceil(this.filteredItems.length / this.itemsPerPage);
        if (totalPages <= 1) return;
        
        const paginationContainer = document.querySelector('.gallery-pagination') || this.createPaginationContainer();
        
        let pagination = '';
        for (let i = 1; i <= totalPages; i++) {
            pagination += `
                <button class="page-btn ${i === this.currentPage ? 'active' : ''}" 
                        onclick="galleryFilters.changePage(${i})">
                    ${i}
                </button>
            `;
        }
        
        paginationContainer.innerHTML = pagination;
    }

    createPaginationContainer() {
        const container = document.createElement('div');
        container.className = 'gallery-pagination';
        document.querySelector('.gallery-section').appendChild(container);
        return container;
    }

    changePage(page) {
        this.currentPage = page;
        this.renderGallery();
        document.getElementById('galeria').scrollIntoView({ behavior: 'smooth' });
    }

    updateActiveFilters() {
        const container = document.getElementById('active-filters');
        const activeFilters = [];
        
        Object.entries(this.currentFilters).forEach(([key, value]) => {
            if (value !== 'all' && value !== '') {
                activeFilters.push({ key, value });
            }
        });
        
        if (activeFilters.length === 0) {
            container.innerHTML = '';
            return;
        }
        
        container.innerHTML = `
            <div class="active-filters-list">
                <span>Filtros ativos:</span>
                ${activeFilters.map(filter => `
                    <span class="active-filter">
                        ${this.getFilterLabel(filter.key)}: ${filter.value}
                        <button onclick="galleryFilters.removeFilter('${filter.key}')">&times;</button>
                    </span>
                `).join('')}
            </div>
        `;
    }

    updateResultsCount() {
        const existingCount = document.querySelector('.results-count');
        if (existingCount) existingCount.remove();
        
        const count = document.createElement('div');
        count.className = 'results-count';
        count.innerHTML = `📊 ${this.filteredItems.length} resultado${this.filteredItems.length !== 1 ? 's' : ''} encontrado${this.filteredItems.length !== 1 ? 's' : ''}`;
        
        document.querySelector('.gallery-filters').appendChild(count);
    }

    removeFilter(key) {
        this.currentFilters[key] = key === 'search' ? '' : 'all';
        document.getElementById(`${key}-filter`).value = this.currentFilters[key];
        if (key === 'search') {
            document.getElementById('gallery-search').value = '';
        }
        this.applyFilters();
        this.updateActiveFilters();
    }

    clearFilters() {
        this.currentFilters = {
            category: 'all',
            occasion: 'all',
            color: 'all',
            priceRange: 'all',
            complexity: 'all',
            search: ''
        };
        
        // Resetar selects
        document.getElementById('category-filter').value = 'all';
        document.getElementById('occasion-filter').value = 'all';
        document.getElementById('color-filter').value = 'all';
        if (document.getElementById('price-filter')) {
            document.getElementById('price-filter').value = 'all';
        }
        if (document.getElementById('complexity-filter')) {
            document.getElementById('complexity-filter').value = 'all';
        }
        document.getElementById('gallery-search').value = '';
        
        this.applyFilters();
        this.updateActiveFilters();
    }

    getAltText(item) {
        const categoryNames = {
            bolos: 'Bolo Decorado',
            caseirinhos: 'Bolo Caseirinho',
            paes: 'Pães Artesanais',
            doces: 'Doces'
        };
        
        const occasionNames = {
            aniversario: 'Aniversário',
            casamento: 'Casamento',
            formatura: 'Formatura',
            batizado: 'Batizado',
            casa: 'Casa',
            festa: 'Festa'
        };
        
        return `${categoryNames[item.category]} - ${occasionNames[item.occasion]}`;
    }

    getFilterLabel(key) {
        const labels = {
            category: 'Categoria',
            occasion: 'Ocasião',
            color: 'Cor',
            search: 'Busca'
        };
        return labels[key];
    }

    animateItems() {
        const items = document.querySelectorAll('.gallery-item');
        items.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.3s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }

    setupSearch() {
        const searchInput = document.getElementById('gallery-search');
        let searchTimeout;
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.updateSearch(e.target.value);
            }, 300);
        });
    }
}

// Funções globais
function openImageModal(src, alt) {
    const modal = document.getElementById('productModal');
    const content = document.getElementById('modalContent');
    
    content.innerHTML = `
        <div class="image-modal">
            <img src="${src}" alt="${alt}" style="max-width: 100%; max-height: 80vh; border-radius: 8px;">
            <div class="image-info">
                <h3>${alt}</h3>
                <button onclick="requestSimilar('${src}', '${alt}')" class="request-btn">
                    💬 Solicitar Orçamento Similar
                </button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function requestSimilar(imageSrc, imageAlt) {
    // Usar a mesma função do script.js para consistência
    if (typeof requestSimilarQuote === 'function') {
        requestSimilarQuote(imageSrc, imageAlt);
    } else {
        // Fallback caso a função não esteja disponível
        const imageUrl = imageSrc.startsWith('http') ? 
            imageSrc : 
            `${window.location.origin}/${imageSrc}`;
            
        const message = `🎂 *SOLICITAÇÃO DE ORÇAMENTO SIMILAR*\n\n` +
                       `Olá! Vi esta foto na galeria do site e gostaria de um orçamento para algo similar:\n\n` +
                       `📸 *Imagem de referência:*\n` +
                       `• ${imageAlt}\n` +
                       `• Ver imagem: ${imageUrl}\n\n` +
                       `Podem me ajudar com um orçamento? 😊`;
        
        const whatsappUrl = `https://api.whatsapp.com/send/?phone=5519971307912&text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }
}

    updateResultsCount() {
        const totalResults = this.filteredItems.length;
        const startIndex = (this.currentPage - 1) * this.itemsPerPage + 1;
        const endIndex = Math.min(this.currentPage * this.itemsPerPage, totalResults);
        
        // Atualizar contador se existir
        const countElement = document.querySelector('.results-info');
        if (countElement) {
            if (totalResults === 0) {
                countElement.textContent = 'Nenhum resultado encontrado';
            } else {
                countElement.textContent = `Mostrando ${startIndex}-${endIndex} de ${totalResults} resultados`;
            }
        }
    }

    // Instância global
window.galleryFilters = new GalleryFilters();

// Performance optimizations
class GalleryPerformance {
    static setupEventListeners() {
        // Debounce para busca
        const searchInput = document.getElementById('gallery-search');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    if (window.galleryFilters) {
                        window.galleryFilters.updateFilter('search', e.target.value);
                    }
                }, 300);
            });
        }

        // Preload próxima página ao scroll
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const scrollPercent = (window.scrollY + window.innerHeight) / document.body.scrollHeight;
                if (scrollPercent > 0.8 && window.galleryFilters) {
                    GalleryPerformance.preloadNextPage();
                }
            }, 100);
        });
    }

    static preloadNextPage() {
        const gallery = window.galleryFilters;
        if (!gallery) return;
        
        const nextPageStart = gallery.currentPage * gallery.itemsPerPage;
        const nextPageEnd = nextPageStart + gallery.itemsPerPage;
        const nextPageItems = gallery.filteredItems.slice(nextPageStart, nextPageEnd);
        
        nextPageItems.forEach(item => {
            const img = new Image();
            img.src = item.src;
        });
    }
}

// Inicializar otimizações
document.addEventListener('DOMContentLoaded', () => {
    GalleryPerformance.setupEventListeners();
});

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.gallery-section')) {
        galleryFilters.init();
    }
});
