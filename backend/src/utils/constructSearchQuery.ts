/**
 * Construct search query.
 * @param queryParams
 */
export default (queryParams: Record<string, unknown>): Record<string, unknown> => {
  const constructedQuery: Record<string, unknown> = {};

  if (queryParams.title) {
    constructedQuery.$or = [{ title: new RegExp(queryParams.title as string, 'iu') }];
  }
  if (queryParams.tags) {
    constructedQuery.tags = {
      $all: Array.isArray(queryParams.tags) ? queryParams.tags : [queryParams.tags],
    };
  }

  // Filtrowanie po produkcie
  if (queryParams.product) {
    constructedQuery.product = queryParams.product; // Bez $all, bo to pojedyncze ID
  }

  if (queryParams.author) {
    constructedQuery.createdBy = queryParams.author;
  }

  if (queryParams.verified) {
    constructedQuery.isVerified = queryParams.verified;
  }

  return constructedQuery;
};
