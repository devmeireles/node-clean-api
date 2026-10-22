import { Menu } from "../generated/prisma/client";
import { prisma } from "../lib/prisma.lib";

export const readAllMenus = async (): Promise<Array<Menu>> => {
  return await prisma.menu.findMany();
};

export const readMenuById = async (id: number): Promise<Menu | null> => {
  return await prisma.menu.findUnique({
    where: { id },
  });
};

export const createMenu = async (newMenu: Menu): Promise<Menu> => {
  return await prisma.menu.create({
    data: newMenu,
  });
};

export const updateMenu = async (
  id: number,
  updatedMenu: Partial<Menu>,
): Promise<Menu | null> => {
  return await prisma.menu.update({
    where: { id },
    data: updatedMenu,
  });
};

export const deleteMenu = async (id: number): Promise<Menu | null> => {
  return await prisma.menu.delete({
    where: { id },
  });
};
