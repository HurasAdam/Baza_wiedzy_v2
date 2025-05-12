import { FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import EditDepartment from "./EditDepartment";
import { MdGroups } from "react-icons/md";
import { LuNetwork } from "react-icons/lu";
import DepartmentMembers from "./DepartmentMembers";
import { BsPeopleFill } from "react-icons/bs";

interface DepartmentContainerProps {
    department: {};
    onClose: () => void;
}

const DepartmentContainer: React.FC<DepartmentContainerProps> = ({ department, onClose }) => {
    const [activeTab, setActiveTab] = useState<"details" | "members">("details");
    const departmentId = department?._id;
    // jeżeli masz dane produktu (żeby pokazać nazwę w nagłówku)

    const menuItems = [
        { key: "details", label: "Dane działu", icon: FileText },
        { key: "members", label: "Pracownicy", icon: BsPeopleFill },
    ];

    return (
        <div className="flex flex-col h-full rounded-lg overflow-hidden bg-background">
            {/* NAGŁÓWEK */}
            <div className="flex items-center justify-between px-6 py-4  border-b">
                <div className="flex items-center gap-3">
                    <LuNetwork className="w-6 h-6 text-primary-600" />
                    <h2 className="text-base font-semibold">
                        Edycja działu
                        {department?.name && <span className="ml-2 text-primary-600 text-sm">({department.name})</span>}
                    </h2>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* MENU */}
                <aside className="w-1/5  border-r">
                    <nav className="flex flex-col mt-6">
                        {menuItems.map(({ key, label, icon: Icon }) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key as any)}
                                className={`flex items-center text-sm gap-2 w-full text-left px-4 py-3 transition 
                  ${
                      activeTab === key
                          ? " text-primary-foreground border-l-4 border-primary font-medium shadow-sm "
                          : "text-primary-foreground/50 hover:bg-muted/80 rounded-lg"
                  }
                `}
                            >
                                <Icon className="w-5 h-5 shrink-0" />
                                {label}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* TREŚĆ */}
                <main className="flex-1 scrollbar-custom max-h-full h-fit overflow-auto ">
                    <Card className="max-h-full h-fitw-full rounded-none border-none bg-background/30 p-0">
                        <div className="h-full w-full">
                            {activeTab === "details" ? (
                                <EditDepartment onClose={onClose} departmentId={departmentId} />
                            ) : (
                                <DepartmentMembers departmentId={departmentId} />
                            )}
                        </div>
                    </Card>
                </main>
            </div>
        </div>
    );
};

export default DepartmentContainer;
