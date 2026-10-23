import type { Response } from "express";

export const sendSuccess = <T>(
  res: Response,
  statusCode: number,
  data: T,
): void => {
  res.status(statusCode).json({
    success: true,
    data,
  });
};

export const sendError = (
  res: Response,
  statusCode: number,
  code: string,
  message: string,
): void => {
  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
    },
  });
};
