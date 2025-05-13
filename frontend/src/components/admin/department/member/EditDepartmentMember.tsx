import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import MemberForm from "./memberForm";
import { departmentMemberApi } from "@/lib/departmentMember.api";
import toast from "react-hot-toast";

interface Props {
    departmentId: string;
    memberId: string;
    onClose: () => void;
}

const EditDepartmentMember = ({ departmentId, memberId, onClose }: Props) => {
    const queryClient = useQueryClient();
    const isPending = false;

    const { data: departmentMember } = useQuery({
        queryKey: ["department-member", memberId],
        queryFn: () => {
            return departmentMemberApi.findOne(departmentId, memberId);
        },
    });

    const { mutate: updateDepartmentMemberMutation } = useMutation({
        mutationFn: ({ departmentId, departmentMemberId, payload }) => {
            return departmentMemberApi.updateOne(departmentId, departmentMemberId, payload);
        },
        onSuccess: () => {
            toast.success("Dane pracownika zostały zaktualizowane");
            onClose();
            queryClient.invalidateQueries(["department-member", memberId]);
        },
    });

    if (!departmentMember) {
        return <div>Loading...</div>;
    }

    const onSave = (formData) => {
        updateDepartmentMemberMutation(formData);
    };

    return (
        <MemberForm
            departmentId={departmentId}
            departmentMember={departmentMember}
            onSave={onSave}
            isPending={isPending}
        />
    );
};

export default EditDepartmentMember;
