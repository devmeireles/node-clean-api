import { Router } from "express";
import { registry } from "../lib/openapi.lib";
import {
  getAllMenus,
  getMenuById,
  createMenu,
  updateMenu,
  deleteMenu,
} from "../controllers/menu.controller";
import { createMenuSchema, menuIdSchema } from "../schemas/menu.schema";

const menuRouter = Router();

menuRouter.post("/menus", createMenu);
menuRouter.get("/menus/:id", getMenuById);
menuRouter.get("/menus", getAllMenus);
menuRouter.put("/menus/:id", updateMenu);
menuRouter.delete("/menus/:id", deleteMenu);

registry.registerPath({
  method: "post",
  path: "/api/menus",
  summary: "Create a menu",
  tags: ["Menus"],
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: createMenuSchema,
        },
      },
    },
  },
  responses: {
    201: { description: "Menu created" },
    400: { description: "Invalid input" },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/menus/{id}",
  summary: "Get a menu by ID",
  tags: ["Menus"],
  request: {
    params: menuIdSchema,
  },
  responses: {
    200: { description: "Menu retrieved" },
    404: { description: "Menu not found" },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/menus",
  summary: "Get all menus",
  tags: ["Menus"],
  responses: {
    200: { description: "Menus retrieved" },
  },
});

registry.registerPath({
  method: "put",
  path: "/api/menus/{id}",
  summary: "Update a menu by ID",
  tags: ["Menus"],
  request: {
    params: menuIdSchema,
    body: {
      required: true,
      content: {
        "application/json": {
          schema: createMenuSchema.partial(),
        },
      },
    },
  },
  responses: {
    200: { description: "Menu updated" },
    400: { description: "Invalid input" },
    404: { description: "Menu not found" },
  },
});

registry.registerPath({
  method: "delete",
  path: "/api/menus/{id}",
  summary: "Delete a menu by ID",
  tags: ["Menus"],
  request: {
    params: menuIdSchema,
  },
  responses: {
    200: { description: "Menu deleted" },
    404: { description: "Menu not found" },
  },
});

export default menuRouter;
