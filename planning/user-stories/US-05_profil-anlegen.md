# US-05 — Profil anlegen (Onboarding)

> **Feature:** [F-02 Nutzer-Profil](../features/F-02_nutzer-profil.md)
> **Größe:** M | **Priorität:** 🔴 MUST | **Status:** 🔲 Offen

---

## User Story

> **Als** neu registrierter Nutzer  
> **möchte ich** direkt nach der Registrierung mein Profil anlegen,  
> **damit** AIVA Health mich mit meinem Namen ansprechen und Inhalte personalisieren kann.

---

## Akzeptanzkriterien

- [ ] Felder: Vorname, Nachname, Geburtsdatum, Geschlecht (m/w/d/keine Angabe)
- [ ] Alle Felder optional außer Vorname
- [ ] Geburtsdatum wird für Alter-basierte Empfehlungen genutzt (z.B. Darmkrebsvorsorge ab 50)
- [ ] Profilbild-Upload (MVP: nur Platzhalter-Avatar, kein echter Upload)
- [ ] Nach Onboarding → Weiterleitung zum Dashboard

---

## Technische Tasks

- [ ] `TASK-21` DB: Tabelle `profiles` (user_id FK, first_name, last_name, birthdate, gender, avatar_url)
- [ ] `TASK-22` Backend: `POST /api/profile` (Profil erstellen)
- [ ] `TASK-23` Frontend: Onboarding-Step nach Registrierung
- [ ] `TASK-24` Frontend: Datumspicker-Komponente
