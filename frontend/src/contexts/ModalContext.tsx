import { AlertModal } from "@/components/core/AlertModal";
import { useCallback, useContext, useEffect, useState } from "react";

import React from "react";


const ModalContext = React.createContext(undefined);



export const ModalContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {

    const [isOpen, setIsOpen] = useState(false);
    const [modalContent, setModalContent] = useState({
      title: "",
      description: "",
      onConfirm: () => {}, 
    });

    const openModal = useCallback((title: string, description: string, onConfirm: () => void) => {
        setModalContent({ title, description, onConfirm });
        setIsOpen(true);
      }, []);
    
      const closeModal = useCallback(() => {
        setIsOpen(false);
      }, []);
    
      const confirmModal = useCallback(() => {
        if (modalContent.onConfirm) {
          modalContent.onConfirm(); // Wywołaj funkcję przekazaną w `onConfirm`
        }
        closeModal(); // Zamknij modal po zatwierdzeniu
      }, [modalContent, closeModal]);
    




  return (
    <ModalContext.Provider
      value={{
        openModal,
        closeModal,
        confirmModal
        
     
      
      }}
    >



<AlertModal
        isOpen={isOpen}
        title={modalContent.title}
        description={modalContent.description}
        onCancel={closeModal}
        onConfirm={confirmModal}
      />



      {children}
    </ModalContext.Provider>
  );
};

export const useModalContext = () => {
  const context = useContext(ModalContext);
  return context as ModalContext;
};