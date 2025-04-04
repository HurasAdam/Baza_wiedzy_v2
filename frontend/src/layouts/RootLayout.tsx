import { MySidebar } from "@/components/MySidebar";
import { useCheckUser } from "@/hooks/auth/useCheckUser";
import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import CreateArticle from "../components/articles/Create/CreateArticle";
import { useModal } from "../components/modal/hooks/useModal";
import { Modal } from "../components/modal/Modal";
import Navbar from "../components/Navbar";

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
        <div className="flex bg-card">
            <MySidebar />
            <div className="w-full">
                <div className="flex flex-1 flex-col gap-4 min-h-screen bg-background">
                    <Navbar openCreateArticleModal={openCreateArticleModal} />
                    <div className="overflow-hidden ">
                        <Outlet context={{ state, setState }} />
                    </div>
                </div>
            </div>
            <Modal isOpen={isCreateArticleModalOpen} onClose={closeCreateArticleModal}>
                <CreateArticle onClose={closeCreateArticleModal} />
            </Modal>
        </div>
    );
};
