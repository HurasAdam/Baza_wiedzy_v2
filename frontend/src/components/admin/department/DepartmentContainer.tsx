import * as Tabs from "@radix-ui/react-tabs";
import { FileText } from "lucide-react";
import { BsPeopleFill } from "react-icons/bs";
import DepartmentMembers from "./DepartmentMembers";
import DepartmentDetails from "./DepartmentDetails";

interface DepartmentContainerProps {
    department: { _id: string; name?: string };
    onClose: () => void;
}

export default function DepartmentContainer({ department, onClose }: DepartmentContainerProps) {
    const departmentId = department._id;

    return (
        <div className="flex flex-col h-full rounded-lg overflow-hidden bg-background">
            {/* HEADER */}
            <header className="flex items-center justify-between px-6 py-4 border-b">
                <h2 className="text-base font-semibold">
                    Edycja działu
                    {department.name && <span className="ml-2 text-primary-600 text-sm">({department.name})</span>}
                </h2>
            </header>

            <Tabs.Root defaultValue="details" className="flex flex-1 overflow-hidden">
                {/* TABS LIST */}
                <Tabs.List
                    className="flex flex-col w-1/5 border-r border-border px-0.5 py-6"
                    aria-label="Panel wyboru zakładek"
                >
                    <Tabs.Trigger
                        value="details"
                        className="flex items-center gap-2 px-4 py-3 text-sm text-primary-foreground/50 hover:bg-muted/80  data-[state=active]:border-l-4 data-[state=active]:border-primary data-[state=active]:text-primary-foreground "
                    >
                        <FileText className="w-5 h-5" />
                        Dane działu
                    </Tabs.Trigger>

                    <Tabs.Trigger
                        value="members"
                        className="flex items-center gap-2 px-4 py-3 text-sm text-primary-foreground/50 hover:bg-muted/80  data-[state=active]:border-l-4 data-[state=active]:border-primary data-[state=active]:text-primary-foreground "
                    >
                        <BsPeopleFill className="w-5 h-5" />
                        Pracownicy
                    </Tabs.Trigger>
                </Tabs.List>

                {/* TABS PANELS */}
                <Tabs.Content value="details" className="flex-1 p-0 overflow-auto scrollbar-custom border-none">
                    <DepartmentDetails onClose={onClose} departmentId={departmentId} />
                </Tabs.Content>
                <Tabs.Content value="members" className="flex-1 p-0 overflow-auto scrollbar-custom border-none">
                    <DepartmentMembers departmentId={departmentId} />
                </Tabs.Content>
            </Tabs.Root>
        </div>
    );
}
