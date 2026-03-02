// src/components/GreetingCard.jsx — Tageszeitabhängige Begrüßung (US-10, TASK-38)
//
// Diese Komponente zeigt eine persönliche Begrüßung basierend auf der
// aktuellen Tageszeit und dem Vornamen des eingeloggten Users.
//
// Wie funktioniert die Tageszeit-Logik?
//   new Date().getHours() gibt die aktuelle Stunde (0-23) zurück.
//   Damit bestimmen wir:
//     5–11 Uhr  → "Guten Morgen"
//     12–13 Uhr → "Mahlzeit"
//     14–17 Uhr → "Guten Nachmittag"
//     18–4 Uhr  → "Guten Abend"
//
// Props:
//   firstName (string) — der Vorname des Users (aus AuthContext)
//                         Falls leer/null → zeigen wir nur "Willkommen!"

import '../styles/components/GreetingCard.css';

// ── Hilfsfunktion: Tageszeit bestimmen ────────────────────────────────────
// Wird AUSSERHALB der Komponente definiert, damit sie nicht bei jedem
// Re-Render neu erstellt wird (Performance-Optimierung).
function getGreeting() {
  const hour = new Date().getHours(); // 0–23

  if (hour >= 5 && hour < 12) return 'Guten Morgen';
  if (hour >= 12 && hour < 14) return 'Mahlzeit';
  if (hour >= 14 && hour < 18) return 'Guten Nachmittag';
  return 'Guten Abend';
}

// ── Hilfsfunktion: Heutiges Datum formatieren ─────────────────────────────
// toLocaleDateString('de-DE', ...) nutzt die deutsche Lokalisierung.
// Ergebnis z.B.: "Montag, 2. März 2026"
function getFormattedDate() {
  return new Date().toLocaleDateString('de-DE', {
    weekday: 'long',  // "Montag"
    day: 'numeric',   // "2"
    month: 'long',    // "März"
    year: 'numeric',  // "2026"
  });
}

export default function GreetingCard({ firstName }) {
  // Begrüßungstext zusammenbauen:
  // Mit Name: "Guten Morgen, Laura 👋"
  // Ohne Name: "Willkommen! 👋"
  const greetingText = firstName
    ? `${getGreeting()}, ${firstName} 👋`
    : 'Willkommen! 👋';

  return (
    <section className="greeting-card" aria-label="Begrüßung">
      {/* Haupttext: z.B. "Guten Morgen, Laura 👋" */}
      <h1 className="greeting-card__title">{greetingText}</h1>

      {/* Datum: z.B. "Montag, 2. März 2026" */}
      <p className="greeting-card__date">{getFormattedDate()}</p>
    </section>
  );
}
