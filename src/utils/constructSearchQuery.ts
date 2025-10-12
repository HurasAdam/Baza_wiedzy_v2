export const constructSearchQuery = (query: any) => {
    const constructedQuery: any = {};

    const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    if (query.title) {
        const safeTitle = escapeRegex(query.title.trim());
        constructedQuery.$or = [{ title: new RegExp(safeTitle, "i") }];
    }

    if (query.tags) {
        constructedQuery.tags = {
            $all: Array.isArray(query.tags) ? query.tags : [query.tags],
        };
    }

    if (query.product) {
        constructedQuery.product = query.product;
    }

    if (query.category) {
        constructedQuery.category = query.category;
    }

    if (query.author) {
        constructedQuery.createdBy = query.author;
    }

    if (query.verified) {
        constructedQuery.isVerified = query.verified;
    }

    if (query.status) {
        constructedQuery.status = query.status;
    } else {
        constructedQuery.status = { $in: ["approved", "pending"] };
    }

    return constructedQuery;
};
