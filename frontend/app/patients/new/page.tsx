"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "../../../app/lib/constants";

export default function NuovoPaziente() {
  const [nome, setNome] = useState("");
  const [dataNascita, setDataNascita] = useState("");
  const [errore, setErrore] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrore("");
    console.log("Sending for:", `${API_BASE_URL}/api/patients`, {
      name: nome,
      dateOfBirth: dataNascita,
    });

    try {
      const res = await fetch(`${API_BASE_URL}/api/patients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nome,
          dateOfBirth: dataNascita,
        }),
      });

      
      if (!res.ok) {
        const errorData = await res.json();
        const errorMessage =
          errorData.message || "Errore durante la creazione del paziente.";
        throw new Error(errorMessage);
      }

      router.push("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrore(err.message);
      } else {
        setErrore("Si è verificato un errore sconosciuto.");
      }
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Nuovo Paziente</h1>

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
            placeholder="Es. Mario Rossi"
          />
        </div>

        <div>
          <label className="block font-medium">Data di nascita</label>
          <input
            type="date"
            value={dataNascita}
            onChange={(e) => setDataNascita(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Salva
        </button>
      </form>
    </div>
  );
}
