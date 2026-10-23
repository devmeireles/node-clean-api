import { IPaginationParams, IPaginatedData } from "@/model/common/pagination";
import type { Menu } from "./menu.model";

export interface ICreateMenuData {
  name: string;
  price: number;
  minPeople: number;
  maxPeople: number;
}

export interface IUpdateMenuData {
  name?: string;
  price?: number;
  minPeople?: number;
  maxPeople?: number;
}

export interface IMenuRepository {
  findAll(params: IPaginationParams): Promise<IPaginatedData<Menu>>;
  findById(id: number): Promise<Menu | null>;
  create(data: ICreateMenuData): Promise<Menu>;
  update(id: number, data: IUpdateMenuData): Promise<Menu>;
  delete(id: number): Promise<Menu>;
}
