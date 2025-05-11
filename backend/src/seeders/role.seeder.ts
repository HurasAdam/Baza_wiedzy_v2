import "dotenv/config";
import mongoose from "mongoose";

import { RolePermissions, RoleVisualConfig } from "../utils/role-permission";
import connectDB from "../config/db";
import RoleModel from "../features/role-permission/roles-permission.model";

const seedRoles = async () => {
    console.log("Running script...");

    try {
        await connectDB(() => {
            console.log("Start Seeding Roles");
        });

        const session = await mongoose.startSession();
        session.startTransaction();

        console.log("Clearing existing roles...");
        await RoleModel.deleteMany({}, { session });

        for (const roleName in RolePermissions) {
            const role = roleName as keyof typeof RolePermissions;
            const permissions = RolePermissions[role];
            const { iconKey, labelColor } = RoleVisualConfig[role];

            // Check if the role already exists
            const existingRole = await RoleModel.findOne({ name: role }).session(session);
            if (!existingRole) {
                const newRole = new RoleModel({
                    name: role,
                    permissions: permissions,
                    iconKey,
                    labelColor,
                });
                await newRole.save({ session });
                console.log(`Role ${role} added with permissions.`);
            } else {
                console.log(`Role ${role} already exists.`);
            }
        }

        await session.commitTransaction();
        console.log("Transaction committed.");

        session.endSession();
        console.log("Session ended.");

        console.log("Seeding completed successfully.");
    } catch (error) {
        console.error("Error during seeding:", error);
    }
};

seedRoles().catch((error) => console.error("Error running seed script:", error));
