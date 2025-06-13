import { Request, Response } from "express";
import { User } from "../models/User";
import { Ref } from "../models/refModel";

export const getTeamLeadsAndMembers = async (req: Request, res: Response): Promise<void> => {
  try {
    // Step 1: Fetch all team leads and members
    const users = await User.find({ role: { $in: ["team_lead", "team_member"] } })
      .select("name _id role");

    // Step 2: Try to fetch ref document
    const refDoc = await Ref.findById("ids");

    // Step 3: If ref not found, return all users
    if (!refDoc) {
      res.status(200).json(users);
      return;
    }

    // Step 4: Filter out users whose _id exists in ref.userIds
    const refUserIds = refDoc.userIds || [];
    const filteredUsers = users.filter(user => !refUserIds.includes(user._id.toString()));

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getTeamLeadsAndMembers:", error);
    res.status(500).json({ error: "Failed to fetch team leads and members." });
  }
};
