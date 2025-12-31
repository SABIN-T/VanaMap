// Shopping Assistant - Find Best Deals for Plants and Supplies
import { useState, useEffect } from 'react';

export interface ProductDeal {
    id: string;
    name: string;
    category: 'plant' | 'pot' | 'soil' | 'fertilizer' | 'tool' | 'accessory';
    price: number;
    originalPrice?: number;
    discount?: number;
    seller: string;
    rating: number;
    reviews: number;
    imageUrl: string;
    productUrl: string;
    inStock: boolean;
    delivery: {
        available: boolean;
        days: number;
        cost: number;
    };
    location?: string;
}

export interface ShoppingRecommendation {
    product: string;
    reason: string;
    alternatives: string[];
    priceRange: {
        min: number;
        max: number;
    };
}

export class ShoppingAssistantService {

    // Search for products
    static async searchProducts(query: string, _category?: string): Promise<ProductDeal[]> {
        // In production, integrate with actual e-commerce APIs
        // For now, return mock data with real-like structure
        // Note: category parameter will be used when integrating real e-commerce API

        const mockProducts: ProductDeal[] = [
            {
                id: 'prod_1',
                name: `${query} - Premium Quality`,
                category: 'plant',
                price: 299,
                originalPrice: 499,
                discount: 40,
                seller: 'Green Paradise Nursery',
                rating: 4.5,
                reviews: 234,
                imageUrl: '/placeholder-plant.jpg',
                productUrl: '#',
                inStock: true,
                delivery: {
                    available: true,
                    days: 3,
                    cost: 0
                },
                location: 'Mumbai, Maharashtra'
            },
            {
                id: 'prod_2',
                name: `${query} - Organic`,
                category: 'plant',
                price: 399,
                originalPrice: 599,
                discount: 33,
                seller: 'Urban Garden Store',
                rating: 4.7,
                reviews: 456,
                imageUrl: '/placeholder-plant.jpg',
                productUrl: '#',
                inStock: true,
                delivery: {
                    available: true,
                    days: 2,
                    cost: 50
                },
                location: 'Bangalore, Karnataka'
            }
        ];

        return mockProducts;
    }

    // Get price comparison
    static async comparePrices(productName: string): Promise<ProductDeal[]> {
        const products = await this.searchProducts(productName);
        return products.sort((a, b) => a.price - b.price);
    }

    // Get best deals
    static async getBestDeals(category?: string): Promise<ProductDeal[]> {
        const allProducts = await this.searchProducts('plant');
        return allProducts
            .filter(p => !category || p.category === category)
            .filter(p => p.discount && p.discount > 20)
            .sort((a, b) => (b.discount || 0) - (a.discount || 0))
            .slice(0, 10);
    }

    // Get nearby sellers
    static async getNearbySellers(userLocation: string): Promise<ProductDeal[]> {
        const products = await this.searchProducts('plant');
        return products.filter(p => p.location?.includes(userLocation));
    }

    // Get shopping recommendations based on plant
    static getRecommendations(plantName: string): ShoppingRecommendation[] {
        const recommendations: ShoppingRecommendation[] = [
            {
                product: `${plantName} Plant`,
                reason: 'Main plant you\'re looking for',
                alternatives: ['Similar variety', 'Dwarf variety', 'Variegated variety'],
                priceRange: { min: 199, max: 799 }
            },
            {
                product: 'Ceramic Pot',
                reason: 'Perfect size for this plant',
                alternatives: ['Plastic pot', 'Terracotta pot', 'Hanging planter'],
                priceRange: { min: 99, max: 499 }
            },
            {
                product: 'Potting Mix',
                reason: 'Ideal soil for this plant type',
                alternatives: ['Coco peat', 'Perlite mix', 'Organic compost'],
                priceRange: { min: 49, max: 299 }
            },
            {
                product: 'Liquid Fertilizer',
                reason: 'Promotes healthy growth',
                alternatives: ['Organic fertilizer', 'Slow-release pellets', 'Compost tea'],
                priceRange: { min: 99, max: 399 }
            }
        ];

        return recommendations;
    }

    // Calculate total cost with delivery
    static calculateTotalCost(products: ProductDeal[]): {
        subtotal: number;
        delivery: number;
        savings: number;
        total: number;
    } {
        const subtotal = products.reduce((sum, p) => sum + p.price, 0);
        const delivery = products.reduce((sum, p) => sum + p.delivery.cost, 0);
        const savings = products.reduce((sum, p) => {
            if (p.originalPrice) {
                return sum + (p.originalPrice - p.price);
            }
            return sum;
        }, 0);

        return {
            subtotal,
            delivery,
            savings,
            total: subtotal + delivery
        };
    }

    // Get seasonal deals
    static getSeasonalDeals(): ProductDeal[] {
        // TODO: Implement seasonal deals based on current season
        // const month = new Date().getMonth();
        // const season = month >= 2 && month <= 5 ? 'spring' : ...

        // Return season-appropriate plants (placeholder)
        return [];
    }

    // Track price history (mock)
    static getPriceHistory(_productId: string): {
        date: Date;
        price: number;
    }[] {
        // Note: productId will be used when integrating real price tracking API
        const history = [];
        const today = new Date();

        for (let i = 30; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            history.push({
                date,
                price: 299 + Math.random() * 100
            });
        }

        return history;
    }

    // Get product alerts
    static setProductAlert(productId: string, targetPrice: number): void {
        const alerts = JSON.parse(localStorage.getItem('price_alerts') || '[]');
        alerts.push({
            productId,
            targetPrice,
            createdAt: new Date()
        });
        localStorage.setItem('price_alerts', JSON.stringify(alerts));
    }

    // Check alerts
    static checkAlerts(): void {
        // TODO: Implement price alert checking
        // const alerts = JSON.parse(localStorage.getItem('price_alerts') || '[]');
        // In production, check actual prices and notify
        console.log('Price alerts check - to be implemented');
    }
}

// React Hook for Shopping Assistant
export function useShoppingAssistant() {
    const [products, setProducts] = useState<ProductDeal[]>([]);
    const [bestDeals, setBestDeals] = useState<ProductDeal[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const searchProducts = async (query: string, category?: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const results = await ShoppingAssistantService.searchProducts(query, category);
            setProducts(results);
            return results;
        } catch (err) {
            setError('Failed to search products');
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    const loadBestDeals = async (category?: string) => {
        setIsLoading(true);
        try {
            const deals = await ShoppingAssistantService.getBestDeals(category);
            setBestDeals(deals);
        } catch (err) {
            setError('Failed to load deals');
        } finally {
            setIsLoading(false);
        }
    };

    const comparePrices = async (productName: string) => {
        setIsLoading(true);
        try {
            const comparison = await ShoppingAssistantService.comparePrices(productName);
            setProducts(comparison);
            return comparison;
        } catch (err) {
            setError('Failed to compare prices');
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadBestDeals();
    }, []);

    return {
        products,
        bestDeals,
        isLoading,
        error,
        searchProducts,
        comparePrices,
        loadBestDeals,
        getRecommendations: ShoppingAssistantService.getRecommendations,
        calculateTotal: ShoppingAssistantService.calculateTotalCost
    };
}
