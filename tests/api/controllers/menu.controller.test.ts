import assert from "node:assert/strict";
import type { Request, Response, NextFunction } from "express";
import { describe, it, vi } from "vitest";
import { MenuController } from "@/api/controllers/menu.controller";
import { MenuService } from "@/application/services/menu.service";
import { Menu } from "@/model/menus/menu.model";
import type { IMenuRepository } from "@/model/menus/menu.repository";

const existingMenu = new Menu(1, "Lunch Menu", 50, 2, 10);

const createRepository = (
  overrides: Partial<IMenuRepository> = {},
): IMenuRepository => ({
  findAll: vi.fn(async () => ({ items: [existingMenu], totalItems: 1 })),
  findById: vi.fn(async () => existingMenu),
  create: vi.fn(
    async (data) =>
      new Menu(2, data.name, data.price, data.minPeople, data.maxPeople),
  ),
  update: vi.fn(
    async (id, data) =>
      new Menu(
        id,
        data.name ?? existingMenu.name,
        data.price ?? existingMenu.price,
        data.minPeople ?? existingMenu.minPeople,
        data.maxPeople ?? existingMenu.maxPeople,
      ),
  ),
  delete: vi.fn(async () => existingMenu),
  ...overrides,
});

const createResponse = () => {
  const response = {
    status: vi.fn(),
    json: vi.fn(),
  };
  response.status.mockReturnValue(response);

  return response;
};

const createRequest = (values: {
  body?: unknown;
  params?: Record<string, string>;
  query?: Record<string, string>;
}): Request => values as unknown as Request;

const createController = (repository: IMenuRepository) =>
  new MenuController(new MenuService(repository));

const createControllerWithService = (service: Partial<MenuService>) =>
  new MenuController(service as MenuService);

