import { Mail, MapPin, Phone } from "lucide-react";
import toast from "react-hot-toast";
import { FaCaretRight } from "react-icons/fa";
import { GoCopy } from "react-icons/go";
import { Card } from "../ui/card";

export interface ISchool {
    _id: string;
    name: string;
    adres: string;
    email: string;
    project: string;
    szId: string;
    phone: string;
    createdAt: string;
    updatedAt: string;
}

interface Props {
    school: ISchool;
}

const copyToClipboardWithToast = (value: string, label: string = "Wartość") => {
    navigator.clipboard.writeText(value);
    toast.success(`${label} skopiowane do schowka`);
};

const ProjectSchoolCard = ({ school }: Props) => {
    return (
        <Card
            key={school._id}
            className="group transition-all duration-200 hover:shadow-md bg-card/60 border border-border rounded-xl p-5"
        >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                {/* Main details*/}
                <div className="flex-1">
                    <div className="flex justify-between">
                        <h3 className="mt-1 text-base font-semibold leading-tight text-primary-foreground/70 flex items-center gap-2">
                            <FaCaretRight className="w-4 h-4 text-muted-foreground" />
                            {school.name}
                        </h3>
                        <GoCopy
                            onClick={() => copyToClipboardWithToast(school.szId, "szkolne Id zostało")}
                            className="hover:text-primary cursor-pointer"
                        />
                    </div>

                    <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full text-muted-foreground bg-primary/75" />
                            <span className="text-sm font-semibold text-primary/75">SzID: {school.szId}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground truncate">{school.adres}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground truncate">{school.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground truncate">{school.email}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default ProjectSchoolCard;
