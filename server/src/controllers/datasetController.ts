import { Response } from "express";
import fs from "fs";
import path from "path";
import { AuthRequest } from "../middleware/auth";
import Dataset from "../models/Dataset";

export const uploadDataset = async (req: AuthRequest, res: Response) => {
  const { title, author, experimentType, tags } = req.body;
  const uploaderId = req.user?._id;

  if (!req.file) {
    return res.status(400).json({ message: "No file was uploaded." });
  }
  if (!title || !author || !experimentType) {
    return res
      .status(400)
      .json({ message: "Please provide all required metadata." });
  }

  try {
    let fileContent = "";
    try {
      fileContent = fs.readFileSync(req.file.path, "utf-8");
    } catch (readError) {
      console.warn("Could not read file content for indexing:", readError);
    }
    const dataset = await Dataset.create({
      title,
      author,
      experimentType,
      tags: Array.isArray(tags) ? tags : tags ? tags.split(",") : [],
      uploaderId,
      fileLocation: `/uploads/${req.file.filename}`,
      fileKey: req.file.filename,
      fileContent: fileContent, 
    });
    res.status(201).json(dataset);
  } catch (error: any) {
    if (error.code === 11000 || error.message.includes("document size")) {
      return res
        .status(400)
        .json({ message: "File content is too large to be indexed." });
    }
    res
      .status(500)
      .json({
        message: "Server Error during dataset creation",
        error: error.message,
      });
  }
};

export const deleteDataset = async (req: AuthRequest, res: Response) => {
  const { datasetId } = req.params;
  try {
    const dataset = await Dataset.findById(datasetId);
    if (!dataset) {
      return res.status(404).json({ message: "Dataset not found" });
    }
    if (dataset.uploaderId.toString() !== req.user?.id) {
      return res
        .status(403)
        .json({ message: "User not authorized to delete this dataset" });
    }
    const filePath = path.join(
      __dirname,
      "..",
      "..",
      "uploads",
      dataset.fileKey
    );
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Failed to delete local file:", err);
      }
    });

    await dataset.deleteOne();
    res.json({ message: "Dataset deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getMyDatasets = async (req: AuthRequest, res: Response) => {
  try {
    const datasets = await Dataset.find({ uploaderId: req.user?._id });
    res.json(datasets);
  } catch (error: any) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const searchMyDatasets = async (req: AuthRequest, res: Response) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ message: "Search query is required" });
  try {
    const datasets = await Dataset.find({
      uploaderId: req.user?._id,
      $text: { $search: q as string },
    });
    res.json(datasets);
  } catch (error: any) {
    res.status(500).json({ message: "Server Error" });
  }
};