describe("MenuController", () => {
  it("returns 400 for invalid pagination query without querying the repository", async () => {
    const repository = createRepository();
    const controller = createController(repository);
    const response = createResponse();

    await controller.getAll(
      createRequest({ query: { page: "0", limit: "101" } }),
      response as unknown as Response,
      vi.fn() as unknown as NextFunction,
    );

    assert.equal(response.status.mock.calls[0]?.[0], 400);
    assert.deepEqual(response.json.mock.calls[0]?.[0], {
      success: false,
      error: {
        code: "INVALID_QUERY",
        message: "Invalid pagination params",
      },
    });
    assert.equal(vi.mocked(repository.findAll).mock.calls.length, 0);
  });

  it("returns paginated menu data for a valid query", async () => {
    const controller = createController(createRepository());
    const response = createResponse();

    await controller.getAll(
      createRequest({ query: { page: "1", limit: "10" } }),
      response as unknown as Response,
      vi.fn() as unknown as NextFunction,
    );

    assert.equal(response.status.mock.calls[0]?.[0], 200);
    assert.deepEqual(response.json.mock.calls[0]?.[0], {
      success: true,
      data: [
        {
          id: 1,
          name: "Lunch Menu",
          price: 50,
          minPeople: 2,
          maxPeople: 10,
        },
      ],
      meta: {
        pagination: {
          page: 1,
          limit: 10,
          totalItems: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      },
    });
  });

  it("returns 400 for invalid menu IDs without calling the service repository", async () => {
    const repository = createRepository();
    const controller = createController(repository);
    const response = createResponse();

    await controller.getById(
      createRequest({ params: { id: "not-a-number" } }),
      response as unknown as Response,
      vi.fn() as unknown as NextFunction,
    );

    assert.equal(response.status.mock.calls[0]?.[0], 400);
    assert.equal(vi.mocked(repository.findById).mock.calls.length, 0);
  });

  it("returns the invalid menu ID error response", async () => {
    const response = createResponse();
    const controller = createController(createRepository());

    await controller.getById(
      createRequest({ params: { id: "invalid" } }),
      response as unknown as Response,
      vi.fn() as unknown as NextFunction,
    );

    assert.deepEqual(response.json.mock.calls[0]?.[0], {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid menu ID",
      },
    });
  });

  it("returns 404 when the requested menu does not exist", async () => {
    const repository = createRepository({
      findById: vi.fn(async () => null),
    });
    const controller = createController(repository);
    const response = createResponse();

    await controller.getById(
      createRequest({ params: { id: "404" } }),
      response as unknown as Response,
      vi.fn() as unknown as NextFunction,
    );

    assert.equal(response.status.mock.calls[0]?.[0], 404);
    assert.deepEqual(response.json.mock.calls[0]?.[0], {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: "Menu not found",
      },
    });
  });

  it("returns the requested menu when it exists", async () => {
    const controller = createController(createRepository());
    const response = createResponse();

    await controller.getById(
      createRequest({ params: { id: "1" } }),
      response as unknown as Response,
      vi.fn() as unknown as NextFunction,
    );

    assert.equal(response.status.mock.calls[0]?.[0], 200);
    assert.deepEqual(response.json.mock.calls[0]?.[0], {
      success: true,
      data: {
        id: 1,
        name: "Lunch Menu",
        price: 50,
        minPeople: 2,
        maxPeople: 10,
      },
    });
  });

  it("returns 400 for invalid create payloads without creating a menu", async () => {
    const repository = createRepository();
    const controller = createController(repository);
    const response = createResponse();

    await controller.create(
      createRequest({
        body: {
          name: "",
          price: 50,
          minPeople: 2,
          maxPeople: 10,
        },
      }),
      response as unknown as Response,
      vi.fn() as unknown as NextFunction,
    );

    assert.equal(response.status.mock.calls[0]?.[0], 400);
    assert.equal(vi.mocked(repository.create).mock.calls.length, 0);
  });

  it("creates a menu and returns 201 for a valid payload", async () => {
    const controller = createController(createRepository());
    const response = createResponse();

    await controller.create(
      createRequest({
        body: {
          name: "Dinner Menu",
          price: 70,
          minPeople: 2,
          maxPeople: 8,
        },
      }),
      response as unknown as Response,
      vi.fn() as unknown as NextFunction,
    );

    assert.equal(response.status.mock.calls[0]?.[0], 201);
    assert.deepEqual(response.json.mock.calls[0]?.[0], {
      success: true,
      data: {
        id: 2,
        name: "Dinner Menu",
        price: 70,
        minPeople: 2,
        maxPeople: 8,
      },
    });
  });

  it("returns 400 for an empty update payload", async () => {
    const repository = createRepository();
    const controller = createController(repository);
    const response = createResponse();

    await controller.update(
      createRequest({ params: { id: "1" }, body: {} }),
      response as unknown as Response,
      vi.fn() as unknown as NextFunction,
    );

    assert.equal(response.status.mock.calls[0]?.[0], 400);
    assert.equal(vi.mocked(repository.findById).mock.calls.length, 0);
    assert.equal(vi.mocked(repository.update).mock.calls.length, 0);
  });

  it("returns 400 when the update ID is invalid", async () => {
    const response = createResponse();
    const controller = createController(createRepository());

    await controller.update(
      createRequest({ params: { id: "invalid" }, body: { name: "Dinner" } }),
      response as unknown as Response,
      vi.fn() as unknown as NextFunction,
    );

    assert.deepEqual(response.json.mock.calls[0]?.[0], {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid menu data",
      },
    });
  });

  it("updates a menu and returns the updated menu", async () => {
    const controller = createController(createRepository());
    const response = createResponse();

    await controller.update(
      createRequest({
        params: { id: "1" },
        body: { price: 60 },
      }),
      response as unknown as Response,
      vi.fn() as unknown as NextFunction,
    );

    assert.equal(response.status.mock.calls[0]?.[0], 200);
    assert.deepEqual(response.json.mock.calls[0]?.[0], {
      success: true,
      data: {
        id: 1,
        name: "Lunch Menu",
        price: 60,
        minPeople: 2,
        maxPeople: 10,
      },
    });
  });

  it("deletes a menu and returns the deleted menu", async () => {
    const repository = createRepository();
    const controller = createController(repository);
    const response = createResponse();

    await controller.delete(
      createRequest({ params: { id: "1" } }),
      response as unknown as Response,
      vi.fn() as unknown as NextFunction,
    );

    assert.equal(response.status.mock.calls[0]?.[0], 200);
    assert.deepEqual(response.json.mock.calls[0]?.[0], {
      success: true,
      data: {
        id: 1,
        name: "Lunch Menu",
        price: 50,
        minPeople: 2,
        maxPeople: 10,
      },
    });
    assert.deepEqual(vi.mocked(repository.delete).mock.calls[0], [1]);
  });

  it("returns the invalid menu ID error response when deleting", async () => {
    const response = createResponse();
    const controller = createController(createRepository());

    await controller.delete(
      createRequest({ params: { id: "invalid" } }),
      response as unknown as Response,
      vi.fn() as unknown as NextFunction,
    );

    assert.deepEqual(response.json.mock.calls[0]?.[0], {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid menu ID",
      },
    });
  });

  it("forwards getAll service errors to Express error middleware", async () => {
    const expectedError = new Error("repository failed");
    const controller = createController(
      createRepository({
        findAll: vi.fn(async () => {
          throw expectedError;
        }),
      }),
    );
    const next = vi.fn();

    await controller.getAll(
      createRequest({ query: { page: "1", limit: "10" } }),
      createResponse() as unknown as Response,
      next as unknown as NextFunction,
    );

    assert.deepEqual(next.mock.calls[0], [expectedError]);
  });

  it("forwards getById service errors to Express error middleware", async () => {
    const expectedError = new Error("lookup failed");
    const controller = createControllerWithService({
      getById: vi.fn(async () => {
        throw expectedError;
      }),
    });
    const next = vi.fn();

    await controller.getById(
      createRequest({ params: { id: "1" } }),
      createResponse() as unknown as Response,
      next as unknown as NextFunction,
    );

    assert.deepEqual(next.mock.calls[0], [expectedError]);
  });

  it("forwards create service errors to Express error middleware", async () => {
    const expectedError = new Error("create failed");
    const controller = createControllerWithService({
      create: vi.fn(async () => {
        throw expectedError;
      }),
    });
    const next = vi.fn();

    await controller.create(
      createRequest({
        body: {
          name: "Dinner",
          price: 70,
          minPeople: 2,
          maxPeople: 8,
        },
      }),
      createResponse() as unknown as Response,
      next as unknown as NextFunction,
    );

    assert.deepEqual(next.mock.calls[0], [expectedError]);
  });

  it("forwards update service errors to Express error middleware", async () => {
    const expectedError = new Error("update failed");
    const controller = createControllerWithService({
      update: vi.fn(async () => {
        throw expectedError;
      }),
    });
    const next = vi.fn();

    await controller.update(
      createRequest({ params: { id: "1" }, body: { name: "Dinner" } }),
      createResponse() as unknown as Response,
      next as unknown as NextFunction,
    );

    assert.deepEqual(next.mock.calls[0], [expectedError]);
  });

  it("forwards delete service errors to Express error middleware", async () => {
    const expectedError = new Error("delete failed");
    const controller = createControllerWithService({
      delete: vi.fn(async () => {
        throw expectedError;
      }),
    });
    const next = vi.fn();

    await controller.delete(
      createRequest({ params: { id: "1" } }),
      createResponse() as unknown as Response,
      next as unknown as NextFunction,
    );

    assert.deepEqual(next.mock.calls[0], [expectedError]);
  });
});
