import { Request, Response } from "express";
import User from "../models/User";
import Dataset from "../models/Dataset";

export const getUsersForModeration = async (req: Request, res: Response) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } }).select(
      "-password"
    );
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const updateUserStatus = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { status } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = status;
    await user.save();

    res.json({ message: `User status updated to ${status}` });
  } catch (error: any) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getAllDatasets = async (req: Request, res: Response) => {
  try {
    const datasets = await Dataset.find({}).populate(
      "uploaderId",
      "name email"
    );
    res.json(datasets);
  } catch (error: any) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
