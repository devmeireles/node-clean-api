import assert from "node:assert/strict";
import { afterEach, describe, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("environment configuration", () => {
  it("loads and coerces configured values", async () => {
    vi.stubEnv("DATABASE_URL", "file:./test.db");
    vi.stubEnv("PORT", "4321");
    vi.stubEnv("API_BASE_URL", "https://api.example.test");

    const { env } = await import("@/config/env");

    assert.deepEqual(env, {
      DATABASE_URL: "file:./test.db",
      PORT: 4321,
      API_BASE_URL: "https://api.example.test",
    });
  });

  it("uses the default port and allows API_BASE_URL to be omitted", async () => {
    vi.stubEnv("DATABASE_URL", "file:./test.db");
    vi.stubEnv("PORT", undefined);
    vi.stubEnv("API_BASE_URL", undefined);

    const { env } = await import("@/config/env");

    assert.equal(env.PORT, 3000);
    assert.equal(env.API_BASE_URL, undefined);
  });

  it("rejects an empty database URL", async () => {
    vi.stubEnv("DATABASE_URL", "");

    await assert.rejects(import("@/config/env"));
  });

  it("rejects invalid ports and URLs", async () => {
    vi.stubEnv("DATABASE_URL", "file:./test.db");
    vi.stubEnv("PORT", "-1");
    vi.stubEnv("API_BASE_URL", "not-a-url");

    await assert.rejects(import("@/config/env"));
  });
});
