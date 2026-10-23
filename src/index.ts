import express from "express";
import { apiReference } from "@scalar/express-api-reference";
import { fileURLToPath, pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { MenuController } from "@/api/controllers/menu.controller";
import { errorMiddleware } from "@/api/middleware/error.middleware";
import { createMenuRouter } from "@/api/routes/menu.route";
import { generateOpenApiDocument } from "@/api/lib/openapi.lib";
import { MenuService } from "@/application/services/menu.service";
import { PrismaMenuRepository } from "@/infrastructure/persistence/prisma/prisma-menu.repository";
import { env } from "@/config/env";

export const createApp = () => {
  const app = express();

  const menuRepository = new PrismaMenuRepository();
  const menuService = new MenuService(menuRepository);
  const menuController = new MenuController(menuService);

  app.use(express.json());

  app.get("/openapi.json", (_req, res) => {
    res.json(generateOpenApiDocument());
  });

  app.use(
    "/reference",
    apiReference({
      theme: "purple",
      url: "/openapi.json",
    }),
  );

  app.use("/api/menus", createMenuRouter(menuController));

  app.use(errorMiddleware);

  return app;
};

export const startServer = (
  port = env.PORT,
  apiBaseUrl = env.API_BASE_URL ?? `http://localhost:${port}`,
) => {
  const app = createApp();

  return app.listen(port, () => {
    console.log(`Server running at ${apiBaseUrl}`);
    console.log(`API documentation: ${apiBaseUrl}/reference`);
  });
};

export const isMainModule = (entryPoint = process.argv[1]): boolean =>
  entryPoint !== undefined &&
  pathToFileURL(resolve(entryPoint)).href ===
    pathToFileURL(fileURLToPath(import.meta.url)).href;

export const startIfMainModule = (
  entryPoint = process.argv[1],
  start = startServer,
): boolean => {
  if (!isMainModule(entryPoint)) {
    return false;
  }

  start();
  return true;
};

startIfMainModule();
