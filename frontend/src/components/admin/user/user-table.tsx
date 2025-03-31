import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import useGetProjectsInWorkspaceQuery from "@/hooks/api/use-get-projects";
// import useGetWorkspaceMembers from "@/hooks/api/use-get-workspace-members";
import useTaskTableFilter from "@/hooks/use-task-table-filter";

import { userApi } from "@/lib/user.api";

import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { FC, useState } from "react";
import { useParams } from "react-router-dom";

import { TaskType } from "../../../types/api.types";
import { getAvatarColor, getAvatarFallbackText } from "../../../utils/avatar";
import { getColumns } from "./table/Columns";
import { accountStatuses, roles } from "./table/Data";
import { DataTable } from "./table/table";
import { DataTableFacetedFilter } from "./table/table-faceted-filter";

type Filters = ReturnType<typeof useTaskTableFilter>[0];
type SetFilters = ReturnType<typeof useTaskTableFilter>[1];

interface DataTableFilterToolbarProps {
    isLoading?: boolean;
    projectId?: string;
    filters: Filters;
    setFilters: SetFilters;
}

const UserTable = () => {
    const param = useParams();
    const projectId = param.projectId as string;

    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [filters, setFilters] = useTaskTableFilter();

    const columns = getColumns(projectId);

    const { data, isLoading } = useQuery({
        queryKey: ["all-users", filters, pageNumber],
        queryFn: () => userApi.findAll(),
        staleTime: 0,
    });

    const users: TaskType[] = data || [];

    const handlePageChange = (page: number) => {
        setPageNumber(page);
    };

    // Handle page size changes
    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
    };

    return (
        <div className="w-full relative">
            <DataTable
                isLoading={isLoading}
                data={users}
                columns={columns}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                pagination={{
                    totalCount: 100,
                    pageNumber,
                    pageSize,
                }}
                filtersToolbar={
                    <DataTableFilterToolbar
                        isLoading={isLoading}
                        projectId={projectId}
                        filters={filters}
                        setFilters={setFilters}
                    />
                }
            />
        </div>
    );
};

const DataTableFilterToolbar: FC<DataTableFilterToolbarProps> = ({ isLoading, projectId, filters, setFilters }) => {
    const data = [];
    const memberData = [];

    const projects = data?.projects || [];
    const members = memberData?.members || [];

    //Workspace Projects
    const projectOptions = projects?.map((project) => {
        return {
            label: (
                <div className="flex items-center gap-1">
                    <span>{project.emoji}</span>
                    <span>{project.name}</span>
                </div>
            ),
            value: project._id,
        };
    });

    // Workspace Memebers
    const assigneesOptions = members?.map((member) => {
        const name = member.userId?.name || "Unknown";
        const initials = getAvatarFallbackText(name);
        const avatarColor = getAvatarColor(name);

        return {
            label: (
                <div className="flex items-center space-x-2">
                    <Avatar className="h-7 w-7">
                        <AvatarImage src={member.userId?.profilePicture || ""} alt={name} />
                        <AvatarFallback className={avatarColor}>{initials}</AvatarFallback>
                    </Avatar>
                    <span>{name}</span>
                </div>
            ),
            value: member.userId._id,
        };
    });

    const handleFilterChange = (key: keyof Filters, values: string[]) => {
        setFilters({
            ...filters,
            [key]: values.length > 0 ? values.join(",") : null,
        });
    };

    return (
        <div className="flex  flex-col lg:flex-row w-full items-start space-y-2 mb-2 lg:mb-0 lg:space-x-2  lg:space-y-0">
            <Input
                placeholder="Wyszukaj użytkownika..."
                value={filters.keyword || ""}
                onChange={(e) =>
                    setFilters({
                        keyword: e.target.value,
                    })
                }
                className="h-8 w-full lg:w-[250px] bg-inherit border-border  "
            />
            {/* Status filter */}
            <DataTableFacetedFilter
                title="Role"
                multiSelect={false}
                options={roles}
                disabled={isLoading}
                selectedValues={filters.status?.split(",") || []}
                onFilterChange={(values) => handleFilterChange("status", values)}
            />

            {/* Account status filter*/}
            <DataTableFacetedFilter
                title="Status"
                multiSelect={false}
                options={accountStatuses}
                disabled={isLoading}
                selectedValues={filters.priority?.split(",") || []}
                onFilterChange={(values) => handleFilterChange("priority", values)}
            />

            {/* Assigned To filter */}
            {/* <DataTableFacetedFilter
                title="Assigned To"
                multiSelect={true}
                options={assigneesOptions}
                disabled={isLoading}
                selectedValues={filters.assigneeId?.split(",") || []}
                onFilterChange={(values) => handleFilterChange("assigneeId", values)}
            /> */}

            {/* {!projectId && (
                <DataTableFacetedFilter
                    title="Projects"
                    multiSelect={false}
                    options={projectOptions}
                    disabled={isLoading}
                    selectedValues={filters.projectId?.split(",") || []}
                    onFilterChange={(values) => handleFilterChange("projectId", values)}
                />
            )} */}

            {Object.values(filters).some((value) => value !== null && value !== "") && (
                <Button
                    disabled={isLoading}
                    variant="ghost"
                    className="h-8 px-2 lg:px-3"
                    onClick={() =>
                        setFilters({
                            keyword: null,
                            status: null,
                            priority: null,
                            projectId: null,
                            assigneeId: null,
                        })
                    }
                >
                    Reset
                    <X />
                </Button>
            )}
        </div>
    );
};

export default UserTable;
