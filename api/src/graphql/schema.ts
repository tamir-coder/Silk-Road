import { gql } from "graphql-tag";
import { GraphQLError } from "graphql";
import type { Context } from "../connectionResolvers.ts";
import {
  buildStepsFromStudyNotes,
  getLearningSubject,
  LEARNING_SUBJECTS,
} from "../modules/learning/learningPaths.ts";
import { ROADMAP_READ, ROADMAP_WRITE } from "../permissions.ts";

export const typeDefs = gql`
  type SilkRoadLearningStep {
    id: String!
    title: String!
    description: String!
    minutes: Int!
    activity: String!
  }

  type SilkRoadSubject {
    id: String!
    name: String!
    description: String!
    gradeRange: String!
    hours: Int!
    steps: [SilkRoadLearningStep!]!
  }

  type SilkRoadStudyFile {
    id: String!
    name: String!
    url: String!
    type: String!
    size: Int!
    uploadedAt: String!
  }

  type SilkRoadPathVersion {
    id: String!
    sourceFileName: String!
    savedAt: String!
    completedStepIds: [String!]!
    generatedSteps: [SilkRoadLearningStep!]!
  }

  type SilkRoadRoadmap {
    _id: String!
    subjectId: String!
    subject: SilkRoadSubject!
    generatedSteps: [SilkRoadLearningStep!]!
    pathHistory: [SilkRoadPathVersion!]!
    completedStepIds: [String!]!
    files: [SilkRoadStudyFile!]!
    updatedAt: String!
  }

  input SilkRoadStudyFileInput {
    name: String!
    url: String!
    type: String!
    size: Int!
  }

  type Query {
    silkRoadLearningSubjects: [SilkRoadSubject!]!
    silkRoadMyRoadmaps: [SilkRoadRoadmap!]!
  }

  type Mutation {
    silkRoadStartRoadmap(subjectId: String!): SilkRoadRoadmap!
    silkRoadSetStepCompletion(
      subjectId: String!
      stepId: String!
      completed: Boolean!
    ): SilkRoadRoadmap!
    silkRoadAddStudyFile(subjectId: String!, input: SilkRoadStudyFileInput!): SilkRoadRoadmap!
    silkRoadCreateRoadmapFromStudyFile(
      subjectId: String!
      input: SilkRoadStudyFileInput!
      content: String!
    ): SilkRoadRoadmap!
  }
`;

const requireStudent = async (context: Context, action: string): Promise<string> => {
  const userId = context.user?._id;
  if (typeof userId !== "string" || !userId) {
    throw new GraphQLError("Login required", { extensions: { code: "UNAUTHENTICATED" } });
  }
  if (!context.subdomain) {
    throw new GraphQLError("Tenant required", { extensions: { code: "FORBIDDEN" } });
  }
  await context.checkPermission(action);
  return userId;
};

