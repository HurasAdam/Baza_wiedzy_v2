// import React, { ReactNode, useCallback, useContext, useState } from "react";
// import { useModalSettings } from '@/contexts/PreferencesSettingsContext';
// import { ContentModal } from "@/components/core/ContentModal";
// import { ContentModalProps } from "../types";
// // import { AlertModal } from "@/components/core/AlertModal";
// // import useModalSize from "@/hooks/useModalSize";

// const ModalContext = React.createContext(null);

// interface ModalContextProps {
//   children: ReactNode;
// }

// export const ModalContextProvider = ({ children }: ModalContextProps) => {
//   // Stany dla ContentModal
//   const [isContentModalOpen, setIsContentModalOpen] = useState<boolean>(false);

//   const [contentModal, setContentModal] = useState<ContentModalProps>({
//     content: null,
//     size: "md",
//     height: "",
//     closeOnOutsideClick: true,
//     scrollable: true,
//   });

//   const { modalSize } = useModalSettings();

//   const openContentModal = useCallback(
//     ({
//       closeOnOutsideClick = true,
//       content = null,
//       size,
//       height,
//       scrollable,
//     }) => {
//       setContentModal({
//         closeOnOutsideClick,
//         title,
//         description,
//         content,
//         size: size ?? null,
//         height,
//         scrollable,
//       });
//       setIsContentModalOpen(true);
//     },
//     []
//   );

//   const closeContentModal = useCallback(() => {
//     setIsContentModalOpen(false);
//     setContentModal({
//       title: "",
//       description: "",
//       content: null,
//       closeOnOutsideClick: true,
//     });
//   }, []);

//   return (
//     <ModalContext.Provider
//       value={{
//         openContentModal,
//         closeContentModal,
//       }}
//     >
//       <ContentModal
//         closeOnOutsideClick={contentModal.closeOnOutsideClick}
//         height={contentModal.height}
//         size={contentModal.size ?? modalSize}
//         isOpen={isContentModalOpen}
//         onClose={closeContentModal}
//         title={contentModal.title}
//         description={contentModal.description}
//         scrollable={contentModal.scrollable}
//       >
//         {contentModal.content}
//       </ContentModal>

//       {children}
//     </ModalContext.Provider>
//   );
// };

// export const useModalContext = () => {
//   const context = useContext(ModalContext);
//   return context;
// };
