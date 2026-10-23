import assert from "node:assert/strict";
import { afterEach, describe, it, vi } from "vitest";
import { createMenuRouter } from "@/api/routes/menu.route";
import type { MenuController } from "@/api/controllers/menu.controller";
import { generateOpenApiDocument } from "@/api/lib/openapi.lib";

const noop = () => {};
const controller = {
  getAll: noop,
  getById: noop,
  create: noop,
  update: noop,
  delete: noop,
} as unknown as MenuController;

describe("generateOpenApiDocument", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("generates the registered menu paths and contract schemas", () => {
    createMenuRouter(controller);
    const document = generateOpenApiDocument();

    assert.equal(document.openapi, "3.1.0");
    assert.equal(document.info.title, "API");
    assert.equal(document.info.version, "1.0.0");
    assert.ok(document.paths?.["/api/menus"]);
    assert.ok(document.paths?.["/api/menus/{id}"]);
    assert.ok(document.components?.schemas?.Menu);
    assert.ok(document.components?.schemas?.CreateMenu);
    assert.ok(document.components?.schemas?.UpdateMenu);
    assert.ok(document.components?.schemas?.MenuResponse);
    assert.ok(document.components?.schemas?.MenusResponse);
    assert.ok(document.components?.schemas?.ErrorResponse);
  });

  it("uses configured API_BASE_URL for the generated server", () => {
    vi.stubEnv("API_BASE_URL", "https://menus.example.test");
    const document = generateOpenApiDocument();

    assert.equal(document.servers?.[0]?.url, "https://menus.example.test");
  });

  it("builds a local server URL from PORT when API_BASE_URL is unset", () => {
    vi.stubEnv("API_BASE_URL", undefined);
    vi.stubEnv("PORT", "4321");

    const document = generateOpenApiDocument();

    assert.equal(document.servers?.[0]?.url, "http://localhost:4321");
  });

  it("uses the default local port when neither server setting is configured", () => {
    vi.stubEnv("API_BASE_URL", undefined);
    vi.stubEnv("PORT", undefined);

    const document = generateOpenApiDocument();

    assert.equal(document.servers?.[0]?.url, "http://localhost:3000");
  });
});
