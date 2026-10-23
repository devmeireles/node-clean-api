import assert from "node:assert/strict";
import { describe, it } from "vitest";
import { DomainValidationError } from "@/model/common/domain-validation.error";
import { Menu } from "@/model/menus/menu.model";

describe("Menu", () => {
  it("creates a menu with valid values", () => {
    const menu = new Menu(1, "Lunch Menu", 50, 2, 10);

    assert.ok(menu instanceof Menu);
    assert.deepEqual(
      {
        id: menu.id,
        name: menu.name,
        price: menu.price,
        minPeople: menu.minPeople,
        maxPeople: menu.maxPeople,
      },
      {
        id: 1,
        name: "Lunch Menu",
        price: 50,
        minPeople: 2,
        maxPeople: 10,
      },
    );
  });

  it.each([
    ["blank name", "", 50, 2, 10, "Menu name cannot be empty"],
    ["negative price", "Lunch Menu", -1, 2, 10, "non-negative number"],
    [
      "non-finite price",
      "Lunch Menu",
      Number.NaN,
      2,
      10,
      "non-negative number",
    ],
    ["non-positive minimum", "Lunch Menu", 50, 0, 10, "positive integer"],
    ["fractional minimum", "Lunch Menu", 50, 1.5, 10, "positive integer"],
    ["maximum below minimum", "Lunch Menu", 50, 5, 4, "greater than or equal"],
    ["fractional maximum", "Lunch Menu", 50, 2, 2.5, "greater than or equal"],
  ])("rejects %s", (_case, name, price, minPeople, maxPeople, message) => {
    assert.throws(
      () => new Menu(1, name, price, minPeople, maxPeople),
      (error: unknown) =>
        error instanceof DomainValidationError &&
        error.message.includes(message),
    );
  });
});
