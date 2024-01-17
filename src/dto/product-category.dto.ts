interface CreateProductCategoryDTO {
  name: string;
  description: string;
  is_active?: boolean;
}

interface UpdateProductCategoryDTO extends Partial<CreateProductCategoryDTO> {
  id: number;
}

export { CreateProductCategoryDTO, UpdateProductCategoryDTO };
