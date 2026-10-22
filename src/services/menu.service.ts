import data, { IMenu } from "../data";

export const readAllMenus = (): Array<IMenu> => {
  return data.menus;
};

export const readMenuById = (id: number): IMenu | undefined => {
  return data.menus.find((menu) => menu.id === id);
};

export const createMenu = (newMenu: IMenu): IMenu => {
  data.menus.push(newMenu);
  return newMenu;
};

export const updateMenu = (
  id: number,
  updatedMenu: Partial<IMenu>,
): IMenu | undefined => {
  const index = data.menus.findIndex((menu) => menu.id === id);

  if (index !== -1) {
    data.menus[index] = { ...data.menus[index], ...updatedMenu };
    return data.menus[index];
  }

  return undefined;
};

export const deleteMenu = (id: number): IMenu | undefined => {
  const index = data.menus.findIndex((menu) => menu.id === id);

  if (index !== -1) {
    const deletedMenu = data.menus.splice(index, 1);
    return deletedMenu[0];
  }

  return undefined;
};
