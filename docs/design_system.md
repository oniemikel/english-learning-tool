# Design System

## Design Concept
- Minimal, modern, and distraction-free
- Optimized for focused vocabulary learning
- Inspired by Apple, Notion, Linear, and Anki
- Prioritize readability and consistency over decoration

## Design Principles
- Use whitespace generously
- Keep layouts simple and consistent
- Prefer typography over excessive colors
- Use subtle shadows and consistent border radius
- Maintain visual consistency across all screens

## Layout
### Desktop
- Header
- Left Sidebar
- Main Content
- Maximum content width: 1200px

### Tablet
- Header
- Drawer Sidebar
- Main Content

### Mobile
- Header
- Main Content
- Bottom Navigation

## Breakpoints
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px

## Color Palette
The color palette is based on the Figma design.

### Primary
- `Primary`: #5b5bd6 (Vibrant Purple)

### Neutral (Dark Theme/Sidebar)
- `Sidebar Background`: #0e0e12 (Near Black)
- `Badge Background`: #1c1c24 (Dark Gray)
- `Sidebar Text`: #e8e8f0 (Light Gray/White)
- `Sidebar Muted Text`: #8888a0 (Muted Gray)

### Neutral (Light Theme/Main)
- `Background`: #f4f4f6 (Light Gray)
- `Card Background`: #ffffff (White)
- `Primary Text`: #0e0e12 (Near Black)
- `Muted Text`: #8888a0 (Muted Gray)

### Semantic & Accent Colors
- `Success`: #16a34a (Green)
- `Warning`: #d97706 (Amber)
- `Streak`: #fbbf24 (Yellow)
- `Accent Pink`: #be185d (Pink)

## Typography
The typographic scale is based on the Figma design and uses `Plus Jakarta Sans` for UI text and `DM Mono` for monospaced figures.

| Element Example         | Size (px) | Weight(s)        |
| ----------------------- | --------- | ---------------- |
| Welcome Banner Title    | 28.125    | Bold             |
| Stat Value              | 22.5      | SemiBold, Bold   |
| Card Title              | 16.875    | SemiBold         |
| Top Bar Title           | 15        | SemiBold         |
| Body & Nav Text         | 13.125    | Regular, Medium  |
| Secondary & Muted Text  | 11.25     | Regular, Medium  |
| Section Headers & Badges| 9.375     | Medium, SemiBold |

## Spacing
Use an 8px grid system only.

Available spacing:
- 4
- 8
- 12
- 16
- 24
- 32
- 48
- 64

## Border Radius
- Small: 8px
- Medium: 12px
- Large: 16px

## Components
Create reusable components only.

Required components:
- Button
- Input
- Textarea
- Select
- Checkbox
- Switch
- Card
- Badge
- Dialog
- Drawer
- Toast
- Tooltip
- Tabs
- Table
- Pagination
- Progress
- Skeleton

## Navigation
### Header
- Logo
- Search
- Theme Toggle
- Notifications
- User Menu

### Sidebar
- Width: 240px
- Collapsible
- Active navigation highlight

### Bottom Navigation
- Dashboard
- Study
- Decks
- Statistics
- Settings

## Study Screen
- Centered content (max-width: 720px)
- Large vocabulary card
- Pronunciation button
- Meaning section
- FSRS review buttons:
  - Again
  - Hard
  - Good
  - Easy
- Keyboard shortcuts (1–4)

## Dashboard
Display cards for:
- Today's Reviews
- Study Time
- Streak
- Accuracy
- Progress

Include weekly/monthly charts.

## Forms
- React Hook Form
- Zod validation
- Inline validation messages
- Accessible labels

## Dark Mode
- Fully supported
- Maintain sufficient contrast
- Use semantic color tokens

## Animation
- Duration: 150–250ms
- Ease-in-out
- Subtle transitions only
- Use Skeleton during loading

## Accessibility
- WCAG compliant
- Keyboard navigation
- Visible focus states
- ARIA labels where appropriate

## Responsive Design
All pages must support:
- Desktop
- Tablet
- Mobile

## Implementation Rules
- Use Next.js App Router
- Use TypeScript
- Use Tailwind CSS
- Use shadcn/ui
- Use Zustand for global state
- Use TanStack Query for server state
- Use reusable components only
- Never duplicate UI components
- Follow this design system consistently
- Do not introduce page-specific design styles
- Reuse shared layouts and components whenever possible