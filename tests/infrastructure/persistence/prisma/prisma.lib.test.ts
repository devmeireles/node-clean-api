import assert from "node:assert/strict";
import { afterEach, describe, it, vi } from "vitest";

const { PrismaBetterSqlite3, PrismaClient } = vi.hoisted(() => ({
  PrismaBetterSqlite3: vi.fn(),
  PrismaClient: vi.fn(),
}));

vi.mock("@prisma/adapter-better-sqlite3", () => ({
  PrismaBetterSqlite3,
}));

vi.mock("@/generated/prisma/client", () => ({
  PrismaClient,
}));

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
  vi.clearAllMocks();
});

describe("Prisma client configuration", () => {
  it("constructs the SQLite adapter and Prisma client using the configured URL", async () => {
    vi.stubEnv("DATABASE_URL", "file:./integration-test.db");
    vi.stubEnv("PORT", "3000");
    vi.stubEnv("API_BASE_URL", undefined);

    const { prisma } =
      await import("@/infrastructure/persistence/prisma/prisma.lib");

    assert.deepEqual(PrismaBetterSqlite3.mock.calls[0]?.[0], {
      url: "file:./integration-test.db",
    });
    assert.equal(PrismaClient.mock.calls.length, 1);
    assert.equal(
      PrismaClient.mock.calls[0]?.[0].adapter,
      PrismaBetterSqlite3.mock.instances[0],
    );
    assert.equal(prisma, PrismaClient.mock.instances[0]);
  });
});
