import { Request, Response } from "express";
import { getProjectModel } from "../../models/projectModel";
import { Ref } from "../../models/refModel";

export const postproject = async (req: Request, res: Response): Promise<void> => {
  const { userId, projectId, projectData, collection } = req.body;

  if (!userId || !projectId || !projectData || !collection) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  try {
    const { projectName, startDate, endDate, priority, teamLead, teamMembers } = projectData;
    const teamLeadId = Object.keys(teamLead)[0];
    const teamLeadName = teamLead[teamLeadId];

    /** ===== 1. Save to Manager Collection ===== */
    const ManagerModel = getProjectModel("manager");

    // Inject projectcomp: 0
    const managerProjectData = {
      ...projectData,
      projectcomp: 0,
    };

    let managerDoc = await ManagerModel.findById(userId);
    if (!managerDoc) {
      managerDoc = new ManagerModel({ _id: userId, [projectId]: managerProjectData });
    } else {
      managerDoc.set(projectId, managerProjectData);
    }
    await managerDoc.save();

    /** ===== 2. Save to TeamLead Collection ===== */
    const TeamLeadModel = getProjectModel("teamlead");

    const teamLeadEntry = {
      projectName,
      startDate,
      endDate,
      priority,
      taskcount: 0,
      manager: { [userId]: projectData?.manager?.[userId] || "Manager" },
      teamMembers,
    };

    let teamLeadDoc = await TeamLeadModel.findById(teamLeadId);
    if (!teamLeadDoc) {
      teamLeadDoc = new TeamLeadModel({ _id: teamLeadId, [projectName]: teamLeadEntry });
    } else {
      const existing = teamLeadDoc.get(projectName);
      if (!existing) {
        teamLeadDoc.set(projectName, teamLeadEntry);
      }
    }
    await teamLeadDoc.save();

    /** ===== 3. Save to Each TeamMember Document ===== */
    const TeamMemberModel = getProjectModel("teammember");

    for (const memberId in teamMembers) {
      const memberName = teamMembers[memberId];
      const memberEntry = {
        projectName,
        startDate,
        endDate,
        priority,
        taskcount: 0,
        teamLead: { [teamLeadId]: teamLeadName },
        teamMember: { [memberId]: memberName },
      };

      let memberDoc = await TeamMemberModel.findById(memberId);
      if (!memberDoc) {
        memberDoc = new TeamMemberModel({ _id: memberId, [projectName]: memberEntry });
      } else {
        memberDoc.set(projectName, memberEntry);
      }

      await memberDoc.save();
    }

    /** ===== 4. Update Ref Collection ===== */
    const userIdsToAdd = [teamLeadId, ...Object.keys(teamMembers)];
    const existingRef = await Ref.findById("ids");

    if (!existingRef) {
      const newRef = new Ref({
        _id: "ids",
        userIds: userIdsToAdd,
      });
      await newRef.save();
    } else {
      const mergedUserIds = Array.from(new Set([...existingRef.userIds, ...userIdsToAdd]));
      existingRef.userIds = mergedUserIds;
      await existingRef.save();
    }

    res.status(200).json({
      message: "Project saved successfully to all collections",
      data: {
        manager: "saved with projectcomp: 0",
        teamLead: "saved with taskcount: 0 (if not duplicate)",
        teamMember: "each saved with taskcount: 0",
        ref: "updated with unique userIds",
      },
    });
  } catch (error) {
    console.error("PostProject Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
