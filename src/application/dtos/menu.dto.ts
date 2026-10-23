export interface ICreateMenuDto {
  name: string;
  price: number;
  minPeople: number;
  maxPeople: number;
}

export interface IUpdateMenuDto {
  name?: string;
  price?: number;
  minPeople?: number;
  maxPeople?: number;
}

export interface IMenuDto {
  id: number;
  name: string;
  price: number;
  minPeople: number;
  maxPeople: number;
}
