export interface Product {
  id: string;
  name: string;
  sku: string;
  laboratory?: string;
  type?: string;
  description?: string;
  stock: number;
  purchasePrice: number;
  salePrice: number;
  /** @deprecated use salePrice */
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  name: string;
  sku: string;
  laboratory?: string;
  type?: string;
  description?: string;
  stock?: number;
  purchasePrice?: number;
  salePrice: number;
  isActive?: boolean;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}

