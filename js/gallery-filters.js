// Sistema de Filtros Avançado - Galeria Vera Lúcia Confeitaria

const GALLERY_DATA = [
    // Bolos Decorados - Aniversários
    { src: "images/downloadgram.org_461696459_1165667781194474_2951026535375491126_n.jpg", category: "bolos", occasion: "aniversario", colors: ["rosa", "branco"], tags: ["flores", "elegante"] },
    { src: "images/downloadgram.org_491441920_17941518353989810_7528810505330933416_n.jpg", category: "bolos", occasion: "aniversario", colors: ["azul", "branco"], tags: ["infantil", "personagem"] },
    { src: "images/downloadgram.org_500326630_17944514105989810_8843742206483996231_n.jpg", category: "bolos", occasion: "aniversario", colors: ["colorido"], tags: ["festa", "alegre"] },
    { src: "images/IMG-20251013-WA0016.jpg", category: "bolos", occasion: "aniversario", colors: ["chocolate"], tags: ["simples", "caseiro"] },
    { src: "images/IMG-20251013-WA0020.jpg", category: "bolos", occasion: "aniversario", colors: ["rosa", "dourado"], tags: ["elegante", "flores"] },
    { src: "images/IMG-20251013-WA0025.jpg", category: "bolos", occasion: "aniversario", colors: ["branco", "azul"], tags: ["masculino", "esporte"] },
    
    // Bolos Decorados - Casamentos
    { src: "images/IMG-20251013-WA0030.jpg", category: "bolos", occasion: "casamento", colors: ["branco", "dourado"], tags: ["elegante", "flores", "luxo"] },
    { src: "images/IMG-20251013-WA0038.jpg", category: "bolos", occasion: "casamento", colors: ["branco", "rosa"], tags: ["romantico", "flores"] },
    { src: "images/IMG-20251013-WA0043.jpg", category: "bolos", occasion: "casamento", colors: ["branco"], tags: ["minimalista", "elegante"] },
    { src: "images/IMG-20251013-WA0048.jpg", category: "bolos", occasion: "casamento", colors: ["branco", "verde"], tags: ["natural", "flores"] },
    
    // Bolos Decorados - Formaturas
    { src: "images/IMG-20251013-WA0055.jpg", category: "bolos", occasion: "formatura", colors: ["azul", "dourado"], tags: ["diploma", "elegante"] },
    { src: "images/IMG-20251013-WA0063.jpg", category: "bolos", occasion: "formatura", colors: ["preto", "dourado"], tags: ["formal", "luxo"] },
    
    // Bolos Decorados - Batizados
    { src: "images/IMG-20251013-WA0070.jpg", category: "bolos", occasion: "batizado", colors: ["branco", "azul"], tags: ["religioso", "delicado"] },
    { src: "images/IMG-20251013-WA0075.jpg", category: "bolos", occasion: "batizado", colors: ["branco", "rosa"], tags: ["religioso", "delicado"] },
    
    // Bolos Caseirinhos
    { src: "images/optimized/downloadgram.org_457383571_506368645434009_3148807429923215423_n.webp", category: "caseirinhos", occasion: "casa", colors: ["chocolate"], tags: ["simples", "gostoso"] },
    { src: "images/optimized/downloadgram.org_457503858_483408134487583_8024968526927135757_n (1).webp", category: "caseirinhos", occasion: "casa", colors: ["baunilha"], tags: ["tradicional"] },
    { src: "images/optimized/downloadgram.org_457522063_866805058333348_7268343729862773615_n.webp", category: "caseirinhos", occasion: "casa", colors: ["cenoura"], tags: ["caseiro", "saudavel"] },
    
    // Pães
    { src: "images/pao.jpg", category: "paes", occasion: "casa", colors: ["dourado"], tags: ["artesanal", "fresco"] },
    { src: "images/IMG-20251013-WA0008.jpg", category: "paes", occasion: "casa", colors: ["dourado"], tags: ["tradicional", "caseiro"] },
    
    // Doces
    { src: "images/IMG-20251013-WA0003.jpg", category: "doces", occasion: "festa", colors: ["colorido"], tags: ["festa", "variados"] }
];

class GalleryFilters {
    constructor() {
        this.currentFilters = {
            category: 'all',
            occasion: 'all',
            color: 'all',
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
                <img src="${item.src}" alt="${this.getAltText(item)}" loading="lazy" 
                     onclick="openImageModal('${item.src}', '${this.getAltText(item)}')">
                <div class="item-overlay">
                    <div class="item-tags">
                        ${item.tags.slice(0, 2).map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <button onclick="requestSimilar('${item.category}', '${item.occasion}')" class="similar-btn">
                        ❤️ Quero Similar
                    </button>
                </div>
            </div>
        `).join('');
        
        this.renderPagination();
        this.animateItems();
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
            search: ''
        };
        
        document.getElementById('category-filter').value = 'all';
        document.getElementById('occasion-filter').value = 'all';
        document.getElementById('color-filter').value = 'all';
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
                <button onclick="requestSimilar('${src}')" class="request-btn">
                    💬 Solicitar Orçamento Similar
                </button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function requestSimilar(category, occasion) {
    const message = `🎂 *SOLICITAÇÃO DE ORÇAMENTO*\n\n` +
                   `Olá! Vi uma foto na galeria do site e gostaria de um orçamento para algo similar:\n\n` +
                   `📋 *Detalhes:*\n` +
                   `• Categoria: ${category}\n` +
                   `• Ocasião: ${occasion}\n\n` +
                   `Podem me ajudar com um orçamento? 😊`;
    
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=5519971307912&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Instância global
window.galleryFilters = new GalleryFilters();

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.gallery-section')) {
        galleryFilters.init();
    }
});
