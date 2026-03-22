// src/components/coach/MoodCalendar.jsx — Befinden-Kalender (US-25, TASK-98)
//
// Zeigt die Check-ins der letzten 30 Tage als Kalender-Grid an.
// Jeder Tag hat eine Farb-Codierung nach moodScore:
//   1–2 (😞😐) → Rot/Orange   (schlechte Tage)
//   3   (🙂)   → Gelb          (mittelmäßig)
//   4–5 (😊😄) → Grün          (gute Tage)
//   Kein Check-in → Grau/leer
//
// Klick auf einen Tag → Detail-Popup mit Emoji + Note.
// Monat-Navigation (← / →) um ältere Monate zu sehen.
//
// Props:
//   refreshKey (number) — Wird nach neuem Check-in erhöht → Kalender re-fetched

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/components/coach/MoodCalendar.css';

// ── Emoji-Mapping (gleich wie in CheckInCard) ────────────────────────
const MOOD_EMOJI = Object.freeze({
  1: '😞', 2: '😐', 3: '🙂', 4: '😊', 5: '😄',
});
const MOOD_LABEL = Object.freeze({
  1: 'Schlecht', 2: 'Mittelmäßig', 3: 'Okay', 4: 'Gut', 5: 'Super',
});

// ── Wochentag-Header ─────────────────────────────────────────────────
const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

// ── Monats-Namen ─────────────────────────────────────────────────────
const MONTHS = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
];

