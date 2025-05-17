import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { projectApi } from "../../../lib/project.api";
import ProjectForm from "./ProjectForm";

interface Props {
    onClose: () => void;
}

const CreateProject = ({ onClose }: Props) => {
    const queryClient = useQueryClient();

    const { mutate: createMutation, isPending: isCreatePending } = useMutation({
        mutationFn: (formData) => {
            return projectApi.create(formData);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(["all-projects"]);
            toast.success("Projekt został pomyślnie dodany.");
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

    return <ProjectForm onSave={onSave} />;
};

export default CreateProject;
