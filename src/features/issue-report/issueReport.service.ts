import { NOT_FOUND } from "@/constants/http";
import appAssert from "@/utils/appAssert";
import ReportCommentModel from "../IssueReportComment/Report-comment.model";
import { CreateIssueDto } from "./dto/create-issue.dto";
import { UpdateIssueStatusDto } from "./dto/update-issue-status.dto";
import IssueReportModel from "./issue-report.model";
import { getNextIssueNumber } from "./utils/getNextIssueNumber";

export const IssueReportService = {
    async create(userId: string, payload: CreateIssueDto) {
        // const issueReport = await IssueReportModel.exists({ title: payload.title });
        // appAssert(!issueReport, CONFLICT, "Issue already exists");

        const ticketNumber = await getNextIssueNumber();

        const Issue = await IssueReportModel.create({
            ...payload,
            createdBy: userId,
            ticketNumber,
        });

        return { data: Issue, message: "Zgłoszenie zostało wysłane" };
    },
    async find(userId, query) {
        const querydb: any = {};

        const title = query.title?.trim();
        const type = query.type?.trim();
        const status = query.status?.trim();

        if (title) {
            querydb.title = new RegExp(title, "i");
        }

        if (type) {
            querydb.type = type;
        }
        if (status) {
            querydb.status = status;
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
        try {
            const issueReport = await IssueReportModel.findById(issueReportId);
            appAssert(issueReport, NOT_FOUND, "Issue report not found");

            if (issueReport.isUnread) {
                issueReport.isUnread = false;
                await issueReport.save();
            }

            return { data: issueReport, message: "Zgłoszenie zostało oznaczone jako przeczytane" };
        } catch (error) {
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

        const issueReports = await IssueReportModel.find(querydb)
            .populate({
                path: "createdBy",
                select: "name surname email",
            })
            .sort({ createdAt: -1 });
        return issueReports;
    },

    async updateStatus(issueReportId: string, payload: UpdateIssueStatusDto) {
        const issueReport = await IssueReportModel.findById(issueReportId);
        appAssert(issueReport, NOT_FOUND, "Issue report not found");

        issueReport.status = payload.status;
        await issueReport.save();

        return { data: issueReport, message: "Status zgłoszenia został zaktualizowany" };
    },

    async deleteReport(issueReportId: string) {
        const issueReport = await IssueReportModel.findById(issueReportId);
        appAssert(issueReport, NOT_FOUND, "Zgłoszenie nie istnieje");

        await ReportCommentModel.deleteMany({ report: issueReportId });
        await IssueReportModel.findByIdAndDelete(issueReportId);

        return { message: "Zgłoszenie i wszystkie komentarze zostały usunięte" };
    },
};
