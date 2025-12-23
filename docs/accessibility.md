# Accessibility Choices + Testing

Making the kanban board accessible was important. Here's what I implemented and how I tested it.

## Keyboard Navigation

All interactive elements can be reached with Tab key. Cards are focusable with tabIndex={0} in Card.jsx line 42. Users can:
- Tab through lists and cards
- Press Enter or Space to open card details
- Press Delete to remove a card
- Use Ctrl+Z for undo, Ctrl+Shift+Z for redo

The keyboard handlers are in Card.jsx handleKeyDown (line 30-37) and App.jsx useEffect (line 33-46).

## Focus Trap in Modals

CardDetailModal.jsx and ConfirmDialog.jsx trap focus when open. I use useEffect to focus the first input when modal opens (CardDetailModal.jsx line 20-23). ESC key closes modal via handleKeyDown listener.

## ARIA Labels and Roles

Every interactive element has proper ARIA attributes:
- role="button" on Card component
- aria-label on all buttons describing their action
- aria-modal="true" and aria-labelledby on dialogs
- role="status" and aria-live="polite" on online/offline indicator

## Color Contrast

I used Tailwind's default colors which pass WCAG AA. Tested with Chrome DevTools accessibility panel. The blue-600 header against white text has contrast ratio of 4.82:1 which passes AA.

## Testing with axe-core

Ran axe DevTools extension on the page. Found one issue: missing label on a button. Fixed by adding aria-label="Archive list" in ListColumn.jsx line 66.

## Screen Reader Testing

Tested with Windows Narrator. All cards announced correctly with title. Modal announced "Edit Card dialog" when opened. Status changes announced automatically thanks to aria-live.
