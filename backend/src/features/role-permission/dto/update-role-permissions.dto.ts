// src/dto/update-role.dto.ts
import { z } from "zod";
import { Permissions } from "../../../enums/role.enum";

/**
 * UpdateRoleDto przyjmuje bezpośrednio tablicę uprawnień.
 */
export const updateRoleDto = z
    .array(z.nativeEnum(Permissions), {
        invalid_type_error: "Każdy element permissions musi być jedną z wartości Permissions",
    })
    .nonempty({ message: "permissions nie może być pustą tablicą" });

export type UpdateRoleDto = z.infer<typeof updateRoleDto>;
