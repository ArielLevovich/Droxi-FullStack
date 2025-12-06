# CHANGES.md

## Implementation Overview

This document describes the implementation of the Smart Inbox feature for clinicians to view prescription requests.

## Shared Package

### Overview (`shared/`)
A shared TypeScript package containing common interfaces used by both the backend and frontend applications. This ensures type consistency across the full stack.

### Structure
```
shared/
├── src/
│   ├── index.ts                    # Main export barrel file
│   └── inbox-request.interface.ts  # Shared request type definitions
├── package.json                    # Package configuration (name: @droxi/shared)
└── tsconfig.json                   # TypeScript configuration
```

### Shared Interfaces (`shared/src/inbox-request.interface.ts`)
- `RequestType` - Union type for request types: `'renewal' | 'freeText' | 'labReport'`
- `InboxRequest` - Base interface with common request properties
- `RenewalRequest` - Extended interface for renewal-type requests
- `FreeTextRequest` - Extended interface for free-text requests
- `LabReportRequest` - Extended interface for lab report requests

### Integration
- **Backend**: Imports types via `@droxi/shared` package reference
- **Frontend**: Imports types via `@droxi/shared` package reference
- Both projects reference the shared package in their `tsconfig.json` paths

## Backend Changes

### 1. Extended Dummy Data (`BE/src/models/dummy1.model.ts`)
- Renamed `request` array to `requests` for clarity
- Added 5 additional request entries (IDs 11-15) to ensure vertical scrolling is required
- Data includes a mix of all three request types: `renewal`, `freeText`, and `labReport`
- Updated patient name for ID 4 from "Silver Cat" to "Thom Brown" to match reference image

### 2. Request Service (`BE/src/request/request.service.ts`)
- Created `InboxRequest` interface to define the shape of inbox request data
- Implemented `getAllRequests()` method to return all requests
- Implemented `getRequestById(id)` method to return a specific request by ID

### 3. Request Controller (`BE/src/request/request.controller.ts`)
- Added `GET /requests` endpoint to fetch all inbox requests
- Updated `GET /requests/:id` endpoint to fetch a single request by ID
- Both endpoints return JSON responses

## Frontend Changes

### 1. Interface (`FE/src/app/models/inbox-request.interface.ts`)
- Created `RequestType` type alias for the three request types
- Created `InboxRequest` interface matching the backend data structure

### 2. Request Service (`FE/src/app/services/request.service.ts`)
- Injectable service using Angular's HttpClient
- `getAllRequests()` - fetches all requests from backend API
- `getRequestById(id)` - fetches a single request by ID
- Uses environment configuration for API URL (see Environment Configuration below)

### 3. Inbox Component (`FE/src/app/components/inbox/`)
- Main container component for the inbox UI
- Fixed dimensions: 409px width x 524px height as per requirements
- Header with static "By Date" sort indicator and "8 min. ago" sync status
- Scrollable list area with custom scrollbar styling
- Loading, error, and empty states handled

### 4. Request Item Component (`FE/src/app/components/request-item/`)
- Reusable component for rendering individual request items
- Displays:
  - Type-based icon (using existing SVG assets)
  - Patient name
  - Timestamp formatted as `HH:mm DD/MM/YYYY`
  - Description (with text truncation)
  - Estimated time (formatted as seconds, minutes, or "X+ min.")
  - Labels (for freeText requests)
  - Panels info (for labReport requests)
  - Assigned clinician

### 5. App Configuration (`FE/src/app/app.config.ts`)
- Added `provideHttpClient()` to enable HTTP requests

### 6. Global Styles (`FE/src/styles.css`)
- Added CSS reset for consistent rendering
- Set global font family

### 7. Environment Configuration (`FE/src/environments/`)
Angular environment-based configuration for managing API URLs across different deployment targets.

**Files:**
- `environment.ts` - Development configuration (`apiUrl: 'http://localhost:3000'`)
- `environment.production.ts` - Production configuration (`apiUrl: '/api'`)

**angular.json Configuration:**
- Added `fileReplacements` in production build configuration
- Automatically swaps `environment.ts` with `environment.production.ts` during production builds

**Usage:**
```typescript
import { environment } from '../../environments/environment';
// Access: environment.apiUrl
```

## Assumptions Made

1. **Static Header Elements**: The "By Date" dropdown and "8 min. ago" sync indicator are static/hardcoded as the assignment notes indicate dropdowns shouldn't work (only static UI).

2. **Timestamp Display**: Used `lastModifiedDate` for the timestamp display as it represents the most recent activity on the request.

3. **Estimated Time Format**:
   - Under 60 seconds: displayed as "X sec."
   - 60-1199 seconds: displayed as "X min."
   - 1200+ seconds (20+ minutes): displayed as "X+ min."

4. **Icon Mapping**: Used the existing icons in `assets/icons/`:
   - `labReport` → `icon_labs.svg`
   - `renewal` → `medicine.svg`
   - `freeText` → `message.svg`

5. **Unread Highlighting**: Requests with `isRead: false` are highlighted with a light blue background.

6. **CORS**: Backend already has CORS configured for all origins, so no changes needed.

## How to Run

### Backend
```bash
cd BE
npm install
npm run dev
```
Server runs on `http://localhost:3000`

### Frontend
```bash
cd FE
npm install
ng serve
```
Application runs on `http://localhost:4200`

## Testing

### Frontend Testing with Jest

Migrated from Karma/Jasmine to Jest for the frontend test runner. Jest runs tests in Node.js without requiring a browser, solving headless Chrome compatibility issues in WSL environments.

**Configuration Files:**
- `jest.config.js` - Jest configuration using `jest-preset-angular`
- `setup-jest.ts` - Test environment setup with Zone.js
- `tsconfig.spec.json` - TypeScript configuration for tests (uses `jest` types)

**Test Files:**
- `src/app/app.component.spec.ts` - Root component tests
- `src/app/services/request.service.spec.ts` - HTTP service tests with HttpClientTestingModule
- `src/app/components/inbox/inbox.component.spec.ts` - Inbox component tests (loading, error, empty states)
- `src/app/components/request-item/request-item.component.spec.ts` - Request item rendering tests

**Running Tests:**
```bash
cd FE
npm test        # Run all tests
npm test -- --watch   # Watch mode
npm test -- --coverage  # With coverage report
```

**Key Differences from Karma:**
- Uses `jest.fn()` instead of `jasmine.createSpyObj()` for mocking
- Uses `jest.spyOn()` instead of `spyOn()`
- No browser required - tests run in jsdom environment

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /requests | Returns all inbox requests |
| GET | /requests/:id | Returns a specific request by ID |
