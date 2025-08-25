const { Schema, model } = require("mongoose");

// Define Task schema
const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to User model
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
);

// Export Task model
const Task = model("Task", taskSchema);
module.exports = Task;
