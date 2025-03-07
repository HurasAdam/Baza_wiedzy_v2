import type { ReactNode } from "react";

export type WidthModal = 'sm' | 'md' | 'lg' | 'xl';
export type HeightModal = 'sm' | 'md' | 'lg';

export interface ModalProps {
  children: ReactNode;
  isOpen: boolean,
  width?: WidthModal;
  height?: HeightModal;
  closeOnOutsideClick?: boolean;
  onClose(): void;
}

// export interface UseModalProps {
//   content: ReactNode;
//   width?: WidthModal;
//   height?: HeightModal;
//   closeOnOutsideClick?: boolean;
// }

export interface UseModal {
    isOpen: boolean;
    // config: UseModalProps;
    openModal(): void;
    closeModal(): void;
}
