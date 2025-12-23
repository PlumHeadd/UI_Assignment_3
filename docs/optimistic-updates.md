# Optimistic Updates

The app implements optimistic updates to make the UI feel fast even with slow network. Here's how it works:

## Sequence of Events

1. User clicks to add a card
2. UI updates immediately via dispatch in BoardProvider.jsx
3. Action gets queued in useOfflineSync.js:60-65
4. Background sync attempts to send to server
5. On success: queue item removed
6. On failure: state reverts and error shown

## Implementation Details

When a user adds a card, addCard in BoardProvider.jsx:41-43 dispatches immediately to the reducer. The UI updates right away without waiting for network. At the same time, the action gets added to sync queue in storage.js using addToSyncQueue.

The useOfflineSync hook (hooks/useOfflineSync.js) processes the queue in processQueue function (line 28-59). It loops through queued actions and calls the appropriate api function. If an action fails, it stays in the queue for retry.

## Handling Failures

If the server request fails, we catch the error in processQueue and keep the item in failedItems array (line 55). The user sees a sync error message in the UI. They can retry manually or wait for the next periodic sync.

## Debugging Story

I had a bug where the UI would show duplicate cards after sync. The problem was I was adding the card both optimistically and when server responded. Fixed by checking if card exists before adding from server response. This was in boardReducer.js where I had to compare IDs before inserting.
