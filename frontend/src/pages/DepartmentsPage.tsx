import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FaAddressBook } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import { departmentApi } from "../lib/departmentApi";
import { departmentMemberApi } from "../lib/departmentMember.api";
import { cn } from "../utils/cn";

export default function DepartmentsPage() {
    const navigate = useNavigate();
    const [selectedDept, setSelectedDept] = useState<string | null>(null);

    const { data: departments = [], isLoading } = useQuery({
        queryKey: ["all-departments"],
        queryFn: () => departmentApi.find({}),
        refetchOnWindowFocus: false,
    });

    const { data: members } = useQuery({
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

    if (isLoading) {
        return <div className="text-muted-foreground">Pobieranie działów...</div>;
    }

    return (
        <div className="flex w-full max-w-[1540px] mx-auto p-5 min-h-[calc(100vh-190px)]">
            <div className="w-full">
                <h1 className="text-xl font-semibold mb-6 text-foreground flex items-center gap-1.5">
                    <FaAddressBook className="w-6 h-6" /> Działy i kontakty
                </h1>

                <div className="flex flex-wrap gap-2 border-b mb-8">
                    {departments.map((dept) => {
                        const isActive = selectedDept === dept._id;
                        return (
                            <button
                                key={dept._id}
                                onClick={() => setSelectedDept(dept._id)}
                                className={cn(
                                    "px-4 py-2 text-sm font-medium rounded-t-md border-b-2 transition-colors",
                                    isActive
                                        ? "border-primary text-primary"
                                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                                )}
                            >
                                {dept.name}
                            </button>
                        );
                    })}
                </div>
                {/* Lista pracowników */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {members?.map((member) => (
                        <div key={member._id} className="border rounded-xl p-4 shadow-sm bg-card text-card-foreground">
                            <h2 className="font-semibold text-lg">
                                {member.name} {member.surname}
                            </h2>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                            <p className="text-sm text-muted-foreground">Telefon: {member.phone}</p>
                        </div>
                    ))}

                    {!members?.length && (
                        // <p className="text-muted-foreground col-span-full">
                        //     Brak pracowników. Wygląda na to że dla tego działu nie dodano jeszcze żadnych pracowników
                        // </p>
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
