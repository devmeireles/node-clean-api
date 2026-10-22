import type { Request, Response } from "express";
import data from "../data";

export const getAllMenus = (_req: Request, res: Response): void => {
  res.json(data.menus);
};

export const getMenuById = (
  req: Request<{ id: string }>,
  res: Response
): void => {
  const id = Number.parseInt(req.params.id, 10);

  const foundMenu = data.menus.find((menu) => menu.id === id);

  if (foundMenu) {
    res.json(foundMenu);
  } else {
    res.status(404).send("Menu Not Found");
  }
};

export const createMenu = (req: Request, res: Response): void => {
  const newMenu = req.body;

  data.menus.push(newMenu);
  res.status(201).json(newMenu);
};

export const updateMenu = (
  req: Request<{ id: string }>,
  res: Response
): void => {
  const id = Number.parseInt(req.params.id, 10);
  const updatedMenu = req.body;

  const index = data.menus.findIndex((menu) => menu.id === id);

  if (index !== -1) {
    data.menus[index] = { ...data.menus[index], ...updatedMenu };
    res.json(data.menus[index]);
  } else {
    res.status(404).send("Menu Not Found");
  }
};

export const deleteMenu = (
  req: Request<{ id: string }>,
  res: Response
): void => {
  const id = Number.parseInt(req.params.id, 10);

  const index = data.menus.findIndex((menu) => menu.id === id);

  if (index !== -1) {
    const deletedMenu = data.menus.splice(index, 1);
    res.json(deletedMenu[0]);
  } else {
    res.status(404).send("Menu Not Found");
  }
};