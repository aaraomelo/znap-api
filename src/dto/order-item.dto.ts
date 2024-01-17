interface CreateOrderItemDTO {
  order_master_id: number;
  product_id: number;
  quantity: number;
  price: number;
  discount_percentage?: number;
  tax_percentage?: number;
}

interface UpdateOrderItemDTO extends Partial<CreateOrderItemDTO> {}

export { CreateOrderItemDTO, UpdateOrderItemDTO };
