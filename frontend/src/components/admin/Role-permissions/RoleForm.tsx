import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface Role {
    _id: string;
    name: string;
    permissions: string[];
}

interface RoleFormSimpleProps {
    role: Role;
    saving: boolean;
    onSave: (permissions: string[]) => Promise<void>;
}

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
    KOPA_KABANA: "NANANA",
};
const ALL_PERMISSIONS = Object.keys(PERMISSION_LABELS);

export function RoleForm({ role, saving, onSave }: RoleFormSimpleProps) {
    // Stan lokalny dla zaznaczonych permisji
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

    // console.log(selectedPermissions, "WYBRANE UPRAWNEINIA");

    // Inicjalizacja stanu przy każdej zmianie `role`
    useEffect(() => {
        setSelectedPermissions(role.permissions || []);
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
        <Card className="p-4 h-full">
            <CardHeader>
                <h2 className="text-xl font-semibold">{role.name}</h2>
            </CardHeader>
            <CardContent>
                <form onSubmit={(e) => handleSubmit(e, selectedPermissions)}>
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
                        <Button type="submit" disabled={saving}>
                            {saving ? "Zapisywanie..." : "Zapisz zmiany"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
