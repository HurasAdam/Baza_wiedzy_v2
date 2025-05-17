import { z } from "zod";

export const createProjectDto = z.object({
    name: z
        .string()
        .trim()
        .min(3, { message: "Nazwa projektu musi zawierać co najmniej 3 znaki" })
        .max(100, { message: "Nazwa projektu nie może przekroczyć 100 znaków" }),

    description: z
        .string()
        .trim()
        .min(6, { message: "Opis projektu musi mieć co najmniej 6 znaków" })
        .max(9000, { message: "Opis projektu nie może przekroczyć 9000 znaków" }),
});

export type CreateProjectDto = z.infer<typeof createProjectDto>;
