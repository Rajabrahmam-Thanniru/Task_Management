import { Request, Response } from "express";
import { User } from "../models/User";
import { loginSchema } from "../utils/validateLogin";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    await loginSchema.validate(req.body);
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    res.json({
      success: true,
      message: "Login successful",
      token,
      name: user.name,
      role: user.role,
      userId: user._id,
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
