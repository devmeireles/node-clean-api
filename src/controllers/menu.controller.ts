import type { Request, Response } from "express";
import {
  readAllMenus,
  createMenu as createMenuService,
  updateMenu as updateMenuService,
  deleteMenu as deleteMenuService,
  readMenuById as readMenuByIdService,
} from "../services/menu.service";

export const getAllMenus = (_req: Request, res: Response): void => {
  const data = readAllMenus();

  res.status(200).json(data);
};

export const getMenuById = (
  req: Request<{ id: string }>,
  res: Response,
): void => {
  const id = Number.parseInt(req.params.id, 10);

  const foundMenu = readMenuByIdService(id);

  if (foundMenu) {
    res.json(foundMenu);
  } else {
    res.status(404).send("Menu Not Found");
  }
};

export const createMenu = (req: Request, res: Response): void => {
  const newMenu = req.body;

  const createdMenu = createMenuService(newMenu);

  res.status(201).json(createdMenu);
};

export const updateMenu = (
  req: Request<{ id: string }>,
  res: Response,
): void => {
  const id = Number.parseInt(req.params.id, 10);
  const updatedMenu = req.body;

  const result = updateMenuService(id, updatedMenu);

  if (result) {
    res.json(result);
  } else {
    res.status(404).send("Menu Not Found");
  }
};

export const deleteMenu = (
  req: Request<{ id: string }>,
  res: Response,
): void => {
  const id = Number.parseInt(req.params.id, 10);

  const deletedMenu = deleteMenuService(id);

  if (deletedMenu) {
    res.json(deletedMenu);
  } else {
    res.status(404).send("Menu Not Found");
  }
};
