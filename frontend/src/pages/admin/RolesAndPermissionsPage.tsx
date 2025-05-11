import RolePermissionDetails from "@/components/admin/Role-permissions/RolePermissionDetails";
import { useModal } from "@/components/modal/hooks/useModal";
import { Modal } from "@/components/modal/Modal";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { adminApi } from "@/lib/admin.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LuKeyRound } from "react-icons/lu";
import { RoleForm } from "@/components/admin/Role-permissions/RoleForm";
import { ICON_MAP } from "@/constants/roleIcons";
import toast from "react-hot-toast";

const RolesAndPermissionsPage = () => {
    const queryClient = useQueryClient();

    const ROLE_LABELS: Record<string, string> = {
        ADMIN: "Admin",
        LEADER: "Lider techniczny",
        MEMBER: "Specjalista",
        GUEST: "Gość",
    };

    const params = { withPermissions: false };

    const { data: roles, isLoading } = useQuery({
        queryKey: ["all-roles"],
        queryFn: () => {
            return adminApi.getRoles(params);
        },
    });

    const { isOpen, closeModal, openModal } = useModal();
    const { isOpen: isAddRoleModalOpen, closeModal: closeAddRoleModal, openModal: openAddRoleModal } = useModal();
    const [selectedRole, setSelctedRole] = useState("");

    const showRoleDetails = (id) => {
        setSelctedRole(id);
        openModal();
    };

    const { mutate: createRoleMutation, isPending } = useMutation({
        mutationFn: ({ permissions, name, iconKey, labelColor }) => {
            return adminApi.createRole(permissions, name, iconKey, labelColor);
        },
        onSuccess: () => {
            closeAddRoleModal();
            queryClient.invalidateQueries("all-roles");
            toast.success("Uprawnienia dla wybranej roli zostały zaktualizowane");
        },
        onError: (error) => {
            if (error?.status === 409) {
                closeAddRoleModal();
                toast.error("Rola o wskazanej nazwie już istnieje");
            } else {
                closeAddRoleModal();
                toast.error("Wystapił błąd");
            }
        },
    });

    const onSave = (formData) => {
        const { name, permissions, iconKey, labelColor } = formData;
        console.log(formData);
        createRoleMutation({ name, iconKey, permissions, labelColor });
    };

    return (
        <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div className="flex flex-col">
                    <h2 className="mb-6 text-2xl font-bold text-foreground flex items-center gap-1">
                        <LuKeyRound />
                        Zarządzanie uprawnieniami
                    </h2>
                </div>

                <Button
                    onClick={openAddRoleModal}
                    className="px-4 flex gap-1.5 py-2 mt-4 md:mt-0 text-sm font-medium text-white bg-primary/75 rounded-md group hover:bg-primary/80 transition"
                >
                    <Plus className="w-4 h-4 group-hover:bg-primary-foreground group-hover:text-primary group-hover:rounded-full group-hover:animate-spin" />{" "}
                    Dodaj role
                </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {roles?.map((role) => {
                    // 1) dynamiczny dobór ikony
                    const IconButton = ICON_MAP[role.iconKey];

                    // 2) dynamiczne klasy Tailwind wg labelColor
                    const bgClass = `bg-${role.labelColor}-100`;
                    const textClass = `${role.labelColor}-600`;

                    return (
                        <Card
                            key={role._id}
                            onClick={() => showRoleDetails(role._id)}
                            className="cursor-pointer rounded-2xl shadow-md hover:shadow-2xl transform transition-all hover:border-primary duration-300"
                        >
                            <CardHeader className="border-b">
                                <div className="flex items-center space-x-3">
                                    <div className={`${bgClass} p-3 rounded-lg flex items-center justify-center`}>
                                        <IconButton className={`w-6 h-6 text-${textClass}`} />
                                    </div>
                                    <h2 className="text-lg font-semibold">{ROLE_LABELS[role.name] ?? role.name}</h2>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <p className="text-sm text-gray-600">Kliknij, aby zarządzać uprawnieniami tej roli.</p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
            <Modal isOpen={isOpen} onClose={closeModal}>
                <RolePermissionDetails roleId={selectedRole} onClose={closeModal} />
            </Modal>
            <Modal isOpen={isAddRoleModalOpen} onClose={closeAddRoleModal}>
                <RoleForm onSave={onSave} />
            </Modal>
        </div>
    );
};

export default RolesAndPermissionsPage;
