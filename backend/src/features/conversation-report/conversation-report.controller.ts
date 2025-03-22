import mongoose from "mongoose";
import { endOfMonth, startOfDay, startOfMonth, subDays } from "date-fns";
import catchErrors from "@/utils/catchErrors";
import { OK } from "@/constants/http";
import ConversationReportModel from "./conversation-report.model";
import { addConversationReport } from "./conversation-report.service";
import { newConversationReportSchema } from "./conversation-report.schema";

export const ConversationReportController = () => ({
    create: catchErrors(async (req, res) => {
        const request = newConversationReportSchema.parse(req.body);
        const { userId } = req;
        const newTag = await addConversationReport({ request, userId });

        return res.status(OK).json(newTag);
    }),

    find: catchErrors(async (req, res) => {
        const allConversationReports = await ConversationReportModel.find({});
        return res.status(OK).json(allConversationReports);
    }),
});
