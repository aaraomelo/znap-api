interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  stock_quantity?: number;
  category_id: number;
}

interface UpdateProductDTO extends Partial<CreateProductDTO> {}

export { CreateProductDTO, UpdateProductDTO };
