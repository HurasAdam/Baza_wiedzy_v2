import { departmentApi } from "@/lib/departmentApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { projectApi } from "../../../lib/project.api";
import ProjectForm from "./ProjectForm";

interface Props {
    onClose: () => void;
    projectId: string;
}

const ProjectDetails = ({ onClose, projectId }: Props) => {
    const queryClient = useQueryClient();

    const { data: project } = useQuery({
        queryKey: ["department", projectId],
        queryFn: () => (projectId ? projectApi.findOne(projectId) : Promise.resolve(null)),
        enabled: !!projectId,
    });

    const { mutate: updateMutation, isPending } = useMutation({
        mutationFn: ({ id, formData }) => {
            return departmentApi.updateOne(id, formData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["project", projectId]);

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

    if (!project) {
        return <div>LOADING...</div>;
    }

    return <ProjectForm onSave={onSave} isPending={isPending} project={project} />;
};

export default ProjectDetails;
