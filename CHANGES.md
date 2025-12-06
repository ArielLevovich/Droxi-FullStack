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
- Header with static "By Date" sort indicator and dynamic sync time display
- Scrollable list area with custom scrollbar styling
- Loading, error, and empty states handled

**Dynamic Sync Time Display:**
- Tracks `lastSyncTime` when requests are successfully loaded
- Displays relative time: "Just now", "1 min. ago", "X min. ago"
- Updates automatically every 60 seconds via `setInterval`
- Implements `OnDestroy` lifecycle hook to clean up interval on component destruction

### 4. Request Item Component (`FE/src/app/components/request-item/`)
- Reusable component for rendering individual request items
- Displays:
  - Type-based icon (using existing SVG assets)
  - Patient name
  - Timestamp formatted as `HH:mm DD/MM/YYYY`
  - Description (with text truncation and tooltip on hover)
  - Estimated time (formatted as seconds, minutes, or "X+ min.")
  - Labels (for freeText requests)
  - Panels info (for labReport requests, with tooltip on hover)
  - Assigned clinician
  - Urgent indicator icon (when `isUrgent: true`)
  - Abnormal results indicator (when `abnormalResults` array has items)
  - Recommendation description (when `recommendationValue === 'yes'`)

**Description Parsing:**
- Descriptions containing timestamp patterns `[MM/DD/YY]` are split and displayed on separate lines
- Example: `[06/05/25] ref; [05/26/25] Sanity refill` renders as two lines
- Limited to 3 visible lines with ellipsis; full text shown in tooltip on hover

**Urgent Indicator:**
- Displays `icon-urgent.svg` after the patient name when `isUrgent: true`
- Shows "Urgent" tooltip on hover

**Abnormal Results Indicator:**
- Displays `red-info.svg` icon when `abnormalResults` array contains items
- Custom styled tooltip on hover showing abnormal results in bold red text

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
npm test -- --verbose   # Watch mode
npm test -- --coverage  # With coverage report
```

**Key Differences from Karma:**
- Uses `jest.fn()` instead of `jasmine.createSpyObj()` for mocking
- Uses `jest.spyOn()` instead of `spyOn()`
- No browser required - tests run in jsdom environment

## Known Vulnerabilities

The frontend project has 19 npm vulnerabilities (6 low, 3 moderate, 10 high).

**Applied:** `npm audit fix` to address non-breaking issues.

**Remaining High Vulnerabilities:**
- Angular core packages (18.x) - XSRF Token Leakage via Protocol-Relative URLs
- Angular compiler (18.x) - Stored XSS via SVG Animation/MathML Attributes
- esbuild, vite, tmp - Development-only vulnerabilities (don't affect production builds)

**Resolution:**
These vulnerabilities require upgrading to Angular 19.x or 21.x, which are breaking changes. Decided to stay on Angular 18 for now because:
1. The XSRF vulnerability only affects apps using protocol-relative URLs with XSRF tokens
2. The XSS vulnerability only affects apps rendering untrusted SVG/MathML content
3. Development-only vulnerabilities don't impact production builds

**Future Upgrade Path:**
When ready to upgrade, use: `ng update @angular/core@19 @angular/cli@19`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /requests | Returns all inbox requests |
| GET | /requests/:id | Returns a specific request by ID |

## InboxRequest Field Usage Analysis

Analysis of `InboxRequest` interface fields and their usage in the `request-item` component.

### Fields Currently Displayed

| Field | Usage in Component |
|-------|-------------------|
| `type` | Icon selection, category label, CSS class |
| `isRead` | Unread highlight styling |
| `patientName` | Patient name display |
| `lastModifiedDate` | Relative time display, formatted timestamp tooltip |
| `description` | Multi-line description with date parsing |
| `estimatedTimeSec` | Time estimate badge |
| `assignment.assignedTo` | Doctor initials and name |
| `isUrgent` | Urgent alert badge |
| `labels` | Label chips section |
| `panels` | Panel count badge (labReport type) |
| `abnormalResults` | Attention alert badge |
| `recommendation` | Recommendation text (when value is 'yes') |

### Fields Not Displayed (By Design)

| Field | Reason |
|-------|--------|
| `id` | Internal identifier, used for routing/selection, not for display |
| `status` | Always 'new' - BE endpoint returns only new status records, no need to render |
| `requestDate` | Not displayed - we already have `isUrgent`, `isRead`, and `abnormalResults` flags; adding more data would overload the card UI |
| `assignment.assignDate` | Internal metadata, not clinically relevant for inbox view |
| `assignment.grouping` | Internal categorization, not displayed to end users |
| `prescriptionIds` | Internal IDs that don't convey meaningful information to clinicians |

## UI/UX Improvements

Looking at the Smart Inbox screenshots, here are polished UI/UX recommendations:

### Visual Hierarchy & Color
- **Status Indicators:** Replace generic red circles with color-coded badges (red = urgent, amber = attention, green = routine) and add a subtle priority-colored left border on each card.
- **Accent Palette:** Warmer accents for patient interactions, cooler tones for administrative tasks to cue context at a glance.
- **Typography:** Bold/darken patient names, lighten timestamps, and enforce a clear hierarchy: Patient Name → Task Summary → Metadata.

### Information Architecture
- **Content Grouping:** Move critical alerts (e.g., "High glucose") to a prominent line with icon + colored badge; group time estimate and doctor name together at the bottom as metadata.
- **Separators:** Use thin dividers or spacing tokens to separate content types instead of relying solely on white space.
- **Icons & Labels:** Use descriptive icons (pill bottle for refills, chart for lab reports, chat bubble for messages) and colored chips for categories (Medication, Lab Results, Consultation) so task type is instantly scannable.

### Interaction Design
- **Hover & Selection States:** Add soft background tint and gentle elevation on hover; show selection with an accent border or background tint.
- **Feedback:** Subtle animation on hover/shadow changes to keep the UI feeling responsive without being distracting.

### Modern Polish
- **Spacing & Density:** Slightly increase card padding, ensure consistent intra-card spacing, and prefer light dividers or elevation over heavy borders.
- **Card Design:** Use very subtle shadows and 4–8px radii; place cards on a light off-white canvas to lift content.
- **Date/Time:** Make "36 min. ago" prominent with absolute time on hover; color-code age (recent = green, aging = amber, old = red).

### Specific Element Tweaks
- **Patient Names:** Bold, +1–2pt, darker color (`#1a1a1a` instead of gray).
- **Alert Badges:** Rounded rectangles with icon + text, not floating text.
- **Time Estimates:** Pair with clock icon and keep secondary unless critical.
- **Lab Reports Count:** Icon + number badge instead of plain text.
- **Doctor Assignment:** Add a small avatar thumbnail beside the name for fast recognition.
