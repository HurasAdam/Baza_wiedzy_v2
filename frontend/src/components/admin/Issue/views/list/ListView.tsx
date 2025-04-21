import React from "react";
import { IssueReportCard } from "./IssueReportCard";

export interface IReport {
    _id: string;
    title: string;
    description: string;
    createdBy: {};
    status: "in-progress" | "resolved" | "pending";
    isUnread: boolean;
    type: "bug" | "proposal";
    category: string;
    createdAt: string;
    updatedAt: string;
}

interface Props {
    onClick: (id: string) => void;
    items: IReport[];
}

const ListView = ({ onClick, items }: Props) => {
    return (
        <div className="grid grid-cols-1 gap-4  overflow-auto ">
            {items?.map((report: IReport) => <IssueReportCard onClick={onClick} key={report._id} report={report} />)}
        </div>
    );
};

export default ListView;
