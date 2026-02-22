# /Component Command

**Context Layers:**
- [Layer 03a: Development](../../system/layers/03-specialization/development.md#component-patterns) — Component Patterns
- [Convention 14: Frontend](../../conventions/fullstack/14-frontend.md) — Atomic Design & Accessibility
- [Convention 18: Design System](../../conventions/other/18-design-system.md) — AIVA Health Design Tokens

## Zweck
Erstellt eine neue UI-Component mit Tests und Dokumentation.

## Verantwortlicher Agent
**Developer Agent**

## Syntax
```
/Component <ComponentName> [--type=atom|molecule|organism] [--story]
```

## Workflow
1. Component-Anforderungen analysieren
2. Atomic Design Level bestimmen (Atom/Molecule/Organism)
3. Props-Interface definieren (TypeScript)
4. Component implementieren (AIVA Design System Tokens)
5. Accessibility sicherstellen (WCAG AA, Thomas-Anforderungen)
6. Unit Tests schreiben
7. Story erstellen (optional)
8. Dokumentation erstellen

## Template: Component Structure

### File-Struktur (Tech-agnostisch)
```
src/components/
└── <ComponentName>/
    ├── <ComponentName>.tsx          # Component
    ├── <ComponentName>.test.tsx     # Tests
    ├── <ComponentName>.styles.css   # Styles (AIVA Design Tokens)
    ├── <ComponentName>.stories.tsx  # Storybook (optional)
    └── index.ts                     # Re-export
```

### Component Template
```typescript
// Props Interface
export interface <ComponentName>Props {
  // Required props
  // Optional props with defaults
}

// Component
export function <ComponentName>(props: <ComponentName>Props) {
  return (
    <div className="aiva-<component-name>">
      {/* Component content */}
    </div>
  );
}
```

### Test Template
```typescript
describe('<ComponentName>', () => {
  it('should render correctly', () => {
    // Arrange
    // Act
    // Assert
  });

  it('should be accessible', () => {
    // ARIA labels
    // Keyboard navigation
    // Min touch target 44px
  });

  it('should use AIVA Design Tokens', () => {
    // Correct colors
    // Min font size 16px
  });
});
```

### Accessibility Checklist
- [ ] Min. 16px Schriftgröße (Thomas)
- [ ] Min. 44×44px Touch Target
- [ ] ARIA Labels vorhanden
- [ ] Keyboard-navigierbar
- [ ] Farbkontrast ≥ 4.5:1 (Text)
- [ ] Farbunabhängige Darstellung (Icons + Text neben Farbe)
- [ ] `prefers-reduced-motion` respektiert

## Verwandte Commands
- **/DesignSpec** → Design vor Implementation
- **/Task** → Task für Component-Erstellung
- **/Review** → Code Review der Component

## AIVA Health Beispiel
```
/Component VitalSignBadge --type=molecule

Erstellt die VitalSignBadge-Komponente mit Farb-Kodierung
(normal/erhöht/kritisch), Wert-Anzeige und letzter Messung.
Verwendet --aiva-success/--aiva-warning/--aiva-danger Tokens.
```
