import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({}, { strict: false }); // Allow dynamic keys

export const getProjectModel = (collectionName: string) => {
  return mongoose.model(collectionName, projectSchema, collectionName);
};
