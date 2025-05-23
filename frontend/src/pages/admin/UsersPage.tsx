import { Plus, Users } from "lucide-react";
import CreateUserForm from "../../components/admin/user/create-user-from";
import UserTable from "../../components/admin/user/user-table";
import { useModal } from "../../components/modal/hooks/useModal";
import { Modal } from "../../components/modal/Modal";
import { Button } from "../../components/ui/button";
import useGetAllUsers from "../../hooks/query/useGetAllUsers";

const UsersPage = () => {
    const { data } = useGetAllUsers({});
    const { openModal, isOpen, closeModal } = useModal();
    return (
        <div className="px-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <h2 className="mb-6 text-xl font-bold text-primary-foreground flex items-center gap-1">
                    <Users />
                    Użytkownicy
                </h2>
                <Button
                    onClick={openModal}
                    className="px-4 flex gap-1.5 py-2 mt-4 md:mt-0 text-sm font-medium text-primary-foreground bg-primary/75 rounded-md hover:bg-primary/85 transition"
                >
                    <Plus className="w-4 h-4" /> Utwórz konto
                </Button>
            </div>
            <div>
                <UserTable />
            </div>
            <Modal isOpen={isOpen} onClose={closeModal} height="md" width="md">
                <CreateUserForm onClose={closeModal} />
            </Modal>
        </div>
    );
};

export default UsersPage;
