import create from "zustand";

const useStore = create((set) => ({
  cartCount: 0,
  saveForLaterCount: 0,
  addToCart: () => set((state) => ({ cartCount: state.cartCount + 1 })),
  addToSaveForLater: () =>
    set((state) => ({ saveForLaterCount: state.saveForLaterCount + 1 })),
  resetCounts: () => set({ cartCount: 0, saveForLaterCount: 0 }),
}));

export default useStore;
