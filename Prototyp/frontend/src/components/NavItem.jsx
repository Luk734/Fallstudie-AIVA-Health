// src/components/NavItem.jsx — Einzelner Tab in der Bottom-Navigation (US-09, TASK-36)
//
// Props:
//   to    — Ziel-URL (z.B. "/dashboard")
//   icon  — Emoji-Icon (z.B. "🏠")
//   label — Beschriftung (z.B. "Home")
//
// Verwendet NavLink statt Link:
//   NavLink ist eine spezielle Variante von Link aus React Router.
//   Der Unterschied: NavLink weiß, ob der Link gerade "aktiv" ist —
//   also ob die aktuelle Browser-URL mit dem `to`-Prop übereinstimmt.
//
//   NavLink kann als className eine FUNKTION erhalten:
//     className={({ isActive }) => isActive ? 'active' : ''}
//   React Router ruft diese Funktion auf und setzt isActive automatisch.
//
// Barrierefreiheit (WCAG 2.1 AA):
//   - Touch-Target: mind. 44×44px (CSS)
//   - Schriftgröße: mind. 16px (CSS, Anforderung Thomas Wagner)
//   - aria-label: Beschreibt den Link für Screenreader

import { NavLink } from 'react-router-dom';
import './NavItem.css';

export default function NavItem({ to, icon, label }) {
  return (
    // NavLink mit Funktion als className:
    // Wenn isActive === true → CSS-Klasse "nav-item active"
    // Wenn isActive === false → CSS-Klasse "nav-item"
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive ? 'nav-item nav-item--active' : 'nav-item'
      }
      aria-label={label}
    >
      {/* Icon-Bereich (Emoji) */}
      <span className="nav-item__icon" aria-hidden="true">
        {icon}
      </span>

      {/* Text-Label unter dem Icon */}
      <span className="nav-item__label">{label}</span>
    </NavLink>
  );
}
