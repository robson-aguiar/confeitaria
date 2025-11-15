// Email Marketing - Vera Lúcia Confeitaria

class EmailMarketing {
    constructor() {
        this.subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
        this.campaigns = {
            welcome: {
                subject: '🎂 Bem-vindo à Vera Lúcia Confeitaria!',
                template: 'welcome'
            },
            birthday: {
                subject: '🎉 Feliz Aniversário! Desconto especial para você',
                template: 'birthday'
            },
            abandoned_cart: {
                subject: '😢 Esqueceu algo? Seu bolo está te esperando!',
                template: 'abandoned_cart'
            },
            promotion: {
                subject: '🔥 Promoção Especial - 15% OFF em todos os bolos!',
                template: 'promotion'
            }
        };
    }

    // Newsletter Signup
    showNewsletterPopup() {
        // Só mostrar se não se inscreveu e está há mais de 30s no site
        if (this.hasSubscribed() || this.popupShown) return;
        
        setTimeout(() => {
            if (!this.popupShown) {
                this.renderNewsletterModal();
                this.popupShown = true;
            }
        }, 30000); // 30 segundos
    }

    renderNewsletterModal() {
        const modal = document.createElement('div');
        modal.className = 'newsletter-modal';
        modal.innerHTML = `
            <div class="newsletter-overlay" onclick="this.parentElement.remove()"></div>
            <div class="newsletter-content">
                <button class="newsletter-close" onclick="this.closest('.newsletter-modal').remove()">&times;</button>
                <div class="newsletter-header">
                    <h3>🎂 Receba Ofertas Especiais!</h3>
                    <p>Cadastre-se e ganhe <strong>10% OFF</strong> no seu primeiro pedido</p>
                </div>
                <form class="newsletter-form" onsubmit="emailMarketing.subscribe(event)">
                    <input type="text" name="nome" placeholder="Seu nome" required>
                    <input type="email" name="email" placeholder="Seu melhor email" required>
                    <input type="date" name="aniversario" placeholder="Data de aniversário (opcional)">
                    <button type="submit">🎁 Quero o Desconto!</button>
                </form>
                <p class="newsletter-disclaimer">
                    Não enviamos spam. Você pode cancelar a qualquer momento.
                </p>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    subscribe(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);
        
        // Salvar subscriber
        const subscriber = {
            ...data,
            id: Date.now(),
            subscribed_at: new Date().toISOString(),
            status: 'active',
            tags: ['website', 'newsletter']
        };
        
        this.subscribers.push(subscriber);
        localStorage.setItem('newsletter_subscribers', JSON.stringify(this.subscribers));
        localStorage.setItem('newsletter_subscribed', 'true');
        
        // Analytics
        if (window.analytics) {
            analytics.trackLead('newsletter_signup');
        }
        
        // Enviar dados via WhatsApp para a empresa
        this.notifyNewSubscriber(subscriber);
        
        // Mostrar sucesso
        event.target.closest('.newsletter-modal').innerHTML = `
            <div class="newsletter-success">
                <h3>🎉 Cadastro Realizado!</h3>
                <p>Você receberá seu cupom de <strong>10% OFF</strong> em breve!</p>
                <button onclick="this.closest('.newsletter-modal').remove()" class="success-btn">
                    Continuar Navegando
                </button>
            </div>
        `;
        
        // Auto-fechar após 3 segundos
        setTimeout(() => {
            const modal = document.querySelector('.newsletter-modal');
            if (modal) modal.remove();
        }, 3000);
    }

    notifyNewSubscriber(subscriber) {
        const message = `📧 *NOVO INSCRITO NEWSLETTER*\n\n` +
                       `👤 *Nome:* ${subscriber.nome}\n` +
                       `📧 *Email:* ${subscriber.email}\n` +
                       `🎂 *Aniversário:* ${subscriber.aniversario || 'Não informado'}\n` +
                       `📅 *Data:* ${new Date().toLocaleDateString('pt-BR')}\n\n` +
                       `_Enviar cupom de 10% OFF para este cliente!_`;
        
        // Não abrir automaticamente, só preparar link
        console.log('Novo subscriber:', subscriber);
        
        // Opcional: enviar para webhook ou API de email marketing
        // this.sendToEmailService(subscriber);
    }

    hasSubscribed() {
        return localStorage.getItem('newsletter_subscribed') === 'true';
    }

    // Campanhas automáticas
    triggerAbandonedCart() {
        if (cart.length > 0 && !this.hasSubscribed()) {
            setTimeout(() => {
                if (cart.length > 0) { // Ainda tem itens no carrinho
                    this.showAbandonedCartEmail();
                }
            }, 300000); // 5 minutos
        }
    }

    showAbandonedCartEmail() {
        const modal = document.createElement('div');
        modal.className = 'abandoned-cart-modal';
        modal.innerHTML = `
            <div class="abandoned-overlay" onclick="this.parentElement.remove()"></div>
            <div class="abandoned-content">
                <h3>😢 Não vai levar seus bolos?</h3>
                <p>Deixe seu email e ganhe <strong>5% OFF</strong> para finalizar o pedido!</p>
                <form onsubmit="emailMarketing.saveAbandonedCart(event)">
                    <input type="email" name="email" placeholder="Seu email" required>
                    <button type="submit">🎁 Quero o Desconto</button>
                </form>
                <button onclick="this.closest('.abandoned-cart-modal').remove()" class="skip-btn">
                    Não, obrigado
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    saveAbandonedCart(event) {
        event.preventDefault();
        
        const email = event.target.email.value;
        const abandonedCart = {
            email,
            cart: [...cart],
            timestamp: Date.now(),
            recovered: false
        };
        
        // Salvar carrinho abandonado
        const abandoned = JSON.parse(localStorage.getItem('abandoned_carts') || '[]');
        abandoned.push(abandonedCart);
        localStorage.setItem('abandoned_carts', JSON.stringify(abandoned));
        
        // Analytics
        if (window.analytics) {
            analytics.trackLead('abandoned_cart_recovery');
        }
        
        // Mostrar sucesso
        event.target.closest('.abandoned-cart-modal').innerHTML = `
            <div class="abandoned-success">
                <h3>✅ Email Salvo!</h3>
                <p>Você receberá um cupom de 5% OFF em breve!</p>
                <button onclick="this.closest('.abandoned-cart-modal').remove()">OK</button>
            </div>
        `;
    }

    // Inicializar campanhas
    init() {
        // Newsletter popup após 30s
        this.showNewsletterPopup();
        
        // Abandoned cart após 5min
        this.triggerAbandonedCart();
        
        // Birthday campaign (verificar diariamente)
        this.checkBirthdayCampaign();
    }

    checkBirthdayCampaign() {
        const today = new Date().toISOString().slice(5, 10); // MM-DD
        
        this.subscribers.forEach(subscriber => {
            if (subscriber.aniversario) {
                const birthday = subscriber.aniversario.slice(5, 10);
                if (birthday === today && !subscriber.birthday_sent_2025) {
                    this.sendBirthdayMessage(subscriber);
                    subscriber.birthday_sent_2025 = true;
                }
            }
        });
        
        localStorage.setItem('newsletter_subscribers', JSON.stringify(this.subscribers));
    }

    sendBirthdayMessage(subscriber) {
        const message = `🎉 *ANIVERSÁRIO HOJE*\n\n` +
                       `👤 *Cliente:* ${subscriber.nome}\n` +
                       `📧 *Email:* ${subscriber.email}\n` +
                       `🎂 *Aniversário:* ${subscriber.aniversario}\n\n` +
                       `_Enviar mensagem de parabéns + desconto especial!_`;
        
        console.log('Birthday campaign:', subscriber);
    }
}

// Instância global
window.emailMarketing = new EmailMarketing();

// Inicializar após carregamento
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        emailMarketing.init();
    }, 2000);
});
