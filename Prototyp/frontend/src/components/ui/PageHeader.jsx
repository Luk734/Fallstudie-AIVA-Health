// src/components/ui/PageHeader.jsx — Wiederverwendbarer Seiten-Header (US-12, Bonus)
//
// WARUM diese Komponente?
//   3 Seiten haben einen identischen Header-Block:
//     ConsentPage:         <header className="consent-header">  <h1>🔒 ...</h1> <p>...</p> </header>
//     ProfilePage:         <header className="profile-header">  <h1>🩺 ...</h1> <p>...</p> </header>
//     PrivacySettingsPage: <header className="privacy-header">  <h1>🔒 ...</h1> <p>...</p> </header>
//   Alle drei haben: zentrierter Text, große Überschrift, Untertitel in Grau.
//   → Identische HTML-Struktur + identisches CSS an 3 Stellen.
//
// VERWENDUNG:
//   <PageHeader
//     title="🔒 Datenschutz & Einwilligungen"
//     subtitle="Deine Gesundheitsdaten gehören dir."
//   />
//
// PROPS erklärt:
//   title     (string) — Die Hauptüberschrift (h1)
//   subtitle  (string) — Optionaler Erklärungstext unter der Überschrift

import '../../styles/components/ui/PageHeader.css';

export default function PageHeader({ title, subtitle }) {
  return (
    <header className="page-header">
      {/* ── Hauptüberschrift ───────────────────────────────────────── */}
      {/* <h1> ist semantisch korrekt: Es gibt nur EINE h1 pro Seite. */}
      <h1 className="page-header__title">{title}</h1>

      {/* ── Untertitel (optional) ──────────────────────────────────── */}
      {/* Wird nur gerendert wenn subtitle angegeben ist.              */}
      {subtitle && (
        <p className="page-header__subtitle">{subtitle}</p>
      )}
    </header>
  );
}
