import { create } from 'zustand';

const getInitialCart = () => {
  try {
    const stored = localStorage.getItem('gadgetzone_cart');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveCart = (items) => {
  try {
    localStorage.setItem('gadgetzone_cart', JSON.stringify(items));
  } catch {
    // Storage quota or private mode
  }
};

export const useCartStore = create((set, get) => ({
  items: getInitialCart(),

  addItem: (product, quantity = 1) => {
    const currentItems = get().items;
    const existingIndex = currentItems.findIndex((item) => item.product.id === product.id);

    let updatedItems;
    if (existingIndex > -1) {
      updatedItems = [...currentItems];
      const newQty = updatedItems[existingIndex].quantity + quantity;
      // Cap at product stock if available
      updatedItems[existingIndex].quantity = product.stock ? Math.min(newQty, product.stock) : newQty;
    } else {
      updatedItems = [...currentItems, { product, quantity: Math.min(quantity, product.stock || 99) }];
    }

    saveCart(updatedItems);
    set({ items: updatedItems });
  },

  removeItem: (productId) => {
    const updatedItems = get().items.filter((item) => item.product.id !== productId);
    saveCart(updatedItems);
    set({ items: updatedItems });
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }

    const updatedItems = get().items.map((item) => {
      if (item.product.id === productId) {
        const cappedQty = item.product.stock ? Math.min(quantity, item.product.stock) : quantity;
        return { ...item, quantity: cappedQty };
      }
      return item;
    });

    saveCart(updatedItems);
    set({ items: updatedItems });
  },

  clearCart: () => {
    saveCart([]);
    set({ items: [] });
  },

  getItemCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },

  getSubtotal: () => {
    return get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  },

  getShippingCost: () => {
    const subtotal = get().getSubtotal();
    if (subtotal === 0) return 0;
    return subtotal >= 5000 ? 0 : 120; // Free shipping over ৳5,000, else ৳120 across BD
  },

  getTotal: () => {
    return get().getSubtotal() + get().getShippingCost();
  },
}));
