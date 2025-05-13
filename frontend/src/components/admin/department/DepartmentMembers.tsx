import EmptyState from "@/components/EmptyState";
import { useModal } from "@/components/modal/hooks/useModal";
import { Modal } from "@/components/modal/Modal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, FolderPlus, Plus } from "lucide-react";
import { useState } from "react";
import { FiX } from "react-icons/fi";
import { useAlert } from "@/components/alert/hooks/useAlert";
import { Alert } from "@/components/alert/Alert";
import toast from "react-hot-toast";
import ProductCategoryCardSkeleton from "../Product/ProductCategoryCardSkeleton";
import MemberForm from "./member/memberForm";
import { departmentMemberApi } from "@/lib/departmentMember.api";
import EditDepartmentMember from "./member/EditDepartmentMember";

const DepartmentMembers = ({ departmentId }: { departmentId?: string }) => {
    const queryClient = useQueryClient();
    const [selectedMemberId, setSelectedMemberId] = useState("");
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

    const { data: members, isLoading } = useQuery({
        queryKey: ["all-department-members", departmentId],
        queryFn: () => {
            return departmentMemberApi.find(departmentId, {});
        },
        enabled: !!departmentId,
        refetchOnWindowFocus: false,
    });

    const { mutate: createMemberMutation, isPending } = useMutation({
        mutationFn: ({ id, payload }) => {
            return departmentMemberApi.create(id, payload);
        },
        onSuccess: () => {
            toast.success("Pracownik działu został dodany");
            queryClient.invalidateQueries(["all-department-members", departmentId]);
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
        mutationFn: ({ departmentId, departmentMemberId }) => {
            return departmentMemberApi.deleteOne(departmentId, departmentMemberId);
        },
        onSuccess: () => {
            closeDeleteAlert();
            toast.success("pracownik działu został usunięty");
            queryClient.invalidateQueries(["all-department-members", departmentId]);
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
    const openEditMember = (id: string) => {
        openEditCategoryModal();
        setSelectedMemberId(id);
    };

    const onDelete = (departmentMemberId) => {
        openDeleteAlert();
        setSelectedMemberId(departmentMemberId);
    };

    const onCloseEditMemberModal = () => {
        setSelectedMemberId("");
        closeEditCategoryModal();
    };

    const onDeleteConfirm = (formData) => {
        const { departmentId, departmentMemberId } = formData;
        deleteDepartmentMemberMutation(formData);
    };

    const onSave = (formData) => {
        const { id, values } = formData;
        createMemberMutation({ id, payload: values });
    };

    const resetFilter = () => setFilterParams("");

    return (
        <div className="overflow-auto px-6 py-10 space-y-8">
            <div className="flex flex-col space-y-1.5">
                <div className="flex justify-between">
                    <h2 className="text-xl font-bold mb-4 text-primary-foreground">Pracownicy działu</h2>
                    <Button
                        onClick={openCreateCategory}
                        className=" text-xs flex gap-1.5  md:mt-0 font-medium text-primary-foreground bg-primary/80 rounded-md hover:bg-primary/90 transition group"
                    >
                        <Plus className="w-4 h-4 group-hover:bg-primary-foreground group-hover:text-primary group-hover:rounded-full group-hover:animate-spin" />{" "}
                        Dodaj pracownika
                    </Button>
                </div>

                <div className="relative w-full lg:w-[300px]">
                    <Input
                        value={name}
                        onChange={(e) => setFilterParams(e.target.value)}
                        placeholder="Wyszukaj pracownika..."
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
            ) : members?.length === 0 ? (
                name.trim() === "" ? (
                    <div>
                        <EmptyState
                            icon={<FolderPlus className="w-10 h-10 text-muted" />}
                            title="Brak pracowników"
                            description="Wygląda na to, że dla tego działu nie dodano jeszcze żadnych pracowników"
                            onReset={openCreateCategory}
                            resetLabel={
                                <div className="flex gap-2 items-center ">
                                    <Plus className="w-6 h-6 text-primary/90" />
                                    Dodaj pracownika
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
                    {members?.map((member) => (
                        <Card
                            key={member._id}
                            className="group transition-all duration-200 hover:shadow-md bg-card/60 border border-border rounded-xl p-5"
                        >
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-xl font-medium text-muted-foreground uppercase">
                                        {member.name?.[0]}
                                    </div>

                                    <div className="space-y-0.5">
                                        <p className="text-sm ">
                                            <span className=" text-base text-primary-foreground/80  px-0.5 py-1 rounded-md">
                                                Nr wew:{" "}
                                                <span className="text-primary/95 font-semibold">{member.phone}</span>
                                            </span>
                                        </p>
                                        <h3 className="text-base font-semibold leading-tight text-primary-foreground/70">
                                            {member.name} {member.surname}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">{member.email}</p>
                                    </div>
                                </div>

                                <div className="flex gap-2 sm:mt-0 mt-2">
                                    <Button
                                        onClick={() => openEditMember(member._id)}
                                        size="sm"
                                        variant="ghost"
                                        className="text-xs font-medium text-muted-foreground hover:text-primary"
                                    >
                                        Edytuj
                                    </Button>
                                    <Button
                                        onClick={() => onDelete(member._id)}
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
                <MemberForm onSave={onSave} departmentId={departmentId} isPending={isPending} />
            </Modal>

            <Modal isOpen={isEditCategoryModalOpen} onClose={onCloseEditMemberModal} height="md" width="sm">
                <EditDepartmentMember
                    departmentId={departmentId}
                    memberId={selectedMemberId}
                    onClose={onCloseEditMemberModal}
                />
            </Modal>
            <Alert
                requireConfirmation={true}
                isOpen={isDeleteAlertOpen}
                onCancel={closeDeleteAlert}
                onConfirm={() => onDeleteConfirm({ departmentId, departmentMemberId: selectedMemberId })}
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

export default DepartmentMembers;
