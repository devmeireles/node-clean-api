export class Menu {
  public constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly price: number,
    public readonly minPeople: number,
    public readonly maxPeople: number,
  ) {
    if (name.trim().length === 0) {
      throw new Error("Menu name cannot be empty");
    }

    if (!Number.isFinite(price) || price < 0) {
      throw new Error("Menu price must be a non-negative number");
    }

    if (!Number.isInteger(minPeople) || minPeople < 1) {
      throw new Error("Minimum people must be a positive integer");
    }

    if (!Number.isInteger(maxPeople) || maxPeople < minPeople) {
      throw new Error(
        "Maximum people must be an integer greater than or equal to minimum people",
      );
    }
  }
}
