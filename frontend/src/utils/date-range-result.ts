export const getDateRange = (filter: string) => {
    const endDate = new Date();
    const startDate = new Date();

    switch (filter) {
        case "week":
            startDate.setDate(endDate.getDate() - 7);
            break;
        case "2weeks":
            startDate.setDate(endDate.getDate() - 14);
            break;
        case "month":
            startDate.setMonth(endDate.getMonth() - 1);
            break;
        default:
            startDate.setDate(endDate.getDate() - 7);
    }

    return {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
    };
};
