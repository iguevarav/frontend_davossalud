import { Patient } from "./patient";
import { Staff } from "./staff";

export interface RecipeItem {
  id: string;
  medicine: string;
  presentation: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface Recipe {
  id: string;
  patientId: string;
  patient: Patient;
  staffId: string;
  staff: Staff;
  prescribedAt: string;
  diagnosis: string;
  notes?: string;
  items: RecipeItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateRecipeItemDto {
  medicine: string;
  presentation: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface CreateRecipeDto {
  patientId: string;
  staffId: string;
  prescribedAt: string;
  diagnosis: string;
  notes?: string;
  items: CreateRecipeItemDto[];
}
