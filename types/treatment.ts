export interface Treatment {
  id: string;
  name: string;
  description?: string;
  durationMinutes?: number;
  price: number;
  instructions?: string;
  observations?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTreatmentDto {
  name: string;
  description?: string;
  durationMinutes?: number;
  price: number;
  instructions?: string;
  observations?: string;
  isActive?: boolean;
}

export interface UpdateTreatmentDto extends Partial<CreateTreatmentDto> {}

