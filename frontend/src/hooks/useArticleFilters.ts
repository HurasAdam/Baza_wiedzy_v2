import { useCallback } from "react";
import { useSearchParams } from "react-router-dom"

const useArticleFilters = ()=>{
    const [searchParams, setSearchParams] = useSearchParams();


    const title = searchParams.get("title") || "";
    const tags = searchParams.getAll("tags");
    const page = searchParams.get("page") ||1;
    const author = searchParams.get("author") || "";
    const verified = searchParams.get("verified");
    const limit = searchParams.get("limit");



    
// console.log("TAGS")
// console.log(tags)
    const setFilters = useCallback((filters) => {
console.log("filters")
console.log(filters)
        setSearchParams((params) => {
        
            if (filters.title !== undefined) {
                if (filters.title === "") {
                    params.delete("title"); 
                }else{
                    params.set('title', filters.title);
                }
           
            } 

            if (filters.limit !== undefined) {
                if (filters.limit === "" || limit ===null) {
                    params.delete("limit");  // Usuwamy parametr author, jeśli jest pusty
                } else {
                    params.set("limit", filters.limit); // Inaczej ustawiamy wartość autora
                }
            }

            if (filters.tags !== undefined) {
                params.delete('tags');
                filters.tags.forEach((tag) => {
                    params.append('tags', tag.value); // tagi powinny być przekazywane jako wartości
                });
            } 

            if (filters.page !== undefined) {
                params.set("page", filters.page.toString());
              }

              if (filters.author !== undefined) {
                if (filters.author === "") {
                    params.delete("author");  // Usuwamy parametr author, jeśli jest pusty
                } else {
                    params.set("author", filters.author); // Inaczej ustawiamy wartość autora
                }
            }

            if (filters.verified !== undefined) {
                if (filters.verified === false) {
                    params.delete("verified"); // Usuń parametr, gdy wartość to false
                } else if (filters.verified === true) {
                    params.set("verified", "true"); // Ustawiaj jako "true", gdy checkbox jest zaznaczony
                }
            }

            return params;
        });
    }, []);

    const getActiveFiltersCount = useCallback(() => {
        let count = 0;
        if (title) count++;
        if (tags.length > 0) count++;
        if (author) count++;
        if (verified !== null && verified !== undefined) count++;
        if (limit) count++;
        return count;
    }, [title, tags, author, verified, limit]);


return {
    title,
    tags,
    page,
    author,
    verified,
    limit,
    setFilters,
    getActiveFiltersCount
}

}

export default useArticleFilters;