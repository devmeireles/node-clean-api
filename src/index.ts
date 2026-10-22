import express from "express";
import swaggerJsdoc from "swagger-jsdoc";
import { apiReference } from "@scalar/express-api-reference";
import { generateOpenApiDocument } from "./lib/openapi.lib";
import menuRouter from "./routes/menu.route";
import { errorMiddleware } from "./middleware/error.middleware";

const app = express();

const PORT = Number(process.env.PORT ?? 3000);
const API_BASE_URL = process.env.API_BASE_URL ?? `http://localhost:${PORT}`;

app.use(express.json());

app.use("/api", menuRouter);

const openapiDocument = swaggerJsdoc({
  failOnErrors: true,
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Menu API",
      version: "1.0.0",
      description: "API for managing menu items.",
    },
    servers: [{ url: API_BASE_URL }],
  },
  apis: ["./src/routes/*.ts"],
});

app.get("/openapi.json", (_req, res) => {
  res.json(generateOpenApiDocument());
});

app.use(
  "/reference",
  apiReference({
    theme: "purple",
    url: "/openapi.json",
  }),
);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running at ${API_BASE_URL}`);
  console.log(`API documentation: ${API_BASE_URL}/reference`);
});
