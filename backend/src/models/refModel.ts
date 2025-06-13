import mongoose from "mongoose";

const refSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true, // Always "ids"
  },
  userIds: {
    type: [String], // Array of user IDs
    required: true,
    default: [],
  },
});

export const Ref = mongoose.model("Ref", refSchema);
