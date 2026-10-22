import { Menu } from "../generated/prisma/client";
import { prisma } from "../lib/prisma.lib";
import { CreateMenuInput, UpdateMenuInput } from "../schemas/menu.schema";

export const readAllMenus = async (): Promise<Array<Menu>> => {
  return await prisma.menu.findMany();
};

export const readMenuById = async (id: number): Promise<Menu | null> => {
  return await prisma.menu.findUnique({
    where: { id },
  });
};

export const createMenu = async (newMenu: CreateMenuInput): Promise<Menu> => {
  return await prisma.menu.create({
    data: newMenu,
  });
};

export const updateMenu = async (
  id: number,
  updatedMenu: UpdateMenuInput,
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
