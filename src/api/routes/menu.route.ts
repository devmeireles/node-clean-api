import { Router } from "express";
import { registry } from "@/api/lib/openapi.lib";
import type { MenuController } from "@/api/controllers/menu.controller";
import {
  createMenuSchema,
  errorResponseSchema,
  menuIdSchema,
  menuResponseSchema,
  menusResponseSchema,
  updateMenuSchema,
} from "@/api/schemas/menu.schema";
import { paginationQuerySchema } from "@/api/schemas/pagination.schema";

export const createMenuRouter = (menuController: MenuController): Router => {
  const router = Router();

  router.get("/", menuController.getAll);
  router.get("/:id", menuController.getById);
  router.post("/", menuController.create);
  router.put("/:id", menuController.update);
  router.delete("/:id", menuController.delete);

  registry.registerPath({
    method: "get",
    path: "/api/menus",
    summary: "Get all menus",
    tags: ["Menus"],
    request: {
      query: paginationQuerySchema,
    },
    responses: {
      200: {
        description: "Paginated menus retrieved successfully",
        content: {
          "application/json": {
            schema: menusResponseSchema,
          },
        },
      },
      400: {
        description: "Invalid pagination parameters",
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
      },
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
      200: {
        description: "Menu retrieved successfully",
        content: {
          "application/json": {
            schema: menuResponseSchema,
          },
        },
      },
      400: {
        description: "Invalid menu ID",
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
      },
      404: {
        description: "Menu not found",
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
      },
    },
  });

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
      201: {
        description: "Menu created successfully",
        content: {
          "application/json": {
            schema: menuResponseSchema,
          },
        },
      },
      400: {
        description: "Invalid menu data",
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
      },
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
            schema: updateMenuSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Menu updated successfully",
        content: {
          "application/json": {
            schema: menuResponseSchema,
          },
        },
      },
      400: {
        description: "Invalid menu ID or menu data",
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
      },
      404: {
        description: "Menu not found",
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
      },
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
      200: {
        description: "Menu deleted successfully",
        content: {
          "application/json": {
            schema: menuResponseSchema,
          },
        },
      },
      400: {
        description: "Invalid menu ID",
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
      },
      404: {
        description: "Menu not found",
        content: {
          "application/json": {
            schema: errorResponseSchema,
          },
        },
      },
    },
  });

  return router;
};
