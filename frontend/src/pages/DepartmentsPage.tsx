import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FaAddressBook } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import DepartmentMemberCard, { IDepartmentMember } from "../components/department-member/DepartmentMemberCard";
import DepartmentMembersSkeleteon from "../components/department-member/DepartmentMembersSkeleton";
import DepartmentTabCard, { IDepartment } from "../components/department/DepartmentTabCard";
import { DepartmentTabsSkeleton } from "../components/department/DepartmentTabsSkeleton";
import EmptyState from "../components/EmptyState";
import { departmentApi } from "../lib/departmentApi";
import { departmentMemberApi } from "../lib/departmentMember.api";

export default function DepartmentsPage() {
    const navigate = useNavigate();
    const [selectedDept, setSelectedDept] = useState<string | null>(null);

    const { data: departments = [], isLoading: isDeptLoading } = useQuery({
        queryKey: ["all-departments"],
        queryFn: () => departmentApi.find({}),
        refetchOnWindowFocus: false,
    });

    const { data: members = [], isLoading: isMemberListLoading } = useQuery({
        queryKey: ["all-department-members", selectedDept],
        queryFn: () => departmentMemberApi.find(selectedDept, {}),
        enabled: !!selectedDept,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (departments.length && !selectedDept) {
            setSelectedDept(departments[0]._id);
        }
    }, [departments, selectedDept]);

    return (
        <div className="flex w-full max-w-[1540px] mx-auto p-5 min-h-[calc(100vh-190px)]">
            <div className="w-full">
                <h1 className="text-xl font-semibold mb-6 text-foreground flex items-center gap-1.5">
                    <FaAddressBook className="w-6 h-6" /> Działy i kontakty
                </h1>

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 border-b mb-8">
                    {isDeptLoading ? (
                        <DepartmentTabsSkeleton tabsCount={4} />
                    ) : (
                        departments.map((department: IDepartment) => {
                            const isActive = selectedDept === department._id;
                            return (
                                <DepartmentTabCard
                                    key={department._id}
                                    onClick={() => setSelectedDept(department._id)}
                                    name={department.name}
                                    isActive={isActive}
                                />
                            );
                        })
                    )}
                </div>

                {/* Members grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isMemberListLoading ? (
                        <DepartmentMembersSkeleteon itemsCount={8} />
                    ) : (
                        members?.map((member: IDepartmentMember) => (
                            <DepartmentMemberCard member={member} key={member._id} />
                        ))
                    )}

                    {!isMemberListLoading && !members?.length && (
                        <EmptyState
                            onReset={() => navigate("/admin/departments")}
                            resetLabel="Dodaj pracowników"
                            title="Brak pracowników"
                            description="Wygląda na to że dla tego działu nie dodano jeszcze żadnych pracowników"
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
