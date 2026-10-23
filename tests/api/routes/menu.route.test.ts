import assert from "node:assert/strict";
import { createServer, type Server } from "node:http";
import express, { type Request, type Response } from "express";
import { afterAll, beforeAll, describe, it, vi } from "vitest";
import { createMenuRouter } from "@/api/routes/menu.route";
import type { MenuController } from "@/api/controllers/menu.controller";

const createHandler = (statusCode: number, data: unknown) =>
  vi.fn((_req: Request, res: Response) => {
    res.status(statusCode).json(data);
  });

const controllerHandlers = {
  getAll: createHandler(200, { route: "getAll" }),
  getById: createHandler(200, { route: "getById" }),
  create: createHandler(201, { route: "create" }),
  update: createHandler(200, { route: "update" }),
  delete: createHandler(200, { route: "delete" }),
};

const app = express();
app.use(express.json());
app.use(
  "/api/menus",
  createMenuRouter(controllerHandlers as unknown as MenuController),
);

let server: Server;
let baseUrl: string;

beforeAll(async () => {
  server = createServer(app);
  await new Promise<void>((resolve) => {
    server.listen(0, "127.0.0.1", resolve);
  });

  const address = server.address();
  if (address === null || typeof address === "string") {
    throw new Error("Test server did not bind to a TCP port");
  }

  baseUrl = `http://127.0.0.1:${address.port}/api/menus`;
});

afterAll(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

describe("menu routes", () => {
  it("routes GET / to the list controller", async () => {
    const response = await fetch(`${baseUrl}?page=2&limit=5`);

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { route: "getAll" });
    assert.equal(controllerHandlers.getAll.mock.calls.length, 1);
    assert.equal(controllerHandlers.getAll.mock.calls[0]?.[0].query.page, "2");
  });

  it("routes GET /:id to the get-by-ID controller", async () => {
    const response = await fetch(`${baseUrl}/17`);

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { route: "getById" });
    assert.equal(controllerHandlers.getById.mock.calls[0]?.[0].params.id, "17");
  });

  it("routes POST / with the parsed JSON body", async () => {
    const body = {
      name: "Dinner",
      price: 70,
      minPeople: 2,
      maxPeople: 8,
    };
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    assert.equal(response.status, 201);
    assert.deepEqual(await response.json(), { route: "create" });
    assert.deepEqual(controllerHandlers.create.mock.calls[0]?.[0].body, body);
  });

  it("routes PUT /:id with params and parsed JSON body", async () => {
    const body = { price: 75 };
    const response = await fetch(`${baseUrl}/17`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { route: "update" });
    assert.equal(controllerHandlers.update.mock.calls[0]?.[0].params.id, "17");
    assert.deepEqual(controllerHandlers.update.mock.calls[0]?.[0].body, body);
  });

  it("routes DELETE /:id to the delete controller", async () => {
    const response = await fetch(`${baseUrl}/17`, { method: "DELETE" });

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { route: "delete" });
    assert.equal(controllerHandlers.delete.mock.calls[0]?.[0].params.id, "17");
  });
});
