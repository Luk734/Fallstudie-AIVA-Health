// src/components/coach/CheckInCard.jsx — Täglicher Befinden-Check-in (US-24)
//
// Laura (32) möchte täglich in 10 Sekunden ihr Befinden eintragen.
//
// Zustände:
//   1. Laden     → Spinner während GET /api/checkins/today
//   2. Auswahl   → 5 Emoji-Buttons + optionales Notizfeld + Speichern-Button
//   3. Erledigt  → Gespeicherter Mood wird angezeigt mit ✅
//
// API-Calls:
//   GET  /api/checkins/today → Prüfen ob heute schon ein Check-in existiert
//   POST /api/checkins       → Neuen Check-in erstellen
//
// Props:
//   onCheckinDone (function) — Callback nach erfolgreichem Check-in
//     (damit CoachPage die Streak aktualisieren kann)

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/components/coach/CheckInCard.css';

// ── Mood-Skala: Die 5 Emojis aus den Akzeptanzkriterien ──────────────
// Jeder Eintrag hat score (1–5), emoji und label.
// Die Reihenfolge entspricht der User Story:
//   😞 Schlecht → 😐 Mittelmäßig → 🙂 Okay → 😊 Gut → 😄 Super
const MOODS = Object.freeze([
  { score: 1, emoji: '😞', label: 'Schlecht' },
  { score: 2, emoji: '😐', label: 'Mittelmäßig' },
  { score: 3, emoji: '🙂', label: 'Okay' },
  { score: 4, emoji: '😊', label: 'Gut' },
  { score: 5, emoji: '😄', label: 'Super' },
]);

export default function CheckInCard({ onCheckinDone }) {
  const { token } = useAuth();

  // ── State ────────────────────────────────────────────────────────
  // todayCheckin: null = noch keiner, Object = schon erledigt
  // selectedMood: Der vom User angeklickte Score (1–5), null = noch nicht gewählt
  // note: Optionaler Freitext
  // loading: Lade-Zustand beim initialen Fetch
  // saving: Speicher-Zustand beim POST
  const [todayCheckin, setTodayCheckin] = useState(null);
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ── Beim Laden: Heutigen Check-in abrufen ────────────────────────
  // Einmaliger API-Call beim Mount der Komponente.
  // Wenn der User heute schon eingecheckt hat, zeigen wir direkt
  // den "Erledigt"-Zustand an.
  useEffect(() => {
    async function fetchToday() {
      try {
        const res = await fetch('/api/checkins/today', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.checkin) {
          setTodayCheckin(data.checkin);
        }
      } catch (err) {
        console.error('CheckInCard: Fehler beim Laden:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchToday();
  }, [token]);

  // ── Check-in speichern ───────────────────────────────────────────
  // POST /api/checkins mit dem gewählten moodScore + optionaler note.
  // Nach Erfolg: todayCheckin setzen → Wechsel zu "Erledigt"-Ansicht.
  // onCheckinDone() aufrufen → CoachPage kann die Streak aktualisieren.
  async function handleSubmit() {
    if (!selectedMood) return;
    setSaving(true);
    try {
      const res = await fetch('/api/checkins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          moodScore: selectedMood,
          note: note.trim() || null,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setTodayCheckin(data.checkin);
        if (onCheckinDone) onCheckinDone();
      }
    } catch (err) {
      console.error('CheckInCard: Fehler beim Speichern:', err);
    } finally {
      setSaving(false);
    }
  }

  // ── Render: Lade-Zustand ─────────────────────────────────────────
  if (loading) {
    return (
      <div className="checkin-card checkin-card--loading">
        <div className="checkin-spinner" />
      </div>
    );
  }

  // ── Render: Schon erledigt ───────────────────────────────────────
  // Zeigt den gespeicherten Mood-Emoji mit einem grünen Haken.
  if (todayCheckin) {
    const mood = MOODS.find((m) => m.score === todayCheckin.moodScore);
    return (
      <div className="checkin-card checkin-card--done">
        <div className="checkin-done-header">
          <span className="checkin-done-check">✅</span>
          <span className="checkin-done-title">Heutiges Check-in</span>
        </div>
        <div className="checkin-done-mood">
          <span className="checkin-done-emoji">{mood?.emoji}</span>
          <span className="checkin-done-label">{mood?.label}</span>
        </div>
        {todayCheckin.note && (
          <p className="checkin-done-note">„{todayCheckin.note}"</p>
        )}
      </div>
    );
  }

  // ── Render: Emoji-Auswahl ────────────────────────────────────────
  // 5 Emoji-Buttons in einer Reihe. Bei Klick wird der Score gesetzt
  // und der Button optisch hervorgehoben (.checkin-mood--selected).
  return (
    <div className="checkin-card">
      <h2 className="checkin-title">Wie geht es dir heute?</h2>
      <p className="checkin-subtitle">Wähle dein Befinden — dauert nur 10 Sekunden</p>

      <div className="checkin-moods">
        {MOODS.map((mood) => (
          <button
            key={mood.score}
            className={`checkin-mood ${selectedMood === mood.score ? 'checkin-mood--selected' : ''}`}
            onClick={() => setSelectedMood(mood.score)}
            type="button"
            aria-label={mood.label}
          >
            <span className="checkin-mood-emoji">{mood.emoji}</span>
            <span className="checkin-mood-label">{mood.label}</span>
          </button>
        ))}
      </div>

      {/* ── Notizfeld: Erscheint nach Emoji-Auswahl ──────────────── */}
      {selectedMood && (
        <div className="checkin-note-section">
          <label htmlFor="checkin-note" className="checkin-note-label">
            Was beschäftigt dich heute? (optional)
          </label>
          <textarea
            id="checkin-note"
            className="checkin-note-input"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="z.B. Gut geschlafen, Sport gemacht..."
            maxLength={500}
            rows={3}
          />
          <button
            className="checkin-submit"
            onClick={handleSubmit}
            disabled={saving}
            type="button"
          >
            {saving ? 'Wird gespeichert…' : 'Check-in speichern'}
          </button>
        </div>
      )}
    </div>
  );
}
