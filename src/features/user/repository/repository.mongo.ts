import UserModel from "../user.model";

export interface IUserRepository {
    findById(id: string): Promise<any | null>;
    updateUserPassword(id: string, newPasword: string, options?: { mustChangePassword: boolean }): Promise<any>;
    updateMyUserData(data: { id: string; name?: string; surname?: string; bio?: string }): Promise<any>;
}

export const createUserRepositoryMongo = (): IUserRepository => ({
    findById: async function (id: string) {
        const user = await UserModel.findById(id);
        return user;
    },

    updateUserPassword: async function (id: string, newPassword: string, options: { mustChangePassword: boolean }) {
        const updated = await UserModel.findByIdAndUpdate(
            id,
            { password: newPassword, mustChangePassword: options?.mustChangePassword ?? false },
            { new: true }
        ).lean();

        return updated;
    },

    updateMyUserData: async function (data: { id: string; name?: string; surname?: string; bio?: string }) {
        const user = await this.findById(data.id);
        if (!user) return null;
        user.name = data.name ?? user.name;
        user.surname = data.surname ?? user.surname;
        user.bio = data.bio ?? user.bio;
        await user.save();
        return user;
    },
});
