import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { FaLandmark } from "react-icons/fa";
import CreateProject from "../../components/admin/project/CreateProject";
import ProjectContainer from "../../components/admin/project/ProjectContainer";
import { useModal } from "../../components/modal/hooks/useModal";
import { Modal } from "../../components/modal/Modal";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { projectApi } from "../../lib/project.api";

const ManageProjectsPage = () => {
    const { openModal, isOpen, closeModal } = useModal();
    const { openModal: openEditModal, isOpen: isEditModalOpen, closeModal: closeEditModal } = useModal();
    const [selectedProject, setSelectedProject] = useState<string>(null);
    const { data: projects, isLoading } = useQuery({
        queryKey: ["all-projects"],
        queryFn: () => {
            return projectApi.find({});
        },
        refetchOnWindowFocus: false,
    });

    const editProjectHandler = (project) => {
        setSelectedProject(project);
        openEditModal();
    };

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

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {projects?.map((project) => {
                    // 1) dynamiczny dobór ikony

                    return (
                        <Card
                            key={project._id}
                            onClick={() => editProjectHandler(project)}
                            className="cursor-pointer rounded-2xl shadow-md hover:shadow-2xl transform transition-all hover:border-primary duration-300"
                        >
                            <CardHeader className="border-b">
                                <div className="flex items-center space-x-3">
                                    <div className={` p-3 rounded-lg flex items-center justify-center`}>
                                        {/* <IconButton className={`w-6 h-6 text-${textClass}`} /> */}
                                    </div>
                                    <h2 className="text-lg font-semibold">{project?.name}</h2>
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
                <CreateProject onClose={closeModal} />
            </Modal>
            <Modal closeOnOutsideClick={false} isOpen={isEditModalOpen} onClose={closeEditModal} height="lg" width="lg">
                <ProjectContainer onClose={closeEditModal} project={selectedProject} />
            </Modal>
        </div>
    );
};

export default ManageProjectsPage;
