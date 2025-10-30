# RWA Orbit Feature

This folder contains the full feature slice for the RWA orbit experience. Components, hooks, data, and modal UI live together so future collaborators can discover everything related to the carousel in one place.

```
src/features/rwa-orbit/
├── README.md              # Overview for contributors
├── RWAOrbitPage.tsx       # Feature entry component rendered by Next.js
├── components/
│   ├── GridBackground.tsx # Decorative background grid
│   ├── OrbitCarousel.tsx  # Interactive orbit UI
│   └── OrbitHeader.tsx    # Top-of-page header controls
├── data/
│   └── products.ts        # Typed product seed data and marketplace catalog
├── hooks/
│   └── useOrbit.ts        # Motion + interaction logic for the carousel
├── modal/
│   └── ProductModal.tsx   # Detailed product modal presentation
├── types.ts               # Shared type definitions
└── index.ts               # Barrel exports for consumers
```

When adding new behavior prefer colocating logic inside this feature slice, keeping the exported surface area small (the page component and typed data). This makes the module safe for parallel development.
