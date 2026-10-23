import assert from "node:assert/strict";
import { beforeEach, describe, it, vi } from "vitest";
import { Menu } from "@/model/menus/menu.model";

const { prisma } = vi.hoisted(() => ({
  prisma: {
    $transaction: vi.fn(),
    menu: {
      findMany: vi.fn(),
      count: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock("@/infrastructure/persistence/prisma/prisma.lib", () => ({
  prisma,
}));

import { PrismaMenuRepository } from "@/infrastructure/persistence/prisma/prisma-menu.repository";

const databaseMenu = {
  id: 3,
  name: "Dinner Menu",
  price: 75,
  minPeople: 2,
  maxPeople: 12,
};

describe("PrismaMenuRepository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    prisma.menu.findMany.mockResolvedValue([databaseMenu]);
    prisma.menu.count.mockResolvedValue(1);
    prisma.$transaction.mockResolvedValue([[databaseMenu], 1]);
    prisma.menu.findUnique.mockResolvedValue(databaseMenu);
    prisma.menu.create.mockResolvedValue(databaseMenu);
    prisma.menu.update.mockResolvedValue(databaseMenu);
    prisma.menu.delete.mockResolvedValue(databaseMenu);
  });

  it("paginates menu rows and maps them to domain models", async () => {
    const repository = new PrismaMenuRepository();
    const result = await repository.findAll({ page: 3, limit: 5 });

    assert.deepEqual(prisma.menu.findMany.mock.calls[0]?.[0], {
      skip: 10,
      take: 5,
      orderBy: { id: "asc" },
    });
    assert.equal(prisma.menu.count.mock.calls.length, 1);
    assert.equal(prisma.$transaction.mock.calls.length, 1);
    assert.deepEqual(result, {
      items: [new Menu(3, "Dinner Menu", 75, 2, 12)],
      totalItems: 1,
    });
    assert.ok(result.items[0] instanceof Menu);
  });

  it("returns null when a menu ID is not found", async () => {
    prisma.menu.findUnique.mockResolvedValue(null);
    const repository = new PrismaMenuRepository();

    assert.equal(await repository.findById(404), null);
    assert.deepEqual(prisma.menu.findUnique.mock.calls[0]?.[0], {
      where: { id: 404 },
    });
  });

  it("maps a found menu to a domain model", async () => {
    const repository = new PrismaMenuRepository();

    const result = await repository.findById(3);

    assert.ok(result instanceof Menu);
    assert.deepEqual(
      {
        id: result?.id,
        name: result?.name,
        price: result?.price,
        minPeople: result?.minPeople,
        maxPeople: result?.maxPeople,
      },
      databaseMenu,
    );
  });

  it("creates a menu with the supplied fields", async () => {
    const repository = new PrismaMenuRepository();
    const data = {
      name: "Dinner Menu",
      price: 75,
      minPeople: 2,
      maxPeople: 12,
    };

    const result = await repository.create(data);

    assert.deepEqual(prisma.menu.create.mock.calls[0]?.[0], { data });
    assert.deepEqual(result, new Menu(3, "Dinner Menu", 75, 2, 12));
  });

  it("updates a menu by ID with the supplied fields", async () => {
    const repository = new PrismaMenuRepository();
    const data = {
      name: "Updated Menu",
      price: 80,
      minPeople: 3,
      maxPeople: 15,
    };

    await repository.update(3, data);

    assert.deepEqual(prisma.menu.update.mock.calls[0]?.[0], {
      where: { id: 3 },
      data,
    });
  });

  it("deletes a menu by ID and returns its domain model", async () => {
    const repository = new PrismaMenuRepository();

    const result = await repository.delete(3);

    assert.deepEqual(prisma.menu.delete.mock.calls[0]?.[0], {
      where: { id: 3 },
    });
    assert.deepEqual(result, new Menu(3, "Dinner Menu", 75, 2, 12));
  });
});
