import { create } from 'zustand';

const useSnackbarStore = create((set) => ({
    isOpen: false,
    message: '',
    type: 'info',
    showSnackbar: (message, type = 'info') => set({ isOpen: true, message, type }),
    hideSnackbar: () => set({ isOpen: false }),
}));

export default useSnackbarStore;
