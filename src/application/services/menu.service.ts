import { Menu } from "../../model/menus/menu.model";
import {
  ICreateMenuData,
  IMenuRepository,
  IUpdateMenuData,
} from "../../model/menus/menu.repository";
import { ICreateMenuDto, IMenuDto, IUpdateMenuDto } from "../dtos/menu.dto";

export class MenuService {
  private readonly menuRepository: IMenuRepository;

  constructor(menuRepository: IMenuRepository) {
    this.menuRepository = menuRepository;
  }

  public async getAll(): Promise<IMenuDto[]> {
    const menus = await this.menuRepository.findAll();

    return menus.map((menu) => this.toDto(menu));
  }

  public async getById(id: number): Promise<IMenuDto | null> {
    const menu = await this.menuRepository.findById(id);

    return menu === null ? null : this.toDto(menu);
  }

  public async create(data: ICreateMenuDto): Promise<IMenuDto> {
    const menu = new Menu(
      0,
      data.name,
      data.price,
      data.minPeople,
      data.maxPeople,
    );

    const repositoryData: ICreateMenuData = {
      name: menu.name,
      price: menu.price,
      minPeople: menu.minPeople,
      maxPeople: menu.maxPeople,
    };

    const createdMenu = await this.menuRepository.create(repositoryData);
    return this.toDto(createdMenu);
  }

  public async update(id: number, data: IUpdateMenuDto): Promise<IMenuDto> {
    const existingMenu = await this.menuRepository.findById(id);

    if (!existingMenu) {
      throw new Error("Menu not found");
    }

    const updatedMenu = new Menu(
      existingMenu.id,
      data.name ?? existingMenu.name,
      data.price ?? existingMenu.price,
      data.minPeople ?? existingMenu.minPeople,
      data.maxPeople ?? existingMenu.maxPeople,
    );

    const repositoryData: IUpdateMenuData = {
      name: updatedMenu.name,
      price: updatedMenu.price,
      minPeople: updatedMenu.minPeople,
      maxPeople: updatedMenu.maxPeople,
    };

    const savedMenu = await this.menuRepository.update(id, repositoryData);
    return this.toDto(savedMenu);
  }

  public async delete(id: number): Promise<IMenuDto> {
    const deletedMenu = await this.menuRepository.delete(id);
    return this.toDto(deletedMenu);
  }

  private toDto(menu: Menu): IMenuDto {
    return {
      id: menu.id,
      name: menu.name,
      price: menu.price,
      minPeople: menu.minPeople,
      maxPeople: menu.maxPeople,
    };
  }
}
