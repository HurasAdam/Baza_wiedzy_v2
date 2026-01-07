import { z } from "zod";

export const updateIssueStatusDto = z.object({
    status: z.enum(["open", "resolved", "closed"], {
        required_error: "Status jest wymagany",
        invalid_type_error: "Nieprawidłowy status",
    }),
});

export type UpdateIssueStatusDto = z.infer<typeof updateIssueStatusDto>;
