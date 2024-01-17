interface CreateOrderMasterDTO {
  date: Date;
  order_number: number;
  client_id: number;
}

interface UpdateOrderMasterDTO extends Partial<CreateOrderMasterDTO> {}

export { CreateOrderMasterDTO, UpdateOrderMasterDTO };
