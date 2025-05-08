import { adminApi } from "@/lib/admin.api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { RoleForm } from "./RoleForm";
import toast from "react-hot-toast";

const RolePermissionDetails = ({ roleId, onClose }) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["role", roleId],
        queryFn: () => adminApi.findOneRole(roleId),
    });

    const { mutate, isPending } = useMutation({
        mutationFn: ({ id, formData }) => {
            return adminApi.updateOneRole(id, formData);
        },
        onSuccess: () => {
            onClose();
            toast.success("Uprawnienia dla wybranej roli zostały zaktualizowane");
        },
        onError: () => {
            onClose();
            toast.error("Wystapił błąd");
        },
    });

    const onSave = ({ id, formData }) => {
        mutate({ id, formData });
    };

    if (isLoading) return <div className="p-4">Ładowanie uprawnień…</div>;
    if (error) return <div className="p-4 text-red-600">Błąd!</div>;

    const roleObj = Array.isArray(data) ? data[0] : data;

    console.log(roleObj, "ROLEOBJC");
    if (!roleObj) return <div className="p-4">Brak danych o roli.</div>;

    return <RoleForm role={roleObj} isLoading={isPending} onSave={onSave} />;
};

export default RolePermissionDetails;
