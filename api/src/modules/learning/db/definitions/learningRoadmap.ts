import { schemaWrapper } from "erxes-api-shared/utils";
import { Schema, type Document, type Types } from "mongoose";

export interface IStudyFile {
  _id: Types.ObjectId;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
}

export interface ILearningPathVersion {
  _id: Types.ObjectId;
  sourceFileName: string;
  savedAt: Date;
  completedStepIds: string[];
  generatedSteps: Array<{
    id: string;
    title: string;
    description: string;
    minutes: number;
    activity: string;
  }>;
}

export interface ILearningRoadmap {
  userId: string;
  subjectId: string;
  completedStepIds: string[];
  generatedSteps: Array<{
    id: string;
    title: string;
    description: string;
    minutes: number;
    activity: string;
  }>;
  pathHistory: ILearningPathVersion[];
  files: IStudyFile[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ILearningRoadmapDocument extends ILearningRoadmap, Document {}

const studyFileSchema = new Schema<IStudyFile>({
  name: { type: String, required: true },
  url: { type: String, required: true },
  type: { type: String, required: true },
  size: { type: Number, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

const historyStepSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    minutes: { type: Number, required: true },
    activity: { type: String, required: true },
  },
  { _id: false },
);

const pathHistorySchema = new Schema<ILearningPathVersion>({
  sourceFileName: { type: String, required: true },
  savedAt: { type: Date, required: true },
  completedStepIds: { type: [String], default: [] },
  generatedSteps: { type: [historyStepSchema], required: true },
});

export const learningRoadmapSchema = schemaWrapper(
  new Schema<ILearningRoadmap>(
    {
      userId: { type: String, required: true },
      subjectId: { type: String, required: true },
      completedStepIds: { type: [String], default: [] },
      generatedSteps: {
        type: [
          {
            id: { type: String, required: true },
            title: { type: String, required: true },
            description: { type: String, required: true },
            minutes: { type: Number, required: true },
            activity: { type: String, required: true },
          },
        ],
        default: [],
      },
      pathHistory: { type: [pathHistorySchema], default: [] },
      files: { type: [studyFileSchema], default: [] },
    },
    { timestamps: true },
  ),
);

learningRoadmapSchema.index({ userId: 1, subjectId: 1 }, { unique: true });
learningRoadmapSchema.index({ userId: 1, updatedAt: -1 });
