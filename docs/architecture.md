# Architecture Choices

This kanban board uses a component hierarchy that follows React best practices. At the top level, we have the App component that wraps everything in BoardProvider for global state access.

## Component Hierarchy

The main components are organized as follows:
- App.jsx - root component handling undo/redo
- BoardProvider.jsx - context provider with useReducer
- Board.jsx - main board container with DndContext
- ListColumn.jsx - individual list columns
- Card.jsx - task cards with drag support

## State Ownership

All board data lives in BoardProvider (src/context/BoardProvider.jsx:7-14). I chose useReducer over useState because of the complex state updates needed for moving cards between lists. The reducer pattern in boardReducer.js makes it easier to handle actions like MOVE_CARD which needs to update multiple cards.

## Data Flow

Data flows down from BoardProvider through context. Components use useBoardState hook to access state and dispatch actions. When a user adds a card, the action goes through the reducer, updates state, and triggers a re-render. The state also gets saved to localStorage via useEffect in BoardProvider.jsx:19-22.

## Folder Structure

I organized files by feature type:
- components/ - all React components
- context/ - BoardProvider and reducer
- hooks/ - custom hooks for reusable logic
- services/ - api and storage handlers
- utils/ - helper functions and validators

This structure makes it easy to find related code. When I was debugging the drag-drop issue, I knew to look in Board.jsx and the reducer.
