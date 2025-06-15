import mongoose, { Schema, Document } from "mongoose";

export interface ITeamLeadReport extends Document {
  managerId: string;
  projectName: string;
  report: string;
  submittedAt: Date;
}

const TeamLeadReportSchema: Schema = new Schema({
  managerId: { type: String, required: true },
  projectName: { type: String, required: true },
  report: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
});

export const TeamLeadReport = mongoose.model<ITeamLeadReport>(
  "TeamLeadReport",
  TeamLeadReportSchema
);
