// Analytics & Tracking - Vera Lúcia Confeitaria

class AnalyticsManager {
    constructor() {
        this.gtag = null;
        this.fbq = null;
        this.initialized = false;
    }

    // Inicializar Google Analytics 4
    initGA4(measurementId = 'G-XXXXXXXXXX') {
        // Carregar gtag
        const script1 = document.createElement('script');
        script1.async = true;
        script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
        document.head.appendChild(script1);

        // Configurar gtag
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', measurementId, {
            page_title: document.title,
            page_location: window.location.href
        });

        this.gtag = gtag;
        console.log('GA4 initialized');
    }

    // Inicializar Facebook Pixel
    initFacebookPixel(pixelId = 'XXXXXXXXXXXXXXXXX') {
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');

        fbq('init', pixelId);
        fbq('track', 'PageView');

        this.fbq = fbq;
        console.log('Facebook Pixel initialized');
    }

    // Eventos de E-commerce
    trackPurchase(value, currency = 'BRL', items = []) {
        // GA4
        if (this.gtag) {
            this.gtag('event', 'purchase', {
                transaction_id: Date.now().toString(),
                value: value,
                currency: currency,
                items: items
            });
        }

        // Facebook
        if (this.fbq) {
            this.fbq('track', 'Purchase', {
                value: value,
                currency: currency
            });
        }
    }

    trackAddToCart(item) {
        // GA4
        if (this.gtag) {
            this.gtag('event', 'add_to_cart', {
                currency: 'BRL',
                value: item.price || 0,
                items: [item]
            });
        }

        // Facebook
        if (this.fbq) {
            this.fbq('track', 'AddToCart', {
                value: item.price || 0,
                currency: 'BRL',
                content_name: item.name,
                content_category: item.category
            });
        }
    }

    trackBeginCheckout(value, items = []) {
        // GA4
        if (this.gtag) {
            this.gtag('event', 'begin_checkout', {
                currency: 'BRL',
                value: value,
                items: items
            });
        }

        // Facebook
        if (this.fbq) {
            this.fbq('track', 'InitiateCheckout', {
                value: value,
                currency: 'BRL'
            });
        }
    }

    trackLead(leadType = 'quote_request') {
        // GA4
        if (this.gtag) {
            this.gtag('event', 'generate_lead', {
                lead_type: leadType,
                value: 1
            });
        }

        // Facebook
        if (this.fbq) {
            this.fbq('track', 'Lead', {
                content_name: leadType
            });
        }
    }

    trackViewItem(item) {
        // GA4
        if (this.gtag) {
            this.gtag('event', 'view_item', {
                currency: 'BRL',
                value: item.price || 0,
                items: [item]
            });
        }

        // Facebook
        if (this.fbq) {
            this.fbq('track', 'ViewContent', {
                value: item.price || 0,
                currency: 'BRL',
                content_name: item.name,
                content_category: item.category
            });
        }
    }

    // Eventos Customizados
    trackCalculatorUse(config) {
        if (this.gtag) {
            this.gtag('event', 'calculator_use', {
                cake_type: config.tipo,
                cake_weight: config.peso,
                estimated_price: config.price
            });
        }
    }

    trackConfiguratorUse(config) {
        if (this.gtag) {
            this.gtag('event', 'configurator_use', {
                cake_format: config.formato,
                cake_layers: config.andares,
                decoration_type: config.decoracao
            });
        }
    }

    trackGalleryFilter(filter) {
        if (this.gtag) {
            this.gtag('event', 'gallery_filter', {
                filter_type: filter.type,
                filter_value: filter.value
            });
        }
    }

    trackWhatsAppClick(source) {
        if (this.gtag) {
            this.gtag('event', 'whatsapp_click', {
                source: source,
                contact_method: 'whatsapp'
            });
        }

        if (this.fbq) {
            this.fbq('track', 'Contact', {
                content_name: source
            });
        }
    }

    trackReviewSubmit() {
        if (this.gtag) {
            this.gtag('event', 'review_submit', {
                engagement_type: 'review'
            });
        }
    }

    // Scroll Tracking
    trackScrollDepth() {
        let maxScroll = 0;
        const milestones = [25, 50, 75, 90];
        
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            );
            
            milestones.forEach(milestone => {
                if (scrollPercent >= milestone && maxScroll < milestone) {
                    maxScroll = milestone;
                    if (this.gtag) {
                        this.gtag('event', 'scroll', {
                            percent_scrolled: milestone
                        });
                    }
                }
            });
        });
    }

    // Time on Page
    trackTimeOnPage() {
        const startTime = Date.now();
        
        window.addEventListener('beforeunload', () => {
            const timeSpent = Math.round((Date.now() - startTime) / 1000);
            
            if (this.gtag && timeSpent > 10) { // Só trackear se ficou mais de 10s
                this.gtag('event', 'time_on_page', {
                    time_spent: timeSpent,
                    page_title: document.title
                });
            }
        });
    }

    // Inicializar tudo
    init(config = {}) {
        if (this.initialized) return;
        
        // Aguardar consentimento de cookies (LGPD)
        if (this.hasConsent()) {
            if (config.ga4Id) {
                this.initGA4(config.ga4Id);
            }
            
            if (config.fbPixelId) {
                this.initFacebookPixel(config.fbPixelId);
            }
            
            // Inicializar tracking automático
            this.trackScrollDepth();
            this.trackTimeOnPage();
            
            this.initialized = true;
        } else {
            this.showConsentBanner();
        }
    }

    // Verificar consentimento LGPD
    hasConsent() {
        return localStorage.getItem('analytics_consent') === 'true';
    }

    // Banner de consentimento LGPD
    showConsentBanner() {
        if (document.getElementById('consent-banner')) return;
        
        const banner = document.createElement('div');
        banner.id = 'consent-banner';
        banner.innerHTML = `
            <div class="consent-content">
                <p>🍪 Usamos cookies para melhorar sua experiência e analisar o uso do site. Ao continuar navegando, você concorda com nossa política de privacidade.</p>
                <div class="consent-buttons">
                    <button onclick="analytics.acceptConsent()" class="accept-btn">Aceitar</button>
                    <button onclick="analytics.rejectConsent()" class="reject-btn">Recusar</button>
                </div>
            </div>
        `;
        banner.className = 'consent-banner';
        document.body.appendChild(banner);
    }

    acceptConsent() {
        localStorage.setItem('analytics_consent', 'true');
        document.getElementById('consent-banner').remove();
        this.init({
            ga4Id: 'G-XXXXXXXXXX', // Substituir pelo ID real
            fbPixelId: 'XXXXXXXXXXXXXXXXX' // Substituir pelo ID real
        });
    }

    rejectConsent() {
        localStorage.setItem('analytics_consent', 'false');
        document.getElementById('consent-banner').remove();
    }
}

// Instância global
window.analytics = new AnalyticsManager();

// Auto-inicializar
document.addEventListener('DOMContentLoaded', () => {
    analytics.init({
        ga4Id: 'G-XXXXXXXXXX', // SUBSTITUIR pelo ID real do GA4
        fbPixelId: 'XXXXXXXXXXXXXXXXX' // SUBSTITUIR pelo ID real do Facebook
    });
});
