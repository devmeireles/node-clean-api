import { Menu } from "@/model/menus/menu.model";
import {
  ICreateMenuData,
  IMenuRepository,
  IUpdateMenuData,
} from "@/model/menus/menu.repository";
import {
  ICreateMenuDto,
  IMenuDto,
  IUpdateMenuDto,
} from "@/application/dtos/menu.dto";
import { IPaginatedData, IPaginationParams } from "@/model/common/pagination";
import { IPaginatedResult } from "../common/pagination";

export class MenuService {
  private readonly menuRepository: IMenuRepository;

  constructor(menuRepository: IMenuRepository) {
    this.menuRepository = menuRepository;
  }

  public async getAll(
    params: IPaginationParams,
  ): Promise<IPaginatedResult<IMenuDto>> {
    const result: IPaginatedData<Menu> =
      await this.menuRepository.findAll(params);

    const totalPages = Math.ceil(result.totalItems / params.limit);

    return {
      data: result.items.map((menu) => this.toDto(menu)),
      meta: {
        pagination: {
          page: params.page,
          limit: params.limit,
          totalItems: result.totalItems,
          totalPages,
          hasNextPage: params.page < totalPages,
          hasPreviousPage: params.page > 1,
        },
      },
    };
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
