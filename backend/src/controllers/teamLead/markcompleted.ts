import { Request, Response } from "express";
import { UserProject } from "../../models/taskAssignment";

export const markcompleted = async (req: Request, res: Response): Promise<void> => {
  try {
    const { managerId, projectName } = req.body;

    if (!managerId || !projectName) {
      res.status(400).json({ message: "managerId and projectName are required" });
      return;
    }

    const userDoc = await UserProject.findById(managerId);

    if (!userDoc || !userDoc.projects || !userDoc.projects.has(projectName)) {
      res.status(404).json({ message: "Project not found for this manager" });
      return;
    }

    const project = userDoc.projects.get(projectName);

    if (!project || !project.teamLead) {
      res.status(404).json({ message: "Team Lead or project not found" });
      return;
    }

    if (project.teamLead.taskCount === 1) {
      res.status(400).json({ message: "Task already marked as completed" });
      return;
    }

    project.teamLead.taskCount = 1;
    project.projectComplete = (project.projectComplete || 0) + 1;

    await userDoc.save();

    res.status(200).json({ message: "Team Lead task marked as completed" });
  } catch (error) {
    console.error("Error marking task as completed:", error);
    res.status(500).json({ message: "Server error" });
  }
};
