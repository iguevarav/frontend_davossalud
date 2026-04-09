import { Staff } from "./staff";

export enum Role {
  ADMIN = "ADMINISTRADOR",
  DOCTOR = "MEDICO",
  RECEPTIONIST = "RECEPCIONISTA",
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: Role[];
  isActive: boolean;
  staff?: Staff;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  roles?: Role[];
}

export interface UpdateUserDto extends Partial<CreateUserDto> {
  isActive?: boolean;
}
