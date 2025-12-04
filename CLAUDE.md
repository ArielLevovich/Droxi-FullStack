# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Smart Inbox application for clinicians to view prescription requests. Fullstack monorepo with independent backend (Node.js/Express/TypeScript) and frontend (Angular 18) applications.

## Commands

### Backend (BE folder)
```bash
cd BE
npm run dev          # Development server with hot reload (ts-node-dev)
npm run start:dev    # Development server without watch
npm run build        # Compile TypeScript to JavaScript
npm run lint         # ESLint check
npm test             # Run Jest tests
```

### Frontend (FE folder)
```bash
cd FE
ng serve             # Dev server at http://localhost:4200
ng build             # Production build to dist/fe
ng test              # Unit tests via Karma
ng generate component <name>  # Scaffold new component
```

## Architecture

### Backend Structure
```
BE/src/
├── server.ts                 # Entry point - creates App instance
├── app.ts                    # Express app, middleware, controller registration
├── interfaces/
│   └── controller.interface.ts  # Base controller pattern
├── models/
│   └── dummy1.model.ts       # Sample data (request[] array)
└── request/
    ├── request.controller.ts # HTTP handlers for /requests
    ├── request.interface.ts  # Domain types (PatientRequest, RenewalRequest, etc.)
    └── request.service.ts    # Business logic layer
```

**Controller Pattern**: Controllers implement `Controller` interface with `path`, `router`, and optional `topLevel` properties. App constructor receives controllers array and registers their routes.

**API Base**: Server runs on port 3000 (default). Routes are prefixed with controller `path` (e.g., `/requests`).

### Frontend Structure
```
FE/src/
├── main.ts                   # Bootstrap with standalone API
├── app/
│   ├── app.component.ts      # Root standalone component
│   ├── app.config.ts         # Providers configuration
│   └── app.routes.ts         # Router configuration
└── assets/icons/             # SVG icons for request types
```

**Angular 18 Standalone**: No NgModule - uses standalone components with `bootstrapApplication()`. Components declare `standalone: true` and `imports` array.

### Data Types (request.interface.ts)
- `PatientRequest` - Base request with patient info, type, timestamp
- `RenewalRequest` - Type: 'renewal' with RefillRequest details
- Request types: 'renewal', 'freeText', 'labReport'
- Icon mapping: labReport → icon_labs.svg, renewal → medicine.svg, freeText → message.svg

### Frontend Constraints
- Display area: 409 × 524 pixels
- Timestamp format: HH:mm DD/MM/YYYY

### Important notes
- Focus on clean, maintainable, and production-quality code
- Use SOLID principles where possible
- Create testable code (based on interfaces)
