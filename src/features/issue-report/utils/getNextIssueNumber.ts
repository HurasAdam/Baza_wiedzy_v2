import IssueReportCounterModel from "../issue-report-counter.model";

export async function getNextIssueNumber(prefix = "z"): Promise<string> {
    const counter = await IssueReportCounterModel.findOneAndUpdate(
        { _id: "issueReport" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );

    return `${prefix}-${counter.seq}`;
}
