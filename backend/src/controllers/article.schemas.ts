import {z} from "zod";


export const articleTitleSchema = z.string().min(4, { message: "Title must be at least 4 characters long" }).max(90, { message: "Title must be at most 90 characters long" });

// Schemat dla pola 'employeeDescription'
export const articleEmployeeDescriptionSchema = z.string().min(6, { message: "Employee description must be at least 6 characters long" }).max(9000, { message: "Employee description must be at most 7000 characters long" });

// Schemat dla pola 'clientDescription'
export const articleClientDescriptionSchema = z.string().min(6, { message: "Client description must be at least 6 characters long" }).max(9000, { message: "Client description must be at most 7000 characters long" });

// Schemat dla pola 'tags' - wymaga, aby było tablicą identyfikatorów ObjectId (string)
export const articleTagsSchema = z.array(z.string().min(1, { message: "Each tag must be a non-empty string" })).nonempty({ message: "Tags cannot be empty" });







export const newArticleSchema = z.object({
    title:articleTitleSchema,
    employeeDescription:articleEmployeeDescriptionSchema,
    clientDescription: articleClientDescriptionSchema,
    tags: articleTagsSchema,
})




