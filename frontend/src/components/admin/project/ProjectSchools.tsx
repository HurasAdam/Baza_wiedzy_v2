import { Alert } from "@/components/alert/Alert";
import { useAlert } from "@/components/alert/hooks/useAlert";
import EmptyState from "@/components/EmptyState";
import { useModal } from "@/components/modal/hooks/useModal";
import { Modal } from "@/components/modal/Modal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, FolderPlus, Mail, MapPin, Phone, Plus } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaCaretRight } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { projectSchoolApi } from "../../../lib/project-school.api";
import ProductCategoryCardSkeleton from "../Product/ProductCategoryCardSkeleton";
import EditProjectSchool from "./school/EditProjectSchool";
import SchoolForm from "./school/SchoolForm";

const ProjectSchools = ({ projectId }: { projectId?: string }) => {
    const queryClient = useQueryClient();
    const [selectedSchoolId, setSelectedSchoolId] = useState("");
    const [name, setFilterParams] = useState("");
    const {
        openModal: openCreateCategoryModal,
        isOpen: isCreateCategoryModalOpen,
        closeModal: closeCreateCategoryModal,
    } = useModal();

    const {
        openModal: openEditCategoryModal,
        isOpen: isEditCategoryModalOpen,
        closeModal: closeEditCategoryModal,
    } = useModal();

    const { isOpen: isDeleteAlertOpen, closeAlert: closeDeleteAlert, openAlert: openDeleteAlert } = useAlert();

    const { data: schools, isLoading } = useQuery({
        queryKey: ["all-project-schools", projectId, name],
        queryFn: () => {
            return projectSchoolApi.find(projectId, { name });
        },
        enabled: !!projectId,
        refetchOnWindowFocus: false,
    });

    const { mutate: createSchoolMutation, isPending } = useMutation({
        mutationFn: ({ id, payload }) => {
            return projectSchoolApi.create(id, payload);
        },
        onSuccess: () => {
            toast.success("Szkoła została dodana");
            queryClient.invalidateQueries(["all-project-schools", projectId]);
            closeCreateCategoryModal();
        },
        onError: ({ status }) => {
            if (status === 409) {
                return toast.error(
                    "Wystapił błąd, pracownik o wskazanym adresie email już istnieje - adres e-mail musi być unikalny"
                );
            }
        },
    });

    const { mutate: deleteDepartmentMemberMutation } = useMutation({
        mutationFn: ({ projectId, schoolId }) => {
            return projectSchoolApi.deleteOne(projectId, schoolId);
        },
        onSuccess: () => {
            closeDeleteAlert();
            toast.success("szkoła została usunięta");
            queryClient.invalidateQueries(["all-project-schools", projectId]);
        },
        onError: ({ status }) => {
            if (status === 409) {
                toast.error(
                    "Nie można usunąć tej kategorii, ponieważ jest używana przez jeden lub więcej artykułów. Najpierw zaktualizuj lub usuń te artykuły."
                );
                closeDeleteAlert();
            }
        },
    });

    const openCreateCategory = () => {
        openCreateCategoryModal();
    };
    const openEditSchool = (id: string) => {
        openEditCategoryModal();
        setSelectedSchoolId(id);
    };

    const onDelete = (schoolId) => {
        openDeleteAlert();
        setSelectedSchoolId(schoolId);
    };

    const onCloseEditMemberModal = () => {
        setSelectedSchoolId("");
        closeEditCategoryModal();
    };

    const onDeleteConfirm = (formData) => {
        const { departmentId, departmentMemberId } = formData;
        deleteDepartmentMemberMutation(formData);
    };

    const onSave = (formData) => {
        const { id, values } = formData;
        createSchoolMutation({ id, payload: values });
    };

    const resetFilter = () => setFilterParams("");

    return (
        <div className="overflow-auto px-6 py-10 space-y-8">
            <div className="flex flex-col space-y-1.5">
                <div className="flex justify-between">
                    <h2 className="text-xl font-bold mb-4 text-primary-foreground">Lista szkół projektowych</h2>
                    <Button
                        onClick={openCreateCategory}
                        className=" text-xs flex gap-1.5  md:mt-0 font-medium text-primary-foreground bg-primary/80 rounded-md hover:bg-primary/90 transition group"
                    >
                        <Plus className="w-4 h-4 group-hover:bg-primary-foreground group-hover:text-primary group-hover:rounded-full group-hover:animate-spin" />{" "}
                        Dodaj szkołe
                    </Button>
                </div>

                <div className="relative w-full lg:w-[300px]">
                    <Input
                        disabled={schools?.length === 0}
                        value={name}
                        onChange={(e) => setFilterParams(e.target.value)}
                        placeholder="Wyszukaj według nazwy..."
                        className="h-8 w-full lg:w-[250px] bg-inherit"
                    />
                    {name && (
                        <button
                            aria-label="Wyczyść wyszukiwanie"
                            onClick={resetFilter}
                            className="absolute inset-y-1 right-14 flex items-center justify-center w-6 h-6 bg-muted/50 hover:bg-muted rounded-full transition"
                        >
                            <FiX className="w-4 h-4 text-muted-foreground" />
                        </button>
                    )}
                </div>
            </div>
            {isLoading ? (
                <div className="grid grid-cols-1 gap-4">
                    {/* Wyświetlanie szkieletów podczas ładowania */}
                    {Array.from({ length: 5 }).map((_, idx) => (
                        <ProductCategoryCardSkeleton key={idx} />
                    ))}
                </div>
            ) : schools?.length === 0 ? (
                name.trim() === "" ? (
                    <div>
                        <EmptyState
                            icon={<FolderPlus className="w-10 h-10 text-muted" />}
                            title="Brak szkół do wyświetlenia"
                            description="Wygląda na to, że do tego projektu nie dodano jeszcze żadnych szkół"
                            onReset={openCreateCategory}
                            resetLabel={
                                <div className="flex gap-2 items-center ">
                                    <Plus className="w-6 h-6 text-primary/90" />
                                    Dodaj szkołę
                                </div>
                            }
                        />
                    </div>
                ) : (
                    <div>
                        <EmptyState onReset={resetFilter} />
                    </div>
                )
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {schools?.map((school) => (
                        <Card
                            key={school._id}
                            className="group transition-all duration-200 hover:shadow-md bg-card/60 border border-border rounded-xl p-5"
                        >
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                                {/* Main details: SzID with icon */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <FaCaretRight className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm font-semibold text-primary/75">
                                            SzID: {school.szId}
                                        </span>
                                    </div>
                                    <h3 className="mt-1 text-base font-semibold leading-tight text-primary-foreground/70">
                                        {school.name}
                                    </h3>
                                    <div className="mt-2 space-y-1">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-sm text-muted-foreground truncate">
                                                {school.adres}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-sm text-muted-foreground truncate">
                                                {school.phone}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-sm text-muted-foreground truncate">
                                                {school.email}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 sm:mt-0 mt-2">
                                    <Button
                                        onClick={() => openEditSchool(school._id)}
                                        size="sm"
                                        variant="ghost"
                                        className="text-xs font-medium text-muted-foreground hover:text-primary"
                                    >
                                        Edytuj
                                    </Button>
                                    <Button
                                        onClick={() => onDelete(school._id)}
                                        size="sm"
                                        variant="ghost"
                                        className="text-xs font-medium text-destructive hover:bg-destructive/10"
                                    >
                                        Usuń
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
            {/* <Modal isOpen={isCreateCategoryModalOpen} onClose={closeCreateCategoryModal} height="lg" width="md">
                <MultiUserForm />
            </Modal> */}

            {/*  */}
            <Modal isOpen={isCreateCategoryModalOpen} onClose={closeCreateCategoryModal} height="md" width="sm">
                <SchoolForm onSave={onSave} projectId={projectId} isPending={isPending} />
            </Modal>

            {projectId && (
                <Modal isOpen={isEditCategoryModalOpen} onClose={onCloseEditMemberModal} height="md" width="sm">
                    <EditProjectSchool
                        projectId={projectId}
                        schoolId={selectedSchoolId}
                        onClose={onCloseEditMemberModal}
                    />
                </Modal>
            )}
            <Alert
                requireConfirmation={true}
                isOpen={isDeleteAlertOpen}
                onCancel={closeDeleteAlert}
                onConfirm={() => onDeleteConfirm({ projectId, schoolId: selectedSchoolId })}
            >
                <div className="flex items-center  space-x-3">
                    <AlertTriangle className="w-5 h-5 mt-1 text-rose-600" />
                    <p className="text-sm text-primary-foreground dark:text-gray-200">
                        Czy na pewno chcesz <span className="font-semibold text-rose-600">Usunąć</span> wybraną
                        kategorie&nbsp; ?
                    </p>
                </div>
            </Alert>
        </div>
    );
};

export default ProjectSchools;
