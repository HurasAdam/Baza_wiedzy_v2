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
    async find(userId, query) {
        const querydb: any = {};

        const title = query.title?.trim();
        const type = query.type?.trim();

        if (title) {
            querydb.title = new RegExp(title, "i");
        }

        if (type) {
            querydb.type = type;
        }

        if (query.isUnread === true || query.isUnread === "true") {
            querydb.isUnread = true;
        }

        const issueReports = await IssueReportModel.find(querydb)
            .select(["-createdBy"])
            .populate({
                path: "createdBy",
                select: "name surname email",
            })
            .sort({ createdAt: -1 });

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

    async findMyReports(userId: string, query) {
        const querydb: any = {
            createdBy: userId,
        };

        if (query?.type) {
            querydb.type = query.type;
        }

        console.log(querydb, "QUERY DB");

        const issueReports = await IssueReportModel.find(querydb)
            .populate({
                path: "createdBy",
                select: "name surname email",
            })
            .sort({ createdAt: -1 });
        return issueReports;
    },
};
