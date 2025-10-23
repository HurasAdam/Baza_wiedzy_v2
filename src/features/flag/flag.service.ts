import FlagModel from "./flag.model";

export const FlagService = {
    async create(userId: string, body: { name: string; color: string }) {
        const { name, color } = body;
        const newFlag = await FlagModel.create({ name, color, createdBy: userId });
        return newFlag;
    },
    async findMyFlags(userId: string) {
        return await FlagModel.find({ createdBy: userId }).lean();
    },
};
