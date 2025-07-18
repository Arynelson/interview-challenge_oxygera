# 🩺 Sistema di Gestione dei Pazienti

## ✅ Stato: COMPLETATO

Un'applicazione full-stack per la gestione di pazienti, farmaci e trattamenti, con **backend NestJS** e **frontend Next.js**, interamente scritto in **TypeScript**, con supporto a **SQLite** e **test automatizzati** (unitari e end-to-end).

---

### 🔹 Backend (NestJS - Porta 8080)

- API RESTful con CRUD completo per `Patient`, `Medication` e `Assignment`
- Validazione degli input con `class-validator`
- Calcolo automatico dei giorni rimanenti di trattamento
- **Test unitari** con Jest
- **Test end-to-end (E2E)** con Supertest
- Database `SQLite` tramite `TypeORM`
- Codici HTTP significativi e corretta gestione degli errori

### 🔹 Frontend (Next.js - Porta 3000)

- UI moderna e responsive con Tailwind CSS
- Form per creare pazienti, farmaci e assegnazioni
- Visualizzazione chiara dei trattamenti e giorni rimanenti
- Validazione dei form e UX reattiva

---

## 🚀 Funzionalità Principali

### 👤 Pazienti

- Registrazione con nome e data di nascita
- Visualizzazione delle terapie assegnate
- Calcolo automatico dei giorni rimanenti

### 💊 Farmaci

- Dosaggio e frequenza configurabili
- CRUD completo con validazione

### 🔁 Assegnazioni

- Collegamento farmaco ↔ paziente
- Inizio del trattamento e durata in giorni
- Indicatori visivi per i giorni rimanenti

---

## 📊 API Endpoint

### Pazienti

- `GET /patients` – Elenco
- `POST /patients` – Crea nuovo
- `GET /patients/:id` – Dettaglio
- `PATCH /patients/:id` – Aggiorna
- `DELETE /patients/:id` – Elimina

### Farmaci

- `GET /medications`
- `POST /medications`
- `GET /medications/:id`
- `PATCH /medications/:id`
- `DELETE /medications/:id`

### Assegnazioni

- `GET /assignments`
- `GET /assignments/with-remaining-days`
- `POST /assignments`
- `PATCH /assignments/:id`
- `DELETE /assignments/:id`

---

## 🧪 Test Automatizzati

### ✅ Test Unitari (Jest)

Coprono la logica del calcolo dei giorni rimanenti e i servizi principali (`AssignmentService`, `PatientService`, `MedicationService`).

```
npm run test
```
### ✅Test End-to-End (E2E)

Validano il comportamento degli endpoint REST: creazione, validazione input, struttura JSON, codici HTTP corretti.

```
npm run test:e2e
```
### Come Eseguire

- Backend
  ```
  cd backend
  npm install
  npm run start:dev
  ```
- Frontend
  ```
  cd frontend
  npm install
  npm run dev
  ```
- Test
  ```
  # Test unitari
  npm run test

  # Test end-to-end
  npm run test:e2e
  ```
  
### 🏁 Conclusione

Sistema completo, testato e funzionale, con architettura modulare, codice pulito e validazioni robuste.

✔️ Progetto conforme ai requisiti : Il FrontEnd è stato progettato in modo semplice per soddisfare le 
       funzionalità richieste senza utilizzare tutti gli endpoint creati nel BackEnd.
     
✔️ Interfaccia utente efficace

✔️ Copertura di test estesa (unità + E2E)

