# Smart Kirana Store — Color Code Documentation

> **Rule:** Always use these exact colors for every new feature, page, or component.
> Never introduce new raw color values — map everything to the tokens below.

---

## 1. Design Tokens (CSS Variables — `globals.css`)

These are the single source of truth. Use `hsl(var(--token))` in raw CSS or the Tailwind class equivalents below.

| Token | HSL Value | Hex Approx | Description |
|---|---|---|---|
| `--background` | `45 30% 97%` | `#F9F8F5` | Warm white page background |
| `--foreground` | `220 25% 12%` | `#181D2A` | Primary text color |
| `--border` | `210 15% 88%` | `#D9DDE6` | Default borders |
| `--input` | `210 15% 91%` | `#E2E5EC` | Input field borders |
| `--ring` | `174 72% 35%` | `#179E8A` | Focus ring (same as primary) |
| `--card` | `0 0% 100%` | `#FFFFFF` | Card backgrounds |
| `--card-foreground` | `220 25% 12%` | `#181D2A` | Text inside cards |
| `--card-border` | `210 15% 91%` | `#E2E5EC` | Card borders |
| `--popover` | `0 0% 100%` | `#FFFFFF` | Popover/dropdown background |
| `--popover-foreground` | `220 25% 12%` | `#181D2A` | Popover text |
| `--primary` | `174 72% 35%` | `#179E8A` | **Teal — main brand color** |
| `--primary-foreground` | `0 0% 100%` | `#FFFFFF` | Text on primary backgrounds |
| `--secondary` | `142 60% 32%` | `#228B4A` | Soft green (profit/positive) |
| `--secondary-foreground` | `0 0% 100%` | `#FFFFFF` | Text on secondary backgrounds |
| `--muted` | `210 20% 94%` | `#EDF0F5` | Muted backgrounds (table headers, footers) |
| `--muted-foreground` | `220 12% 48%` | `#6B7280` | Muted/secondary text |
| `--accent` | `174 25% 92%` | `#E3F0EE` | Light teal accent background |
| `--accent-foreground` | `174 60% 22%` | `#0F6357` | Text on accent backgrounds |
| `--destructive` | `0 76% 55%` | `#E53535` | Red — errors, delete, out-of-stock |
| `--destructive-foreground` | `0 0% 100%` | `#FFFFFF` | Text on destructive backgrounds |
| `--warning` | `38 90% 52%` | `#F59E0B` | Amber — khata/udhaar, low stock, warnings |
| `--warning-foreground` | `0 0% 100%` | `#FFFFFF` | Text on warning backgrounds |

### Sidebar-specific tokens

| Token | HSL Value | Description |
|---|---|---|
| `--sidebar` | `174 30% 97%` | Sidebar background (teal-tinted white) |
| `--sidebar-foreground` | `220 25% 20%` | Sidebar text |
| `--sidebar-border` | `174 20% 88%` | Sidebar border |
| `--sidebar-primary` | `174 72% 35%` | Active nav item background |
| `--sidebar-primary-foreground` | `0 0% 100%` | Active nav item text |
| `--sidebar-accent` | `174 25% 92%` | Hover state on nav items |
| `--sidebar-accent-foreground` | `174 60% 22%` | Hover text on nav items |

### Chart tokens

| Token | HSL Value | Used For |
|---|---|---|
| `--chart-1` | `174 72% 35%` | Sales bar chart (teal/primary) |
| `--chart-2` | `142 60% 32%` | Profit area chart (green) |
| `--chart-3` | `38 90% 52%` | Warning/amber data |
| `--chart-4` | `0 76% 55%` | Destructive/red data |
| `--chart-5` | `220 80% 55%` | Blue data (purchase rate) |

---

## 2. Semantic Color System

### Primary — Teal (Brand Color)
Used for: active nav, primary buttons, prices, cart badges, focus rings, icons.

```
Tailwind classes:
  bg-primary          text-primary          border-primary
  bg-primary/10       text-primary-foreground
  hover:border-primary   ring-primary
```

### Positive — Green (Profit / Success / Payment Received)
Used for: profit stats, "In Stock" label, payment received, "Clear" balance, success states.

