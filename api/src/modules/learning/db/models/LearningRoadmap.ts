import type { Model } from "mongoose";
import type { IModels } from "../../../../connectionResolvers.ts";
import type { ILearningStep } from "../../learningPaths.ts";
import {
  type ILearningRoadmapDocument,
  learningRoadmapSchema,
} from "../definitions/learningRoadmap.ts";

export interface ILearningRoadmapModel extends Model<ILearningRoadmapDocument> {
  listForUser(userId: string): Promise<ILearningRoadmapDocument[]>;
  startForUser(userId: string, subjectId: string): Promise<ILearningRoadmapDocument | null>;
  setStepCompletion(
    userId: string,
    subjectId: string,
    stepId: string,
    completed: boolean,
  ): Promise<ILearningRoadmapDocument | null>;
  addStudyFile(
    userId: string,
    subjectId: string,
    file: { name: string; url: string; type: string; size: number },
  ): Promise<ILearningRoadmapDocument | null>;
  createFromStudyFile(
    userId: string,
    subjectId: string,
    file: { name: string; url: string; type: string; size: number },
    steps: ILearningStep[],
  ): Promise<ILearningRoadmapDocument | null>;
}

export const loadLearningRoadmapClass = (models: IModels) => {
  class LearningRoadmap {
    public static listForUser(userId: string) {
      return models.LearningRoadmaps.find({ userId }).sort({ updatedAt: -1, _id: -1 });
    }

    public static startForUser(userId: string, subjectId: string) {
      return models.LearningRoadmaps.findOneAndUpdate(
        { userId, subjectId },
        { $setOnInsert: { userId, subjectId, completedStepIds: [], files: [] } },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    }

    public static setStepCompletion(
      userId: string,
      subjectId: string,
      stepId: string,
      completed: boolean,
    ) {
      return models.LearningRoadmaps.findOneAndUpdate(
        { userId, subjectId },
        completed
          ? { $addToSet: { completedStepIds: stepId } }
          : { $pull: { completedStepIds: stepId } },
        { new: true, runValidators: true },
      );
    }

    public static addStudyFile(
      userId: string,
      subjectId: string,
      file: { name: string; url: string; type: string; size: number },
    ) {
      return models.LearningRoadmaps.findOneAndUpdate(
        { userId, subjectId },
        { $push: { files: file } },
        { new: true, runValidators: true },
      );
    }

    public static createFromStudyFile(
      userId: string,
      subjectId: string,
      file: { name: string; url: string; type: string; size: number },
      steps: ILearningStep[],
    ) {
      return models.LearningRoadmaps.findOne({ userId, subjectId }).then((existing) => {
        const historyEntry = existing?.generatedSteps.length
          ? {
              sourceFileName: existing.files.at(-1)?.name ?? "Өмнөх сурах тэмдэглэл",
              savedAt: existing.updatedAt,
              completedStepIds: existing.completedStepIds,
              generatedSteps: existing.generatedSteps,
            }
          : null;

        return models.LearningRoadmaps.findOneAndUpdate(
          { userId, subjectId },
          {
            $set: { generatedSteps: steps, completedStepIds: [] },
            $setOnInsert: { userId, subjectId },
            $push: {
              files: file,
              ...(historyEntry ? { pathHistory: historyEntry } : {}),
            },
          },
          { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true },
        );
      });
    }
  }

  learningRoadmapSchema.loadClass(LearningRoadmap);

  return learningRoadmapSchema;
};
