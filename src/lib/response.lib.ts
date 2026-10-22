import type { Response } from "express";

export const sendError = (
  res: Response,
  status: number,
  code: string,
  message: string,
): void => {
  res.status(status).json({
    success: false,
    error: {
      code,
      message,
    },
  });
};

export const sendSuccess = (
  res: Response,
  status: number,
  data: unknown,
): void => {
  res.status(status).json({
    success: true,
    data,
  });
};
