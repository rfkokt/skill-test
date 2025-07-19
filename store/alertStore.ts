// store/alertStore.ts
import { LucideIcon } from "lucide-react";
import { create } from "zustand";

interface AlertData {
  title: string;
  description: string;
  icon?: LucideIcon;
  variant?: "default" | "warning" | "error" | "success";
}

interface AlertState {
  isOpen: boolean;
  data: AlertData | null;
  showAlert: (data: AlertData) => void;
  closeAlert: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  isOpen: false,
  data: null,

  showAlert: (data) => set({ isOpen: true, data }),
  closeAlert: () => set({ isOpen: false, data: null }),
}));
