import express from "express";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import {
  uploadDataset,
  getMyDatasets,
  searchMyDatasets,
  deleteDataset,
} from "../controllers/datasetController";
import { protect } from "../middleware/auth";

const router = express.Router();

// --- Multer Configuration ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // The folder where files will be saved
  },
  filename: function (req, file, cb) {
    // Create a unique filename to prevent overwrites
    const uniqueSuffix = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueSuffix);
  },
});
const upload = multer({ storage: storage });
// --------------------------

// All routes here are protected
router.use(protect);

// The upload route now uses multer's 'upload.single' middleware
router.post("/upload", upload.single("file"), uploadDataset);

router.get("/", getMyDatasets);
router.get("/search", searchMyDatasets);
router.delete("/:datasetId", deleteDataset);

export default router;
