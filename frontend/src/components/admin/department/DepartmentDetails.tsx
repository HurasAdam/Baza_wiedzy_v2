import DepartmentForm from "@/components/forms/DepartmentForm";
import { departmentApi } from "@/lib/departmentApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface Props {
    onClose: () => void;
    departmentId: string;
}

const DepartmentDetails = ({ onClose, departmentId }: Props) => {
    const queryClient = useQueryClient();

    const { data: department } = useQuery({
        queryKey: ["department", departmentId],
        queryFn: () => (departmentId ? departmentApi.findOne(departmentId) : Promise.resolve(null)),
        enabled: !!departmentId,
    });

    const { mutate: updateMutation, isPending } = useMutation({
        mutationFn: ({ id, formData }) => {
            return departmentApi.updateOne(id, formData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["department", departmentId]);

            toast.success("Dział został zaktualizowany pomyślnie.");
            onClose();
        },
        onError: (error) => {
            console.log(error);
            if (error?.status === 409) {
                // Jeśli kod błędu to 409, ustaw błąd w polu "name"

                toast.error("Dział o podanej nazwie już istnieje  (nazwa działu musi być unikalna");
            } else {
                // Obsługa innych błędów

                toast.error("Wystąpił błąd podczas edycji działu. Spróbuj ponownie.");
            }
        },
    });

    const onSave = (formData) => {
        const { id, values } = formData;
        console.log(formData);
        updateMutation(formData);
    };

    if (!department) {
        return <div>LOADING...</div>;
    }

    return <DepartmentForm onSave={onSave} isPending={isPending} department={department} />;
};

export default DepartmentDetails;
