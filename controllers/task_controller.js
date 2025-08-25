const Task = require("../models/task");
Task
// ✅ Create Task
const createTask = async (req, res) => {
  try {
    const { title, description, date } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    const task = await Task.create({
      title,
      description,
      user: req.user.id,
      createdAt:date
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get Tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Tasks fetched successfully",
      tasks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update Task
const updateTask = async (req, res) => {
  try {
    const { id, title, description } = req.body;

    const task = await Task.findOne({ _id: id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    if (title) task.title = title;
    if (description) task.description = description;

    await task.save();

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete Task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.body;

    const task = await Task.findOneAndDelete({ _id: id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Mark In-Progress
const markInProgress = async (req, res) => {
  try {
    const { id } = req.body;

    const task = await Task.findOne({ _id: id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    task.status = "pending";
    await task.save();

    res.status(200).json({
      success: true,
      message: "Task marked as in-progress",
      task,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Mark Completed
const markCompleted = async (req, res) => {
  try {
    const { id } = req.body;

    const task = await Task.findOne({ _id: id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    task.status = "completed";
    await task.save();

    res.status(200).json({
      success: true,
      message: "Task marked as completed",
      task,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  markInProgress,
  markCompleted,
};
