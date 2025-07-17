// Configuração global da API
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Tipos TypeScript para as entidades
export interface Patient {
  id: number;
  name: string;
  dateOfBirth: Date;
  assignments?: Assignment[];
}

export interface Medication {
  id: number;
  name: string;
  dosage: number;
  frequency: number;
  assignments?: Assignment[];
}

export interface Assignment {
  id: number;
  startDate: string;
  numberOfDays: number;
  patientId: number;
  medicationId: number;
  patient?: Patient;
  medication?: Medication;
  remainingDays?: number;
}

export interface CreatePatientDto {
  name: string;
  dateOfBirth: string;
}

export interface CreateMedicationDto {
  name: string;
  dosage: number;
  frequency: number;
}

export interface CreateAssignmentDto {
  patientId: number;
  medicationId: number;
  startDate: string;
  numberOfDays: number;
}
