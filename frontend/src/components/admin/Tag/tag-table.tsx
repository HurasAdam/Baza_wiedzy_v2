import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { FC, useState } from "react";
import { useParams } from "react-router-dom";
import useTaskTableFilter from "../../../hooks/use-task-table-filter";
import { productApi } from "@/lib/product.api";
import { tagApi } from "@/lib/tag.api";
import { TaskType } from "../../../types/api.types";
import { getAvatarColor, getAvatarFallbackText } from "../../../utils/avatar";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { getColumns } from "./table/Columns";
import { DataTable } from "./table/table";

type Filters = ReturnType<typeof useTaskTableFilter>[0];
type SetFilters = ReturnType<typeof useTaskTableFilter>[1];

interface DataTableFilterToolbarProps {
    isLoading?: boolean;
    projectId?: string;
    filters: Filters;
    setFilters: SetFilters;
}

const TagTable = () => {
    const param = useParams();
    const projectId = param.projectId as string;

    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [filters, setFilters] = useTaskTableFilter();

    const columns = getColumns(projectId);

    const { data, isLoading } = useQuery({
        queryKey: ["all-tags", filters, pageNumber],
        queryFn: () => {
            return tagApi.findAll(filters);
        },

        staleTime: 0,
    });

    const tags: TaskType[] = data?.tags || [];

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
                setFilters={setFilters}
                isLoading={isLoading}
                data={tags}
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

    const { data: allProducts = [] } = useQuery({
        queryKey: ["all-products"],
        queryFn: () => {
            return productApi.find();
        },
    });
    const products =
        (allProducts &&
            allProducts?.map((product) => {
                return { label: product.name, value: product._id };
            })) ||
        [];

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
                placeholder="Wyszukaj tag..."
                value={filters.name || ""}
                onChange={(e) =>
                    setFilters({
                        name: e.target.value,
                    })
                }
                className="h-8 w-full lg:w-[250px] bg-inherit  "
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
                            name: null,
                            keyword: null,
                            isActive: null,
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

export default TagTable;
