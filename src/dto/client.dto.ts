interface CreateClientDTO {
  name: string;
  email: string;
  phone_number?: string;
}

interface UpdateClientDTO extends Partial<CreateClientDTO> {}

export { CreateClientDTO, UpdateClientDTO };
