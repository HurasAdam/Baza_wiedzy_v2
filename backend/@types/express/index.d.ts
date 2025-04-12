import type { Request } from "express";
import type { UserWithoutPassword } from "@/features/user/user.model";

declare global {
    namespace Express {
        interface Request {
            userId: string;
            sessionId: string;
            user: UserWithoutPassword;
        }
    }
}

export {};