```
CSS utility classes (globals.css):
  .text-positive      → hsl(142 60% 28%)   — text
  .bg-positive        → hsl(142 60% 32%)   — background
  .bg-positive-soft   → hsl(142 60% 95%)   — soft background
  .border-positive    → hsl(142 60% 32%)   — border

Tailwind equivalents used in code:
  text-green-600      text-green-700       bg-green-50
  bg-green-100        border-green-200     border-green-300
  border-green-500    border-green-600     ring-green-500
  bg-green-600        hover:bg-green-50    text-emerald-600
```

### Warning — Amber (Khata / Udhaar / Low Stock)
Used for: pending khata amounts, low stock badges, time filter UI, udhaar entries.

```
CSS utility classes (globals.css):
  .text-warning       → hsl(38 90% 42%)    — text
  .bg-warning         → hsl(38 90% 52%)    — background
  .bg-warning-soft    → hsl(38 90% 95%)    — soft background
  .border-warning     → hsl(38 90% 52%)    — border

Tailwind equivalents used in code:
  text-amber-600      text-amber-700       text-amber-800
  bg-amber-50         bg-amber-100         border-amber-200
  border-amber-300    border-amber-400     bg-gradient-to-br from-amber-50 to-orange-50
```

### Destructive — Red (Errors / Out of Stock / Delete)
Used for: out-of-stock labels, delete buttons, error toasts, low stock alert card.

```
Tailwind classes:
  text-destructive    bg-destructive       border-destructive
  text-red-500        text-red-600         text-red-700
  bg-red-50           bg-red-100           border-red-200
  hover:text-red-500  ring-red-500         border-red-500
```

### Muted — Gray (Secondary Text / Backgrounds)
Used for: subtitles, table headers, placeholder text, disabled states, footer text.

```
Tailwind classes:
  text-muted-foreground    bg-muted         bg-muted/30
  bg-muted/40              bg-muted/50      bg-muted/60
  hover:bg-muted           hover:bg-muted/20   hover:bg-muted/30
```

### Blue — Purchase Rate / Info (Non-semantic, used sparingly)
Used only in: products table (purchase rate column), bulk calculation section, device icons.

```
Tailwind classes:
  text-blue-600       text-blue-700
  bg-blue-50/70       border-blue-200
  border-2 border-blue-200 bg-blue-50/70   ← bulk calculation box
```

### Purple — Tablet device icon (Settings page only)
```
  text-purple-600
```

---

## 3. Component Color Patterns

### Stat Cards (Dashboard & Reports)
Each stat card has a consistent color set — always use these exact combinations:

| Stat | Text | Background | Border | Icon |
|---|---|---|---|---|
| Sales / Revenue | `text-primary` | `bg-teal-50` | `border-teal-200` | `text-primary` |
| Profit | `text-positive` | `bg-green-50` | `border-green-200` | `text-positive` |
| Khata / Udhaar | `text-warning` | `bg-amber-50` | `border-amber-200` | `text-warning` |
| Low Stock / Alert | `text-destructive` | `bg-red-50` | `border-red-200` | `text-destructive` |

### Payment Mode Badges
Always use these exact badge styles:

| Mode | Classes |
|---|---|
| Cash | `text-positive border-green-300 bg-green-50` |
| UPI | `text-primary border-teal-300 bg-teal-50` |
| Khata | `text-warning border-amber-300 bg-amber-50` |

### Stock Status Badges (Products page)
| Status | Badge Variant | Extra Classes |
|---|---|---|
| In Stock | `default` | — |
| Low Stock | `secondary` | `bg-orange-100 text-orange-700 border-orange-200` |
| Out of Stock | `destructive` | — |

### Stock Label (Billing product cards)
| State | Class |
|---|---|
| In Stock | `text-positive` |
| Low Stock | `text-warning` |
| Out of Stock | `text-destructive` |

### Khata Ledger Transaction Icons
| Type | Background | Text |
|---|---|---|
| Credit (Udhaar) | `bg-amber-100` | `text-amber-600` |
| Payment Received | `bg-green-100` | `text-green-600` |

### Khata Transaction Amounts
| Type | Class |
|---|---|
| Credit (Udhaar) | `text-amber-600` |
| Payment | `text-green-600` |

### Customer Due Amount
| State | Class |
|---|---|
| Has due | `text-amber-600` |
| Clear (no due) | `text-green-600` |

