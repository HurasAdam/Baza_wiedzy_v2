import { Types } from "mongoose";
import { BAD_REQUEST, NOT_FOUND } from "../../constants/http";
import appAssert from "../../utils/appAssert";
import { WorkspaceFolderModel } from "../workspace-folder/workspace-folder.model";
import WorkspaceMemberModel from "../workspace-member/workspaceMember.model";
import WorkspaceModel from "../workspace/workspace.model";
import { CreateWorkspaceArticleDto } from "./dto/create-workspace-article.dto";
import { WorkspaceArticleResponseVariantDto } from "./dto/workspace-article-response-variant.dto";
import { WorkspaceResponseVariantModel } from "./response-variant/workspace-response-variant.model";
import { WorkspaceArticleModel } from "./workspace-article.model";

export const WorkspaceArticleService = {
    async create(userId: string, payload: CreateWorkspaceArticleDto) {
        const folder = await WorkspaceFolderModel.findById(payload.folderId);
        appAssert(folder, NOT_FOUND, "Folder nie istnieje");

        const newArticle = await WorkspaceArticleModel.create({
            title: payload.title,
            folderId: folder._id,
            workspaceId: folder.workspaceId, // pobrane z folderu
            createdBy: userId,
        });

        const createdVariants = await Promise.all(
            payload.responseVariants.map((variant) =>
                WorkspaceResponseVariantModel.create({
                    articleId: newArticle._id,
                    variantName: variant.variantName,
                    variantContent: variant.variantContent,
                    createdBy: userId,
                })
            )
        );

        return {
            ...newArticle.toObject(),
            responseVariants: createdVariants,
        };
    },

    async findByFolder(folderId: string, query: { page?: number; limit?: number; title?: string }) {
        appAssert(Types.ObjectId.isValid(folderId), BAD_REQUEST, "Nieprawidłowy identyfikator folderu");

        const folderExists = await WorkspaceFolderModel.exists({ _id: folderId });
        appAssert(folderExists, NOT_FOUND, "Folder nie istnieje");

        const page = Math.max(Number(query.page) || 1, 1);
        const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
        const skip = (page - 1) * limit;

        const filter: any = { folderId: new Types.ObjectId(folderId) };
        if (query.title?.trim()) {
            const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            filter.title = new RegExp(escapeRegex(query.title.trim()), "i");
        }

        const [articles, total] = await Promise.all([
            WorkspaceArticleModel.find(filter)
                .populate({ path: "createdBy", select: ["name", "surname"] })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            WorkspaceArticleModel.countDocuments(filter),
        ]);

        return {
            data: articles,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
                limit,
            },
        };
    },
    async findOne(userId: string, articleId: string) {
        const article = await WorkspaceArticleModel.findById(articleId)
            .populate({ path: "createdBy", select: ["name", "surname"] })
            .lean();

        appAssert(article, NOT_FOUND, "Artykuł nie istnieje");

        const folder = await WorkspaceFolderModel.findById(article.folderId).select("_id name").lean();
        appAssert(folder, NOT_FOUND, "Folder powiązany z artykułem nie istnieje");

        const workspace = await WorkspaceModel.findById(article.workspaceId).lean();
        appAssert(workspace, NOT_FOUND, "Workspace nie istnieje");

        const isOwner = workspace.owner?.toString() === userId;

        const isMember = await WorkspaceMemberModel.exists({
            workspaceId: workspace._id,
            userId,
        });

        appAssert(isOwner || isMember, NOT_FOUND, "Nie masz dostępu do tego artykułu");

        const variants = await WorkspaceResponseVariantModel.find({
            articleId: article._id,
        })
            .sort({ createdAt: 1 })
            .select("variantName variantContent")
            .lean();

        const { folderId, ...rest } = article;

        return {
            ...rest,
            folder,
            responseVariants: variants,
        };
    },

    async createResponseVariant(userId: string, articleId: string, payload: WorkspaceArticleResponseVariantDto) {
        const article = await WorkspaceArticleModel.findById(articleId).lean();
        appAssert(article, NOT_FOUND, "Artykuł nie istnieje");

        const workspace = await WorkspaceModel.findById(article.workspaceId).lean();
        appAssert(workspace, NOT_FOUND, "Workspace nie istnieje");

        const isOwner = workspace.owner?.toString() === userId;
        const isMember = await WorkspaceMemberModel.exists({
            workspaceId: workspace._id,
            userId,
        });
        appAssert(isOwner || isMember, NOT_FOUND, "Nie masz dostępu do tego artykułu");

        const newVariant = await WorkspaceResponseVariantModel.create({
            articleId,
            variantName: payload.variantName,
            variantContent: payload.variantContent,
            createdBy: userId,
        });

        return newVariant.toObject();
    },

    async updateResponseVariant(
        userId: string,
        articleId: string,
        variantId: string,
        payload: WorkspaceArticleResponseVariantDto
    ) {
        const article = await WorkspaceArticleModel.findById(articleId).lean();
        appAssert(article, NOT_FOUND, "Artykuł nie istnieje");

        const workspace = await WorkspaceModel.findById(article.workspaceId).lean();
        appAssert(workspace, NOT_FOUND, "Workspace nie istnieje");

        const isOwner = workspace.owner?.toString() === userId;
        const isMember = await WorkspaceMemberModel.exists({
            workspaceId: workspace._id,
            userId,
        });
        appAssert(isOwner || isMember, NOT_FOUND, "Nie masz dostępu do tego artykułu");

        const variant = await WorkspaceResponseVariantModel.findOne({
            _id: variantId,
            articleId,
        });
        appAssert(variant, NOT_FOUND, "Wariant odpowiedzi nie istnieje");

        variant.variantName = payload.variantName;
        variant.variantContent = payload.variantContent;
        await variant.save();

        return variant.toObject();
    },
};
