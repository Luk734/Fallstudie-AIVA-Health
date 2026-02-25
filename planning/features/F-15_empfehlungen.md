# F-15 — Regelbasierte Empfehlungen

> **Epic:** [EPIC-04 AIVA Coach](../epics/EPIC-04_aiva-coach.md)
> **Priorität:** 🟡 SHOULD | **Größe:** L | **Abhängigkeit:** F-14

---

## Ziel

Nach dem täglichen Check-in erhält der Nutzer eine konkrete, umsetzbare Gesundheitsempfehlung.

**MVP-Einschränkung:** Regelbasiert (if–else Logik). Kein Machine Learning. KI-Empfehlungen kommen in v2.0.

**Beispielregel:** Mood ≤ 2 UND letzte 3 Tage auch ≤ 2 → „Gönn dir heute 10 Min. Spaziergang + Überleg ob du mit jemandem reden möchtest."

---

## User Stories

| ID | Titel | Größe | Status |
|----|-------|-------|--------|
| [US-26](../user-stories/US-26_tagesempfehlung.md) | Tagesempfehlung erhalten | L | 🔲 Offen |
