import RolePermissionDetails from "@/components/admin/Role-permissions/RolePermissionDetails";
import { useModal } from "@/components/modal/hooks/useModal";
import { Modal } from "@/components/modal/Modal";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { adminApi } from "@/lib/admin.api";
import { useQuery } from "@tanstack/react-query";
import { Crown, Plus, Users } from "lucide-react";
import React, { useState } from "react";
import { FaEye, FaLockOpen, FaUser, FaUserTie } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { LuKeyRound } from "react-icons/lu";

const RolesAndPermissionsPage = () => {
    const ROLE_CONFIG: Record<string, { icon: React.ReactNode; bg: string; text: string }> = {
        ADMIN: { icon: <Crown />, bg: "bg-orange-100", text: "text-orange-600" },
        LEADER: { icon: <FaUserTie />, bg: "bg-green-100", text: "text-green-600" },
        MEMBER: { icon: <FaUser />, bg: "bg-blue-100", text: "text-blue-600" },
        GUEST: { icon: <FaEye />, bg: "bg-gray-100", text: "text-gray-600" },
    };

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
    const [selectedRole, setSelctedRole] = useState("");

    const showRoleDetails = (id) => {
        setSelctedRole(id);
        openModal();
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

                <Button className="px-4 flex gap-1.5 py-2 mt-4 md:mt-0 text-sm font-medium text-white bg-primary/75 rounded-md group hover:bg-primary/80 transition">
                    <Plus className="w-4 h-4 group-hover:bg-primary-foreground group-hover:text-primary group-hover:rounded-full group-hover:animate-spin" />{" "}
                    Dodaj role
                </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {roles?.map((role) => {
                    const config = ROLE_CONFIG[role.name] || {
                        icon: <Users />,
                        bg: "bg-indigo-100",
                        text: "text-indigo-600",
                    };
                    return (
                        <Card
                            onClick={() => showRoleDetails(role?._id)}
                            key={role._id}
                            className="cursor-pointer rounded-2xl shadow-md hover:shadow-2xl transform  transition-all hover:border-primary duration-300"
                        >
                            <CardHeader className="border-b">
                                <div className="flex items-center space-x-3">
                                    <div className={`${config.bg} p-3 rounded-lg flex items-center justify-center`}>
                                        {React.cloneElement(config.icon as React.ReactElement, {
                                            className: `w-6 h-6 ${config.text}`,
                                        })}
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
        </div>
    );
};

export default RolesAndPermissionsPage;
