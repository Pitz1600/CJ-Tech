import express from "express";
import { createTask, getTasks, getTaskById, deleteTask } from "../controllers/taskController.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();

router.post("/create", userAuth, createTask);
router.get("/", userAuth, getTasks);
router.get("/:id", userAuth, getTaskById);
router.delete("/:id", userAuth, deleteTask);

export default router;