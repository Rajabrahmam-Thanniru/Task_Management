import { Request, Response } from "express";
import { User } from "../models/User";

export const getTeamLeadsAndMembers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find({ role: { $in: ["team_lead", "team_member"] } })
      .select("name _id role");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch team leads and members." });
  }
};
