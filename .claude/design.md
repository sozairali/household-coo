# Design System & UI/UX Rules

## Design Principles
- **ADHD-friendly**: One task surfaced per category at a time. No information overload.
- **Touch-first**: All interactive elements 44 px minimum (Raspberry Pi kiosk use).
- **High contrast**: Works under any lighting condition.
- **Minimal motion**: Reduce distractions; avoid decorative animations.

## Color — Always Use CSS Variables
| Forbidden | Use instead |
|---|---|
| `bg-gray-900` | `bg-background` |
| `bg-gray-800` | `bg-card` |
| `text-white` | `text-foreground` |
| `text-gray-300` | `text-muted-foreground` |
| `bg-blue-600` | `bg-primary` |
| `bg-green-600` | `bg-chart-2` |
| `bg-orange-500` | `bg-chart-3` |

Scan for `bg-*-[0-9]` and `text-*-[0-9]` patterns before every PR.

## Typography
- Task headline: `text-4xl` — dominant element, everything else small.
- All large text (`text-4xl`+) must have `overflow-hidden line-clamp-3`.
- Button text: `whitespace-nowrap overflow-hidden text-ellipsis`.

## Spacing
- Card padding: `p-6` or `p-8`.
- Section gaps: `gap-4`, `gap-6`, or `gap-8` — consistent within a view.
- No ad-hoc margin values outside the Tailwind scale.

## Responsive Breakpoints
Test at: 375 px (mobile) · 768 px (tablet) · 1024 px (desktop) · 1440 px (wide).
- Cards: `grid-cols-1 lg:grid-cols-3`.
- Button groups: must wrap or stack gracefully at 375 px.

## Component Checklist (before marking a UI task done)
- [ ] No hardcoded colours — only CSS variables.
- [ ] All text has overflow protection.
- [ ] All interactive elements ≥ 44 px touch target.
- [ ] Layout verified at 375 px and 1024 px.
- [ ] Hover and focus states use CSS variables, not hardcoded colours.
- [ ] Consistent padding follows `p-4 / p-6 / p-8` scale.

## Three-Card Layout
Each spotlight card shows exactly one task (the top scorer for its dimension).
- **Important card** — highest `importance` score among open tasks.
- **Urgent card** — highest `urgency` score among open tasks.
- **Savings card** — highest `savingsScore` among open tasks with `savingsUsd > 0`.

Cards must still render (empty state) when no task qualifies for a dimension.
