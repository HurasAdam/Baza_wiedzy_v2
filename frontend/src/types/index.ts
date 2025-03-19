export interface ITag {
    _id: string;
    name: string;
}

export interface IProduct {
    _id: string;
    name: string;
    labelColor: string;
    banner: string;
}

export interface IArticle {
    _id: string;
    title: string;
    tags: ITag[];
    isVerified: boolean;
    createdBy: {};
    viewsCounter: number;
    isTrashed: boolean;
    product?: IProduct;
    createdAt: string;
    isFavourite: boolean;
}
