// store/alertStore.ts
import { LucideIcon } from "lucide-react";
import { create } from "zustand";

export type AlertVariant = "default" | "warning" | "error" | "success";

export interface AlertData {
  title: string;
  description: string;
  icon?: LucideIcon;
  variant?: AlertVariant;
  onClick?: () => void; // onClick ini untuk tombol aksi utama
  onClose?: () => void; // Opsional: jika ada aksi saat menutup
}

interface AlertState {
  isOpen: boolean;
  data: AlertData | null;
  showAlert: (data: AlertData) => void;
  closeAlert: () => void;
}

export const useAlertStore = create<AlertState>((set, get) => ({
  isOpen: false,
  data: null,

  showAlert: (data) => {
    set({ isOpen: true, data });
  },

  // Perbaikan di sini: closeAlert HANYA menutup alert.
  closeAlert: () => {
    // Jalankan callback onClose jika ada, sebelum menutup
    get().data?.onClose?.();
    set({ isOpen: false, data: null });
  },
}));
