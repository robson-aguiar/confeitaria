// Sistema de Reviews - Vera Lúcia Confeitaria

const REVIEWS_DATA = [
    {
        id: 1,
        nome: "Maria Silva",
        avatar: "MS",
        rating: 5,
        data: "2025-10-20",
        evento: "Aniversário",
        comentario: "Bolo maravilhoso! A decoração ficou exatamente como eu imaginei. Sabor incrível, todos os convidados elogiaram. Super recomendo!",
        fotos: ["review1.jpg"],
        verificado: true,
        resposta: {
            data: "2025-10-21",
            texto: "Muito obrigada Maria! Foi um prazer fazer parte do aniversário. Ficamos felizes que todos gostaram! 🎂❤️"
        }
    },
    {
        id: 2,
        nome: "João Santos",
        avatar: "JS",
        rating: 5,
        data: "2025-10-18",
        evento: "Casamento",
        comentario: "Contratamos para nosso casamento e foi perfeito! Bolo de 3 andares lindo e delicioso. Atendimento nota 10, entrega pontual.",
        fotos: ["review2.jpg", "review3.jpg"],
        verificado: true,
        resposta: {
            data: "2025-10-19",
            texto: "Que alegria fazer parte do dia mais especial de vocês! Desejamos muito amor e felicidade! 💕"
        }
    },
    {
        id: 3,
        nome: "Ana Costa",
        avatar: "AC",
        rating: 5,
        data: "2025-10-15",
        evento: "Formatura",
        comentario: "Bolo caseirinho de chocolate simplesmente divino! Textura perfeita, sabor caseiro mesmo. Já virei cliente fiel!",
        fotos: [],
        verificado: true
    },
    {
        id: 4,
        nome: "Carlos Oliveira",
        avatar: "CO",
        rating: 5,
        data: "2025-10-12",
        evento: "Aniversário Infantil",
        comentario: "Minha filha ficou encantada com o bolo da Frozen! Decoração impecável e sabor que agradou crianças e adultos.",
        fotos: ["review4.jpg"],
        verificado: true,
        resposta: {
            data: "2025-10-13",
            texto: "Que bom que a princesinha gostou! Adoramos fazer bolos temáticos. Obrigada pela confiança! 👸❄️"
        }
    },
    {
        id: 5,
        nome: "Fernanda Lima",
        avatar: "FL",
        rating: 5,
        data: "2025-10-10",
        evento: "Chá de Bebê",
        comentario: "Bolo lindo e gostoso para o chá de bebê. Decoração delicada, sabor de morango perfeito. Recomendo muito!",
        fotos: ["review5.jpg"],
        verificado: true
    },
    {
        id: 6,
        nome: "Roberto Mendes",
        avatar: "RM",
        rating: 5,
        data: "2025-10-08",
        evento: "Aniversário",
        comentario: "Terceiro bolo que encomendo e sempre supera as expectativas. Qualidade excepcional, sabor único!",
        fotos: [],
        verificado: true,
        resposta: {
            data: "2025-10-09",
            texto: "Roberto, você é um cliente especial! Obrigada pela fidelidade e confiança. Sempre um prazer atendê-lo! 🙏"
        }
    }
];

class ReviewsSystem {
    constructor() {
        this.reviews = REVIEWS_DATA;
        this.currentPage = 1;
        this.reviewsPerPage = 3;
    }

    getAverageRating() {
        const total = this.reviews.reduce((sum, review) => sum + review.rating, 0);
        return (total / this.reviews.length).toFixed(1);
    }

    getRatingDistribution() {
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        this.reviews.forEach(review => {
            distribution[review.rating]++;
        });
        return distribution;
    }

    getReviewsForPage(page = 1) {
        const startIndex = (page - 1) * this.reviewsPerPage;
        const endIndex = startIndex + this.reviewsPerPage;
        return this.reviews.slice(startIndex, endIndex);
    }

    getTotalPages() {
        return Math.ceil(this.reviews.length / this.reviewsPerPage);
    }

