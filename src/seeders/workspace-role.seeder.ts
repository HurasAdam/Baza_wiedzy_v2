import "dotenv/config";

import mongoose from "mongoose";
import connectDB from "../config/db";
import WorkspaceRoleModel from "../features/workspace-role/workspace-role.model";

import { WorkspaceRolePermissions } from "../utils/workspaceRole-permission";

const seedWorkspaceRoles = async () => {
    console.log("Running script...");

    try {
        await connectDB(() => {
            console.log("Start Seeding Roles");
        });

        console.log("Clearing existing roles...");
        await WorkspaceRoleModel.deleteMany({});

        for (const workspaceRoleName in WorkspaceRolePermissions) {
            const role = workspaceRoleName as keyof typeof WorkspaceRolePermissions;
            const permissions = WorkspaceRolePermissions[role];

            const existingRole = await WorkspaceRoleModel.findOne({ name: role });
            if (!existingRole) {
                const newRole = new WorkspaceRoleModel({
                    name: role,
                    permissions: permissions,
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

seedWorkspaceRoles().catch((error) => console.error("Error running seed script:", error));
