import { adminApi } from "@/lib/admin.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RoleForm } from "./RoleForm";
import toast from "react-hot-toast";

const RolePermissionDetails = ({ roleId, onClose }) => {
    const queryClient = useQueryClient();
    const { data, isLoading, error } = useQuery({
        queryKey: ["role", roleId],
        queryFn: () => adminApi.findOneRole(roleId),
    });

    const { mutate, isPending } = useMutation({
        mutationFn: ({ id, permissions, name, iconKey, labelColor }) => {
            return adminApi.updateOneRole(id, permissions, name, iconKey, labelColor);
        },
        onSuccess: () => {
            onClose();
            queryClient.invalidateQueries("all-roles");
            toast.success("Uprawnienia dla wybranej roli zostały zaktualizowane");
        },
        onError: (error) => {
            if (error?.status === 409) {
                onClose();
                toast.error("Rola o wskazanej nazwie już istnieje");
            } else {
                onClose();
                toast.error("Wystapił błąd");
            }
        },
    });

    const onSave = (formData) => {
        const { id, name, permissions, iconKey, labelColor } = formData;
        console.log(formData);
        mutate({ id, permissions, name, iconKey, labelColor });
    };

    if (isLoading) return <div className="p-4">Ładowanie uprawnień…</div>;
    if (error) return <div className="p-4 text-red-600">Błąd!</div>;

    const roleObj = Array.isArray(data) ? data[0] : data;

    console.log(roleObj, "ROLEOBJC");
    if (!roleObj) return <div className="p-4">Brak danych o roli.</div>;

    return <RoleForm role={roleObj} isLoading={isPending} onSave={onSave} />;
};

export default RolePermissionDetails;
