import { useQuery } from "@tanstack/react-query";
import MemberForm from "./memberForm";
import { departmentMemberApi } from "@/lib/departmentMember.api";

const EditDepartmentMember = ({ departmentId, memberId }) => {
    const isPending = false;

    const { data: departmentMember } = useQuery({
        queryKey: ["department-member", memberId],
        queryFn: () => {
            return departmentMemberApi.findOne(departmentId, memberId);
        },
    });

    if (!departmentMember) {
        return <div>Loading...</div>;
    }

    return (
        <MemberForm
            departmentId={departmentId}
            departmentMember={departmentMember}
            onSave={() => {}}
            isPending={isPending}
        />
    );
};

export default EditDepartmentMember;
