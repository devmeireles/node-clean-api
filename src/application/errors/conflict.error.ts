import { AppError } from "./app.error";

export class ConflictError extends AppError {
  public constructor(message = "Resource conflict") {
    super(409, "CONFLICT", message);

    this.name = "ConflictError";
  }
}