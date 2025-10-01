import express from "express";
import {
  getUsersForModeration,
  updateUserStatus,
  getAllDatasets,
} from "../controllers/adminController";
import { protect, admin } from "../middleware/auth";

const router = express.Router();

// All routes in this file are protected and require admin role
router.use(protect, admin);

router.get("/users", getUsersForModeration);
router.put("/users/:userId/status", updateUserStatus);
router.get("/datasets", getAllDatasets);

export default router;