    renderReviewsSection() {
        const avgRating = this.getAverageRating();
        const totalReviews = this.reviews.length;
        const distribution = this.getRatingDistribution();

        return `
            <section class="reviews-section" id="avaliacoes">
                <div class="container">
                    <h2 class="section-title">⭐ Avaliações dos Clientes</h2>
                    
                    <div class="reviews-header">
                        <div class="rating-summary">
                            <div class="avg-rating">
                                <span class="rating-number">${avgRating}</span>
                                <div class="stars">
                                    ${this.renderStars(parseFloat(avgRating))}
                                </div>
                                <p>${totalReviews} avaliações</p>
                            </div>
                            
                            <div class="rating-bars">
                                ${[5,4,3,2,1].map(rating => `
                                    <div class="rating-bar">
                                        <span>${rating}★</span>
                                        <div class="bar">
                                            <div class="fill" style="width: ${(distribution[rating] / totalReviews) * 100}%"></div>
                                        </div>
                                        <span>${distribution[rating]}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <div class="google-reviews">
                            <a href="https://g.page/r/YOUR_GOOGLE_BUSINESS_ID/review" target="_blank" class="google-btn">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" width="20">
                                Avaliar no Google
                            </a>
                        </div>
                    </div>
                    
                    <div class="reviews-grid" id="reviews-container">
                        ${this.renderReviews()}
                    </div>
                    
                    <div class="reviews-pagination">
                        ${this.renderPagination()}
                    </div>
                    
                    <div class="review-cta">
                        <h3>Já experimentou nossos bolos?</h3>
                        <p>Compartilhe sua experiência e ajude outros clientes!</p>
                        <button onclick="openReviewForm()" class="review-btn">
                            ✍️ Deixar Avaliação
                        </button>
                    </div>
                </div>
            </section>
        `;
    }

    renderStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<span class="star filled">★</span>';
            } else if (i - 0.5 <= rating) {
                stars += '<span class="star half">★</span>';
            } else {
                stars += '<span class="star">★</span>';
            }
        }
        return stars;
    }

    renderReviews(page = 1) {
        const reviews = this.getReviewsForPage(page);
        return reviews.map(review => `
            <div class="review-card">
                <div class="review-header">
                    <div class="reviewer-info">
                        <div class="avatar">${review.avatar}</div>
                        <div class="reviewer-details">
                            <h4>${review.nome}</h4>
                            <div class="review-meta">
                                <div class="stars">${this.renderStars(review.rating)}</div>
                                <span class="review-date">${this.formatDate(review.data)}</span>
                                ${review.verificado ? '<span class="verified">✓ Verificado</span>' : ''}
                            </div>
                        </div>
                    </div>
                    <div class="review-event">${review.evento}</div>
                </div>
                
                <div class="review-content">
                    <p>${review.comentario}</p>
                    
                    ${review.fotos && review.fotos.length > 0 ? `
                        <div class="review-photos">
                            ${review.fotos.map(foto => `
                                <img src="images/reviews/${foto}" alt="Foto do cliente" onclick="openPhotoModal('${foto}')">
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
                
                ${review.resposta ? `
                    <div class="business-response">
                        <div class="response-header">
                            <strong>Resposta da Vera Lúcia Confeitaria</strong>
                            <span>${this.formatDate(review.resposta.data)}</span>
                        </div>
                        <p>${review.resposta.texto}</p>
                    </div>
                ` : ''}
            </div>
        `).join('');
    }

    renderPagination() {
        const totalPages = this.getTotalPages();
        if (totalPages <= 1) return '';

        let pagination = '';
        for (let i = 1; i <= totalPages; i++) {
            pagination += `
                <button class="page-btn ${i === this.currentPage ? 'active' : ''}" 
                        onclick="reviewsSystem.changePage(${i})">
                    ${i}
                </button>
            `;
        }
        return pagination;
    }

    changePage(page) {
        this.currentPage = page;
        document.getElementById('reviews-container').innerHTML = this.renderReviews(page);
        
        // Atualizar botões de paginação
        document.querySelectorAll('.page-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`.page-btn:nth-child(${page})`).classList.add('active');
        
        // Scroll suave para o topo das reviews
        document.getElementById('avaliacoes').scrollIntoView({ behavior: 'smooth' });
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        });
    }
}

// Instância global
window.reviewsSystem = new ReviewsSystem();

// Funções globais
function openReviewForm() {
    const modal = document.getElementById('productModal');
    const content = document.getElementById('modalContent');
    
    content.innerHTML = `
        <h2 class="modal-title">✍️ Deixar Avaliação</h2>
        <p class="modal-description">Compartilhe sua experiência conosco!</p>
        
        <form class="review-form" onsubmit="submitReview(event)">
            <div class="form-group">
                <label>Nome *</label>
                <input type="text" name="nome" required>
            </div>
            
            <div class="form-group">
                <label>WhatsApp *</label>
                <input type="tel" name="telefone" required placeholder="(19) 99999-9999">
            </div>
            
            <div class="form-group">
                <label>Tipo de evento</label>
                <select name="evento">
                    <option value="Aniversário">Aniversário</option>
                    <option value="Casamento">Casamento</option>
                    <option value="Formatura">Formatura</option>
                    <option value="Batizado">Batizado</option>
                    <option value="Outro">Outro</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>Sua avaliação *</label>
                <div class="rating-input" id="rating-input">
                    ${[1,2,3,4,5].map(i => `
                        <span class="star-input" data-rating="${i}" onclick="setRating(${i})">★</span>
                    `).join('')}
                </div>
                <input type="hidden" name="rating" id="rating-value" required>
            </div>
            
            <div class="form-group">
                <label>Seu comentário *</label>
                <textarea name="comentario" required rows="4" 
                          placeholder="Conte como foi sua experiência..."></textarea>
            </div>
            
            <button type="submit" class="review-submit-btn">
                📱 Enviar Avaliação
            </button>
        </form>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function setRating(rating) {
    document.getElementById('rating-value').value = rating;
    
    document.querySelectorAll('.star-input').forEach((star, index) => {
        if (index < rating) {
            star.classList.add('selected');
        } else {
            star.classList.remove('selected');
        }
    });
}

function submitReview(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    if (!data.rating) {
        alert('Por favor, selecione uma avaliação de 1 a 5 estrelas.');
        return;
    }
    
    let message = `⭐ *NOVA AVALIAÇÃO*\n\n`;
    message += `👤 *Nome:* ${data.nome}\n`;
    message += `📱 *WhatsApp:* ${data.telefone}\n`;
    message += `🎉 *Evento:* ${data.evento}\n`;
    message += `⭐ *Avaliação:* ${'★'.repeat(data.rating)} (${data.rating}/5)\n\n`;
    message += `💬 *Comentário:*\n${data.comentario}\n\n`;
    message += `_Enviado via site da Vera Lúcia Confeitaria_`;
    
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=5519971307912&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    closeProductModal();
    
    // Mostrar mensagem de agradecimento
    setTimeout(() => {
        alert('Obrigada pela sua avaliação! Em breve ela aparecerá em nosso site. 🙏');
    }, 500);
}

function openPhotoModal(foto) {
    const modal = document.getElementById('productModal');
    const content = document.getElementById('modalContent');
    
    content.innerHTML = `
        <div class="photo-modal">
            <img src="images/reviews/${foto}" alt="Foto do cliente" style="max-width: 100%; border-radius: 8px;">
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}
