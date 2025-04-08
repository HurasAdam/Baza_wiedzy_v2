import { MySidebar } from "@/components/MySidebar";
import { useCheckUser } from "@/hooks/auth/useCheckUser";
import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import CreateArticle from "../components/articles/Create/CreateArticle";
import { useModal } from "../components/modal/hooks/useModal";
import { Modal } from "../components/modal/Modal";
import Navbar from "../components/Navbar";
import { IMAGES } from "../constants/images";

export const RootLayout = () => {
    const logo = IMAGES.Logo;
    const { status } = useCheckUser();
    const [state, setState] = useState("Przykładowa wartość");

    const {
        openModal: openCreateArticleModal,
        isOpen: isCreateArticleModalOpen,
        closeModal: closeCreateArticleModal,
    } = useModal();

    if (status === "pending") {
        return (
            <div className="relative h-screen w-full">
                <div className=" flex h-full items-center justify-center">
                    <div className="flex flex-col items-center animate-fadeIn">
                        <div
                            className=" inset-0 bg-contain bg-center bg-no-repeat w-20 h-20 animate-spin"
                            style={{ backgroundImage: `url(${logo})` }}
                        />
                        <p className="mt-6 text-base font-bold text-primary-foreground ">
                            Proszę czekać, aplikacja się ładuje...
                        </p>
                    </div>
                </div>
            </div>
        );
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
