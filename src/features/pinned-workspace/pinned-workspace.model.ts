import { model, Schema } from "mongoose";

interface PinnedWorkspaceDocument extends Document {
    owner: Schema.Types.ObjectId;
    workspace: Schema.Types.ObjectId;
}

const PinnedWorkspaceSchema = new Schema<PinnedWorkspaceDocument>({
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    workspace: { type: Schema.Types.ObjectId, ref: "Workspace", required: true },
});

PinnedWorkspaceSchema.index({ owner: 1, workspace: 1 }, { unique: true });
const PinnedWorkspaceModel = model<PinnedWorkspaceDocument>("PinnedWorkspace", PinnedWorkspaceSchema);
export default PinnedWorkspaceModel;
