import "dotenv/config";

import mongoose from "mongoose";
import connectDB from "../config/db";
import RoleModel from "../features/role-permission/roles-permission.model";
import { RolePermissions, RoleVisualConfig } from "../utils/role-permission";

const seedRoles = async () => {
    console.log("Running script...");

    try {
        await connectDB(() => {
            console.log("Start Seeding Roles");
        });

        console.log("Checking existing roles...");

        for (const roleName in RolePermissions) {
            const role = roleName as keyof typeof RolePermissions;
            const permissions = RolePermissions[role];
            const { iconKey, labelColor } = RoleVisualConfig[role];

            const existingRole = await RoleModel.findOne({ name: role });

            if (!existingRole) {
                await RoleModel.create({
                    name: role,
                    permissions,
                    iconKey,
                    labelColor,
                });

                console.log(`Role ${role} created.`);
            } else {
                console.log(`Role ${role} already exists. Skipping.`);
            }
        }

        console.log("Seeding completed successfully.");
        await mongoose.disconnect();
    } catch (error) {
        console.error("Error during seeding:", error);
        process.exit(1);
    }
};

seedRoles().catch((error) => console.error("Error running seed script:", error));
