import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import * as Icons from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { ICON_MAP, ICON_KEYS, IconKey } from "@/constants/roleIcons";
import { Separator } from "@/components/ui/separator";
// Interfaces
interface Role {
    _id: string;
    name: string;
    iconKey: string;
    permissions: string[];
}

interface SaveArgs {
    id?: string;
    name?: string;
    iconKey?: string;
    permissions: string[];
    labelColor: string;
}

interface RoleFormSimpleProps {
    role?: Role;
    isLoading: boolean;
    onSave: (args: SaveArgs) => void;
}

// Labels
const ROLE_LABELS: Record<string, string> = {
    ADMIN: "Admin",
    LEADER: "Lider techniczny",
    MEMBER: "Specjalista",
    GUEST: "Gość",
};

// Options for icons picker

export const COLOR_OPTIONS = [
    { name: "bg-green-100", value: "green" },
    { name: "bg-blue-100", value: "blue" },
    { name: "bg-purple-100", value: "violet" },
    { name: "bg-indigo-100", value: "indigo" },
    { name: "bg-gray-100", value: "gray" },
    { name: "bg-rose-100", value: "rose" },
    { name: "bg-amber-100", value: "amber" },
    { name: "bg-orange-100", value: "orange" },
];

// Permission labels
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

console.log("MAPA IKON", ICON_KEYS);

// RoleForm component
export function RoleForm({ role, isLoading, onSave }: RoleFormSimpleProps) {
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [roleName, setRoleName] = useState<string>(role?.name || "");
    const [selectedIconKey, setSelectedIconKey] = useState<string>(role?.iconKey || ICON_KEYS[0]);
    const [selectedColor, setSelectedColor] = useState<string>(role?.labelColor || COLOR_OPTIONS[0].name);

    // header icon and style

    const IconComponent = (Icons as any)[selectedIconKey] as React.ComponentType<{ size?: number; className: string }>;

    useEffect(() => {
        if (role) {
            setSelectedPermissions(role.permissions || []);
            setRoleName(role.name);
            setSelectedIconKey(role.iconKey);
        }
    }, [role]);

    const toggle = (perm: string) => {
        setSelectedPermissions((current) =>
            current.includes(perm) ? current.filter((p) => p !== perm) : [...current, perm]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload: SaveArgs = {
            name: roleName,
            iconKey: selectedIconKey,
            permissions: selectedPermissions,
            labelColor: selectedColor,
        };

        if (role?._id) {
            payload.id = role._id;
        }

        onSave(payload);
    };

    return (
        <Card className="p-4 space-y-6  h-fit">
            <div className="p-6 flex items-center">
                <div className={`p-3 rounded-lg mr-4 flex items-center justify-center bg-${role?.labelColor}-100`}>
                    {IconComponent && <IconComponent size={24} className={`text-${role?.labelColor}-600`} />}
                </div>
                <div>
                    <h1 className="text-2xl font-bold leading-tight text-primary-foreground/95">
                        {role ? ROLE_LABELS[role.name] : roleName}
                    </h1>
                    <p className="mt-1 text-sm text-gray-600">
                        {role ? "Zarządzaj uprawnieniami roli" : "Utwórz nową rolę"}
                    </p>
                </div>
            </div>

            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-10">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-primary-foreground/75 mb-2">Nazwa roli</label>
                        <Input
                            disabled={role?.name === "ADMIN"}
                            value={roleName}
                            onChange={(e) => setRoleName(e.currentTarget.value)}
                            placeholder="Wpisz nazwę roli"
                            required
                        />
                    </div>

                    {/* Icon picker */}
                    <div>
                        <label className="block text-sm font-medium text-primary-foreground/75 mb-2">
                            Wybierz ikonę
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {ICON_KEYS.map((iconKey) => {
                                const IconButton = ICON_MAP[iconKey];
                                return (
                                    <button
                                        key={iconKey}
                                        type="button"
                                        onClick={() => setSelectedIconKey(iconKey)}
                                        className={`w-12 h-12 flex flex-col items-center justify-center rounded-lg border bg-background ${
                                            selectedIconKey === iconKey ? "border-primary text-primary" : ""
                                        }`}
                                    >
                                        {IconButton && <IconButton size={20} />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Color picker */}
                    <div>
                        <label className="block text-sm font-medium text-primary-foreground/70 mb-2">
                            Kolor etykiety
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {COLOR_OPTIONS.map((color) => (
                                <button
                                    key={color.name}
                                    type="button"
                                    onClick={() => setSelectedColor(color.value)}
                                    className={`${color.name} w-9 h-9 rounded-md border ${selectedColor === color.value ? "border-[4px] border-primary" : ""}`}
                                >
                                    <span className="sr-only">{color.value}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Permissions */}

                    <div>
                        <Separator className="my-4" />
                        <label className="block text-sm font-medium text-primary-foreground/70 mb-6">Uprawnienia</label>

                        <div className="grid grid-cols-3 gap-5">
                            {ALL_PERMISSIONS.map((perm) => (
                                <label key={perm} className="flex items-center space-x-2 cursor-pointer">
                                    <Checkbox
                                        className="w-5 h-5"
                                        disabled={role?.name === "ADMIN"}
                                        checked={selectedPermissions.includes(perm)}
                                        onCheckedChange={() => toggle(perm)}
                                    />
                                    <span className="text-base text-primary-foreground/90">
                                        {PERMISSION_LABELS[perm]}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                    {/* Save */}
                    <div className="mt-14 text-right">
                        <Button type="submit" disabled={isLoading || !roleName.trim()}>
                            {isLoading ? "Zapisywanie..." : role ? "Zapisz zmiany" : "Utwórz rolę"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
