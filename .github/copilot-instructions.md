# Copilot Instructions for Padel Boy

## Project Overview
Mobile-first React web app for organizing padel games. Deployed to GitHub Pages via GitHub Actions.

## Tech Stack
- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS v4 (uses `@import "tailwindcss"` syntax)
- **Routing**: react-router-dom
- **Forms**: react-hook-form + zod for validation
- **State**: Zustand for global state
- **Icons**: lucide-react for UI icons (e.g., `ArrowLeft`, `Cookie`, `Users`) + custom SVG components

## Commands
```bash
npm run dev      # Start dev server at localhost:5173/padel-boy/
npm run build    # Production build to ./dist
npm run lint     # ESLint check
npm run preview  # Preview production build
```

## Architecture & Patterns

### File Structure
```
src/
├── components/     # Reusable UI components (e.g., PadelBallIcon.jsx)
├── App.jsx         # Main app component with routing
├── main.jsx        # Entry point
└── index.css       # Global styles + custom animations
```

### Styling Conventions
- **Mobile-first**: Write base styles for mobile, add breakpoint prefixes for larger screens
- **Tailwind utilities**: Use utility classes directly in JSX, avoid separate CSS files
- **Custom animations**: Define in `src/index.css` using `@keyframes` (see `animate-wave`)
- **Color palette**: Dark theme with slate backgrounds (`slate-900`, `slate-800`, `slate-700`)
- **Brand color**: Padel yellow (`--color-padel-yellow: #D4FF00`) defined in `src/index.css`, use as `text-[var(--color-padel-yellow)]` or in gradients
- **Spacing Scale**: Follow mobile-first responsive spacing
  - Small padding: `p-3` (icon buttons, tight containers)
  - Medium padding: `p-4 sm:p-5 md:p-6` (panels, sections, form containers)
  - Large padding: `p-6 sm:p-7 md:p-8` (page containers, hero sections)
  - Small gaps: `gap-2` (8px, chip grids)
  - Medium gaps: `gap-3 sm:gap-3.5 md:gap-4` (12-14-16px, form elements, card grids)
  - Large gaps: `gap-4 sm:gap-5 md:gap-6` (16-20-24px, major sections)
  - Content rhythm: `space-y-4 sm:space-y-5 md:space-y-6` (within sections)
  - Section rhythm: `space-y-6 sm:space-y-7 md:space-y-8` (between sections)
- **Touch Targets**: Minimum 44px on mobile (iOS/Android guidelines), 46px on small screens, 48px on desktop
  - Buttons: `min-h-[44px] sm:min-h-[46px] md:min-h-[48px]`
  - Interactive elements: Ensure adequate padding for touch

```jsx
// ✅ Correct: mobile-first responsive
<div className="text-sm p-4 md:text-base md:p-6 lg:text-lg">

// ❌ Avoid: desktop-first
<div className="text-lg p-6 sm:text-sm sm:p-4">
```

### Component Patterns
- Use named exports for components: `export function ComponentName()`
- **Icons**: ALWAYS use lucide-react icons for UI elements. Import icons from lucide-react: `import { ArrowLeft, Cookie } from 'lucide-react'`
- **Icon usage**: Use lucide icons with className for sizing and colors: `<Cookie className="w-5 h-5 text-[var(--color-padel-yellow)]" />`
- **NO emojis**: Never use emoji characters for icons in the UI. Always use lucide-react components instead
- Custom SVG icons as React components with `className` and custom props (see `PadelBallIcon.jsx`)
- Props with sensible defaults: `{ className = "w-16 h-16", animate = true }`

### Page Structure
**CRITICAL**: App.tsx already provides `container mx-auto px-4 py-8 max-w-4xl` wrapper for all routes. Pages MUST NOT add additional container wrappers.

