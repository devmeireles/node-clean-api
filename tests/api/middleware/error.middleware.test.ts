import assert from "node:assert/strict";
import type { NextFunction, Request, Response } from "express";
import { afterEach, describe, it, vi } from "vitest";
import { errorMiddleware } from "@/api/middleware/error.middleware";
import {
  AppError,
  ConflictError,
  NotFoundError,
  ValidationError,
} from "@/application/errors";
import { Prisma } from "@/generated/prisma/client";

const createResponse = (headersSent = false) => {
  const response = {
    headersSent,
    status: vi.fn(),
    json: vi.fn(),
  };
  response.status.mockReturnValue(response);

  return response;
};

const invokeMiddleware = (
  error: unknown,
  response: ReturnType<typeof createResponse>,
  next: ReturnType<typeof vi.fn>,
) => {
  errorMiddleware(
    error,
    {} as Request,
    response as unknown as Response,
    next as unknown as NextFunction,
  );
};

describe("errorMiddleware", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each([
    [new ValidationError("Invalid menu"), 400, "VALIDATION_ERROR"],
    [new NotFoundError("Menu not found"), 404, "NOT_FOUND"],
    [new ConflictError("Menu already exists"), 409, "CONFLICT"],
    [
      new AppError(418, "CUSTOM_ERROR", "Custom application error"),
      418,
      "CUSTOM_ERROR",
    ],
  ])("serializes application errors", (error, statusCode, code) => {
    const response = createResponse();

    invokeMiddleware(error, response, vi.fn());

    assert.equal(response.status.mock.calls[0]?.[0], statusCode);
    assert.deepEqual(response.json.mock.calls[0]?.[0], {
      success: false,
      error: {
        code,
        message: error.message,
      },
    });
  });

  it("maps Prisma missing-record errors to 404", () => {
    const response = createResponse();
    const error = new Prisma.PrismaClientKnownRequestError("Record not found", {
      code: "P2025",
      clientVersion: "test",
    });

    invokeMiddleware(error, response, vi.fn());

    assert.equal(response.status.mock.calls[0]?.[0], 404);
    assert.deepEqual(response.json.mock.calls[0]?.[0], {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: "Item not found",
      },
    });
  });

  it("logs Prisma database errors and returns a database error response", () => {
    const response = createResponse();
    const logger = vi.spyOn(console, "error").mockImplementation(() => {});
    const error = new Prisma.PrismaClientKnownRequestError(
      "Unique constraint failed",
      {
        code: "P2002",
        clientVersion: "test",
      },
    );

    invokeMiddleware(error, response, vi.fn());

    assert.deepEqual(logger.mock.calls[0], [error]);
    assert.equal(response.status.mock.calls[0]?.[0], 500);
    assert.deepEqual(response.json.mock.calls[0]?.[0], {
      success: false,
      error: {
        code: "DATABASE_ERROR",
        message: "A database error occurred",
      },
    });
  });

  it("logs unexpected errors and returns a generic 500 response", () => {
    const response = createResponse();
    const logger = vi.spyOn(console, "error").mockImplementation(() => {});

    invokeMiddleware(new Error("internal details"), response, vi.fn());

    assert.equal(logger.mock.calls[0]?.[0] instanceof Error, true);
    assert.equal(response.status.mock.calls[0]?.[0], 500);
    assert.deepEqual(response.json.mock.calls[0]?.[0], {
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred",
      },
    });
  });

  it("passes errors onward when response headers have already been sent", () => {
    const response = createResponse(true);
    const next = vi.fn();
    const error = new Error("stream failure");

    invokeMiddleware(error, response, next);

    assert.deepEqual(next.mock.calls[0], [error]);
    assert.equal(response.status.mock.calls.length, 0);
    assert.equal(response.json.mock.calls.length, 0);
  });
});
