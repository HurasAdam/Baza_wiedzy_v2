import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Crown, Users } from "lucide-react";
import { FaEye, FaUser, FaUserTie } from "react-icons/fa";
import { Input } from "@/components/ui/input";

interface Role {
    _id: string;
    name: string;
    permissions: string[];
}

interface SaveArgs {
    id: string;
    permissions: string[];
}

interface RoleFormSimpleProps {
    role: Role;
    isLoading: boolean;
    // eslint-disable-next-line no-unused-vars
    onSave: (args: SaveArgs) => void;
}
const ROLE_LABELS: Record<string, string> = {
    ADMIN: "Admin",
    LEADER: "Lider techniczny",
    MEMBER: "Specjalista",
    GUEST: "Gość",
};

const ROLE_CONFIG: Record<string, { icon: React.ReactNode; bg: string; text: string }> = {
    ADMIN: { icon: <Crown />, bg: "bg-orange-100", text: "text-orange-600" },
    LEADER: { icon: <FaUserTie />, bg: "bg-green-100", text: "text-green-600" },
    MEMBER: { icon: <FaUser />, bg: "bg-blue-100", text: "text-blue-600" },
    GUEST: { icon: <FaEye />, bg: "bg-gray-100", text: "text-gray-600" },
};

const PERMISSION_LABELS: Record<string, string> = {
    ADD_ARTICLE: "Dodawanie artykułów",
    EDIT_ARTICLE: "Edycja artykułów",
    VERIFY_ARTICLE: "Zatwierdzanie artykułów",
    UNVERIFY_ARTICLE: "Cofanie zatwierdzenia",
    TRASH_ARTICLE: "Przenoszenie do kosza",
    RESTORE_ARTICLE: "Przywracanie z kosza",
    DELETE_ARTICLE: "Usuwanie artykułów",
    VIEW_ARTICLE_HISTORY: "Przeglądanie historii",
    REPORT_BUG: "Zgłaszanie błędów",
    REPORT_PROPOSAL: "Zgłaszanie propozycji",
    ADD_TAG: "Dodawanie tagów",
    EDIT_TAG: "Edycja tagów",
    DELETE_TAG: "Usuwanie tagów",
    ADD_PRODUCT: "Dodawanie produktów",
    EDIT_PRODUCT: "Edycja produktów",
    DELETE_PRODUCT: "Usuwanie produktów",
    ADD_CATEGORY: "Dodawanie kategorii",
    EDIT_CATEGORY: "Edycja kategorii",
    DELETE_CATEGORY: "Usuwanie kategorii",
    ADD_TOPIC: "Dodawanie tematów",
    EDIT_TOPIC: "Edycja tematów",
    DELETE_TOPIC: "Usuwanie tematów",
    READ_ONLY: "Tylko odczyt",
};

const ALL_PERMISSIONS = Object.keys(PERMISSION_LABELS);

export function RoleForm({ role, isLoading, onSave }: RoleFormSimpleProps) {
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const config = role ? ROLE_CONFIG[role.name] : { icon: <Users />, bg: "bg-indigo-100", text: "text-indigo-600" };
    useEffect(() => {
        if (role) {
            setSelectedPermissions(role.permissions || []);
        }
    }, [role]);

    const toggle = (perm: string) => {
        setSelectedPermissions((current) =>
            current.includes(perm) ? current.filter((p) => p !== perm) : [...current, perm]
        );
    };

    const handleSubmit = async (e: React.FormEvent, permissions: []) => {
        e.preventDefault();
        console.log(permissions);
        onSave({ id: role?._id, formData: permissions });
    };

    return (
        <Card className="p-4 h-full space-y-6">
            {role ? (
                <div className="p-6 flex items-center">
                    <div className={`${config.bg} p-3 rounded-lg mr-4 flex items-center justify-center drop-shadow-sm`}>
                        {React.cloneElement(config.icon as React.ReactElement, { className: `w-6 h-6 ${config.text}` })}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold leading-tight text-primary-foreground/95">
                            {ROLE_LABELS[role.name]}
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">Zarządzaj uprawnieniami wybranej roli</p>
                    </div>
                </div>
            ) : (
                <div>Dodaj nową rolę</div>
            )}
            <CardContent>
                <form onSubmit={(e) => handleSubmit(e, selectedPermissions)} className="space-y-6">
                    {!role && (
                        <div>
                            <Input />
                        </div>
                    )}
                    <div className="grid grid-cols-3 gap-5">
                        {ALL_PERMISSIONS.map((perm) => (
                            <label key={perm} className="flex items-center space-x-2 cursor-pointer">
                                <Checkbox
                                    className="w-5 h-5"
                                    checked={selectedPermissions.includes(perm)}
                                    onCheckedChange={() => toggle(perm)}
                                />
                                <span className="text-base">{PERMISSION_LABELS[perm]}</span>
                            </label>
                        ))}
                    </div>
                    <div className="mt-14 text-right">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Zapisywanie..." : "Zapisz zmiany"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
