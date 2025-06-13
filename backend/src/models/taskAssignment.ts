import mongoose from "mongoose";
import { string } from "yup";

const teamMemberSchema = new mongoose.Schema(
  {
    name: String,
    task: String,
    taskCount: { type: Number, default: 0 },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    projectName: String,
    totalTasks: Number,
    projectComplete: { type: Number, default: 0 },
    teamLead: {
      name: String,
      task: String,
      taskCount: { type: Number, default: 0 },
    },
    teamMembers: [teamMemberSchema],
  },
  { _id: false }
);

// Modified schema using only _id as the user reference
const userProjectSchema = new mongoose.Schema({
  _id: { type: String, ref: "User", required: true },
  projects: {
    type: Map,
    of: projectSchema,
  },
});

export const UserProject = mongoose.model("UserProject", userProjectSchema);
