# Copilot Instructions for Padel Boy

## Project Overview
Mobile-first React web app for organizing padel games. Deployed to GitHub Pages via GitHub Actions.

## Tech Stack
- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS v4 (uses `@import "tailwindcss"` syntax)
- **Routing**: react-router-dom
- **Forms**: react-hook-form + zod for validation
- **State**: Zustand for global state
- **Icons**: lucide-react + custom SVG components

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

```jsx
// ✅ Correct: mobile-first responsive
<div className="text-sm p-4 md:text-base md:p-6 lg:text-lg">

// ❌ Avoid: desktop-first
<div className="text-lg p-6 sm:text-sm sm:p-4">
```

### Component Patterns
- Use named exports for components: `export function ComponentName()`
- SVG icons as React components with `className` and custom props (see `PadelBallIcon.jsx`)
- Props with sensible defaults: `{ className = "w-16 h-16", animate = true }`

### State Management
- **Local state**: `useState` for component-specific state
- **Global state**: Zustand stores (to be added in `src/stores/`)
- **Forms**: react-hook-form with zodResolver for validation

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
