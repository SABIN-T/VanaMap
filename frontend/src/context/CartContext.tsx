import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Plant } from '../types';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface CartItem {
    plant: Plant;
    quantity: number;
}

interface RawCartItem {
    plantId?: string;
    _id?: string;
    quantity: number;
    plant?: Plant;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (plant: Plant) => void;
    removeFromCart: (plantId: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const { user, updateUser } = useAuth();

    // Initial load from localStorage (either from user or guest_cart)
    const [items, setItems] = useState<CartItem[]>(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            const parsed = JSON.parse(savedUser);
            if (parsed.cart) return parsed.cart;
        }
        const guestCart = localStorage.getItem('guest_cart');
        if (guestCart) return JSON.parse(guestCart);
        return [];
    });

    // Sync local cart with user's DB cart on login
    useEffect(() => {
        const hydrateCart = async () => {
            if (user && user.cart && user.cart.length > 0) {
                // Check if the first item needs hydration (has plantId but no plant object)
                const firstItem = user.cart[0] as unknown as RawCartItem;
                const needsHydration = !firstItem.plant && (firstItem.plantId || firstItem._id);

                if (needsHydration) {
                    try {
                        const { fetchPlants } = await import('../services/api');
                        const allPlants = await fetchPlants();

                        const hydratedItems: CartItem[] = (user.cart as any[]).map((item: any) => {
                            const raw = item as RawCartItem;
                            // Handle both plantId and _id formats from different DB schemas
                            const targetId = raw.plantId || raw._id;
                            const fullPlant = allPlants.find(p => p.id === targetId);
                            if (fullPlant) {
                                return {
                                    plant: fullPlant,
                                    quantity: item.quantity || 1
                                };
                            }
                            return null;
                        }).filter((i): i is CartItem => i !== null); // Remove nulls if plant not found

                        setItems(hydratedItems);
                    } catch (err) {
                        console.error("Failed to hydrate cart", err);
                    }
                } else {
                    // Already hydrated or empty
                    setItems(user.cart as unknown as CartItem[]);
                }
            } else if (user && (!user.cart || user.cart.length === 0)) {
                // User has empty cart in DB (or cleared it)
                setItems([]);
            }
        };

        hydrateCart();
    }, [user]);

    const addToCart = (plant: Plant) => {
        setItems(prev => {
            const existing = prev.find(i => i.plant.id === plant.id);
            let newItems: CartItem[];
            if (existing) {
                newItems = prev.map(i => i.plant.id === plant.id ? { ...i, quantity: i.quantity + 1 } : i);
            } else {
                newItems = [...prev, { plant, quantity: 1 }];
            }

            // Persistence logic
            const cartPayload = newItems.map(i => ({ plantId: i.plant.id, quantity: i.quantity }));
            if (user) {
                // Keep Auth state and global DB in sync
                updateUser({ cart: cartPayload });
                import('../services/api').then(({ syncCart }) => syncCart(user.email, cartPayload));
            } else {
                // Persistent guest cart
                localStorage.setItem('guest_cart', JSON.stringify(newItems));
            }
            return newItems;
        });
        toast.success(`${plant.name} added to cart!`);
    };

    const removeFromCart = (plantId: string) => {
        setItems(prev => {
            const newItems = prev.filter(i => i.plant.id !== plantId);
            const cartPayload = newItems.map(i => ({ plantId: i.plant.id, quantity: i.quantity }));
            if (user) {
                updateUser({ cart: cartPayload });
                import('../services/api').then(({ syncCart }) => syncCart(user.email, cartPayload));
            } else {
                localStorage.setItem('guest_cart', JSON.stringify(newItems));
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
