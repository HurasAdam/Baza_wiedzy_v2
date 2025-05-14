import { cn } from "../../utils/cn";

export interface IDepartment {
    _id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

interface Props {
    name: IDepartment["name"];
    isActive: boolean;
    onClick: () => void;
}

const DepartmentTabCard = ({ name, isActive, onClick }: Props) => {
    return (
        <button
            onClick={onClick}
            className={cn(
                "px-4 py-2 text-sm font-medium rounded-t-md border-b-2 transition-colors",
                isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            )}
        >
            {name}
        </button>
    );
};

export default DepartmentTabCard;
