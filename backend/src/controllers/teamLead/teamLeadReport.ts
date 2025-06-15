import { Request, Response } from "express";
import { TeamLeadReport } from "../../models/teamLeadReport";

export const submitReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { managerId, projectName, report } = req.body;

    if (!managerId || !projectName || !report) {
      res.status(400).json({ message: "managerId, projectName, and report are required" });
      return;
    }

    const newReport = new TeamLeadReport({
      managerId,
      projectName,
      report,
    });

    await newReport.save();

    res.status(201).json({ message: "Report submitted successfully" });
  } catch (error) {
    console.error("Error saving report:", error);
    res.status(500).json({ message: "Server error" });
  }
};
