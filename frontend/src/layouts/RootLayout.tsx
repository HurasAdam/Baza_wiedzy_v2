import { Navigate, Outlet } from "react-router-dom";
import { MySidebar } from "@/components/MySidebar";
import CreateArticle from "@/components/articles/Create/CreateArticle";
import { useModal } from "@/components/modal/hooks/useModal";
import { Modal } from "@/components/modal/Modal";
import Navbar from "@/components/Navbar";
import { ViewPreferenceProvider } from "@/contexts/ViewPreferenceContext";
import { useUser } from "@/hooks/auth/useUser";

export const RootLayout = () => {
    const user = useUser();
    const createArticleModal = useModal();

    if (!user) {
        return <Navigate to="/auth/login" />;
    }

    if (user.mustChangePassword && location.pathname !== "/onboarding/change-password") {
        return <Navigate to="/onboarding/change-password" replace />;
    }

    return (
        <ViewPreferenceProvider>
            <div className="flex bg-card">
                <MySidebar />
                <div className="w-full">
                    <div className="flex flex-1 flex-col min-h-screen bg-background">
                        <Navbar openCreateArticleModal={createArticleModal.openModal} />
                        <div className="overflow-hidden">
                            <Outlet />
                        </div>
                    </div>
                </div>
                <Modal
                    isOpen={createArticleModal.isOpen}
                    onClose={createArticleModal.closeModal}
                    closeOnOutsideClick={false}
                >
                    <CreateArticle onClose={createArticleModal.closeModal} />
                </Modal>
            </div>
        </ViewPreferenceProvider>
    );
};
