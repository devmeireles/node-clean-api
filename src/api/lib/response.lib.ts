import type { Response } from "express";

export const sendSuccess = <T>(
  res: Response,
  statusCode: number,
  data: T,
  meta?: object,
): void => {
  res.status(statusCode).json({
    success: true,
    data,
    ...(meta === undefined ? {} : { meta }),
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
