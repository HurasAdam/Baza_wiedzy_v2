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
    const { user, status } = useCheckUser();
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
                    <div className="flex flex-col items-center justify-center h-full text-center  w-full rounded-2xl shadow-lg p-6">
                        <div className="relative w-16 h-16 mb-6 animate-spin-slow">
                            {/* Obracający się pierścień */}
                            <div className="absolute inset-0 rounded-full border-4 border-primary/30 border-t-primary-foreground  border-b-primary animate-spin-slow" />

                            {/* Static inner glow */}
                            <div className="absolute inset-4 rounded-full bg-primary/10 backdrop-blur-md shadow-inner" />

                            {/* Centralna kulka jako core-logo */}
                            <div className="absolute top-1/2 left-1/2 w-5 h-5 bg-primary rounded-full shadow-xl -translate-x-1/2 -translate-y-1/2 border border-white/10 " />
                        </div>
                        <h2 className="text-xl font-semibold text-foreground mb-2">Łoadowanie...</h2>
                        <p className="text-sm text-muted-foreground max-w-md">Trwa ładowanie, danych..</p>
                    </div>
                </div>
            </div>
        );
    }

    if (status === "error") {
        return <Navigate to="/login" replace />;
    }

    if (user?.mustChangePassword && location.pathname !== "/onboarding/change-password") {
        return <Navigate to="/onboarding/change-password" replace />;
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
            <Modal isOpen={isCreateArticleModalOpen} onClose={closeCreateArticleModal} closeOnOutsideClick={false}>
                <CreateArticle onClose={closeCreateArticleModal} />
            </Modal>
        </div>
    );
};
