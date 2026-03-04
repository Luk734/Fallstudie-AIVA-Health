// src/components/AppLayout.jsx — Layout-Rahmen mit Bottom-Navigation (US-09, TASK-35)
//
// Diese Komponente umgibt ALLE geschützten Seiten (außer Login & Consent).
// Sie besteht aus zwei Bereichen:
//
//   ┌─────────────────────────┐
//   │                         │
//   │    <main> (children)    │  ← Hier wird die aktuelle Seite gerendert
//   │    z.B. DashboardPage   │     (über React Router als children übergeben)
//   │                         │
//   ├─────────────────────────┤
//   │  🏠  📅  🔬  💪  👨‍👩‍👧  │  ← Bottom-Navigation (fixiert am unteren Rand)
//   └─────────────────────────┘
//
// Warum ein eigenes Layout?
//   Ohne AppLayout müsste JEDE Seite ihre eigene Navigation rendern.
//   Das wäre Code-Duplizierung. Mit AppLayout schreiben wir die Nav
//   nur EINMAL und sie erscheint automatisch auf allen geschützten Seiten.
//
// Children-Pattern:
//   In React kann eine Komponente andere Komponenten "umhüllen".
//   Alles zwischen <AppLayout> und </AppLayout> wird als `children` Prop
//   an AppLayout übergeben. Beispiel:
//     <AppLayout>
//       <DashboardPage />    ← das ist children
//     </AppLayout>

import AppHeader from './AppHeader';
import NavItem from './NavItem';
import '../styles/components/AppLayout.css';

export default function AppLayout({ children }) {
  return (
    <div className="app-layout">
      {/* ── App-Header: Logo + Profil/Datenschutz/Logout ─────────────── */}
      {/* Erscheint auf JEDER geschützten Seite (wie die Bottom-Nav).    */}
      {/* Vorher war der Header nur in DashboardPage eingebettet.        */}
      <AppHeader />

      {/* ── Hauptbereich: Hier erscheint die aktuelle Seite ──────────── */}
      {/* flex: 1 → nimmt den gesamten Platz ein, der nicht von der Nav   */}
      {/* belegt wird. overflow-y: auto → scrollbar bei langem Inhalt.    */}
      <main className="app-layout__main">
        {children}
      </main>

      {/* ── Bottom-Navigation ────────────────────────────────────────── */}
      {/* Fixiert am unteren Bildschirmrand. Enthält 5 NavItem-Tabs.     */}
      {/* role="navigation" + aria-label → Barrierefreiheit: Screenreader */}
      {/* erkennen dies als Navigationsbereich.                          */}
      <nav className="app-layout__nav" role="navigation" aria-label="Hauptnavigation">
        <NavItem to="/dashboard" icon="🏠" label="Home" />
        <NavItem to="/care"      icon="📅" label="Care" />
        <NavItem to="/labs"      icon="🔬" label="Labs" />
        <NavItem to="/coach"     icon="💪" label="Coach" />
        <NavItem to="/family"    icon="👨‍👩‍👧" label="Family" />
      </nav>
    </div>
  );
}
