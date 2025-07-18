"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { medicationApi } from "@/app/lib/api";

export default function NuovoFarmaco() {
  const [nome, setNome] = useState("");
  const [dosaggio, setDosaggio] = useState("");
  const [frequenza, setFrequenza] = useState("");
  const [errore, setErrore] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrore("");

    try {
      await medicationApi.create({
        name: nome,
        dosage: Number(dosaggio),
        frequency: Number(frequenza),
      });

      router.push("/"); 
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
      <h1 className="text-2xl font-bold mb-4">Nuovo Farmaco</h1>

      {errore && <p className="text-red-500 mb-2">{errore}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Nome</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
            placeholder="Es. Aspirina"
          />
        </div>

        <div>
          <label className="block font-medium">Dosaggio (mg)</label>
          <input
            type="number"
            value={dosaggio}
            onChange={(e) => setDosaggio(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
            min={1}
            max={100000}
          />
        </div>

        <div>
          <label className="block font-medium">Frequenza (al giorno)</label>
          <input
            type="number"
            value={frequenza}
            onChange={(e) => setFrequenza(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
            min={1}
            max={24}
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Salva
        </button>
      </form>
    </div>
  );
}