export default function MoodCalendar({ refreshKey }) {
  const { token } = useAuth();
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null);

  // ── Aktueller Monat (navigierbar) ────────────────────────────────
  // Wir speichern Jahr+Monat, damit ←/→ Navigation funktioniert.
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth()); // 0-basiert

  // ── Monat-Navigation ─────────────────────────────────────────────
  function goToPrevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function goToNextMonth() {
    // Nicht über den aktuellen Monat hinaus navigieren
    const isCurrentMonth = viewYear === now.getFullYear() && viewMonth === now.getMonth();
    if (isCurrentMonth) return;
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  // ── Ist der "Vor"-Button deaktiviert? ────────────────────────────
  const isNextDisabled = viewYear === now.getFullYear() && viewMonth === now.getMonth();

  // ── Check-ins für den gewählten Monat laden ──────────────────────
  useEffect(() => {
    async function fetchCheckins() {
      setLoading(true);
      try {
        // Erster und letzter Tag des Monats als ISO-Strings
        const from = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-01`;
        const lastDay = new Date(viewYear, viewMonth + 1, 0).getDate();
        const to = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

        const res = await fetch(`/api/checkins?from=${from}&to=${to}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setCheckins(data.checkins || []);
      } catch (err) {
        console.error('MoodCalendar: Fehler beim Laden:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCheckins();
  }, [token, viewYear, viewMonth, refreshKey]);

  // ── Check-ins als Map: "YYYY-MM-DD" → checkin-Objekt ──────────────
  // Damit wir beim Kalender-Rendering schnell nachschauen können,
  // ob ein bestimmter Tag einen Check-in hat.
  const checkinMap = useMemo(() => {
    const map = {};
    for (const c of checkins) {
      // date kommt als "2026-03-22T00:00:00.000Z" → wir brauchen "2026-03-22"
      const key = c.date.slice(0, 10);
      map[key] = c;
    }
    return map;
  }, [checkins]);

  // ── Kalender-Grid berechnen ──────────────────────────────────────
  // Wir brauchen:
  //   1. An welchem Wochentag beginnt der Monat? (0=Mo, 6=So)
  //   2. Wie viele Tage hat der Monat?
  //   3. Leere Zellen am Anfang füllen
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  // JavaScript: getDay() = 0=Sonntag, 1=Montag...
  // Wir wollen: 0=Montag, 6=Sonntag → umrechnen
  const firstDayRaw = new Date(viewYear, viewMonth, 1).getDay();
  const firstDayOffset = firstDayRaw === 0 ? 6 : firstDayRaw - 1; // Mo=0, So=6

  // ── CSS-Klasse nach moodScore ────────────────────────────────────
  function moodClass(score) {
    if (score <= 2) return 'mood-bad';     // 😞😐 → rot/orange
    if (score === 3) return 'mood-mid';    // 🙂 → gelb
    return 'mood-good';                     // 😊😄 → grün
  }

  // ── Render ───────────────────────────────────────────────────────
  return (
    <div className="mood-calendar">
      {/* ── Monats-Header mit Navigation ──────────────────────── */}
      <div className="mood-calendar-header">
        <button className="mood-calendar-nav" onClick={goToPrevMonth} type="button" aria-label="Vorheriger Monat">
          ←
        </button>
        <h3 className="mood-calendar-title">
          {MONTHS[viewMonth]} {viewYear}
        </h3>
        <button
          className="mood-calendar-nav"
          onClick={goToNextMonth}
          type="button"
          disabled={isNextDisabled}
          aria-label="Nächster Monat"
        >
          →
        </button>
      </div>

      {/* ── Wochentag-Header ──────────────────────────────────── */}
      <div className="mood-calendar-grid">
        {WEEKDAYS.map((day) => (
          <div key={day} className="mood-calendar-weekday">{day}</div>
        ))}

        {/* ── Leere Zellen vor dem 1. des Monats ──────────────── */}
        {Array.from({ length: firstDayOffset }, (_, i) => (
          <div key={`empty-${i}`} className="mood-calendar-day mood-calendar-day--empty" />
        ))}

        {/* ── Tage des Monats ─────────────────────────────────── */}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const dayNum = i + 1;
          const dateKey = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
          const checkin = checkinMap[dateKey];
          const isToday =
            viewYear === now.getFullYear() &&
            viewMonth === now.getMonth() &&
            dayNum === now.getDate();
          const isFuture = new Date(viewYear, viewMonth, dayNum) > now;

          return (
            <button
              key={dayNum}
              type="button"
              className={[
                'mood-calendar-day',
                checkin ? `mood-calendar-day--${moodClass(checkin.moodScore)}` : '',
                isToday ? 'mood-calendar-day--today' : '',
                isFuture ? 'mood-calendar-day--future' : '',
              ].filter(Boolean).join(' ')}
              onClick={() => checkin && setSelectedDay(checkin)}
              disabled={!checkin || isFuture}
              aria-label={checkin ? `${dayNum}. ${MOOD_LABEL[checkin.moodScore]}` : `${dayNum}.`}
            >
              {dayNum}
            </button>
          );
        })}
      </div>

      {/* ── Legende ───────────────────────────────────────────── */}
      <div className="mood-calendar-legend">
        <span className="mood-legend-item"><span className="mood-legend-dot mood-legend-dot--good" /> Gut/Super</span>
        <span className="mood-legend-item"><span className="mood-legend-dot mood-legend-dot--mid" /> Okay</span>
        <span className="mood-legend-item"><span className="mood-legend-dot mood-legend-dot--bad" /> Schlecht</span>
      </div>

      {/* ── Detail-Popup bei Klick auf einen Tag ──────────────── */}
      {selectedDay && (
        <div className="mood-calendar-detail" onClick={() => setSelectedDay(null)}>
          <div className="mood-detail-card" onClick={(e) => e.stopPropagation()}>
            <button className="mood-detail-close" onClick={() => setSelectedDay(null)} type="button" aria-label="Schließen">
              ✕
            </button>
            <div className="mood-detail-date">
              {new Date(selectedDay.date).toLocaleDateString('de-DE', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </div>
            <div className="mood-detail-emoji">
              {MOOD_EMOJI[selectedDay.moodScore]}
            </div>
            <div className="mood-detail-label">
              {MOOD_LABEL[selectedDay.moodScore]}
            </div>
            {selectedDay.note && (
              <p className="mood-detail-note">„{selectedDay.note}"</p>
            )}
          </div>
        </div>
      )}

      {loading && <div className="mood-calendar-loading">Lädt…</div>}
    </div>
  );
}
