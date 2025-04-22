import { useState } from "react";

const AvatarUploader = () => {
    const [avatar, setAvatar] = useState<File | null>(null);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setAvatar(file);
    };

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Dodaj awatar</h2>
            <p className="text-sm text-muted-foreground">Wybierz zdjęcie profilowe.</p>
            <div className="flex justify-center">
                {avatar ? (
                    <img
                        src={URL.createObjectURL(avatar)}
                        alt="Avatar"
                        className="w-24 h-24 rounded-full border-4 border-primary object-cover"
                    />
                ) : (
                    <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center text-muted-foreground text-xl">
                        +
                    </div>
                )}
            </div>
            <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="w-full px-4 py-2 text-sm border border-input rounded-lg"
            />
        </div>
    );
};

export default AvatarUploader;
