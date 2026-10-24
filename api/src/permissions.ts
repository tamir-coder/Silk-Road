import type { IPermissionConfig } from "erxes-api-shared/core-types";
import { manifest } from "./config.ts";

export const ROADMAP_READ = "silkRoadRoadmapRead";
export const ROADMAP_WRITE = "silkRoadRoadmapWrite";

export const permissions: IPermissionConfig = {
  plugin: manifest.name,
  modules: [
    {
      name: "silkRoadRoadmaps",
      description: `${manifest.title} student learning roadmaps`,
      scopeField: "userId",
      ownerFields: ["userId"],
      scopes: [{ name: "own", description: "The signed-in student's own roadmaps" }],
      actions: [
        {
          name: ROADMAP_READ,
          title: "Read learning roadmaps",
          description: "View the signed-in student's learning paths and study materials",
        },
        {
          name: ROADMAP_WRITE,
          title: "Update learning roadmaps",
          description: "Choose subjects, track progress, and attach study materials",
        },
      ],
    },
  ],
};
