import { NOT_FOUND } from "@/constants/http";
import appAssert from "@/utils/appAssert";
import SessionModel from "./session.model";

export const SessionService = {
    async find(userId: string, sessionId: string) {
        const sessions = await SessionModel.find(
            {
                userId,
                expiresAt: { $gt: Date.now() },
            },
            {
                _id: 1,
                userAgent: 1,
                createdAt: 1,
            },
            {
                sort: { createdAt: -1 },
            }
        );

        return sessions.map((session) => ({
            ...session.toObject(),
            ...(session.id === sessionId && {
                isCurrent: true,
            }),
        }));
    },

    async deleteOne(userId: string, sessionId: string) {
        const deleted = await SessionModel.findOneAndDelete({
            _id: sessionId,
            userId,
        });
        appAssert(deleted, NOT_FOUND, "Session not found");
    },
};
