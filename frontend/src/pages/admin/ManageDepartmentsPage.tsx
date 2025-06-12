import CreateDepartment from "@/components/admin/department/CreateDepartment";
import DepartmentContainer from "@/components/admin/department/DepartmentContainer";
import { useModal } from "@/components/modal/hooks/useModal";
import { Modal } from "@/components/modal/Modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { departmentApi } from "@/lib/departmentApi";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { LuNetwork } from "react-icons/lu";

const ManageDepartmentsPage = () => {
    const { openModal, closeModal, isOpen } = useModal();
    const { openModal: openEditModal, isOpen: isEditModalOpen, closeModal: closeEditModal } = useModal();
    const [selectedDepartment, setSelectedDepartment] = useState<string>(null);
    const { data: departments, isLoading } = useQuery({
        queryKey: ["all-departments"],
        queryFn: () => {
            return departmentApi.find({});
        },
        refetchOnWindowFocus: false,
    });

    const editDepartmentandler = (department) => {
        setSelectedDepartment(department);
        openEditModal();
    };

    return (
        <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div className="flex flex-col">
                    <h2 className="mb-6 text-xl font-bold text-foreground flex items-center gap-1">
                        <LuNetwork />
                        Działy i kontakty
                    </h2>
                </div>

                <Button
                    onClick={openModal}
                    className="px-4 flex gap-1.5 py-2 mt-4 md:mt-0 text-sm font-medium text-secondary-foreground bg-primary/75 rounded-md group hover:bg-primary/80 transition"
                >
                    <Plus className="w-4 h-4 group-hover:bg-secondary-foreground group-hover:text-primary group-hover:rounded-full group-hover:animate-spin" />{" "}
                    Dodaj dział
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {departments?.map((department) => {
                    // 1) dynamiczny dobór ikony

                    return (
                        <Card
                            key={department._id}
                            onClick={() => editDepartmentandler(department)}
                            className="cursor-pointer rounded-2xl shadow-md hover:shadow-2xl transform transition-all hover:border-primary duration-300"
                        >
                            <CardHeader className="border-b">
                                <div className="flex items-center space-x-3">
                                    <div className={` p-3 rounded-lg flex items-center justify-center`}>
                                        {/* <IconButton className={`w-6 h-6 text-${textClass}`} /> */}
                                    </div>
                                    <h2 className="text-lg font-semibold">{department?.name}</h2>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <p className="text-sm text-gray-600">Kliknij, aby wyświetlić więcej szczegółów</p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <Modal closeOnOutsideClick={false} isOpen={isOpen} onClose={closeModal} height="fit" width="xs">
                <CreateDepartment onClose={closeModal} />
            </Modal>
            <Modal closeOnOutsideClick={false} isOpen={isEditModalOpen} onClose={closeEditModal} height="lg" width="md">
                <DepartmentContainer onClose={closeEditModal} department={selectedDepartment} />
            </Modal>
        </div>
    );
};

export default ManageDepartmentsPage;