**Standard page pattern** (see [Home.tsx](../src/pages/Home.tsx) as reference):
```jsx
export function PageName() {
  return (
    <div className="space-y-6 sm:space-y-7 md:space-y-8">
      {/* Page content directly here - no extra container wrappers */}
      <ContentPanel>...</ContentPanel>
      <div>...</div>
    </div>
  )
}
```

**❌ NEVER do this** (creates double containering and inconsistent width):
```jsx
// ❌ Wrong: extra container wrapper
<div className="container mx-auto px-4">
  <ContentPanel>...</ContentPanel>
</div>
```

**Key points**:
- Use only spacing classes: `space-y-6 sm:space-y-7 md:space-y-8` for main container
- NO `container mx-auto px-4` inside pages - App.tsx handles this
- NO `min-h-screen py-8` - App.tsx provides padding
- All pages should have consistent width matching Home.tsx

### State Management
- **Local state**: `useState` for component-specific state
- **Global state**: Zustand stores (to be added in `src/stores/`)
- **Forms**: react-hook-form with zodResolver for validation

### Tournament Data Management
**CRITICAL**: All tournament data manipulations and calculations MUST be centralized in utility files to maintain a single source of truth.

**Core files**:
- `src/utils/tournamentState.ts` - All tournament state calculations, round logic, match updates, and data transformations
- `src/utils/tournamentStats.ts` - Player standings, statistics, and tournament status calculations
- `src/schemas/tournament.ts` - Tournament data schemas and TypeScript types
- `src/utils/binaryFormat.ts` - Binary serialization/deserialization for compact storage

**Rules**:
- ✅ **DO**: Add new functions to these utility files when you need to read, calculate, or manipulate tournament data
- ✅ **DO**: Use existing functions from these files in components
- ✅ **DO**: Update BOTH `schemas/tournament.ts` AND `utils/binaryFormat.ts` when adding/modifying tournament fields
- ❌ **DON'T**: Duplicate tournament logic in components or other files
- ❌ **DON'T**: Access nested tournament data structures directly in components - create utility functions instead
- ❌ **DON'T**: Add fields to tournament schema without updating the binary encoder/decoder

**Why**: This pattern ensures:
- Consistent interpretation of tournament data across the entire app
- Single place to update when data structure changes
- Binary format stays in sync with schema
- Easier testing and debugging
- Clear separation between business logic and presentation

**Example**:
```tsx
// ❌ Wrong: Direct data access in component
const pausingPlayers = tournament.players.filter((_, i) => 
  !tournament.matches[currentRound].some(m => 
    m.team1.includes(i) || m.team2.includes(i)))

// ✅ Correct: Use utility function
const pausingPlayerIndices = getPausingPlayers(tournament, currentRound)
```

**When adding new tournament fields**:
1. Update `storedTournamentSchema` in `src/schemas/tournament.ts`
2. Update `encodeTournament()` in `src/utils/binaryFormat.ts` to encode the new field
3. Update `decodeTournament()` in `src/utils/binaryFormat.ts` to decode the new field
4. If the field affects binary format structure, update header flags and metadata
5. Add tests in `src/utils/__tests__/binaryFormat.test.ts` to verify encoding/decoding

## Deployment
- **Base path**: `/padel-boy/` (configured in `vite.config.js`)
- **CI/CD**: Push to `main` triggers build → lint → deploy to GitHub Pages
- **Manual deploy**: Use `workflow_dispatch` in Actions tab

## Key Files
- [vite.config.js](vite.config.js) - Vite config with base path for GitHub Pages
- [eslint.config.js](eslint.config.js) - ESLint flat config for React 19
- [.github/workflows/deploy.yml](.github/workflows/deploy.yml) - CI/CD pipeline
- [src/index.css](src/index.css) - Tailwind imports + custom animations

## Maintaining These Instructions
**Keep this file updated!** When making changes to:
- Infrastructure (build tools, CI/CD, deployment)
- New dependencies or major version upgrades
- New directories or architectural patterns
- Conventions that other AI agents should follow

Update this file in the same commit/PR to keep guidance accurate.
