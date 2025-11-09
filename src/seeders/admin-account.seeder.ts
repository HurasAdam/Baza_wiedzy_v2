import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../config/db";
import { ADMIN_DEFAULT_EMAIL, ADMIN_DEFAULT_PASSWORD } from "../constants/env";
import { Permissions } from "../enums/role.enum";
import RoleModel from "../features/role-permission/roles-permission.model";
import UserModel from "../features/user/user.model";

async function seedAdmin() {
    await connectDB(() => {
        console.log("Ruszamy");
    });

    try {
        let adminRole = await RoleModel.findOne({ name: "ADMIN" });
        if (!adminRole) {
            adminRole = new RoleModel({
                name: "ADMIN",
                permissions: Object.values(Permissions),
            });
            await adminRole.save();
            console.log("Rola ADMIN utworzona");
        }

        const existing = await UserModel.findOne({ email: ADMIN_DEFAULT_EMAIL });
        if (!existing) {
            const admin = new UserModel({
                name: "Admin",
                surname: "Admin",
                email: ADMIN_DEFAULT_EMAIL,
                password: ADMIN_DEFAULT_PASSWORD,
                role: adminRole._id,
                isActive: true,
                verified: true,
                mustChangePassword: true,
            });
            await admin.save();
            console.log("Konto admina utworzone");
        } else {
            console.log("Konto admina już istnieje");
        }
    } catch (err) {
        console.error("Błąd seedowania admina, rollback:", err);
    } finally {
        mongoose.disconnect();
    }
}

seedAdmin().catch(console.error);
