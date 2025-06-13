// src/models/projectModel.ts
import mongoose from "mongoose";

// Allow dynamic keys with _id as String
const projectSchema = new mongoose.Schema(
  { _id: String },
  { strict: false }
);

// Dynamic model getter for different collections
export const getProjectModel = (collectionName: string) => {
  return mongoose.models[collectionName] || mongoose.model(collectionName, projectSchema, collectionName);
};
