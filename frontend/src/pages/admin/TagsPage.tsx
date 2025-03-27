import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { FaHashtag } from "react-icons/fa";
import TagTable from "../../components/admin/Tag/tag-table";
import TagForm from "../../components/forms/TagForm";
import { useModal } from "../../components/modal/hooks/useModal";
import { Modal } from "../../components/modal/Modal";
import { Button } from "../../components/ui/button";

import { tagApi } from "../../lib/tag.api";

const TagsPage = () => {
    const { openModal, isOpen, closeModal } = useModal();
    const { data: tags } = useQuery({
        queryKey: ["tags"],
        queryFn: () => {
            return tagApi.findAll();
        },
    });
    return (
        <div className="px-6 space-y-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <h2 className="mb-6 text-xl font-bold text-gray-800 dark:text-white flex items-center gap-1">
                    <FaHashtag />
                    Tagi
                </h2>
                <Button
                    onClick={openModal}
                    className="px-4 flex gap-1.5 py-2 mt-4 md:mt-0 text-sm font-medium text-white bg-slate-600 rounded-md hover:bg-slate-700 transition"
                >
                    <Plus className="w-4 h-4" /> Dodaj tag
                </Button>
            </div>
            <div>
                <TagTable />
            </div>
            <Modal isOpen={isOpen} onClose={closeModal} height="" width="sm">
                <TagForm />
            </Modal>
        </div>
    );
};

export default TagsPage;
