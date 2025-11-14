import { Types } from "mongoose";
import { CONFLICT, FORBIDDEN, NOT_FOUND } from "../../constants/http";
import appAssert from "../../utils/appAssert";
import WorkspaceMemberModel from "../workspace-member/workspaceMember.model";
import WorkspaceModel from "../workspace/workspace.model";
import { CreateWorkspaceFolderDto } from "./dto/create-workspaceFolder.dto";
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
    async findFolders(userId: string, workspaceId: string) {
        const isMember = await WorkspaceMemberModel.exists({ userId, workspaceId });
        appAssert(isMember, FORBIDDEN, "Brak dostępu do tego workspace");

        const folders = await WorkspaceFolderModel.aggregate([
            { $match: { workspaceId: new Types.ObjectId(workspaceId) } },
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
            { $sort: { createdAt: -1 } },
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
        const isAdmin = member?.role?.name === "OWNER";
        appAssert(isOwner || isAdmin, FORBIDDEN, "Brak uprawnień do edycji folderu");

        const folder = await WorkspaceFolderModel.findOne({ _id: folderId, workspaceId });

        console.log("FOLDER", folder);
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
};