const requireSubject = (subjectId: string) => {
  const subject = getLearningSubject(subjectId);
  if (!subject) {
    throw new GraphQLError("Choose a subject from the learning catalog", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }
  return subject;
};

const serializeRoadmap = (roadmap: {
  _id: { toString(): string };
  subjectId: string;
  completedStepIds: string[];
  generatedSteps?: Array<{
    id: string;
    title: string;
    description: string;
    minutes: number;
    activity: string;
  }>;
  pathHistory?: Array<{
    _id: { toString(): string };
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
  }>;
  files: Array<{
    _id: { toString(): string };
    name: string;
    url: string;
    type: string;
    size: number;
    uploadedAt: Date;
  }>;
  updatedAt: Date;
}) => ({
  _id: roadmap._id.toString(),
  subjectId: roadmap.subjectId,
  completedStepIds: roadmap.completedStepIds,
  files: roadmap.files
    .filter((file) => Boolean(file.name && file.url))
    .map((file) => ({
      id: file._id.toString(),
      name: file.name,
      url: file.url,
      type: file.type || "application/octet-stream",
      size: Number.isInteger(file.size) ? file.size : 0,
      uploadedAt: file.uploadedAt?.toISOString?.() ?? new Date().toISOString(),
    })),
  updatedAt: roadmap.updatedAt.toISOString(),
  generatedSteps: roadmap.generatedSteps ?? [],
  pathHistory: (roadmap.pathHistory ?? []).map((version) => ({
    id: version._id.toString(),
    sourceFileName: version.sourceFileName,
    savedAt: version.savedAt.toISOString(),
    completedStepIds: version.completedStepIds,
    generatedSteps: version.generatedSteps,
  })),
});

export const resolvers = {
  Query: {
    silkRoadLearningSubjects: () => LEARNING_SUBJECTS,
    silkRoadMyRoadmaps: async (_parent: unknown, _args: unknown, context: Context) => {
      const userId = await requireStudent(context, ROADMAP_READ);
      const roadmaps = await context.models.LearningRoadmaps.listForUser(userId);
      return roadmaps.map(serializeRoadmap);
    },
  },
  SilkRoadRoadmap: {
    subject: (roadmap: { subjectId: string }) => {
      const subject = getLearningSubject(roadmap.subjectId);
      if (!subject) {
        throw new GraphQLError("This learning path is no longer available", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
      return subject;
    },
  },
  Mutation: {
    silkRoadStartRoadmap: async (
      _parent: unknown,
      { subjectId }: { subjectId: string },
      context: Context,
    ) => {
      requireSubject(subjectId);
      const userId = await requireStudent(context, ROADMAP_WRITE);
      const roadmap = await context.models.LearningRoadmaps.startForUser(userId, subjectId);
      if (!roadmap) {
        throw new GraphQLError("Could not start this learning path", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
      return serializeRoadmap(roadmap);
    },
    silkRoadSetStepCompletion: async (
      _parent: unknown,
      { subjectId, stepId, completed }: { subjectId: string; stepId: string; completed: boolean },
      context: Context,
    ) => {
      const subject = requireSubject(subjectId);
      const userId = await requireStudent(context, ROADMAP_WRITE);
      const savedRoadmap = await context.models.LearningRoadmaps.findOne({ userId, subjectId });
      const validStep =
        subject.steps.some((step) => step.id === stepId) ||
        savedRoadmap?.generatedSteps.some((step) => step.id === stepId);
      if (!validStep) {
        throw new GraphQLError("Choose a step from this learning path", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }
      const roadmap = await context.models.LearningRoadmaps.setStepCompletion(
        userId,
        subjectId,
        stepId,
        completed,
      );
      if (!roadmap) {
        throw new GraphQLError("Start this learning path before tracking progress", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }
      return serializeRoadmap(roadmap);
    },
    silkRoadAddStudyFile: async (
      _parent: unknown,
      {
        subjectId,
        input,
      }: {
        subjectId: string;
        input: { name: string; url: string; type: string; size: number };
      },
      context: Context,
    ) => {
      requireSubject(subjectId);
      const userId = await requireStudent(context, ROADMAP_WRITE);
      const safeUrl =
        input.url.startsWith("/") && !input.url.startsWith("//")
          ? true
          : (() => {
              try {
                const url = new URL(input.url);
                return url.protocol === "https:" || url.protocol === "http:";
              } catch {
                return false;
              }
            })();
      if (
        !input.name.trim() ||
        input.name.length > 255 ||
        !safeUrl ||
        input.url.length > 2048 ||
        input.type.length > 120 ||
        !Number.isInteger(input.size) ||
        input.size < 1 ||
        input.size > 20 * 1024 * 1024
      ) {
        throw new GraphQLError("Upload a supported file smaller than 20 MB", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }
      const roadmap = await context.models.LearningRoadmaps.addStudyFile(userId, subjectId, {
        ...input,
        name: input.name.trim(),
      });
      if (!roadmap) {
        throw new GraphQLError("Start this learning path before adding study materials", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }
      return serializeRoadmap(roadmap);
    },
    silkRoadCreateRoadmapFromStudyFile: async (
      _parent: unknown,
      {
        subjectId,
        input,
        content,
      }: {
        subjectId: string;
        input: { name: string; url: string; type: string; size: number };
        content: string;
      },
      context: Context,
    ) => {
      requireSubject(subjectId);
      const userId = await requireStudent(context, ROADMAP_WRITE);
      const safeUrl =
        input.url.startsWith("/") && !input.url.startsWith("//")
          ? true
          : (() => {
              try {
                const url = new URL(input.url);
                return url.protocol === "https:" || url.protocol === "http:";
              } catch {
                return false;
              }
            })();
      if (
        !input.name.trim() ||
        input.name.length > 255 ||
        !safeUrl ||
        input.url.length > 2048 ||
        input.type.length > 120 ||
        !Number.isInteger(input.size) ||
        input.size < 1 ||
        input.size > 20 * 1024 * 1024 ||
        content.trim().length < 20 ||
        content.length > 30_000
      ) {
        throw new GraphQLError(
          "Choose a text file with at least 20 characters and no more than 30,000 characters",
          {
            extensions: { code: "BAD_USER_INPUT" },
          },
        );
      }
      const generatedSteps = buildStepsFromStudyNotes(content);
      if (generatedSteps.length < 2) {
        throw new GraphQLError("Add notes with at least two topics or study points", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }
      const roadmap = await context.models.LearningRoadmaps.createFromStudyFile(
        userId,
        subjectId,
        { ...input, name: input.name.trim() },
        generatedSteps,
      );
      if (!roadmap) {
        throw new GraphQLError("Could not build a roadmap from this file", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
      return serializeRoadmap(roadmap);
    },
  },
};
