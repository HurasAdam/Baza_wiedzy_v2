export const constructSearchQuery = (query: any) => {
    const constructedQuery: any = {};

    if (query.title) {
        constructedQuery.$or = [{ title: new RegExp(query.title, "i") }];
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

    return constructedQuery;
};
