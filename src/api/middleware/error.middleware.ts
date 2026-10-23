import type {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import { Prisma } from "@/generated/prisma/client";
import { sendError } from "@/api/lib/response.lib";

export const errorMiddleware: ErrorRequestHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (res.headersSent) {
    next(error);
    return;
  }

  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  ) {
    sendError(res, 404, "NOT_FOUND", "Item not found");
    return;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    console.error(error);

    sendError(res, 500, "DATABASE_ERROR", "A database error occurred");
    return;
  }

  console.error(error);

  sendError(res, 500, "INTERNAL_SERVER_ERROR", "An unexpected error occurred");
};
