import { Router } from "express";

import {
  getAllMenus,
  getMenuById,
  createMenu,
  updateMenu,
  deleteMenu,
} from "../controllers/menu.controller";

const menuRouter = Router();

menuRouter.get("/menus", getAllMenus);
menuRouter.get("/menus/:id", getMenuById);
menuRouter.post("/menus", createMenu);
menuRouter.put("/menus/:id", updateMenu);
menuRouter.delete("/menus/:id", deleteMenu);

export default menuRouter;
