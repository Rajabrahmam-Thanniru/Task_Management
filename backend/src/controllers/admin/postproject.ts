import { Request, Response } from "express";
import { getProjectModel } from "../../models/projectModel";

export const postproject = async (req: Request, res: Response): Promise<void> => {
  const { userId, projectId, projectData, collection } = req.body;

  if (!userId || !projectId || !projectData || !collection) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  try {
    // Save to manager collection only if explicitly requested
    if (collection === "manager") {
      const ManagerModel = getProjectModel("manager");
      let managerDoc = await ManagerModel.findOne({});

      if (!managerDoc) {
        managerDoc = new ManagerModel({ [userId]: { [projectId]: projectData } });
      } else {
        const managerProjects = managerDoc.get(userId) || {};
        managerProjects[projectId] = projectData;
        managerDoc.set(userId, managerProjects);
      }
      await managerDoc.save();

      // Extract necessary fields
      const { projectName, startDate, endDate, priority, teamLead, teamMembers } = projectData;
      const teamLeadId = Object.keys(teamLead)[0];
      const teamLeadName = teamLead[teamLeadId];

      // Save to teamlead collection
      const TeamLeadModel = getProjectModel("teamlead");
      let teamLeadDoc = await TeamLeadModel.findOne({});
      const teamLeadEntry = {
        projectName,
        startDate,
        endDate,
        priority,
        manager: { [userId]: projectData?.manager?.[userId] || "Manager" },
        teamMembers,
      };

      if (!teamLeadDoc) {
        teamLeadDoc = new TeamLeadModel({
          [teamLeadId]: {
            [projectName]: teamLeadEntry,
          },
        });
      } else {
        const leadProjects = teamLeadDoc.get(teamLeadId) || {};
        leadProjects[projectName] = teamLeadEntry;
        teamLeadDoc.set(teamLeadId, leadProjects);
      }
      await teamLeadDoc.save();

      // Save to each teammember collection
      const TeamMemberModel = getProjectModel("teammember");
      let teamMemberDoc = await TeamMemberModel.findOne({});
      if (!teamMemberDoc) teamMemberDoc = new TeamMemberModel({});

      for (const memberId in teamMembers) {
        const memberEntry = {
          projectName,
          startDate,
          endDate,
          priority,
          teamLead: { [teamLeadId]: teamLeadName },
        };

        const memberProjects = teamMemberDoc.get(memberId) || {};
        memberProjects[projectName] = memberEntry;
        teamMemberDoc.set(memberId, memberProjects);
      }

      await teamMemberDoc.save();

      res.status(200).json({
        message: "Project saved successfully to all collections",
        data: {
          manager: "saved",
          teamLead: "saved",
          teamMember: "saved",
        },
      });
    } else {
      res.status(400).json({ message: "Unsupported collection type" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