### Navigation (Sidebar & Bottom Nav)
| State | Classes |
|---|---|
| Active item (sidebar) | `bg-primary text-primary-foreground` |
| Inactive item (sidebar) | `text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground` |
| Active item (bottom nav) | `text-primary` |
| Inactive item (bottom nav) | `text-muted-foreground` |
| Active billing button (bottom nav) | `bg-primary text-primary-foreground` |
| Active item in "More" sheet | `bg-primary/10 border-primary/30 text-primary` |

### Khata Ledger Header Card
```
bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200
Avatar: bg-amber-100 text-amber-700
Due amount: text-amber-600
```

### Customer Avatar (list)
```
bg-primary/10 text-primary
```

### Billing — Cart Success State
```
border-green-400   (card border when bill is created)
text-positive      (CheckCircle2 icon)
```

### Billing — Product Card (in cart)
```
border-primary bg-teal-50
```

### Billing — Customer Picker (required, empty)
```
border-warning bg-amber-50
```

### Reports — Time Filter Box
```
bg-amber-50 border-amber-200
text-amber-600 (clock icon, "to" text)
text-amber-800 (label)
border-amber-300 (time inputs)
focus:ring-amber-400 (time inputs)
```

### Reports — Low Stock Badge (in table)
| State | Classes |
|---|---|
| Out of Stock | `bg-red-100 text-red-700 border-red-200` |
| Low Stock | `bg-amber-100 text-amber-700 border-amber-200` |

### Products — Bulk Calculation Box
```
border-2 border-blue-200 bg-blue-50/70   (outer box)
bg-white border-2 border-green-500       (result display)
text-green-700                           (result text)
text-blue-600                            (calculator icon)
```

### Products — Table Columns
| Column | Class |
|---|---|
| Purchase Rate | `text-blue-700` |
| Selling Price | `text-green-700` |
| Margin % | `text-emerald-600` |

### Settings — Device Icons
| Device | Class |
|---|---|
| Computer | `text-blue-600` |
| Mobile | `text-green-600` |
| Tablet | `text-purple-600` |

### Settings — Current Session Card
```
border-primary bg-primary/5 shadow-sm
```

### Error Page
```
bg-red-100 (icon container)
text-destructive (AlertTriangle icon)
```

---

## 4. Charts (Recharts)

| Chart | Color |
|---|---|
| Sales Bar | `hsl(var(--primary))` → teal |
| Profit Area stroke | `hsl(142 60% 32%)` → green |
| Profit Area fill gradient | `hsl(142 60% 32%)` with opacity 0.3 → 0 |
| Grid lines | `hsl(var(--border))` |
| Axis ticks | `hsl(var(--muted-foreground))` |
| Tooltip background | `hsl(var(--card))` |
| Tooltip border | `hsl(var(--border))` |
| Cursor (bar hover) | `hsl(var(--muted))` |

---

## 5. Border Radius

| Token | Value | Tailwind |
|---|---|---|
| `--radius-sm` | `0.375rem` | `rounded-sm` |
| `--radius-md` | `0.5rem` | `rounded-md` |
| `--radius-lg` | `0.625rem` | `rounded-lg` |
| `--radius-xl` | `0.875rem` | `rounded-xl` |
| — | `1rem` | `rounded-2xl` (cards, containers) |
| — | `9999px` | `rounded-full` (avatars, badges) |

---

## 6. Quick Reference — "What color for what?"

| Situation | Use |
|---|---|
| Money / price / revenue | `text-primary` |
| Profit / success / payment received | `text-positive` or `text-green-600/700` |
| Udhaar / khata / pending / warning | `text-warning` or `text-amber-600` |
| Error / delete / out-of-stock | `text-destructive` or `text-red-600` |
| Secondary/helper text | `text-muted-foreground` |
| Purchase cost / info | `text-blue-700` |
| Margin percentage | `text-emerald-600` |
| Active/selected state | `bg-primary text-primary-foreground` |
| Soft teal highlight | `bg-teal-50 border-teal-200` |
| Soft green highlight | `bg-green-50 border-green-200` |
| Soft amber highlight | `bg-amber-50 border-amber-200` |
| Soft red highlight | `bg-red-50 border-red-200` |
| Table/section header bg | `bg-muted` or `bg-muted/60` |
| Hover row | `hover:bg-muted/30` or `hover:bg-muted/60` |
| Card background | `bg-card` or `bg-white` |
| Page background | `bg-background` |
