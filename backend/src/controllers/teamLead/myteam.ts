import { Response, Request } from "express";
import { getProjectModel } from "../../models/projectModel";

export const myTeam = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  if (!userId) {
    res.status(400).json({ message: "User ID is required" });
    return;
  }

  try {
    const TeamLeadModel = getProjectModel("teamlead");
    const teamLeadDoc = await TeamLeadModel.findById(userId).lean();

    if (!teamLeadDoc) {
      res.status(404).json({ message: "Team lead data not found." });
      return;
    }

    const result: any[] = [];

    for (const [projectKey, projectData] of Object.entries(teamLeadDoc)) {
      if (["_id", "__v"].includes(projectKey)) continue;

      const project = projectData as any;
      const teamMembers = project.teamMembers || {};

      const membersArray = Object.entries(teamMembers).map(
        ([id, name]) => ({
          id,
          name,
        })
      );

      result.push({
        projectName: project.projectName || projectKey,
        teamMembers: membersArray,
      });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error in myTeam:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
