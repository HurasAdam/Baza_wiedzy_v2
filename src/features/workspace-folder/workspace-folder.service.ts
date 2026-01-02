import { Types } from "mongoose";
import { CONFLICT, FORBIDDEN, NOT_FOUND } from "../../constants/http";
import appAssert from "../../utils/appAssert";
import { WorkspaceArticleModel } from "../workspace-article/workspace-article.model";
import WorkspaceMemberModel from "../workspace-member/workspaceMember.model";
import WorkspaceModel from "../workspace/workspace.model";
import { CreateWorkspaceFolderDto } from "./dto/create-workspaceFolder.dto";
import { SearchFoldersDto } from "./dto/search-folders.dto";
import { WorkspaceFolderModel } from "./workspace-folder.model";

export const WorkspaceFolderService = {
    async create(userId: string, workspaceId: string, body: CreateWorkspaceFolderDto) {
        const { name } = body;

        const workspace = await WorkspaceModel.findById(workspaceId);
        appAssert(workspace, NOT_FOUND, "Nie znaleziono workspace");

        const isMember = await WorkspaceMemberModel.exists({ userId, workspaceId });
        appAssert(isMember, FORBIDDEN, "Brak dostępu do tego workspace");

        const existingFolder = await WorkspaceFolderModel.findOne({ workspaceId, name });
        appAssert(!existingFolder, CONFLICT, "Folder o tej nazwie już istnieje");

        const folder = await WorkspaceFolderModel.create({
            workspaceId,
            name,
            createdBy: userId,
        });

        return folder;
    },
    async findFolders(userId: string, workspaceId: string, query: SearchFoldersDto) {
        const { name, sort = "newest" } = query;

        const isMember = await WorkspaceMemberModel.exists({ userId, workspaceId });
        appAssert(isMember, FORBIDDEN, "Brak dostępu do tego workspace");

        const match: any = { workspaceId: new Types.ObjectId(workspaceId) };

        if (name && name.trim()) {
            const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            match.name = { $regex: escapeRegex(name.trim()), $options: "i" };
        }

        const sortOrder = sort === "oldest" ? 1 : -1;

        const folders = await WorkspaceFolderModel.aggregate([
            { $match: match },
            {
                $lookup: {
                    from: "workspacearticles",
                    localField: "_id",
                    foreignField: "folderId",
                    as: "articles",
                },
            },
            {
                $addFields: {
                    articlesCount: { $size: "$articles" },
                },
            },
            {
                $project: { articles: 0, __v: 0 },
            },
            { $sort: { createdAt: sortOrder } },
        ]);

        return folders;
    },
    async findOneFolder(userId: string, workspaceId: string, folderId: string) {
        const isMember =
            (await WorkspaceMemberModel.exists({ userId, workspaceId })) ||
            (await WorkspaceModel.exists({ _id: workspaceId, owner: userId }));
        if (!isMember) throw new Error("Brak dostępu do workspace");

        const folder = await WorkspaceFolderModel.findOne({ _id: folderId, workspaceId }, { __v: 0 })
            .populate({
                path: "createdBy",
                select: "name surname email",
            })
            .lean();
        if (!folder) throw new Error("Folder nie istnieje");

        return folder;
    },

    async updateOneFolder(userId: string, workspaceId: string, folderId: string, payload: CreateWorkspaceFolderDto) {
        const workspace = await WorkspaceModel.findById(workspaceId);
        appAssert(workspace, NOT_FOUND, "Workspace nie istnieje");

        const member = await WorkspaceMemberModel.findOne({ userId, workspaceId }).populate("role");
        const isOwner = workspace.owner.toString() === userId;

        appAssert(isOwner, FORBIDDEN, "Brak uprawnień do edycji folderu");

        const folder = await WorkspaceFolderModel.findOne({ _id: folderId, workspaceId });

        appAssert(folder, NOT_FOUND, "Folder nie istnieje");

        const existingFolder = await WorkspaceFolderModel.findOne({
            workspaceId,
            name: payload.name,
            _id: { $ne: folderId },
        });
        appAssert(!existingFolder, CONFLICT, "Folder o tej nazwie już istnieje");

        folder.name = payload.name;
        await folder.save();

        return folder;
    },

    async deleteOneFolder(userId: string, workspaceId: string, folderId: string) {
        const workspace = await WorkspaceModel.findById(workspaceId);
        appAssert(workspace, NOT_FOUND, "Workspace nie istnieje");

        const member = await WorkspaceMemberModel.findOne({ userId, workspaceId }).populate("role");
        const isOwner = workspace.owner.toString() === userId;

        appAssert(isOwner, FORBIDDEN, "Brak uprawnień do usunięcia folderu");

        const folder = await WorkspaceFolderModel.findOne({ _id: folderId, workspaceId });
        appAssert(folder, NOT_FOUND, "Folder nie istnieje");

        // Sprawdź czy są artykuły w folderze
        const articlesCount = await WorkspaceArticleModel.countDocuments({ folderId });
        appAssert(
            articlesCount === 0,
            CONFLICT,
            "Folder zawiera artykuły – usuń lub przenieś je przed usunięciem folderu"
        );

        await WorkspaceFolderModel.deleteOne({ _id: folderId });
        return { message: "Folder został usunięty" };
    },
};
