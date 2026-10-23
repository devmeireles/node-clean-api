import assert from "node:assert/strict";
import { describe, it } from "vitest";
import { MenuService } from "@/application/services/menu.service";
import { Menu } from "@/model/menus/menu.model";
import type { IMenuRepository } from "@/model/menus/menu.repository";
import { ValidationError } from "@/application/errors";

describe("MenuService", () => {
  const existingMenu = new Menu(1, "Lunch Menu", 50, 10, 20);

  it("returns menus with pagination metadata", async () => {
    const repository: IMenuRepository = {
      findAll: async () => ({
        items: [existingMenu],
        totalItems: 21,
      }),
      findById: async () => existingMenu,
      create: async (data) =>
        new Menu(2, data.name, data.price, data.minPeople, data.maxPeople),
      update: async (id, data) =>
        new Menu(
          id,
          data.name ?? existingMenu.name,
          data.price ?? existingMenu.price,
          data.minPeople ?? existingMenu.minPeople,
          data.maxPeople ?? existingMenu.maxPeople,
        ),
      delete: async () => existingMenu,
    };

    const service = new MenuService(repository);
    const result = await service.getAll({ page: 2, limit: 10 });

    assert.equal(result.data.length, 1);
    assert.deepEqual(result.meta.pagination, {
      page: 2,
      limit: 10,
      totalItems: 21,
      totalPages: 3,
      hasNextPage: true,
      hasPreviousPage: true,
    });
  });

  it("rejects an update that creates an invalid capacity range", async () => {
    let updateCalled = false;

    const repository: IMenuRepository = {
      findAll: async () => ({
        items: [],
        totalItems: 0,
      }),
      findById: async () => existingMenu,
      create: async (data) =>
        new Menu(2, data.name, data.price, data.minPeople, data.maxPeople),
      update: async (id, data) => {
        updateCalled = true;

        return new Menu(
          id,
          data.name ?? existingMenu.name,
          data.price ?? existingMenu.price,
          data.minPeople ?? existingMenu.minPeople,
          data.maxPeople ?? existingMenu.maxPeople,
        );
      },
      delete: async () => existingMenu,
    };

    const service = new MenuService(repository);

    await assert.rejects(service.update(1, { minPeople: 25 }), ValidationError);

    assert.equal(updateCalled, false);
  });
});
