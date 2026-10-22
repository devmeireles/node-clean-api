export interface Menu {
  id: number;
  name: string;
  price: number;
}

const menus: Menu[] = [
  { id: 1, name: "Lunch Menu", price: 12.99 },
  { id: 2, name: "Dinner Menu", price: 15.99 }
];

export default { menus };