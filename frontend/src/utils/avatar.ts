export const formatStatusToEnum = (status: string): string => {
    return status.toUpperCase().replace(/\s+/g, "_");
};

//THE UPDATED ONE BECAUSE OF THE FILTERS ->  Take Note ->
export const transformOptions = (
    options: string[],
    iconMap?: Record<string, React.ComponentType<{ className?: string }>>
) =>
    options.map((value) => ({
        label: value
            .replace(/_/g, " ")
            .toLowerCase()
            .replace(/\b\w/g, (c) => c.toUpperCase()),
        value: value,
        icon: iconMap ? iconMap[value] : undefined,
    }));

export const getAvatarColor = (initials: string): string => {
    const colors = [
        "bg-slate-600 text-white",
        "bg-gray-600 text-white",
        "bg-indigo-600 text-white",
        "bg-teal-600 text-white",
        "bg-blue-600 text-white",
        "bg-green-600 text-white",
        "bg-red-600 text-white",
        "bg-amber-600 text-black", // Amber z ciemniejszym tekstem dla lepszej czytelności
        "bg-purple-600 text-white",
    ];

    // Simple hash to map initials to a color index
    const hash = initials.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

    return colors[hash % colors.length];
};

export const getAvatarFallbackText = (name: string) => {
    if (!name) return "NA";
    const initials = name
        .split(" ")
        .map((n) => n.charAt(0).toUpperCase())
        .join("")
        .slice(0, 2); // Ensure only two initials
    return initials || "NA";
};
