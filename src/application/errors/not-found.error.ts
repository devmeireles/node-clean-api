import { AppError } from "./app.error";

export class NotFoundError extends AppError {
  public constructor(message = "Resource not found") {
    super(404, "NOT_FOUND", message);

    this.name = "NotFoundError";
  }
}
