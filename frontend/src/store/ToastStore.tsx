import { create } from "zustand";

interface ToastState {
  message: string;
  type: "success" | "error" | "info" | "";
  isOpen: boolean;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  message: "",
  type: "",
  isOpen: false,
  showToast: (message, type = "info") => {
    set({ message, type, isOpen: true });
    setTimeout(() => set({ isOpen: false }), 3000); // auto-hide after 3s
  },
  hideToast: () => set({ isOpen: false }),
}));
