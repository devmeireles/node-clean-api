import type { Request, Response } from "express";
import {
  readAllMenus,
  createMenu as createMenuService,
  updateMenu as updateMenuService,
  deleteMenu as deleteMenuService,
  readMenuById as readMenuByIdService,
} from "../services/menu.service";

import { sendError, sendSuccess } from "../lib/response.lib";
import {
  createMenuSchema,
  menuIdSchema,
  updateMenuSchema,
} from "../schemas/menu.schema";

export const getAllMenus = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  const data = await readAllMenus();

  sendSuccess(res, 200, data);
};

export const getMenuById = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  const parsedId = menuIdSchema.safeParse(req.params);

  if (!parsedId.success) {
    sendError(res, 400, "INVALID_INPUT", "Invalid menu ID");
    return;
  }

  const menu = await readMenuByIdService(parsedId.data.id);

  if (!menu) {
    sendError(res, 404, "NOT_FOUND", "Menu Not Found");
    return;
  }

  sendSuccess(res, 200, menu);
};

export const createMenu = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const parsedNewMenu = createMenuSchema.safeParse(req.body);

  if (!parsedNewMenu.success) {
    sendError(res, 400, "INVALID_INPUT", "Invalid input data");
    return;
  }

  const createdMenu = await createMenuService(parsedNewMenu.data);

  sendSuccess(res, 201, createdMenu);
};

export const updateMenu = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  const parsedId = menuIdSchema.safeParse(req.params);

  if (!parsedId.success) {
    sendError(res, 400, "INVALID_INPUT", "Invalid menu ID");
    return;
  }

  const parsedMenu = updateMenuSchema.safeParse(req.body);

  if (!parsedMenu.success) {
    sendError(res, 400, "INVALID_INPUT", "Invalid input data");
    return;
  }

  const updatedMenu = await updateMenuService(
    parsedId.data.id,
    parsedMenu.data,
  );

  if (updatedMenu) {
    sendSuccess(res, 200, updatedMenu);
  } else {
    sendError(res, 404, "NOT_FOUND", "Menu Not Found");
  }
};

export const deleteMenu = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  const parsedId = menuIdSchema.safeParse(req.params);

  if (!parsedId.success) {
    sendError(res, 400, "INVALID_INPUT", "Invalid menu ID");
    return;
  }

  const deletedMenu = await deleteMenuService(parsedId.data.id);

  sendSuccess(res, 200, deletedMenu);
};
