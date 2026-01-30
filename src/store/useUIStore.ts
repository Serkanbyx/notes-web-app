import { create } from 'zustand';

/**
 * UI state for global modals and dialogs
 */
interface UIState {
  /** Whether the keyboard shortcuts modal is open */
  isShortcutsModalOpen: boolean;
  /** Open the keyboard shortcuts modal */
  openShortcutsModal: () => void;
  /** Close the keyboard shortcuts modal */
  closeShortcutsModal: () => void;
  /** Toggle the keyboard shortcuts modal */
  toggleShortcutsModal: () => void;
}

/**
 * Global UI store for managing modals and dialogs
 */
export const useUIStore = create<UIState>((set) => ({
  isShortcutsModalOpen: false,

  openShortcutsModal: () => set({ isShortcutsModalOpen: true }),
  closeShortcutsModal: () => set({ isShortcutsModalOpen: false }),
  toggleShortcutsModal: () =>
    set((state) => ({ isShortcutsModalOpen: !state.isShortcutsModalOpen })),
}));

// Selectors
export const selectIsShortcutsModalOpen = (state: UIState) =>
  state.isShortcutsModalOpen;
export const selectOpenShortcutsModal = (state: UIState) =>
  state.openShortcutsModal;
export const selectCloseShortcutsModal = (state: UIState) =>
  state.closeShortcutsModal;
export const selectToggleShortcutsModal = (state: UIState) =>
  state.toggleShortcutsModal;
