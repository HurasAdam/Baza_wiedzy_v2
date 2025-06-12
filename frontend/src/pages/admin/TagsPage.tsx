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
        <div className="px-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <h2 className="mb-6 text-xl font-bold text-foreground flex items-center gap-1">
                    <FaHashtag />
                    Tagi
                </h2>
                <Button
                    onClick={openModal}
                    className="px-4 flex gap-1.5 py-2 mt-4 md:mt-0 text-sm font-medium text-secondary-foreground bg-primary rounded-md hover:text-secondary-foreground transition"
                >
                    <Plus className="w-4 h-4 text-secondary-foreground" /> Dodaj tag
                </Button>
            </div>
            <div>
                <TagTable />
            </div>
            <Modal isOpen={isOpen} onClose={closeModal} height="fit" width="xs">
                <TagForm onClose={closeModal} />
            </Modal>
        </div>
    );
};

export default TagsPage;
