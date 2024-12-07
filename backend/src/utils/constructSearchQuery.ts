export const constructSearchQuery = (queryParams: any) => {
    let constructedQuery: any = {};
  
    if (queryParams.title) {
      constructedQuery.$or = [
        { title: new RegExp(queryParams.title, "i") },
 
      ];
    }
    if (queryParams.tags) {
      console.log(queryParams.tags)
      constructedQuery.tags = {
        $all: Array.isArray(queryParams.tags)
          ? queryParams.tags
          : [queryParams.tags],
      };
    }

    // Filtrowanie po produkcie
    if (queryParams.product) {
      console.log("Product ID:", queryParams.product);
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