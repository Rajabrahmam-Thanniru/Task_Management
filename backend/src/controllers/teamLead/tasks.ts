import { Request, Response } from "express";
import { getProjectModel } from "../../models/projectModel";
import { UserProject } from "../../models/taskAssignment";

export const tasks = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  if (!userId) {
    res.status(400).json({ message: "User ID is required" });
    return;
  }

  try {
    const TeamLeadModel = getProjectModel("teamlead");
    const teamLeadDoc = await TeamLeadModel.findById(userId).lean();

    if (!teamLeadDoc) {
      res.status(404).json({ message: "Team lead not found" });
      return;
    }

    const response: any[] = [];
    if (Array.isArray(teamLeadDoc)) {
      res.status(500).json({ message: "Unexpected array returned for team lead document" });
      return;
    }
    const { _id, __v, ...projects } = teamLeadDoc;

    for (const [projectName, projectData] of Object.entries(projects)) {
      const managerObj = (projectData as any).manager;
      const managerId = managerObj ? Object.keys(managerObj)[0] : null;

      if (!managerId) continue;

      const userDoc = await UserProject.findById(managerId).lean();

      if (!userDoc || !userDoc.projects) continue;

      const projectDetails = userDoc.projects[projectName];

      if (!projectDetails) continue;

      response.push({
        projectName,
        managerId,
        totalTasks: projectDetails.totalTasks,
        projectComplete: projectDetails.projectComplete,
        teamLead: projectDetails.teamLead,
        teamMembers: projectDetails.teamMembers,
      });
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("Error retrieving tasks:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
