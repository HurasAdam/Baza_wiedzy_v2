import { MySidebar } from "@/components/MySidebar";
import Navbar from "@/components/Navbar";
import { ModalContextProvider } from "@/contexts/ModalContext";
import { useCheckUser } from "@/hooks/auth/useCheckUser";
import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import CreateArticle from "../components/articles/Create/CreateArticle";
import { useModal } from "../components/modal/hooks/useModal";
import { Modal } from "../components/modal/Modal";

export const RootLayout = () => {
    const { status } = useCheckUser();
    const [state, setState] = useState("Przykładowa wartość");

    const {
        openModal: openCreateArticleModal,
        isOpen: isCreateArticleModalOpen,
        closeModal: closeCreateArticleModal,
    } = useModal();

    if (status === "pending") {
        return <div>Loading... RootLayout</div>;
    }

    if (status === "error") {
        return <Navigate to="/login" replace />;
    }

    return (
        <ModalContextProvider>
            <div className="flex min-h-full bg-card ">
                <MySidebar />
                <div className="w-full ">
                    <Navbar openCreateArticleModal={openCreateArticleModal} />
                    <div className="flex flex-1 flex-col gap-4 p-4  min-h-screen bg-background rounded-xl ">
                        <Outlet context={{ state, setState }} />
                    </div>
                </div>
                <Modal isOpen={isCreateArticleModalOpen} onClose={closeCreateArticleModal}>
                    <CreateArticle onClose={closeCreateArticleModal} />
                </Modal>
            </div>
        </ModalContextProvider>
    );
};
