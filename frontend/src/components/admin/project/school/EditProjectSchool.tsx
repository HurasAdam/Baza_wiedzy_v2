import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { projectSchoolApi } from "../../../../lib/project-school.api";
import SchoolForm from "./SchoolForm";

interface Props {
    projectId: string;
    schoolId: string;
    onClose: () => void;
}

const EditProjectSchool = ({ projectId, schoolId, onClose }: Props) => {
    const queryClient = useQueryClient();
    const isPending = false;

    const { data: projectSchool } = useQuery({
        queryKey: ["project-school", schoolId],
        queryFn: () => {
            return projectSchoolApi.findOne(projectId, schoolId);
        },
    });
    console.log("ID PROJEKTU TO:", projectSchool);
    const { mutate: updateDepartmentMemberMutation } = useMutation({
        mutationFn: ({ projectId, departmentMemberId, payload }) => {
            return projectSchoolApi.updateOne(projectId, departmentMemberId, payload);
        },
        onSuccess: () => {
            toast.success("Dane szkoły zostały zaktualizowane");
            onClose();
            queryClient.invalidateQueries(["project-school", schoolId]);
        },
    });

    if (!projectSchool) {
        return <div>Loading...</div>;
    }

    const onSave = (formData) => {
        updateDepartmentMemberMutation(formData);
    };

    return <SchoolForm projectId={projectId} projectSchool={projectSchool} onSave={onSave} isPending={isPending} />;
};

export default EditProjectSchool;
