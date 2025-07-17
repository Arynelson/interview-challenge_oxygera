'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { assignmentApi } from '@/app/lib/api';

export default function NuovaAssegnazione() {
  const [patientId, setPatientId] = useState('');
  const [medicationId, setMedicationId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [days, setDays] = useState('');
  const [errore, setErrore] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrore('');

    try {
      await assignmentApi.create({
        patientId: Number(patientId),
        medicationId: Number(medicationId),
        startDate,
        numberOfDays: Number(days),
      });

      router.push("/"); // ou /medications se existir
    }  catch (err: unknown) {
      if (err instanceof Error) {
        setErrore(err.message);
      } else {
        setErrore("Si è verificato un errore sconosciuto.");
      }
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Nuova Assegnazione</h1>

      {errore && <p className="text-red-500 mb-2">{errore}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">ID Paziente</label>
          <input
            type="number"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
            min={1}
          />
        </div>

        <div>
          <label className="block font-medium">ID Farmaco</label>
          <input
            type="number"
            value={medicationId}
            onChange={(e) => setMedicationId(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
            min={1}
          />
        </div>

        <div>
          <label className="block font-medium">Data Inizio</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium">Numero di giorni</label>
          <input
            type="number"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
            min={1}
          />
        </div>

        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Salva
        </button>
      </form>
    </div>
  );
}
