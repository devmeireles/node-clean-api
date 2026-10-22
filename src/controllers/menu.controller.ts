import type { Request, Response } from "express";
import {
  readAllMenus,
  createMenu as createMenuService,
  updateMenu as updateMenuService,
  deleteMenu as deleteMenuService,
  readMenuById as readMenuByIdService,
} from "../services/menu.service";

export const getAllMenus = async (_req: Request, res: Response): Promise<void> => {
  const data = await readAllMenus();

  res.status(200).json(data);
};

export const getMenuById = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  const id = Number.parseInt(req.params.id, 10);

  const foundMenu = await readMenuByIdService(id);

  if (foundMenu) {
    res.json(foundMenu);
  } else {
    res.status(404).send("Menu Not Found");
  }
};

export const createMenu = async (req: Request, res: Response): Promise<void> => {
  const newMenu = req.body;

  const createdMenu = await createMenuService(newMenu);

  res.status(201).json(createdMenu);
};

export const updateMenu = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  const id = Number.parseInt(req.params.id, 10);
  const updatedMenu = req.body;

  const result = await updateMenuService(id, updatedMenu);

  if (result) {
    res.json(result);
  } else {
    res.status(404).send("Menu Not Found");
  }
};

export const deleteMenu = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  const id = Number.parseInt(req.params.id, 10);

  const deletedMenu = deleteMenuService(id);

  if (deletedMenu) {
    res.json(deletedMenu);
  } else {
    res.status(404).send("Menu Not Found");
  }
};
