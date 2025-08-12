const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  questionAnswered: {
    type: Boolean,
    default: false,
  },
  questions: [
    {
      sugar: {
        type: Boolean,
        required: true,
        default: null,
      },
      bloodPressure: {
        type: Boolean,
        required: true,
        default: null,
      },
      overWeight: {
        type: Boolean,
        required: true,
        default: null,
      },
      age: {
        type: Number,
      },
      gender: {
        type: String,
      },
      height: {
        type: Number,
      },
      weight: {
        type: Number,
      },
      bmi: {
        type: Number,
      },
      allergies: {
        type: Array,
      },
      religious: {
        type: Array,
      },
      dietary: {
        type: Array,
      },
      purpose: {
        type: Array,
      },
      cholesterol: {
        type: Boolean,
        required: true,
        default: null,
      },
    },
  ],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
