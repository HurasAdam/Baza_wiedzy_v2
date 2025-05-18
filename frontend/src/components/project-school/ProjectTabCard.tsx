import { Folder, FolderOpen } from "lucide-react";
import { cn } from "../../utils/cn";

export interface IProject {
    _id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

interface Props {
    name: IProject["name"];
    isActive: boolean;
    onClick: () => void;
}

const ProjectTabCard = ({ name, isActive, onClick }: Props) => {
    // Update indicator position on active change

    return (
        <div className="relative inline-block">
            <button
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
                onClick={onClick}
                className={cn(
                    "flex items-center px-4 py-2 text-sm font-medium transition-transform rounded-t-md focus:outline-none",
                    isActive ? "text-primary" : "text-muted-foreground  hover:text-foreground"
                )}
            >
                {/* Icon changes based on active state */}
                {isActive ? (
                    <FolderOpen className="mr-2 h-4 w-4 text-primary" />
                ) : (
                    <Folder className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                )}
                {name}
            </button>
        </div>
    );
};

export default ProjectTabCard;
