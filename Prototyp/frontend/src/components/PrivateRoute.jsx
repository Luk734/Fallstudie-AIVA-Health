// src/components/PrivateRoute.jsx — Schutz für eingeloggte Nutzer (US-03 + US-04)
//
// Ablauf bei jedem Seitenaufruf:
//   1. isLoading = true  → Spinner anzeigen (Token-Prüfung läuft noch)
//   2. isLoading = false, kein Token → zu /login weiterleiten
//   3. isLoading = false, Token OK   → geschützte Seite anzeigen
//
// Warum isLoading wichtig ist (US-04):
//   Ohne isLoading würde PrivateRoute beim App-Start sofort
//   "kein Token" annehmen und zu /login leiten — selbst wenn der
//   Token im localStorage liegt und nur noch nicht geprüft wurde.
//   Mit isLoading wartet PrivateRoute bis AuthContext fertig ist.

import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export default function PrivateRoute({ children }) {
  const { token, isLoading } = useAuth();

  // Schritt 1: Token-Prüfung läuft noch → Spinner anzeigen
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Schritt 2: Prüfung abgeschlossen, kein gültiger Token → zu Login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Schritt 3: Token gültig → geschützte Seite rendern
  return children;
}
