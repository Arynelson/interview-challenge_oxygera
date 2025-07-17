import {
  API_BASE_URL,
  Patient,
  Medication,
  Assignment,
  CreatePatientDto,
  CreateMedicationDto,
  CreateAssignmentDto,
} from "./constants";

// Funções para Patient
export const patientApi = {
  getAll: async (): Promise<Patient[]> => {
    const response = await fetch(`${API_BASE_URL}/api/patients`);
    if (!response.ok) throw new Error("Erro ao buscar pacientes");
    return response.json();
  },

  getById: async (id: number): Promise<Patient> => {
    const response = await fetch(`${API_BASE_URL}/api/patients/${id}`);
    if (!response.ok) throw new Error("Erro ao buscar paciente");
    return response.json();
  },

  create: async (data: CreatePatientDto): Promise<Patient> => {
    const response = await fetch(`${API_BASE_URL}/api/patients`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ao criar paciente: ${errorText}`);
    }

    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/patients/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erro ao deletar paciente");
  },
};

// Funções para Medication
export const medicationApi = {
  getAll: async (): Promise<Medication[]> => {
    const response = await fetch(`${API_BASE_URL}/api/medications`);
    if (!response.ok) throw new Error("Erro ao buscar medicamentos");
    return response.json();
  },

  getById: async (id: number): Promise<Medication> => {
    const response = await fetch(`${API_BASE_URL}/api/medications/${id}`);
    if (!response.ok) throw new Error("Erro ao buscar medicamento");
    return response.json();
  },

  create: async (data: CreateMedicationDto): Promise<Medication> => {
    const response = await fetch(`${API_BASE_URL}/api/medications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Erro ao criar medicamento");
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/medications/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erro ao deletar medicamento");
  },
};

// Funções para Assignment
export const assignmentApi = {
  getAll: async (): Promise<Assignment[]> => {
    const response = await fetch(`${API_BASE_URL}/api/assignments`);
    if (!response.ok) throw new Error("Erro ao buscar atribuições");
    return response.json();
  },

  getAllWithRemainingDays: async (): Promise<Assignment[]> => {
    const response = await fetch(
      `${API_BASE_URL}/api/assignments/with-remaining-days`
    );
    if (!response.ok)
      throw new Error("Erro ao buscar atribuições com dias restantes");
    return response.json();
  },

  create: async (data: CreateAssignmentDto): Promise<Assignment> => {
    const response = await fetch(`${API_BASE_URL}/api/assignments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Erro ao criar atribuição");
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/assignments/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erro ao deletar atribuição");
  },
};
