import { AlertModal } from "@/components/core/AlertModal";
import { ContentModal } from "@/components/core/ContentModal";
import React, { useCallback, useContext, useState } from "react";

// Stwórz kontekst
const ModalContext = React.createContext(undefined);

export const ModalContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Stany dla AlertModal
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertModal, setModalContent] = useState({
    title: "",
    description: "",
    isUsed: false,
    isChecked: false,
    onConfirm: () => {},
  });

  // Stany dla ContentModal
  const [isContentModalOpen, setIsContentModalOpen] = useState<boolean>(false);
  const [contentModal, setContentModal] = useState({
    title: "",
    description: "",
    content: null as React.ReactNode | null,
    size: "md",
    height: "",
    closeOnOutsideClick: true,
    scrollable: true,
  });

  // Funkcje dla AlertModal
  const openModal = useCallback(
    (
      title: string,
      description: string,
      onConfirm: () => void,
      isUsed?: boolean
    ) => {
      setModalContent({ title, description, onConfirm, isUsed });
      setIsAlertOpen(true);
    },
    []
  );

  const closeModal = useCallback(() => {
    setIsAlertOpen(false);
  }, []);

  const confirmModal = useCallback(() => {
    if (alertModal.onConfirm) {
      alertModal.onConfirm();
    }
    closeModal();
  }, [alertModal, closeModal]);

  // Funkcje dla ContentModal
  const openContentModal = useCallback(
    ({
      closeOnOutsideClick = true,
      title = "",
      description = "",
      content = null,
      size,
      height,
      scrollable,
    }) => {
      setContentModal({
        closeOnOutsideClick,
        title,
        description,
        content,
        size,
        height,
        scrollable,
      });
      setIsContentModalOpen(true);
    },
    []
  );

  const closeContentModal = useCallback(() => {
    setIsContentModalOpen(false);
    setContentModal({
      title: "",
      description: "",
      content: null,
      closeOnOutsideClick: true,
    });
  }, []);

  return (
    <ModalContext.Provider
      value={{
        openModal,
        closeModal,
        confirmModal,
        openContentModal,
        closeContentModal,
      }}
    >
      {/* Memoized AlertModal */}
      {isAlertOpen && (
        <MemoizedAlertModal
          isUsed={alertModal.isUsed}
          isOpen={isAlertOpen}
          title={alertModal.title}
          description={alertModal.description}
          onCancel={closeModal}
          onConfirm={confirmModal}
        />
      )}

      {/* Memoized ContentModal */}
      {isContentModalOpen && (
        <MemoizedContentModal
          closeOnOutsideClick={contentModal.closeOnOutsideClick}
          height={contentModal.height}
          size={contentModal.size}
          isOpen={isContentModalOpen}
          onClose={closeContentModal}
          title={contentModal.title}
          description={contentModal.description}
          scrollable={contentModal.scrollable}
        >
          {contentModal.content}
        </MemoizedContentModal>
      )}

      {children}
    </ModalContext.Provider>
  );
};

// Memoized AlertModal
const MemoizedAlertModal = React.memo(AlertModal);

// Memoized ContentModal
const MemoizedContentModal = React.memo(ContentModal);

export const useModalContext = () => {
  const context = useContext(ModalContext);
  return context as ModalContext;
};
