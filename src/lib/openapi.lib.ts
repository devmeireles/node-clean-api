import {
  extendZodWithOpenApi,
  OpenAPIRegistry,
  OpenApiGeneratorV31,
} from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const registry = new OpenAPIRegistry();

export function generateOpenApiDocument() {
  const generator = new OpenApiGeneratorV31(registry.definitions);

  return generator.generateDocument({
    openapi: "3.1.0",
    info: {
      title: "API",
      version: "1.0.0",
      description: "API for managing items.",
    },
    servers: [
      {
        url:
          process.env.API_BASE_URL ??
          `http://localhost:${process.env.PORT ?? 3000}`,
      },
    ],
  });
}
