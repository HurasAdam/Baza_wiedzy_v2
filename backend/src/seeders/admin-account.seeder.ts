import "dotenv/config";
import mongoose from "mongoose";
import RoleModel from "../features/role-permission/roles-permission.model";
import UserModel from "../features/user/user.model";
import { Permissions } from "../enums/role.enum";
import connectDB from "../config/db";
import { ADMIN_DEFAULT_EMAIL, ADMIN_DEFAULT_PASSWORD } from "../constants/env";

async function seedAdmin() {
    await connectDB(() => {
        console.log("Ruszamy");
    });
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        // 1) Pobierz lub utwórz rolę ADMIN
        let adminRole = await RoleModel.findOne({ name: "ADMIN" }).session(session);
        if (!adminRole) {
            adminRole = new RoleModel({
                name: "ADMIN",
                permissions: Object.values(Permissions), // cała lista permisji
            });
            await adminRole.save({ session });
            console.log("Rola ADMIN utworzona");
        }

        // 2) Pobierz lub utwórz konto admina
        const existing = await UserModel.findOne({ email: ADMIN_DEFAULT_EMAIL }).session(session);
        if (!existing) {
            const admin = new UserModel({
                name: "Admin",
                surname: "Admin",
                email: ADMIN_DEFAULT_EMAIL,
                password: ADMIN_DEFAULT_PASSWORD, // zahashuje pre-save hook
                role: adminRole._id,
                isActive: true,
                verified: true,
                mustChangePassword: true, // wymuś zmianę hasła przy pierwszym logowaniu
            });
            await admin.save({ session });
            console.log("Konto admina utworzone");
        } else {
            console.log("Konto admina już istnieje");
        }

        await session.commitTransaction();
    } catch (err) {
        console.error("Błąd seedowania admina, rollback:", err);
        await session.abortTransaction();
    } finally {
        session.endSession();
        mongoose.disconnect();
    }
}

seedAdmin().catch(console.error);
