import express from "express";
import { apiReference } from "@scalar/express-api-reference";
import { MenuController } from "@/api/controllers/menu.controller";
import { errorMiddleware } from "@/api/middleware/error.middleware";
import { createMenuRouter } from "@/api/routes/menu.route";
import { generateOpenApiDocument } from "@/api/lib/openapi.lib";
import { MenuService } from "@/application/services/menu.service";
import { PrismaMenuRepository } from "@/infrastructure/persistence/prisma/prisma-menu.repository";

const app = express();

const port = Number(process.env.PORT ?? 3000);
const apiBaseUrl = process.env.API_BASE_URL ?? `http://localhost:${port}`;

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

app.listen(port, () => {
  console.log(`Server running at ${apiBaseUrl}`);
  console.log(`API documentation: ${apiBaseUrl}/reference`);
});
