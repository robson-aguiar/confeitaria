// Calculadora de Preços Avançada - Vera Lúcia Confeitaria

const PRICING = {
    bolosDecorados: {
        base: 80, // R$/kg
        massas: {
            'chocolate': 0,
            'baunilha': 0,
            'morango': 5,
            'limao': 3,
            'coco': 3,
            'cenoura': 0,
            'red-velvet': 10,
            'prestigio': 8,
            'ninho': 8,
            'maracuja': 5,
            'abacaxi': 5,
            'banana': 3,
            'laranja': 3,
            'cafe': 5,
            'amendoim': 8,
            'nozes': 12,
            'ameixa': 8
        },
        recheios: {
            'brigadeiro': 0,
            'beijinho': 0,
            'doce-leite': 3,
            'nutella': 15,
            'morango': 8,
            'maracuja': 5,
            'limao': 3,
            'chocolate-branco': 5,
            'ninho': 8,
            'prestigio': 10,
            'frutas-vermelhas': 12,
            'abacaxi': 5,
            'banana': 3,
            'cafe': 5,
            'caramelo': 8,
            'creme-ninho': 10,
            'mousse-chocolate': 8,
            'mousse-maracuja': 8,
            'ganache': 10,
            'chantilly': 5,
            'cream-cheese': 12,
            'leite-condensado': 3,
            'goiabada': 5,
            'romeu-julieta': 8,
            'paçoca': 8,
            'oreo': 12,
            'kit-kat': 15,
            'bis': 12,
            'sonho-valsa': 10
        },
        coberturas: {
            'chantilly': 0,
            'buttercream': 5,
            'ganache': 8,
            'fondant': 15
        },
        decoracao: {
            'simples': 0,
            'media': 20,
            'elaborada': 50,
            'premium': 100
        }
    },
    bolosCaseirinhos: {
        base: 45, // R$/kg
        sabores: {
            'chocolate': 0,
            'baunilha': 0,
            'cenoura': 0,
            'limao': 2,
            'coco': 2,
            'laranja': 2,
            'banana': 2,
            'milho': 3,
            'fuba': 2,
            'iogurte': 3,
            'cafe': 3
        },
        coberturas: {
            'sem-cobertura': 0,
            'acucar': 0,
            'chocolate': 3,
            'limao': 2,
            'caramelo': 5,
            'cream-cheese': 8,
            'ganache': 5
        }
    },
    descontos: {
        quantidade: {
            2: 0.05,  // 5% para 2+ kg
            3: 0.08,  // 8% para 3+ kg
            5: 0.12,  // 12% para 5+ kg
            10: 0.15  // 15% para 10+ kg
        },
        fidelidade: 0.10, // 10% cliente fiel
        promocional: 0.15 // 15% promoção especial
    }
};

class PriceCalculator {
    constructor() {
        this.currentConfig = {
            tipo: 'bolosDecorados',
            peso: 1,
            massa: 'chocolate',
            recheio: 'brigadeiro',
            cobertura: 'chantilly',
            decoracao: 'simples',
            quantidade: 1,
            descontos: []
        };
    }

    calculatePrice(config = this.currentConfig) {
        const pricing = PRICING[config.tipo];
        let pricePerKg = pricing.base;

        // Adicionar custos extras
        if (config.tipo === 'bolosDecorados') {
            pricePerKg += pricing.massas[config.massa] || 0;
            pricePerKg += pricing.recheios[config.recheio] || 0;
            pricePerKg += pricing.coberturas[config.cobertura] || 0;
            pricePerKg += pricing.decoracao[config.decoracao] || 0;
        } else {
            pricePerKg += pricing.sabores[config.sabor] || 0;
            pricePerKg += pricing.coberturas[config.cobertura] || 0;
        }

        // Preço total
        let totalPrice = pricePerKg * config.peso * config.quantidade;

        // Aplicar descontos
        let totalDiscount = 0;
        
        // Desconto por quantidade
        const totalWeight = config.peso * config.quantidade;
        for (const [minWeight, discount] of Object.entries(PRICING.descontos.quantidade).reverse()) {
            if (totalWeight >= parseFloat(minWeight)) {
                totalDiscount += discount;
                break;
            }
        }

        // Outros descontos
        config.descontos.forEach(desconto => {
            if (PRICING.descontos[desconto]) {
                totalDiscount += PRICING.descontos[desconto];
            }
        });

        // Aplicar desconto máximo de 25%
        totalDiscount = Math.min(totalDiscount, 0.25);
        
        const discountAmount = totalPrice * totalDiscount;
        const finalPrice = totalPrice - discountAmount;

        return {
            pricePerKg,
            totalPrice,
            discountAmount,
            finalPrice,
            totalDiscount: totalDiscount * 100,
            totalWeight
        };
    }

    generateQuote(config, customerInfo) {
        const pricing = this.calculatePrice(config);
        const now = new Date();
        const validUntil = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 dias

        return {
            id: `VLC-${now.getTime()}`,
            date: now.toLocaleDateString('pt-BR'),
            validUntil: validUntil.toLocaleDateString('pt-BR'),
            customer: customerInfo,
            config,
            pricing,
            terms: [
                'Orçamento válido por 7 dias',
                'Pagamento: 50% entrada + 50% na entrega',
                'Prazo de entrega: 3-5 dias úteis',
                'Entrega gratuita em Campinas (pedidos acima de R$ 150)',
                'Alterações após confirmação podem gerar custos extras'
            ]
        };
    }

    getRecommendations(pessoas) {
        const adultos = pessoas.adultos || 0;
        const criancas = pessoas.criancas || 0;
        
        // Cálculo padrão: 100g adulto, 80g criança
        const pesoMinimo = (adultos * 0.1) + (criancas * 0.08);
        const pesoRecomendado = (adultos * 0.12) + (criancas * 0.1);
        const pesoGeneroso = (adultos * 0.15) + (criancas * 0.12);

        return {
            minimo: {
                peso: Math.max(0.5, pesoMinimo),
                descricao: 'Porção básica',
                situacao: 'Festa com muitas outras sobremesas'
            },
            recomendado: {
                peso: Math.max(0.8, pesoRecomendado),
                descricao: 'Porção ideal',
                situacao: 'Festa tradicional'
            },
            generoso: {
                peso: Math.max(1.0, pesoGeneroso),
                descricao: 'Porção farta',
                situacao: 'Bolo como sobremesa principal'
            }
        };
    }
}

// Instância global
window.priceCalculator = new PriceCalculator();
