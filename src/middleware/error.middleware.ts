import type { ErrorRequestHandler } from "express";
import { Prisma } from "../generated/prisma/client";

export const errorMiddleware: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next,
): void => {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  ) {
    res.status(404).json({
      success: false,
      error: {
        code: "NOT_FOUND",
        message: "Menu not found",
      },
    });
    return;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: {
        code: "DATABASE_ERROR",
        message: "A database error occurred",
      },
    });
    return;
  }

  console.error(error);

  res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred",
    },
  });
};
