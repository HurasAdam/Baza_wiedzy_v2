import api from "@/config/api.client";
import { crurl } from "@/utils/crurl";

const baseUrl = "/users";

const findMe = () => {
    return api.get(crurl(baseUrl, "me"));
};

const findAll = () => {
    return api.get(baseUrl);
};


const findAllFavouriteArticles = ()=>{
    return api.get(crurl(baseUrl,"favourites-articles"));
}

export const userApi = {
    findMe,
    findAll,
    findAllFavouriteArticles
};

