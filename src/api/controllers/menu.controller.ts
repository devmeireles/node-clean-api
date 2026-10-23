import type { Request, Response, NextFunction } from "express";
import type { MenuService } from "../../application/services/menu.service";
import {
  createMenuSchema,
  menuIdSchema,
  updateMenuSchema,
} from "../schemas/menu.schema";
import { sendError, sendSuccess } from "../lib/response.lib";

export class MenuController {
  private readonly menuService: MenuService;

  public constructor(menuService: MenuService) {
    this.menuService = menuService;
  }

  public getAll = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const menus = await this.menuService.getAll();

      sendSuccess(res, 200, menus);
    } catch (error) {
      next(error);
    }
  };

  public getById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const parsedId = menuIdSchema.safeParse(req.params);

      if (!parsedId.success) {
        sendError(res, 400, "VALIDATION_ERROR", "Invalid menu ID");
        return;
      }

      const menu = await this.menuService.getById(parsedId.data.id);

      if (menu === null) {
        sendError(res, 404, "NOT_FOUND", "Menu not found");
        return;
      }

      sendSuccess(res, 200, menu);
    } catch (error) {
      next(error);
    }
  };

  public create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const parsedBody = createMenuSchema.safeParse(req.body);

      if (!parsedBody.success) {
        sendError(res, 400, "VALIDATION_ERROR", "Invalid menu data");
        return;
      }

      const menu = await this.menuService.create(parsedBody.data);

      sendSuccess(res, 201, menu);
    } catch (error) {
      next(error);
    }
  };

  public update = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const parsedId = menuIdSchema.safeParse(req.params);
      const parsedBody = updateMenuSchema.safeParse(req.body);

      if (!parsedId.success || !parsedBody.success) {
        sendError(res, 400, "VALIDATION_ERROR", "Invalid menu data");
        return;
      }

      const menu = await this.menuService.update(
        parsedId.data.id,
        parsedBody.data,
      );

      sendSuccess(res, 200, menu);
    } catch (error) {
      next(error);
    }
  };

  public delete = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const parsedId = menuIdSchema.safeParse(req.params);

      if (!parsedId.success) {
        sendError(res, 400, "VALIDATION_ERROR", "Invalid menu ID");
        return;
      }

      const menu = await this.menuService.delete(parsedId.data.id);

      sendSuccess(res, 200, menu);
    } catch (error) {
      next(error);
    }
  };
}
