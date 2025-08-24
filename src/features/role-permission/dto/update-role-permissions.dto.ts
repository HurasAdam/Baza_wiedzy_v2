import { z } from "zod";
import { Permissions } from "../../../enums/role.enum";

export const updateRoleDto = z.object({
    permissions: z
        .array(z.nativeEnum(Permissions), {
            invalid_type_error: "Każdy element permissions musi być jedną z wartości Permissions",
        })
        .nonempty({ message: "permissions nie może być pustą tablicą" }),
    name: z.string({
        required_error: "name jest wymagane",
        invalid_type_error: "name musi być stringiem",
    }),
    iconKey: z.string({
        required_error: "iconKey jest wymagane",
        invalid_type_error: "iconKey musi być stringiem",
    }),
    labelColor: z.string({
        required_error: "labelColor jest wymagane",
        invalid_type_error: "labelColor musi być stringiem",
    }),
});

export type UpdateRoleDto = z.infer<typeof updateRoleDto>;
