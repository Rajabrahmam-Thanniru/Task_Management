import { Request, Response } from "express";
import { UserProject } from "../../models/taskAssignment";

export const updateTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { managerId, projectName, teamMembers } = req.body;

    if (!managerId || !projectName || !Array.isArray(teamMembers)) {
      res.status(400).json({ message: "Missing required fields." });
      return;
    }

    const userDoc = await UserProject.findById(managerId);

    if (!userDoc) {
      res.status(404).json({ message: "Manager not found." });
      return;
    }

    const project = userDoc.projects?.get(projectName);

    if (!project) {
      res.status(404).json({ message: "Project not found." });
      return;
    }

    if (userDoc.projects) {
      const projectToUpdate = userDoc.projects.get(projectName);
      if (projectToUpdate) {
        projectToUpdate.teamMembers.forEach((existingMember: any) => {
          const updated = teamMembers.find((tm: any) => tm.name === existingMember.name || tm.id === String(existingMember._id));
          if (updated) {
            existingMember.task = updated.task;
          }
        });
        userDoc.projects.set(projectName, projectToUpdate);
      }
    }

    await userDoc.save();

    res.status(200).json({ message: "Tasks updated successfully." });

  } catch (error) {
    console.error("Error updating tasks:", error);
    res.status(500).json({ message: "Server error." });
  }
};
