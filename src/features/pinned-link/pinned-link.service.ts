import { CONFLICT, NOT_FOUND, UNPROCESSABLE_CONTENT } from "../../constants/http";
import appAssert from "../../utils/appAssert";
import PinnedLinkModel from "./pinned-link.model";
const MAX_PINNED_LINKS = 32;

export const PinnedLinkService = {
    async create(payload, userId) {
        const count = await PinnedLinkModel.countDocuments({ owner: userId });

        appAssert(count < MAX_PINNED_LINKS, UNPROCESSABLE_CONTENT, "pinned links limit reached (max 32)");

        const isNameTaken = await PinnedLinkModel.exists({
            owner: userId,
            name: payload.name,
        });

        appAssert(!isNameTaken, CONFLICT, "pinned link name already taken");

        await PinnedLinkModel.create({
            ...payload,
            owner: userId,
        });
    },

    async find(userId) {
        const userPinnedLinks = await PinnedLinkModel.find({ owner: userId });
        return userPinnedLinks;
    },
    async findOne(pinnedLinkId: string) {
        const userPinnedLinks = await PinnedLinkModel.findById({ _id: pinnedLinkId });
        return userPinnedLinks;
    },

    async updateOne(userId: string, pinnedLinkId: string, payload: any) {
        if (payload.name) {
            const exists = await PinnedLinkModel.exists({
                owner: userId,
                name: payload.name,
                _id: { $ne: pinnedLinkId },
            });

            appAssert(!exists, CONFLICT, "pinned link name already taken");
        }
        const updated = await PinnedLinkModel.findOneAndUpdate(
            {
                _id: pinnedLinkId,
                owner: userId,
            },
            {
                $set: payload,
            },
            {
                new: true,
            }
        );

        appAssert(updated, NOT_FOUND, "Link not found");

        return updated;
    },

    async deleteOne(userId, pinnedLinkId) {
        const userPinnedLink = await PinnedLinkModel.exists({ owner: userId, _id: pinnedLinkId });
        appAssert(userPinnedLink, NOT_FOUND, "Link not found");
        await PinnedLinkModel.findByIdAndDelete(pinnedLinkId);
    },
};
