// Instagram API Integration - Vera Lúcia Confeitaria
class InstagramAPI {
    constructor() {
        this.accessToken = null;
        this.userId = null;
        this.posts = [];
        this.isConfigured = false;
    }

    // Configurar credenciais (será chamado após setup no Facebook Developers)
    configure(accessToken, userId) {
        this.accessToken = accessToken;
        this.userId = userId;
        this.isConfigured = true;
        localStorage.setItem('instagram_config', JSON.stringify({
            accessToken,
            userId,
            lastUpdate: Date.now()
        }));
    }

    // Carregar configuração salva
    loadConfig() {
        const saved = localStorage.getItem('instagram_config');
        if (saved) {
            const config = JSON.parse(saved);
            this.accessToken = config.accessToken;
            this.userId = config.userId;
            this.isConfigured = true;
            return true;
        }
        return false;
    }

    // Buscar posts do Instagram
    async fetchPosts(limit = 12) {
        if (!this.isConfigured) {
            console.warn('Instagram API não configurada');
            return this.getMockPosts(); // Fallback com posts mock
        }

        try {
            const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&limit=${limit}&access_token=${this.accessToken}`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.error) {
                console.error('Erro Instagram API:', data.error);
                return this.getMockPosts();
            }
            
            this.posts = data.data.filter(post => post.media_type === 'IMAGE');
            this.savePostsCache();
            return this.posts;
            
        } catch (error) {
            console.error('Erro ao buscar posts:', error);
            return this.getCachedPosts() || this.getMockPosts();
        }
    }

    // Cache dos posts para funcionar offline
    savePostsCache() {
        localStorage.setItem('instagram_posts_cache', JSON.stringify({
            posts: this.posts,
            timestamp: Date.now()
        }));
    }

    getCachedPosts() {
        const cached = localStorage.getItem('instagram_posts_cache');
        if (cached) {
            const data = JSON.parse(cached);
            // Cache válido por 1 hora
            if (Date.now() - data.timestamp < 3600000) {
                return data.posts;
            }
        }
        return null;
    }

    // Posts mock para desenvolvimento/fallback
    getMockPosts() {
        return [
            {
                id: 'mock1',
                media_url: 'images/downloadgram.org_461696459_1165667781194474_2951026535375491126_n.jpg',
                caption: 'Bolo de aniversário personalizado 🎂✨',
                permalink: '#'
            },
            {
                id: 'mock2', 
                media_url: 'images/downloadgram.org_491441920_17941518353989810_7528810505330933416_n.jpg',
                caption: 'Bolo infantil temático 🎈👶',
                permalink: '#'
            },
            {
                id: 'mock3',
                media_url: 'images/downloadgram.org_500326630_17944514105989810_8843742206483996231_n.jpg',
                caption: 'Festa colorida e alegre! 🌈🎉',
                permalink: '#'
            }
        ];
    }

    // Renderizar posts na galeria
    async renderInstagramGallery(containerId = 'instagram-gallery') {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '<div class="loading">Carregando posts do Instagram...</div>';
        
        const posts = await this.fetchPosts(6);
        
        container.innerHTML = `
            <div class="instagram-header">
                <h3>📸 Nossos Trabalhos no Instagram</h3>
                <a href="https://instagram.com/veraluciaconfeitaria" target="_blank" class="follow-btn">
                    Seguir no Instagram
                </a>
            </div>
            <div class="instagram-grid">
                ${posts.map(post => `
                    <div class="instagram-post" onclick="window.open('${post.permalink}', '_blank')">
                        <img src="${post.media_url}" alt="${post.caption || 'Post do Instagram'}" loading="lazy">
                        <div class="post-overlay">
                            <p>${this.truncateCaption(post.caption)}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    truncateCaption(caption) {
        if (!caption) return '';
        return caption.length > 50 ? caption.substring(0, 50) + '...' : caption;
    }

    // Atualizar posts automaticamente
    startAutoUpdate(intervalMinutes = 30) {
        setInterval(() => {
            this.fetchPosts();
        }, intervalMinutes * 60 * 1000);
    }
}

// Instância global
window.instagramAPI = new InstagramAPI();
