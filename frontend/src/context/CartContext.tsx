import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Plant } from '../types';

interface CartItem {
    plant: Plant;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (plant: Plant) => void;
    removeFromCart: (plantId: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([]);

    const addToCart = (plant: Plant) => {
        setItems(prev => {
            const existing = prev.find(i => i.plant.id === plant.id);
            if (existing) {
                return prev.map(i => i.plant.id === plant.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { plant, quantity: 1 }];
        });
        alert(`${plant.name} added to cart!`);
    };

    const removeFromCart = (plantId: string) => {
        setItems(prev => prev.filter(i => i.plant.id !== plantId));
    };

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};
