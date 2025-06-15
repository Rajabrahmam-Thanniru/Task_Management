import { Request, Response } from "express";
import { User } from "../../models/User";

export const teamMember = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  if (!userId) {
    res.status(400).json({ message: "User ID is required" });
    return;
  }

  try {
    const userDoc = await User.findById(userId).lean();

    if (!userDoc) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(userDoc);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
