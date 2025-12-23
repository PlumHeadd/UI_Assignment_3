# Kanban Board

A collaborative Kanban board single-page application built with React, featuring drag-and-drop, offline support, and real-time sync.

## Data Storage

**Default:** MongoDB (Backend) - Data is stored in MongoDB and synced across devices  
**Fallback:** localStorage (Browser) - Used when backend is unavailable

## Setup Instructions

### Full Setup (Recommended - MongoDB + Frontend)

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Start MongoDB (if using local MongoDB)
# mongod

# Start backend server (in backend directory)
cd backend && npm run dev

# Start frontend (in main directory)
npm run dev

# Or run both with PowerShell script
npm run dev:all
```

### Frontend Only (localStorage Mode)

If you want to run without MongoDB:

```bash
# Remove or comment out VITE_BACKEND_URL in .env
# VITE_BACKEND_URL=

# Then run frontend
npm run dev
```

## Running Tests

```bash
# Run unit and integration tests
npm test

# Run tests with coverage report
npm run test:coverage

# Run end-to-end tests (requires dev server)
npm run e2e
```

## Seeding Test Data

### Backend Seeding (MongoDB - Default)
To seed the MongoDB database with 500+ performance test cards:

```bash
# From backend directory
cd backend
npm run seed
```

Or via API endpoint:
```bash
curl -X POST http://localhost:5000/api/seed
```

This creates **520 cards** distributed across 4 lists for performance testing.

### Browser Seeding (localStorage - Fallback)
To test with 500+ cards in localStorage mode:

```javascript
// Open browser console and run:
import('./scripts/seedData.js').then(m => m.seedLocalStorage())
```

## Architecture Summary

This application follows a component-based architecture with centralized state management using React Context and useReducer. The main architectural decisions are:

**State Management**: All board data (lists, cards) lives in BoardProvider which uses useReducer for predictable state updates. This pattern was chosen over external libraries like Redux because the app's state needs are well-contained and the reducer pattern handles complex updates like moving cards between lists.

**Component Structure**: Components are organized by responsibility - Board handles drag-and-drop context, ListColumn manages individual columns with virtualization, and Card components are memoized to prevent unnecessary re-renders. The separation allows each component to focus on its specific task.

**Offline-First Design**: Data is stored primarily in MongoDB with localStorage as a fallback. The useOfflineSync hook manages a queue of pending server operations, automatically syncing when online and queuing when offline. When the backend is unavailable, data is stored in localStorage and synced when the backend comes back online. This ensures users never lose work and can work seamlessly across devices.

**Performance Optimization**: With 500+ cards, performance required virtualization (react-window), memoization (React.memo, useMemo, useCallback), and code splitting (lazy-loaded modals). These optimizations keep the UI smooth even with large datasets.

**Accessibility**: Full keyboard navigation, ARIA labels, focus trapping in modals, and WCAG AA color contrast make the app usable for everyone. All interactive elements are reachable and operable via keyboard.

The folder structure separates concerns: components/, context/, hooks/, services/, and utils/ each contain related code, making navigation and maintenance straightforward.
