import assert from "node:assert/strict";
import type { Server } from "node:http";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, it, vi } from "vitest";

let server: Server;
let baseUrl: string;
let startupModule: typeof import("@/index");

beforeAll(async () => {
  vi.stubEnv("DATABASE_URL", "file:./index-test.db");
  vi.stubEnv("API_BASE_URL", "http://localhost");
  vi.stubEnv("PORT", "3000");
  startupModule = await import("@/index");

  const logger = vi.spyOn(console, "log").mockImplementation(() => {});
  server = startupModule.startServer(0, "http://localhost:test");
  await new Promise<void>((resolve, reject) => {
    if (server.listening) {
      resolve();
      return;
    }
    server.once("listening", resolve);
    server.once("error", reject);
  });

  const address = server.address();
  if (address === null || typeof address === "string") {
    throw new Error("Test server did not bind to a TCP port");
  }

  baseUrl = `http://127.0.0.1:${address.port}`;
  await new Promise((resolve) => setImmediate(resolve));
  assert.deepEqual(logger.mock.calls, [
    ["Server running at http://localhost:test"],
    ["API documentation: http://localhost:test/reference"],
  ]);
});

afterAll(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

describe("application startup", () => {
  it("serves the OpenAPI document", async () => {
    const response = await fetch(`${baseUrl}/openapi.json`);
    const document = await response.json();

    assert.equal(response.status, 200);
    assert.equal(document.openapi, "3.1.0");
    assert.ok(document.paths["/api/menus"]);
  });

  it("mounts the menu router and application error middleware", async () => {
    const response = await fetch(`${baseUrl}/api/menus/not-an-id`);

    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid menu ID",
      },
    });
  });

  it("detects whether an entry point refers to this module", () => {
    const thisModule = fileURLToPath(
      new URL("../src/index.ts", import.meta.url),
    );

    assert.equal(startupModule.isMainModule(thisModule), true);
    assert.equal(startupModule.isMainModule("/some/other/entry.js"), false);
    assert.equal(startupModule.isMainModule(undefined), false);
  });

  it("starts the server only when this module is the entry point", () => {
    const thisModule = fileURLToPath(
      new URL("../src/index.ts", import.meta.url),
    );
    const start = vi.fn();

    assert.equal(startupModule.startIfMainModule(thisModule, start), true);
    assert.equal(start.mock.calls.length, 1);
    assert.equal(
      startupModule.startIfMainModule("/other/entry.js", start),
      false,
    );
    assert.equal(start.mock.calls.length, 1);
  });
});
