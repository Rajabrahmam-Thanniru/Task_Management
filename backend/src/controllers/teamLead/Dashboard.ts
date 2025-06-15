import { Request, Response } from "express";
import { getProjectModel } from "../../models/projectModel";
import { User } from "../../models/User";

export const DashboardTL = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  if (!userId) {
    res.status(400).json({ message: "User ID is required" });
    return;
  }

  try {
    const TeamLeadModel = getProjectModel("teamlead");
    const ManagerModel = getProjectModel("manager");

    const teamLeadDoc = await TeamLeadModel.findById(userId).lean();

    if (!teamLeadDoc) {
      res.status(404).json({ message: "No projects found for this team lead" });
      return;
    }

    let projects: any = {};
    if (teamLeadDoc && !Array.isArray(teamLeadDoc)) {
      const { _id, __v, ...rest } = teamLeadDoc;
      projects = rest;
    }

    const projectList = await Promise.all(
      Object.entries(projects).map(async ([projectKey, projectData]: any) => {
        const project = projectData as any;

        const managerId = Object.keys(project.manager || {})[0];
        const managerDoc = await User.findById(managerId).lean();
        const managerName = managerDoc?.name || "Unknown Manager";

        // Fetch project completion from manager collection
        let projectcomp = 0;
        const managerProjectDoc = await ManagerModel.findById(managerId).lean();
        if (
          managerProjectDoc &&
          !(Array.isArray(managerProjectDoc)) &&
          (managerProjectDoc as Record<string, any>)[projectKey]
        ) {
          projectcomp = (managerProjectDoc as Record<string, any>)[projectKey].projectcomp || 0;
        }

        return {
          projectId: projectKey,
          managerId,               // Include the manager ID here
          ...project,
          manager: managerName,
          projectcomp,
        };
      })
    );

    res.status(200).json({ projects: projectList });
  } catch (error) {
    console.error("DashboardTL Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
