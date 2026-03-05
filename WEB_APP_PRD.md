# Product Requirements Document (PRD): POS Analytics Web Dashboard

## 1. Executive Summary

- **Problem Statement**: Small business owners using the mobile POS application lack a convenient way to analyze comprehensive business data, reports, and expenses on a larger screen, limiting their ability to make informed decisions.
- **Proposed Solution**: A client-side web application built with React, Vite, and TypeScript that parses existing mobile app backup files (JSON) to generate interactive financial reports and transaction logs.
- **Success Criteria**:
    - Zero server-side data storage (100% privacy-focused).
    - Support for parsing JSON backup files up to 50MB within 5 seconds.
    - Seamless integration with Google Drive for direct file loading.

## 2. User Experience & Functionality

### User Personas
- **The Business Owner**: A non-technical user who runs a retail shop or cafe using the mobile POS. They need clear, actionable insights without complex setup.

### User Stories
- **Import Data**:
    - As an Owner, I want to drag and drop my backup file from my computer so I can view my data immediately.
    - As an Owner, I want to select a backup file directly from my Google Drive so I don't have to download it to my device first.
- **View Reports**:
    - As an Owner, I want to see a dashboard with Total Revenue, Net Profit, and Total Expenses for a selected date range.
    - As an Owner, I want to view a chart of daily sales trends to identify my busiest days.
    - As an Owner, I want to see a list of top-selling products to plan my inventory.
- **Transaction Management**:
    - As an Owner, I want to browse a searchable list of all transactions with details (items, time, amount).

### Acceptance Criteria
- **File Handling**:
    - Validates JSON schema before processing.
    - Displays error messages for corrupt or invalid files.
- **Dashboard**:
    - Filters data by Date Range (Today, This Week, This Month, Custom).
    - Cards for: Revenue, Expense, Profit, Transaction Count.
- **Privacy**:
    - Data persists locally in the browser using Dexie.js (IndexedDB); data remains available across sessions until manually cleared by the user.

### Non-Goals
- **Real-time Sync**: The app relies on backup files, not a live database connection.
- **Data Editing**: The web app is read-only for analysis; changes must be made in the mobile app.
- **User Accounts**: No login system required beyond Google Drive OAuth.

## 3. AI System Requirements (N/A)
*This project does not currently require AI/ML components. It is a deterministic data visualization tool.*

## 4. Technical Specifications

### Architecture Overview
- **Type**: Single Page Application (SPA).
- **Stack**: React, Vite, TypeScript, Tanstack Router, Zod Schema Validation,Dexie.js, Shadcn UI, Mobile-first Design using bottom tab, and sidebar for webapp.
- **State Management**: React Context or Zustand for UI state; Dexie.js for persistent data storage.
- **Data Processing**: Client-side parsing. Web Workers recommended for large files to prevent UI freezing.

### Integration Points
- **Google Drive API**:
    - Scope: `drive.readonly` (or specific file scope if possible).
    - Flow: Client-side OAuth 2.0 to obtain an access token, use Google Picker API for file selection.
- **Local File API**: Standard HTML5 File API for drag-and-drop.

### Security & Privacy
- **Data Handling**: strict "No-Backend" policy for business data. All calculations happen in the user's browser.
- **Auth**: Google Sign-In is used solely for accessing Drive files; no user identity is stored on any server.

## 5. Risks & Roadmap

### Phased Rollout
- **MVP (v1.0)**:
    - Manual JSON file upload.
    - Basic Dashboard (Revenue, Expense, Profit).
    - Transaction List.
- **v1.1**:
    - Google Drive Integration (Picker & Auth).
    - Advanced Charts (Sales Trends, Category breakdown).
- **v2.0**:
    - Export filtered reports to CSV/PDF.
    - Comparison views (Month vs Month).

### Technical Risks
- **Large File Performance**: Parsing massive JSON files (100MB+) might crash the browser tab. Mitigation: Use streaming parsers or Web Workers.
- **Google API Quotas**: Standard API limits may apply. Mitigation: Efficient caching and minimal data fetching.
