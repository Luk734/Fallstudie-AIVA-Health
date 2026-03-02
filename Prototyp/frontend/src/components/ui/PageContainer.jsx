// src/components/ui/PageContainer.jsx — Wiederverwendbarer Seiten-Container (US-12, Bonus)
//
// WARUM diese Komponente?
//   3 Seiten haben eine identische äußere Hülle:
//     ConsentPage:         .consent-page > .consent-container
//     ProfilePage:         .profile-page > .profile-container
//     PrivacySettingsPage: .privacy-page > .privacy-container
//   Alle drei haben: min-height 100vh, Hintergrundfarbe, Padding,
//   max-width und margin: 0 auto (horizontales Zentrieren).
//
// VERWENDUNG:
//   <PageContainer>
//     <PageHeader title="..." subtitle="..." />
//     <Card>...</Card>
//   </PageContainer>
//
//   <PageContainer maxWidth="400px">  → Schmalere Seite (z.B. Login)
//     ...
//   </PageContainer>
//
// PROPS erklärt:
//   children  (ReactNode) — Der gesamte Seiteninhalt
//   maxWidth  (string)    — Maximale Breite: 'sm' (400px) | 'md' (500px) | 'lg' (600px)
//   className (string)    — Optionale zusätzliche CSS-Klassen
//   ...rest   — Weitere Props (z.B. style)

import '../../styles/components/ui/PageContainer.css';

export default function PageContainer({
  children,
  maxWidth = 'md',        // Standard: 500px (passend für die meisten Formulare)
  className = '',         // Zusätzliche CSS-Klassen
  ...rest
}) {
  const classes = [
    'page-container',
    `page-container--${maxWidth}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} {...rest}>
      {/* ── Innerer Container: Begrenzt die Breite ────────────────── */}
      {/* Zweiteilung (page-container > page-container__inner) damit   */}
      {/* der Hintergrund die volle Breite füllt, aber der Inhalt      */}
      {/* zentriert und begrenzt ist.                                  */}
      <div className="page-container__inner">
        {children}
      </div>
    </div>
  );
}
