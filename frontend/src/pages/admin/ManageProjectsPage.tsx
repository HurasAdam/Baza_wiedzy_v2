import { Plus } from "lucide-react";
import { FaLandmark } from "react-icons/fa";
import { useModal } from "../../components/modal/hooks/useModal";
import { Button } from "../../components/ui/button";

const ManageProjectsPage = () => {
    const { openModal } = useModal();
    return (
        <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div className="flex flex-col">
                    <h2 className="mb-6 text-xl font-bold text-foreground flex items-center gap-1">
                        <FaLandmark />
                        Szkoły projektowe
                    </h2>
                </div>

                <Button
                    onClick={openModal}
                    className="px-4 flex gap-1.5 py-2 mt-4 md:mt-0 text-sm font-medium text-white bg-primary/75 rounded-md group hover:bg-primary/80 transition"
                >
                    <Plus className="w-4 h-4 group-hover:bg-primary-foreground group-hover:text-primary group-hover:rounded-full group-hover:animate-spin" />{" "}
                    Dodaj projekt
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8"></div>

            {/* <Modal closeOnOutsideClick={false} isOpen={isOpen} onClose={closeModal} height="fit" width="xs">
                        <CreateDepartment onClose={closeModal} />
                    </Modal>
                    <Modal closeOnOutsideClick={false} isOpen={isEditModalOpen} onClose={closeEditModal} height="lg" width="md">
                        <DepartmentContainer onClose={closeEditModal} department={selectedDepartment} />
                    </Modal> */}
        </div>
    );
};

export default ManageProjectsPage;
