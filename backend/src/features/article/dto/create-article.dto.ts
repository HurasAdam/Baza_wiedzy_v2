import { Types } from "mongoose";
import { z } from "zod";

export const createArticleDto = z.object({
    // articleTitleSchema
    title: z.string().trim().min(4).max(255),

    // articleEmployeeDescriptionSchema
    employeeDescription: z.string().trim().min(6).max(9000),

    // articleClientDescriptionSchema
    clientDescription: z.string().trim().min(6).max(9000),

    // articleTagsSchema
    tags: z
        .array(
            // stringi tablicy muszą być ObjectId z mongoose
            z.string().refine((value) => Types.ObjectId.isValid(value))
        )
        .nonempty()
        // stringi nie mogą się powtarzać
        .refine((values) => new Set(values).size === values.length),
    // articleProductSchema
    product: z.string().refine((value) => {
        // string musi być ObjectId z mongoose
        return Types.ObjectId.isValid(value);
    }),
});

export type CreateArticleDto = z.infer<typeof createArticleDto>;

// -------------------------------------------------------------------
//
// Zostawiam jakby jednak wiadomości miały zostać przywrócone
//    nie musi być
//        .min(4, { message: "Title must be at least 4 characters long" })
//    można od razu przekazać wiadomość
//        .min(4, "Title must be at least 4 characters long")
//
// -------------------------------------------------------------------
//
// export const articleTitleSchema = z
//     .string()
//     .min(4, { message: "Title must be at least 4 characters long" })
//     .max(90, { message: "Title must be at most 90 characters long" });

// // Schemat dla pola 'employeeDescription'
// export const articleEmployeeDescriptionSchema = z
//     .string()
//     .min(6, {
//         message: "Employee description must be at least 6 characters long",
//     })
//     .max(9000, {
//         message: "Employee description must be at most 7000 characters long",
//     });

// // Schemat dla pola 'clientDescription'
// export const articleClientDescriptionSchema = z
//     .string()
//     .min(6, { message: "Client description must be at least 6 characters long" })
//     .max(9000, {
//         message: "Client description must be at most 7000 characters long",
//     });

// // Schemat dla pola 'tags' - wymaga, aby było tablicą identyfikatorów ObjectId (string)
// export const articleTagsSchema = z
//     .array(z.string().min(1, { message: "Each tag must be a non-empty string" }))
//     .nonempty({ message: "Tags cannot be empty" });

// export const articleProductSchema = z
//     .string()
//     .min(24, { message: "Product ID must be a valid ObjectId" }) // ObjectId ma 24 znaki
//     .max(24, { message: "Product ID must be a valid ObjectId" });
