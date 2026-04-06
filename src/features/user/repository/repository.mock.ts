import { IUserRepository } from "./repository.mongo";

// TODO

export const createUserRepositoryMock = (): IUserRepository => ({
    findById: async function (id: string) {},
    updateUserPassword: async function () {},
    updateMyUserData: async function () {},
});
