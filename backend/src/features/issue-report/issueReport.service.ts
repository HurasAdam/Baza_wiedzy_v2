import { CONFLICT, NOT_FOUND } from "@/constants/http";
import appAssert from "@/utils/appAssert";
import IssueReportModel from "./issue-report.model";
import { CreateIssueDto } from "./dto/create-issue.dto";

export const IssueReportService = {
    async create(userId: string, payload: CreateIssueDto) {
        // const issueReport = await IssueReportModel.exists({ title: payload.title });
        // appAssert(!issueReport, CONFLICT, "Issue already exists");

        const Issue = await IssueReportModel.create({
            ...payload,
            createdBy: userId,
        });

        return { data: Issue, message: "Zgłoszenie zostało wysłane" };
    },
    async find(userId, payload) {
        const issueReports = await IssueReportModel.find({}).select(["-createdBy"]).populate({
            path: "createdBy",
            select: "name surname email",
        });

        return issueReports;
    },
    async findOne(issueReportId: string) {
        const issueReport = await IssueReportModel.findById({ _id: issueReportId }).populate({
            path: "createdBy",
            select: "name surname email",
        });
        appAssert(issueReport, NOT_FOUND, "Issue report not found");
        return issueReport;
    },
    async markAsRead(issueReportId: string) {
        const session = await IssueReportModel.startSession();
        session.startTransaction();

        try {
            const issueReport = await IssueReportModel.findById(issueReportId).session(session);
            appAssert(issueReport, NOT_FOUND, "Issue report not found");

            // Jeśli jest nieprzeczytane, zmieniamy flagę
            if (issueReport.isUnread) {
                issueReport.isUnread = false;
                await issueReport.save({ session });
            }

            await session.commitTransaction();
            session.endSession();

            return { data: issueReport, message: "Zgłoszenie zostało oznaczone jako przeczytane" };
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    },

    async findMyReports(userId: string) {
        const issueReports = await IssueReportModel.find({ createdBy: userId }).populate({
            path: "createdBy",
            select: "name surname email",
        });
        return issueReports;
    },
};
