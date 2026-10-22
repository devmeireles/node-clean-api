import type { Request, Response } from "express";
import {
  readAllMenus,
  createMenu as createMenuService,
  updateMenu as updateMenuService,
  deleteMenu as deleteMenuService,
  readMenuById as readMenuByIdService,
} from "../services/menu.service";

import { sendError, sendSuccess } from "../lib/response.lib";

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
  const id = Number.parseInt(req.params.id, 10);

  const foundMenu = await readMenuByIdService(id);

  if (foundMenu) {
    sendSuccess(res, 200, foundMenu);
  } else {
    sendError(res, 404, "NOT_FOUND", "Menu Not Found");
  }
};

export const createMenu = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const newMenu = req.body;

  const createdMenu = await createMenuService(newMenu);

  sendSuccess(res, 201, createdMenu);
};

export const updateMenu = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  const id = Number.parseInt(req.params.id, 10);
  const updatedMenu = req.body;

  const result = await updateMenuService(id, updatedMenu);

  if (result) {
    sendSuccess(res, 200, result);
  } else {
    sendError(res, 404, "NOT_FOUND", "Menu Not Found");
  }
};

export const deleteMenu = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  const id = Number.parseInt(req.params.id, 10);

  const deletedMenu = deleteMenuService(id);

  if (deletedMenu) {
    sendSuccess(res, 200, deletedMenu);
  } else {
    sendError(res, 404, "NOT_FOUND", "Menu Not Found");
  }
};
