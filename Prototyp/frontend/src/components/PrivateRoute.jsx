// src/components/PrivateRoute.jsx — Schutz für eingeloggte Nutzer (US-03 + US-04 + US-07)
//
// Ablauf bei jedem Seitenaufruf:
//   1. isLoading = true  → Spinner anzeigen (Token-Prüfung läuft noch)
//   2. isLoading = false, kein Token → zu /login weiterleiten
//   3. isLoading = false, Token OK, hasConsents = false → zu /consent weiterleiten
//   4. isLoading = false, Token OK, hasConsents = true  → geschützte Seite anzeigen
//
// Warum isLoading wichtig ist (US-04):
//   Ohne isLoading würde PrivateRoute beim App-Start sofort
//   "kein Token" annehmen und zu /login leiten — selbst wenn der
//   Token im localStorage liegt und nur noch nicht geprüft wurde.
//   Mit isLoading wartet PrivateRoute bis AuthContext fertig ist.
//
// US-07 Erweiterung:
//   hasConsents wird nach der Token-Prüfung auch gecheckt.
//   So werden ALLE User geprüft — auch die mit gespeichertem Token.
//   Die /consent-Seite selbst ist eine Ausnahme (sonst Endlos-Redirect).
//   Wir nutzen useLocation() um den aktuellen Pfad zu erkennen.

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export default function PrivateRoute({ children }) {
  const { token, isLoading, hasConsents } = useAuth();
  const location = useLocation();

  // Schritt 1: Token-Prüfung läuft noch → Spinner anzeigen
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Schritt 2: Prüfung abgeschlossen, kein gültiger Token → zu Login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Schritt 3: Token gültig, aber Consents fehlen → zu Consent-Seite
  // WICHTIG: Wenn wir bereits auf /consent sind, NICHT weiterleiten!
  // Sonst entsteht eine Endlos-Schleife: /consent → /consent → /consent → ...
  // hasConsents === null bedeutet: Prüfung läuft noch → Spinner zeigen
  if (hasConsents === null) {
    return <LoadingSpinner />;
  }

  if (!hasConsents && location.pathname !== '/consent') {
    return <Navigate to="/consent" replace />;
  }

  // Schritt 4: Token gültig + Consents vorhanden → geschützte Seite rendern
  return children;
}
