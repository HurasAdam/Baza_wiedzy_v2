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

        console.log("Clearing existing roles...");
        await RoleModel.deleteMany({});

        for (const roleName in RolePermissions) {
            const role = roleName as keyof typeof RolePermissions;
            const permissions = RolePermissions[role];
            const { iconKey, labelColor } = RoleVisualConfig[role];

            // Check if the role already exists
            const existingRole = await RoleModel.findOne({ name: role });
            if (!existingRole) {
                const newRole = new RoleModel({
                    name: role,
                    permissions: permissions,
                    iconKey,
                    labelColor,
                });
                await newRole.save();
                console.log(`Role ${role} added with permissions.`);
            } else {
                console.log(`Role ${role} already exists.`);
            }
        }

        console.log("Transaction committed.");

        console.log("Seeding completed successfully.");
        await mongoose.disconnect();
    } catch (error) {
        console.error("Error during seeding:", error);
    }
};

seedRoles().catch((error) => console.error("Error running seed script:", error));
