import { Request, Response } from "express";
import { UserProject } from "../../models/taskAssignment"; // model as you've provided

export const AddTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, projectName, totalTasks, teamLead, teamMembers } = req.body;

    if (!userId || !projectName || !teamLead || !teamMembers || totalTasks === undefined) {
      res.status(400).json({ message: "Missing required fields." });
      return;
    }

    const projectData = {
      projectName,
      totalTasks,
      projectComplete: 0,
      teamLead: {
        name: teamLead.name,
        task: teamLead.task,
        taskCount: 0,
      },
      teamMembers: teamMembers.map((member: any) => ({
        name: member.name,
        task: member.task,
        taskCount: 0,
      })),
    };

    let userDoc = await UserProject.findById(userId);

    if (!userDoc) {
      // Create new user with _id as userId
      userDoc = new UserProject({
        _id: userId,
        projects: {
          [projectName]: projectData,
        },
      });
    } else {
      // Add/update the project under the projectName key
      userDoc.set(`projects.${projectName}`, projectData);
    }

    await userDoc.save();

    res.status(201).json({ message: "Task assignment saved successfully." });

  } catch (error) {
    console.error("Error saving task assignment:", error);
    res.status(500).json({ message: "Server error." });
  }
};
