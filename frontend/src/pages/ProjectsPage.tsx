import { useQuery } from "@tanstack/react-query";
import { Filter, Mail, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { FaCaretRight, FaLandmark } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { DepartmentTabsSkeleton } from "../components/department/DepartmentTabsSkeleton";
import EmptyState from "../components/EmptyState";
import ProjectSchoolCard, { ISchool } from "../components/project-school/ProjectSchoolCard";
import ProjectSchoolSkeletonCard from "../components/project-school/ProjectSchoolSkeletonCard";
import ProjectTabCard, { IProject } from "../components/project-school/ProjectTabCard";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { projectSchoolApi } from "../lib/project-school.api";
import { projectApi } from "../lib/project.api";

type FilterField = "name" | "adres" | "email";

const placeholderMap: Record<FilterField, string> = {
    name: "Wyszukaj po nazwie szkoły…",
    adres: "Wyszukaj po adresie…",
    email: "Wyszukaj po e-mailu…",
};

export default function ProjectsPage() {
    const navigate = useNavigate();
    const [selectedDept, setSelectedDept] = useState<string | null>(null);
    const [filterField, setFilterField] = useState<FilterField>("name");
    const [filterQuery, setFilterQuery] = useState("");
    const { data: projects = [], isLoading: isProjectLoading } = useQuery({
        queryKey: ["all-projects"],
        queryFn: () => projectApi.find({}),
        refetchOnWindowFocus: false,
    });

    const { data: schools = [], isLoading: isMemberListLoading } = useQuery({
        queryKey: ["all-department-members", selectedDept, filterQuery],
        queryFn: () => projectSchoolApi.find(selectedDept, { [filterField]: filterQuery }),
        enabled: !!selectedDept,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (projects.length && !selectedDept) {
            setSelectedDept(projects[0]._id);
        }
    }, [projects, selectedDept]);

    const filterOptions: { value: FilterField; label: string; icon: React.ReactNode }[] = [
        { value: "name", label: "Nazwa", icon: <FaCaretRight className="w-4 h-4 mr-2" /> },
        { value: "adres", label: "Adres", icon: <MapPin className="w-4 h-4 mr-2" /> },
        { value: "email", label: "E-mail", icon: <Mail className="w-4 h-4 mr-2" /> },
    ];

    return (
        <div className="flex w-full max-w-[1540px] mx-auto p-5 min-h-[calc(100vh-190px)]">
            <div className="w-full">
                <h1 className="text-xl font-semibold mb-6 text-foreground flex items-center gap-1.5">
                    <FaLandmark className="w-6 h-6" /> Szkoły projektowe
                </h1>

                {/* Tabs */}

                <div className="flex flex-wrap gap-2 border-b mb-8">
                    {isProjectLoading ? (
                        <DepartmentTabsSkeleton tabsCount={4} />
                    ) : (
                        projects.map((project: IProject) => {
                            const isActive = selectedDept === project._id;
                            return (
                                <ProjectTabCard
                                    key={project._id}
                                    onClick={() => setSelectedDept(project._id)}
                                    name={project.name}
                                    isActive={isActive}
                                />
                            );
                        })
                    )}
                </div>

                {/* Enterprise-style filter panel */}
                <div className="mb-8 p-4 bg-muted/50 border border-border rounded-xl shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium min-w-[100px]">
                            <Filter className="w-4 h-4" />
                            Filtruj szkoły
                        </div>
                        <Select value={filterField} onValueChange={setFilterField}>
                            <SelectTrigger className="w-36">
                                <SelectValue placeholder="Kryterium" />
                            </SelectTrigger>
                            <SelectContent className="bg-card">
                                {filterOptions.map(({ value, label, icon }) => (
                                    <SelectItem key={value} value={value} className="bg-card">
                                        <div className="flex items-center py-0.5 text-primary-foreground ">
                                            {icon}
                                            {label}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Input
                            className="flex-1 outline-none ring-0 focus:ring-0"
                            placeholder={placeholderMap[filterField]}
                            value={filterQuery}
                            onChange={(e) => setFilterQuery(e.target.value)}
                        />
                        <Button
                            variant={filterQuery || filterField !== "name" ? "default" : "outline"}
                            disabled={!filterQuery && filterField === "name"}
                            onClick={() => {
                                setFilterField("name");
                                setFilterQuery("");
                            }}
                            className="ml-2 text-secondary-foreground"
                        >
                            Resetuj
                        </Button>
                    </div>
                </div>
                {/* Members grid */}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isMemberListLoading ? (
                        <ProjectSchoolSkeletonCard itemsCount={6} />
                    ) : (
                        schools?.map((school: ISchool) => (
                            // <DepartmentMemberCard member={member} key={member._id} />
                            <ProjectSchoolCard school={school} />
                        ))
                    )}

                    {!isMemberListLoading && !schools?.length && (
                        <EmptyState
                            onReset={() => navigate("/admin/projects")}
                            resetLabel="Dodaj szkołę"
                            title="Brak szkół do wyświetlenia"
                            description="Wygląda na to że do tego proejtku nie dodano jeszcze żadnych szkół"
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
