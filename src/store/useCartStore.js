import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useAuthStore from './useAuthStore';

const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],
      savedItems: [],

      // Initialize both cart and saved items from DB after login
      initializeFromDB: async (userId) => {
        try {
          const response = await fetch(`/api/user/${userId}`);
          if (response.ok) {
            const userData = await response.json();
            set({
              cartItems: JSON.parse(userData.cartitem || '[]'),
              savedItems: JSON.parse(userData.savelater || '[]')
            });
          }
        } catch (error) {
          console.error('Error initializing cart and saved items:', error);
        }
      },

      // Add to cart with DB sync
      addToCart: async (product) => {
        const userId = useAuthStore.getState().userId;
        if (!userId) return;

        const currentItems = get().cartItems;
        const existingItem = currentItems.find(item => item.id === product.id);

        let newCartItems;
        if (existingItem) {
          // If item exists, increment quantity
          newCartItems = currentItems.map(item =>
            item.id === product.id
              ? { ...item, quantity: (item.quantity || 1) + 1 }
              : item
          );
        } else {
          // If item doesn't exist, add with quantity 1
          newCartItems = [...currentItems, { ...product, quantity: 1 }];
        }
        
        try {
          const response = await fetch(`/api/user/${userId}/cart`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cartItems: newCartItems })
          });

          if (response.ok) {
            set({ cartItems: newCartItems });
          }
        } catch (error) {
          console.error('Error updating cart:', error);
        }
      },

      // Update item quantity with DB sync
      updateQuantity: async (productId, quantity) => {
        const userId = useAuthStore.getState().userId;
        if (!userId) return;

        // Ensure quantity is at least 1
        const validQuantity = Math.max(1, quantity);

        const newCartItems = get().cartItems.map(item =>
          item.id === productId
            ? { ...item, quantity: validQuantity }
            : item
        );

        try {
          const response = await fetch(`/api/user/${userId}/cart`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cartItems: newCartItems })
          });

          if (response.ok) {
            set({ cartItems: newCartItems });
          }
        } catch (error) {
          console.error('Error updating quantity:', error);
        }
      },

      // Remove from cart with DB sync
      removeFromCart: async (productId) => {
        const userId = useAuthStore.getState().userId;
        if (!userId) return;

        const newCartItems = get().cartItems.filter(item => item.id !== productId);

        try {
          const response = await fetch(`/api/user/${userId}/cart`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cartItems: newCartItems })
          });

          if (response.ok) {
            set({ cartItems: newCartItems });
          }
        } catch (error) {
          console.error('Error removing from cart:', error);
        }
      },

      // Save for later with DB sync
      saveForLater: async (product) => {
        const userId = useAuthStore.getState().userId;
        if (!userId) return;

        const currentSavedItems = get().savedItems;
        const isAlreadySaved = currentSavedItems.some(item => item.id === product.id);
        const newSavedItems = isAlreadySaved
          ? currentSavedItems.filter(item => item.id !== product.id)
          : [...currentSavedItems, product];

        try {
          const response = await fetch(`/api/user/${userId}/savelater`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ savedItems: newSavedItems })
          });

          if (response.ok) {
            set({ savedItems: newSavedItems });
          }
        } catch (error) {
          console.error('Error updating saved items:', error);
        }
      },

      // Remove from saved items with DB sync
      removeFromSaved: async (productId) => {
        const userId = useAuthStore.getState().userId;
        if (!userId) return;

        const newSavedItems = get().savedItems.filter(item => item.id !== productId);

        try {
          const response = await fetch(`/api/user/${userId}/savelater`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ savedItems: newSavedItems })
          });

          if (response.ok) {
            set({ savedItems: newSavedItems });
          }
        } catch (error) {
          console.error('Error removing saved item:', error);
        }
      },

      // Clear cart with DB sync
      clearCart: async () => {
        const userId = useAuthStore.getState().userId;
        if (!userId) return;

        try {
          const response = await fetch(`/api/user/${userId}/cart`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cartItems: [] })
          });

          if (response.ok) {
            set({ cartItems: [] });
          }
        } catch (error) {
          console.error('Error clearing cart:', error);
        }
      },

      // Clear saved items with DB sync
      clearSaved: async () => {
        const userId = useAuthStore.getState().userId;
        if (!userId) return;

        try {
          const response = await fetch(`/api/user/${userId}/savelater`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ savedItems: [] })
          });

          if (response.ok) {
            set({ savedItems: [] });
          }
        } catch (error) {
          console.error('Error clearing saved items:', error);
        }
      },

      // Get total price
      getTotalPrice: () => {
        return get().cartItems.reduce((total, item) => 
          total + (item.price * (item.quantity || 1)), 0
        );
      },

      // Utility functions
      getSavedCount: () => get().savedItems.length,
      getCartCount: () => get().cartItems.reduce((count, item) => count + (item.quantity || 1), 0),
      isItemSaved: (productId) => get().savedItems.some(item => item.id === productId),
    }),
    {
      name: 'cart-storage',
    }
  )
);

export default useCartStore; 