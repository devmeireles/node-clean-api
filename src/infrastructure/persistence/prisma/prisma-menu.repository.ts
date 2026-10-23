import type {
  ICreateMenuData,
  IMenuRepository,
  IUpdateMenuData,
} from "../../../model/menus/menu.repository";
import { Menu as PrismaMenu } from "../../../generated/prisma/client";
import { prisma } from "./prisma.lib";
import { Menu } from "../../../model/menus/menu.model";

export class PrismaMenuRepository implements IMenuRepository {
  public async findAll(): Promise<Menu[]> {
    const records = await prisma.menu.findMany();

    return records.map((record) => this.toDomain(record));
  }

  public async findById(id: number): Promise<Menu | null> {
    const record = await prisma.menu.findUnique({
      where: { id },
    });

    return record === null ? null : this.toDomain(record);
  }

  public async create(data: ICreateMenuData): Promise<Menu> {
    const record = await prisma.menu.create({
      data: {
        name: data.name,
        price: data.price,
        minPeople: data.minPeople,
        maxPeople: data.maxPeople,
      },
    });

    return this.toDomain(record);
  }

  public async update(id: number, data: IUpdateMenuData): Promise<Menu> {
    const record = await prisma.menu.update({
      where: { id },
      data: {
        name: data.name,
        price: data.price,
        minPeople: data.minPeople,
        maxPeople: data.maxPeople,
      },
    });

    return this.toDomain(record);
  }

  public async delete(id: number): Promise<Menu> {
    const record = await prisma.menu.delete({
      where: { id },
    });

    return this.toDomain(record);
  }

  private toDomain(record: PrismaMenu): Menu {
    return new Menu(
      record.id,
      record.name,
      Number(record.price),
      record.minPeople,
      record.maxPeople,
    );
  }
}
