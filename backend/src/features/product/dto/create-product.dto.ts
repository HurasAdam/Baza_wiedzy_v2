import { z } from "zod";

export const createProductDto = z.object({
    name: z.string().trim().min(2).max(50),
    labelColor: z.string(),
    banner: z
        .enum([
            "blob",
            "steps",
            "circle",
            "biblioteka",
            "abstract",
            "abstract2",
            "abstract3",
            "abstract4",
            "default-banner",
        ])
        .catch("default-banner")
        .default("default-banner"),
});

export type CreateProductDto = z.infer<typeof createProductDto>;
