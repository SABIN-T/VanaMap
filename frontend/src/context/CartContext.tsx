import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Plant } from '../types';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

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

    const { user } = useAuth();

    // Sync local cart with user's DB cart on login
    useEffect(() => {
        if (user && user.cart) {
            // Assuming the backend populates the cart items with full Plant objects
            // If strictly IDs, we would need to hydrate this data here
            setItems(user.cart as unknown as CartItem[]);
        }
    }, [user]);

    const addToCart = (plant: Plant) => {
        setItems(prev => {
            const existing = prev.find(i => i.plant.id === plant.id);
            let newItems;
            if (existing) {
                newItems = prev.map(i => i.plant.id === plant.id ? { ...i, quantity: i.quantity + 1 } : i);
            } else {
                newItems = [...prev, { plant, quantity: 1 }];
            }

            // Sync with Cloud & Local Storage
            if (user) {
                import('../services/api').then(({ syncCart }) => syncCart(user.email, newItems));

                // Update local storage user object immediately so refresh works
                const savedUser = localStorage.getItem('user');
                if (savedUser) {
                    const parsed = JSON.parse(savedUser);
                    parsed.cart = newItems;
                    localStorage.setItem('user', JSON.stringify(parsed));
                }
            }
            return newItems;
        });
        toast.success(`${plant.name} added to cart!`);
    };

    const removeFromCart = (plantId: string) => {
        setItems(prev => {
            const newItems = prev.filter(i => i.plant.id !== plantId);
            if (user) {
                import('../services/api').then(({ syncCart }) => syncCart(user.email, newItems));

                // Update local storage user object immediately
                const savedUser = localStorage.getItem('user');
                if (savedUser) {
                    const parsed = JSON.parse(savedUser);
                    parsed.cart = newItems;
                    localStorage.setItem('user', JSON.stringify(parsed));
                }
            }
            return newItems;
        });
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
