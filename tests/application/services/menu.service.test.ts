import assert from "node:assert/strict";
import { describe, it, vi } from "vitest";
import { MenuService } from "@/application/services/menu.service";
import { Menu } from "@/model/menus/menu.model";
import type {
  ICreateMenuData,
  IMenuRepository,
  IUpdateMenuData,
} from "@/model/menus/menu.repository";
import { NotFoundError, ValidationError } from "@/application/errors";

const existingMenu = new Menu(1, "Lunch Menu", 50, 10, 20);

const createRepository = (
  overrides: Partial<IMenuRepository> = {},
): IMenuRepository => ({
  findAll: vi.fn(async () => ({ items: [existingMenu], totalItems: 1 })),
  findById: vi.fn(async () => existingMenu),
  create: vi.fn(
    async (data: ICreateMenuData) =>
      new Menu(2, data.name, data.price, data.minPeople, data.maxPeople),
  ),
  update: vi.fn(
    async (id: number, data: IUpdateMenuData) =>
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

describe("MenuService", () => {
  it("returns menus with pagination metadata", async () => {
    const service = new MenuService(
      createRepository({
        findAll: vi.fn(async () => ({
          items: [existingMenu],
          totalItems: 21,
        })),
      }),
    );

    const result = await service.getAll({ page: 2, limit: 10 });

    assert.deepEqual(result, {
      data: [
        {
          id: 1,
          name: "Lunch Menu",
          price: 50,
          minPeople: 10,
          maxPeople: 20,
        },
      ],
      meta: {
        pagination: {
          page: 2,
          limit: 10,
          totalItems: 21,
          totalPages: 3,
          hasNextPage: true,
          hasPreviousPage: true,
        },
      },
    });
  });

  it("returns empty pagination metadata when there are no menus", async () => {
    const service = new MenuService(
      createRepository({
        findAll: vi.fn(async () => ({ items: [], totalItems: 0 })),
      }),
    );

    const result = await service.getAll({ page: 1, limit: 10 });

    assert.deepEqual(result.meta.pagination, {
      page: 1,
      limit: 10,
      totalItems: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    });
    assert.deepEqual(result.data, []);
  });

  it("returns a menu by ID as a DTO", async () => {
    const service = new MenuService(createRepository());

    assert.deepEqual(await service.getById(1), {
      id: 1,
      name: "Lunch Menu",
      price: 50,
      minPeople: 10,
      maxPeople: 20,
    });
  });

  it("returns null when a menu is not found by ID", async () => {
    const service = new MenuService(
      createRepository({ findById: vi.fn(async () => null) }),
    );

    assert.equal(await service.getById(404), null);
  });

  it("validates and persists a new menu", async () => {
    const repository = createRepository();
    const service = new MenuService(repository);
    const data = {
      name: "  Dinner Menu  ",
      price: 70,
      minPeople: 2,
      maxPeople: 8,
    };

    assert.deepEqual(await service.create(data), {
      id: 2,
      name: data.name,
      price: data.price,
      minPeople: data.minPeople,
      maxPeople: data.maxPeople,
    });
    assert.deepEqual(vi.mocked(repository.create).mock.calls[0]?.[0], data);
  });

  it("maps invalid domain data during creation to a validation error", async () => {
    const repository = createRepository();
    const service = new MenuService(repository);

    await assert.rejects(
      service.create({
        name: "Dinner Menu",
        price: 70,
        minPeople: 8,
        maxPeople: 2,
      }),
      ValidationError,
    );
    assert.equal(vi.mocked(repository.create).mock.calls.length, 0);
  });

  it("rethrows unexpected errors from domain model construction", async () => {
    const repository = createRepository();
    const service = new MenuService(repository);
    const expectedError = new TypeError("Unexpected trim failure");
    const trim = vi.spyOn(String.prototype, "trim").mockImplementation(() => {
      throw expectedError;
    });

    try {
      await assert.rejects(
        service.create({
          name: "Dinner Menu",
          price: 70,
          minPeople: 2,
          maxPeople: 8,
        }),
        (error: unknown) => error === expectedError,
      );
      assert.equal(vi.mocked(repository.create).mock.calls.length, 0);
    } finally {
      trim.mockRestore();
    }
  });

  it("merges partial updates, validates the final menu, and persists all fields", async () => {
    const repository = createRepository();
    const service = new MenuService(repository);

    assert.deepEqual(await service.update(1, { price: 60 }), {
      id: 1,
      name: "Lunch Menu",
      price: 60,
      minPeople: 10,
      maxPeople: 20,
    });
    assert.deepEqual(vi.mocked(repository.update).mock.calls[0], [
      1,
      {
        name: "Lunch Menu",
        price: 60,
        minPeople: 10,
        maxPeople: 20,
      },
    ]);
  });

  it("rejects an update that creates an invalid capacity range without persisting", async () => {
    const repository = createRepository();
    const service = new MenuService(repository);

    await assert.rejects(service.update(1, { minPeople: 25 }), ValidationError);
    assert.equal(vi.mocked(repository.update).mock.calls.length, 0);
  });

  it("throws a not-found error when updating a missing menu", async () => {
    const repository = createRepository({
      findById: vi.fn(async () => null),
    });
    const service = new MenuService(repository);

    await assert.rejects(
      service.update(404, { name: "Dinner" }),
      NotFoundError,
    );
    assert.equal(vi.mocked(repository.update).mock.calls.length, 0);
  });

  it("deletes a menu and returns its DTO", async () => {
    const repository = createRepository();
    const service = new MenuService(repository);

    assert.deepEqual(await service.delete(1), {
      id: 1,
      name: "Lunch Menu",
      price: 50,
      minPeople: 10,
      maxPeople: 20,
    });
    assert.deepEqual(vi.mocked(repository.delete).mock.calls[0], [1]);
  });
});
