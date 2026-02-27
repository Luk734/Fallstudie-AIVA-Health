// src/contexts/AuthContext.jsx — Globaler Auth-Status
//
// React Context ist ein Mechanismus, um Daten durch den gesamten
// Komponentenbaum zu teilen, ohne sie als Props weitergeben zu müssen.
//
// Dieser Context verwaltet:
//   user      → die aktuellen User-Daten (oder null wenn ausgeloggt)
//   token     → der JWT-Token (oder null)
//   isLoading → true solange der Token beim App-Start geprüft wird (US-04)
//   login()   → speichert Token + User in Context UND localStorage
//   logout()  → löscht alles aus Context UND localStorage
//
// localStorage erklärt:
//   Der Browser hat einen dauerhaften Schlüssel-Wert-Speicher pro Website.
//   Daten dort bleiben auch nach einem Seitenreload erhalten.
//   → Genau das brauchen wir, damit der User eingeloggt bleibt.

import { createContext, useContext, useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// ── Schritt 1: Context erstellen ─────────────────────────────────────────────
// createContext() erstellt ein leeres Context-Objekt.
// null als Default-Wert wird angezeigt wenn eine Komponente den
// Context nutzt aber kein <AuthProvider> in ihrer Elternkette hat.
const AuthContext = createContext(null);

// ── Schritt 2: Provider-Komponente ───────────────────────────────────────────
// Der Provider "umhüllt" die gesamte App und stellt den Context-Wert bereit.
// Alle Kindkomponenten innerhalb des Providers können auf den Context zugreifen.
export function AuthProvider({ children }) {
  // useState: Holt beim ersten Laden den gespeicherten Token/User aus
  // dem localStorage (falls der User schon einmal eingeloggt war).
  // JSON.parse() wandelt den gespeicherten String zurück in ein Objekt.
  const [token, setToken] = useState(
    () => localStorage.getItem('aiva_token') || null
  );
  const [user, setUser] = useState(
    () => {
      const saved = localStorage.getItem('aiva_user');
      return saved ? JSON.parse(saved) : null;
    }
  );

  // ── isLoading: Token-Prüfung bei App-Start (US-04) ─────────────────────────
  // Startet als true — die App zeigt einen Spinner bis die Prüfung abgeschlossen
  // ist. Danach immer false. So gibt es kein Flackern zwischen den Seiten.
  const [isLoading, setIsLoading] = useState(true);

  // ── useEffect: Token beim App-Start validieren ──────────────────────────────
  // useEffect(fn, []) wird genau EINMAL ausgeführt — nach dem ersten Rendern.
  // Das leere Array [] bedeutet: keine Abhängigkeiten → nur beim Mounten.
  //
  // Ablauf:
  //   1. Gibt es einen Token im localStorage?
  //   2. JA → GET /api/auth/me aufrufen (Backend prüft ob Token noch gültig)
  //      a. Antwort OK   → User-Daten aktualisieren (frisch aus DB)
  //      b. Antwort 401  → Token abgelaufen → logout() aufrufen
  //   3. NEIN → nichts tun (User ist ausgeloggt)
  //   4. In jedem Fall: isLoading = false → Spinner verschwindet
  useEffect(() => {
    const savedToken = localStorage.getItem('aiva_token');

    if (!savedToken) {
      // Kein Token gespeichert → sofort fertig, User ist ausgeloggt
      setIsLoading(false);
      return;
    }

    // Token vorhanden → Backend fragen ob er noch gültig ist
    fetch(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${savedToken}` },
    })
      .then((res) => {
        if (!res.ok) {
          // 401: Token abgelaufen oder manipuliert → ausloggen
          throw new Error('Token ungültig');
        }
        return res.json();
      })
      .then((data) => {
        // Token ist gültig → User-Daten frisch aus DB übernehmen
        // (könnten sich seit dem letzten Login geändert haben)
        setUser(data.user);
      })
      .catch(() => {
        // Token ungültig oder Netzwerkfehler → sauber ausloggen
        setToken(null);
        setUser(null);
        localStorage.removeItem('aiva_token');
        localStorage.removeItem('aiva_user');
      })
      .finally(() => {
        // Immer: Prüfung abgeschlossen → Spinner ausschalten
        setIsLoading(false);
      });
  }, []); // [] = nur einmal beim App-Start ausführen

  // ── login(): Token + User speichern ────────────────────────────────────────
  // Wird nach erfolgreichem Login aufgerufen.
  // Speichert die Daten sowohl im React-State (sofortige UI-Aktualisierung)
  // als auch im localStorage (überlebt Seitenreloads).
  //
  // JSON.stringify() wandelt das user-Objekt in einen String um,
  // da localStorage nur Strings speichern kann.
  function login(newToken, newUser) {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('aiva_token', newToken);
    localStorage.setItem('aiva_user', JSON.stringify(newUser));
  }

  // ── logout(): Alles löschen ─────────────────────────────────────────────────
  // Das ist der Kern von US-03!
  // Setzt token und user auf null (React re-rendert sofort)
  // und entfernt die Einträge aus dem localStorage.
  // → Nach diesem Aufruf ist der User aus Sicht der App komplett ausgeloggt.
  // → PrivateRoute leitet ihn dann automatisch zur Login-Seite weiter.
  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem('aiva_token');
    localStorage.removeItem('aiva_user');
  }

  // ── updateUser(): User-Daten aktualisieren (US-05) ──────────────────────────
  // Wird nach dem Profil-Speichern aufgerufen.
  // Aktualisiert die User-Daten im React-State UND im localStorage,
  // damit alle Komponenten (z.B. Dashboard) sofort den neuen Namen sehen.
  //
  // Wir mergen (= zusammenführen) die neuen mit den alten Daten:
  //   { ...user }       → alle bisherigen Felder behalten (email, id, ...)
  //   { ...newUserData } → neue/geänderte Felder überschreiben (firstName, ...)
  // Der Spread-Operator "..." kopiert alle Eigenschaften eines Objekts.
  function updateUser(newUserData) {
    const merged = { ...user, ...newUserData };
    setUser(merged);
    localStorage.setItem('aiva_user', JSON.stringify(merged));
  }

  // ── Context-Wert zusammenstellen ───────────────────────────────────────────
  // Dieses Objekt ist das, was alle Kindkomponenten mit useAuth() abrufen.
  // isLoading wird von PrivateRoute genutzt um den Spinner anzuzeigen.
  const value = { user, token, isLoading, login, logout, updateUser };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Schritt 3: Custom Hook ───────────────────────────────────────────────────
// useAuth() ist ein Custom Hook — eine wiederverwendbare Funktion, die
// useContext(AuthContext) kapselt.
//
// Statt:  const { user, logout } = useContext(AuthContext);
// einfach: const { user, logout } = useAuth();
//
// Die Fehlermeldung bei falschem Einsatz hilft beim Debugging.
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth() muss innerhalb eines <AuthProvider> verwendet werden!');
  }
  return context;
}
