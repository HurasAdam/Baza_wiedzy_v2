import { Plus, Users } from "lucide-react";
import TopicTable from "../../components/admin/topic/topic-table";
import TopicForm from "../../components/forms/TopicForm";
import { useModal } from "../../components/modal/hooks/useModal";
import { Modal } from "../../components/modal/Modal";
import { Button } from "../../components/ui/button";

const TopicsPage = () => {
    const { openModal, isOpen, closeModal } = useModal();
    return (
        <div className="px-6 space-y-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <h2 className="mb-6 text-xl font-bold text-gray-800 dark:text-white flex items-center gap-1">
                    <Users />
                    Użytkownicy
                </h2>
                <Button
                    onClick={openModal}
                    className="px-4 flex gap-1.5 py-2 mt-4 md:mt-0 text-sm font-medium text-white bg-slate-600 rounded-md hover:bg-slate-700 transition"
                >
                    <Plus className="w-4 h-4" /> Dodaj temat
                </Button>
            </div>
            <div>
                <TopicTable />
            </div>
            <Modal isOpen={isOpen} onClose={closeModal} height="md" width="sm">
                <TopicForm onClose={closeModal} />
            </Modal>
        </div>
    );
};

export default TopicsPage;
