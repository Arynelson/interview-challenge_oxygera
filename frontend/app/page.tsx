"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { patientApi, assignmentApi, medicationApi } from "../app/lib/api";
import { Patient, Assignment, Medication } from "../app/lib/constants";

export default function Home() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [showMedications, setShowMedications] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [patientsData, assignmentsData] = await Promise.all([
        patientApi.getAll(),
        assignmentApi.getAllWithRemainingDays(),
      ]);
      setPatients(patientsData);
      setAssignments(assignmentsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore sconosciuto");
    } finally {
      setLoading(false);
    }
  };

  const fetchMedications = async () => {
    try {
      const meds = await medicationApi.getAll();
      setMedications(meds);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore sconosciuto");
    }
  };

  const getPatientAssignments = (patientId: number) => {
    return assignments.filter(
      (assignment) => assignment.patientId === patientId
    );
  };

  const getRemainingDaysColor = (remainingDays: number) => {
    if (remainingDays === 0) return "text-red-600 bg-red-50";
    if (remainingDays <= 3) return "text-orange-600 bg-orange-50";
    if (remainingDays <= 7) return "text-yellow-600 bg-yellow-50";
    return "text-green-600 bg-green-50";
  };

  const handleDeletePatient = async () => {
    const input = prompt("Inserisci l'ID del paziente da eliminare:");
    if (!input) return;
    const id = parseInt(input);
    if (isNaN(id)) return alert("ID non valido.");
    try {
      await patientApi.delete(id);
      alert("Paziente eliminato con successo.");
      fetchData();
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      err instanceof Error
        ? alert(err.message)
        : alert("Errore durante l'eliminazione.");
    }
  };

  const handleDeleteMedication = async () => {
    const input = prompt("Inserisci l'ID del farmaco da eliminare:");
    if (!input) return;
    const id = parseInt(input);
    if (isNaN(id)) return alert("ID non valido.");
    try {
      await medicationApi.delete(id);
      alert("Farmaco eliminato con successo.");
      if (showMedications) {
        await fetchMedications();
      }
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      err instanceof Error
        ? alert(err.message)
        : alert("Errore durante l'eliminazione.");
    }
  };

  const handleListMedications = async () => {
    try {
      setLoading(true);
      await fetchMedications();
      setShowMedications(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore sconosciuto");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Caricamento...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">Errore: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cabeçalho fixo */}
      <div className="sticky top-0 z-10 bg-white shadow-md py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Sistema di Gestione Pazienti
          </h1>

          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/patients/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <PlusIcon className="w-4 h-4 mr-1" /> Nuovo Paziente
            </Link>
            <Link
              href="/medications/new"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <PlusIcon className="w-4 h-4 mr-1" /> Nuovo Farmaco
            </Link>
            <Link
              href="/assignments/new"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
            >
              <PlusIcon className="w-4 h-4 mr-1" /> Nuova Assegnazione
            </Link>
            <button
              onClick={handleListMedications}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center"
            >
              <ListIcon className="w-4 h-4 mr-1" /> Lista Farmaci
            </button>
            <button
              onClick={handleDeletePatient}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
            >
              <TrashIcon className="w-4 h-4 mr-1" /> Elimina Paziente
            </button>
            <button
              onClick={handleDeleteMedication}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center"
            >
              <TrashIcon className="w-4 h-4 mr-1" /> Elimina Farmaco
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="container mx-auto px-4 py-8 pt-20">
        {patients.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nessun paziente registrato.</p>
            <Link
              href="/patients/new"
              className="inline-block mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Registra il primo paziente
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {patients.map((patient) => {
              const patientAssignments = getPatientAssignments(patient.id);
              return (
                <div
                  key={patient.id}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {patient.name}
                      </h2>
                      <p className="text-gray-600">
                        Data di nascita:{" "}
                        {new Date(patient.dateOfBirth).toLocaleDateString(
                          "it-IT"
                        )}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500">
                      ID: {patient.id}
                    </span>
                  </div>

                  {patientAssignments.length === 0 ? (
                    <p className="text-gray-500 italic">
                      Nessun farmaco assegnato a questo paziente.
                    </p>
                  ) : (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">
                        Farmaci Assegnati:
                      </h3>
                      <div className="space-y-3">
                        {patientAssignments.map((assignment) => (
                          <div
                            key={assignment.id}
                            className="border border-gray-200 rounded-lg p-4"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">
                                  {assignment.medication?.name}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  Dosaggio: {assignment.medication?.dosage} mg |
                                  Frequenza: {assignment.medication?.frequency}{" "}
                                  volte al giorno
                                </p>
                                <p className="text-sm text-gray-600">
                                  Inizio:{" "}
                                  {new Date(
                                    assignment.startDate
                                  ).toLocaleDateString("it-IT")}{" "}
                                  | Durata: {assignment.numberOfDays} giorni
                                </p>
                              </div>
                              <div className="ml-4">
                                <span
                                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRemainingDaysColor(
                                    assignment.remainingDays || 0
                                  )}`}
                                >
                                  {assignment.remainingDays === 0
                                    ? "Completato"
                                    : `${assignment.remainingDays} giorni rimanenti`}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de Medicamentos */}
      {showMedications && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Lista Farmaci
              </h2>
              <button
                onClick={() => setShowMedications(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>

            {medications.length === 0 ? (
              <p>Nessun farmaco registrato.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {medications.map((med) => (
                  <div
                    key={med.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <h3 className="font-bold text-lg">
                      {med.name}
                      <span className="text-bold font-normal text-black-500">
                        ( Id: {med.id})
                      </span>
                    </h3>
                    <p>Dosaggio: {med.dosage} mg</p>
                    <p>Frequenza: {med.frequency} volte al giorno</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Ícones
const PlusIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
    />
  </svg>
);

const ListIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 10h16M4 14h16M4 18h16"
    />
  </svg>
);

const TrashIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);
