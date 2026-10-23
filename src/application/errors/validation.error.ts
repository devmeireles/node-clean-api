import { AppError } from "./app.error";

export class ValidationError extends AppError {
  public constructor(message = "Validation failed") {
    super(400, "VALIDATION_ERROR", message);

    this.name = "ValidationError";
  }
}
