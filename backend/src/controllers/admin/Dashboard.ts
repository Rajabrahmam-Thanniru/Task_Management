import { Request, Response } from "express";
import { getProjectModel } from "../../models/projectModel";

export const Dashboard = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  if (!userId) {
    res.status(400).json({ message: "userId is required" });
    return;
  }

  try {
    const ManagerModel = getProjectModel("manager");
    const managerDoc = await ManagerModel.findById(userId);

    if (!managerDoc) {
      res.status(404).json({ message: "Manager data not found" });
      return;
    }

    // Convert document to plain object
    const allProjects = managerDoc.toObject();

    // Remove the _id field
    delete allProjects._id;

    // Filter out non-object values (e.g., _id or accidental strings)
    const formattedProjects = Object.values(allProjects).filter(
      (proj) =>
        typeof proj === "object" &&
        proj !== null &&
        "projectName" in proj // basic validation that it's a project
    );

    res.status(200).json({ projects: formattedProjects });
  } catch (error) {
    console.error("Error fetching dashboard:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
