import taskModel from "../models/taskModel.js";
import userModel from "../models/userModel.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, hasDeadline, deadline, images } = req.body;

    // Ensure user exists (based on ID from userAuth middleware)
    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const newTask = new taskModel({
      userEmail: user.email,
      title,
      description,
      hasDeadline,
      deadline: hasDeadline ? deadline : null,
      images,
    });

    await newTask.save();

    return res.json({ success: true, message: "Task created successfully", task: newTask });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const tasks = await taskModel.find({ userEmail: user.email }).sort({ createdAt: -1 });
    res.json({ success: true, tasks });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await taskModel.findById(req.params.id);
    if (!task) {
      return res.json({ success: false, message: "Task not found" });
    }
    res.json({ success: true, task });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await taskModel.findById(req.params.id);
    if (!task) {
      return res.json({ success: false, message: "Task not found" });
    }

    await taskModel.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};