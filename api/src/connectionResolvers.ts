import type { IMainContext } from "erxes-api-shared/core-types";
import { createGenerateModels } from "erxes-api-shared/utils";
import type { Connection } from "mongoose";
import {
  type ILearningRoadmapModel,
  loadLearningRoadmapClass,
} from "./modules/learning/db/models/LearningRoadmap.ts";
import type { ILearningRoadmapDocument } from "./modules/learning/db/definitions/learningRoadmap.ts";

export interface IModels {
  LearningRoadmaps: ILearningRoadmapModel;
}

/**
 * GraphQL resolver context: what `apolloServerContext` in main.ts returns.
 * `subdomain` is the tenant, `models` are bound to that tenant's database.
 */
// IMainContext declares `models?: any`, which would absorb the typed IModels
// in a plain intersection — Omit it first so resolvers get real types.
export type Context = Omit<IMainContext, "models"> & {
  subdomain: string;
  models: IModels;
};

// Every model must come from this factory: createGenerateModels binds the
// connection for the request's tenant (Mongo `useDb` per organization on
// SaaS), so resolvers never touch another tenant's collections.
const loadClasses = (db: Connection) => {
  const models = {} as IModels;

  models.LearningRoadmaps = db.model<ILearningRoadmapDocument, ILearningRoadmapModel>(
    "silk_road_learning_roadmaps",
    loadLearningRoadmapClass(models),
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(loadClasses);
