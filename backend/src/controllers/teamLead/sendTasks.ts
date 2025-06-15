import { Request, Response } from "express";
import { UserProject } from "../../models/taskAssignment";

export const sendTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { managerId, projectName } = req.query;

    if (!managerId || !projectName) {
      res.status(400).json({ message: "managerId and projectName are required" });
      return;
    }

    const userDoc = await UserProject.findById(managerId);

    if (!userDoc) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (!userDoc.projects) {
      res.status(404).json({ message: "Projects not found for user" });
      return;
    }

    const project = userDoc.projects.get(projectName as string);

    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    const result = {
      projectName: project.projectName,
      totalTasks: project.totalTasks,
      teamLead: project.teamLead,
      teamMembers: project.teamMembers,
    };

    res.status(200).json(result);
  } catch (error) {
    console.error("Error retrieving tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
};
