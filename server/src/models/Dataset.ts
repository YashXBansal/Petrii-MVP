import { Schema, model, Document, Model, Types } from "mongoose";

export interface IDataset extends Document {
  title: string;
  author: string;
  experimentType: string;
  tags: string[];
  uploaderId: Types.ObjectId;
  fileLocation: string;
  fileKey: string;
  fileContent?: string;
}

const DatasetSchema = new Schema<IDataset>(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    experimentType: { type: String, required: true, trim: true },
    tags: [{ type: String, trim: true }],
    uploaderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileLocation: { type: String, required: true },
    fileKey: { type: String, required: true },
    fileContent: { type: String },
  },
  { timestamps: true }
);

DatasetSchema.index({
  title: "text",
  author: "text",
  experimentType: "text",
  tags: "text",
  fileContent: "text",
});

const Dataset: Model<IDataset> = model<IDataset>("Dataset", DatasetSchema);
export default Dataset;
