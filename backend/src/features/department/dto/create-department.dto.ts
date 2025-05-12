import { z } from "zod";

export const createDepartmentDto = z.object({
    name: z
        .string()
        .trim()
        .min(3, { message: "Nazwa działu musi mieć co najmniej 3 znaki" })
        .max(100, { message: "Nazwa działu nie może przekroczyć 100" }),

    description: z
        .string()
        .trim()
        .min(6, { message: "Opis musi mieć co najmniej 6 znaków" })
        .max(9000, { message: "Opis nie może przekroczyć 9000 znaków" }),
});

export type CreateDepartmentDto = z.infer<typeof createDepartmentDto>;
