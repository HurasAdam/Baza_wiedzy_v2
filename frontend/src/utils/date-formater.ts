export const dateFormater = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("pl-PL", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};
