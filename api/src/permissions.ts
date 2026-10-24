import type { IPermissionConfig } from "erxes-api-shared/core-types";
import { manifest } from "./config.ts";

export const ROADMAP_READ = "silkRoadRoadmapRead";
export const ROADMAP_WRITE = "silkRoadRoadmapWrite";

export const permissions: IPermissionConfig = {
  plugin: manifest.name,
  modules: [
    {
      name: "silkRoadRoadmaps",
      description: `${manifest.title} сурагчдын суралцах замнал`,
      scopeField: "userId",
      ownerFields: ["userId"],
      scopes: [{ name: "own", description: "Нэвтэрсэн сурагчийн өөрийн суралцах замнал" }],
      actions: [
        {
          name: ROADMAP_READ,
          title: "Суралцах замнал унших",
          description: "Нэвтэрсэн сурагчийн замнал болон сурах материалыг харах",
        },
        {
          name: ROADMAP_WRITE,
          title: "Суралцах замнал шинэчлэх",
          description: "Хичээл сонгох, явцаа хянах, сурах материал хавсаргах",
        },
      ],
    },
  ],
};
