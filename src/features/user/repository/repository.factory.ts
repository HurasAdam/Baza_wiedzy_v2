import { createUserRepositoryMock } from "./repository.mock";
import { createUserRepositoryMongo, IUserRepository } from "./repository.mongo";

export enum DB_TYPE {
    MONGO = "mongo",
    MOCK = "mock",
}

export function createUserRepository(dbType: DB_TYPE): IUserRepository {
    switch (dbType) {
        case DB_TYPE.MONGO:
            return createUserRepositoryMongo();
        case DB_TYPE.MOCK:
            return createUserRepositoryMock();
        default:
            throw new Error(`Unsupported Database type :${dbType}`);
    }
}
