# Smart Inbox – Backend & Frontend Task

## Overview

This project aims to implement a **Smart Inbox** feature for clinicians. The inbox will display **prescription requests** submitted for patients, enabling clinicians to manage and review them efficiently.

## Project Structure

The repository includes both backend and frontend components:

### Backend (Node.js with TypeScript)

The backend is a Node.js server written in TypeScript. It includes the following key components:

- `request.controller.ts` – Handles incoming HTTP requests related to prescription data.
- `request.interface.ts` – Defines TypeScript interfaces for request data structures.
- `request.service.ts` – Contains the business logic for processing prescription requests.
- `models/dummy1.model.ts` – `request` array - Provides a sample prescription request for demonstration purposes.

### Frontend (Angular)

The frontend is a basic Angular project that displays prescription requests in an inbox-style UI.

## Assignment

Your task is to implement the following:

1. **Backend Integration**
  - Use the `request` of `RenewalRequest` interface from
  `fullstack/BE/src/models/dummy1.model.ts`
- Extend the existing dummy JSON with additional data to ensure the frontend view requires vertical scrolling.
- Expose this data via an API endpoint for the frontend to fetch.

2. **Frontend Display**
   Render the list of prescription and message requests in the frontend, following the layout provided in the reference image.

   ![Inbox UI Notes](/fullstack/FE/inbox.png)

- Restrict the app display area to `409 × 524` pixels (can be placed center, left, or right).
- Use the `FE` folder Angular project.
- Display a **scrollable vertical list** of requests/messages.

Each list item should include:
- Sender Name
- Timestamp in format `HH:mm DD/MM/YYYY`
- Sync Duration (e.g., "1 min.", "5 sec.") – hardcoded
- Type-based Icon (e.g., lab, text, prescription):
   -  "type": "labReport" - icon_labs.svg
   -  "type": "renewal"  - medicine.svg
   -  "type": "freeText" - message.svg
- Message Content

> **Note:** Match the reference image layout and formatting as closely as possible.



![Inbox UI Example](/fullstack/FE/inbox-notes.png)


**Additional Guidelines:**
- Organize UI using Angular components.
- Use CSS for styling.
- Icons: Use **Font Awesome**, **Angular Material**, or local `assets/icons` folder.
  Replace unavailable icons with alternatives—don’t spend too much time sourcing exact matches.



3. **Documenation**
   Document your approach and any assumptions made during implementation by creating CHANGES.md file.


## Notes

- Focus on clean, maintainable, and production-quality code.
