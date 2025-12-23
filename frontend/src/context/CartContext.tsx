import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Plant, CartItem } from '../types';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface RawCartItem {
    plantId?: string;
    _id?: string;
    quantity: number;
    plant?: Plant;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (plant: Plant, vendorId?: string, price?: number) => void;
    removeFromCart: (plantId: string, vendorId?: string) => void;
    updateQuantity: (plantId: string, quantity: number, vendorId?: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const { user, updateUser } = useAuth();

    // Initial load from localStorage (either from user or guest_cart)
    const [items, setItems] = useState<CartItem[]>(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            const parsed = JSON.parse(savedUser);
            if (parsed.cart) {
                // Prevent crash: Only use cached cart if it contains full plant objects.
                if (parsed.cart.length > 0 && !parsed.cart[0].plant) {
                    return [];
                }
                return parsed.cart;
            }
        }
        const guestCart = localStorage.getItem('guest_cart');
        if (guestCart) return JSON.parse(guestCart);
        return [];
    });

    // Sync local cart with user's DB cart on login
    useEffect(() => {
        const hydrateCart = async () => {
            if (user && user.cart && user.cart.length > 0) {
                const firstItem = user.cart[0] as unknown as RawCartItem;
                const needsHydration = !firstItem.plant && (firstItem.plantId || firstItem._id);

                if (needsHydration) {
                    try {
                        const { fetchPlants } = await import('../services/api');
                        const allPlants = await fetchPlants();

                        const hydratedItems: CartItem[] = (user.cart as any[]).map((item: any) => {
                            const raw = item as RawCartItem;
                            const targetId = raw.plantId || raw._id;
                            const fullPlant = allPlants.find(p => p.id === targetId);
                            if (fullPlant) {
                                return {
                                    plant: fullPlant,
                                    quantity: item.quantity || 1
                                };
                            }
                            return null;
                        }).filter((i): i is CartItem => i !== null);

                        setItems(hydratedItems);
                    } catch (err) {
                        console.error("Failed to hydrate cart", err);
                    }
                } else {
                    setItems(user.cart as unknown as CartItem[]);
                }
            } else if (user && (!user.cart || user.cart.length === 0)) {
                setItems([]);
            }
        };

        hydrateCart();
    }, [user]);

    const persistCart = (newItems: CartItem[]) => {
        const cartPayload = newItems.map(i => ({
            plantId: i.plant.id,
            quantity: i.quantity,
            vendorId: i.vendorId,
            vendorPrice: i.vendorPrice
        }));
        if (user) {
            updateUser({ cart: cartPayload as any });
            import('../services/api').then(({ syncCart }) => syncCart(cartPayload));
        } else {
            localStorage.setItem('guest_cart', JSON.stringify(newItems));
        }
    };

    const addToCart = (plant: Plant, vendorId?: string, price?: number) => {
        setItems(prev => {
            // Check for existing item with same plant AND same vendor
            const existing = prev.find(i => i.plant.id === plant.id && i.vendorId === vendorId);
            let newItems: CartItem[];

            if (existing) {
                newItems = prev.map(i =>
                    (i.plant.id === plant.id && i.vendorId === vendorId)
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            } else {
                newItems = [...prev, {
                    plant,
                    quantity: 1,
                    vendorId,
                    vendorPrice: price
                }];
            }
            persistCart(newItems);
            return newItems;
        });
        toast.success(`${plant.name} added to cart!`);
    };

    const updateQuantity = (plantId: string, quantity: number, vendorId?: string) => {
        setItems(prev => {
            let newItems;
            if (quantity <= 0) {
                newItems = prev.filter(i => !(i.plant.id === plantId && i.vendorId === vendorId));
            } else {
                newItems = prev.map(i =>
                    (i.plant.id === plantId && i.vendorId === vendorId)
                        ? { ...i, quantity }
                        : i
                );
            }
            persistCart(newItems);
            return newItems;
        });
    };

    const removeFromCart = (plantId: string, vendorId?: string) => {
        setItems(prev => {
            // Remove specific item matching plantId and vendorId (if provided)
            // If vendorId is undefined, it removes generic entries (or all matching plantId? usually specialized logic needed)
            // For now, assume exact match needed
            const newItems = prev.filter(i => !(i.plant.id === plantId && i.vendorId === vendorId));
            persistCart(newItems);
            return newItems;
        });
        toast.success(`Item removed`);
    };

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};
