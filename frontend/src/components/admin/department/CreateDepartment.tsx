import DepartmentForm from "@/components/forms/DepartmentForm";
import { departmentApi } from "@/lib/departmentApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface Props {
    onClose: () => void;
}

const CreateDepartment = ({ onClose }: Props) => {
    const queryClient = useQueryClient();

    const { mutate: createMutation, isPending: isCreatePending } = useMutation({
        mutationFn: (formData) => {
            return departmentApi.create(formData);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(["departments"]);
            toast.success("Dział został pomyślnie dodany.");
            onClose();
        },
        onError: (error) => {
            if (error?.status === 409) {
                // form.setError("name", {
                //     message: "Tag o podanej nazwie już istnieje  (nazwa tagu musi być unikalna)",
                // });
            } else {
                toast.error("Wystąpił błąd. Spróbuj ponownie.");
            }
        },
    });

    const onSave = (formData) => {
        createMutation(formData);
        console.log("TWORZE");
    };

    return <DepartmentForm onSave={onSave} />;
};

export default CreateDepartment;
