// issue-report/counters.model.ts
import { Schema, model } from "mongoose";

const IssueReportCounterSchema = new Schema({
    _id: { type: String, required: true }, // np. "issueReport"
    seq: { type: Number, default: 0 },
});

const IssueReportCounterModel = model("IssueReportCounter", IssueReportCounterSchema);
export default IssueReportCounterModel;
