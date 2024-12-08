import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import useCartStore from './useCartStore';

const useAuthStore = create(
  persist(
    (set) => ({
      // Auth state
      isAuthenticated: false,
      userId: null,
      userEmail: null,
      token: null,

      // Login action
      login: (userData) => {
        set({
          isAuthenticated: true,
          userId: userData.id,
          userEmail: userData.email,
          token: userData.token,
        });
        
        // Initialize cart and saved items from DB
        useCartStore.getState().initializeFromDB(userData.id);
      },

      // Logout action
      logout: () => {
        // Clear all localStorage items
        if (typeof window !== 'undefined') {
          // Clear everything from localStorage
          localStorage.clear();
          
          // Reset state completely
          set({
            isAuthenticated: false,
            userId: null,
            userEmail: null,
            token: null,
          }, true);

          // Force a page reload to clear any cached state
          window.location.href = '/signin';
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        userId: state.userId,
        userEmail: state.userEmail,
        token: state.token,
      }),
    }
  )
);

export default useAuthStore; 