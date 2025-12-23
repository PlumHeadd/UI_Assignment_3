# Conflict Resolution Approach

When syncing offline changes, conflicts can happen if both client and server modified the same data. This document explains my three-way merge approach.

## Three-Way Merge

The merge logic is in helpers.js threeWayMerge function (line 22-46). It takes three versions:
- base: the original version before any changes
- local: the offline modified version
- server: the current server version

The algorithm checks:
1. If local equals base, server wins (user didn't change locally)
2. If server equals base, local wins (server didn't change)
3. If both changed same field, we have a conflict

## Field-Level Comparison

For each field in the object, I compare base vs local and base vs server. If only one side changed a field, that change wins. If both sides changed the same field to different values, we flag a conflict.

## Conflict UI

When merge fails, MergeConflictDialog.jsx shows both versions side by side. The user can choose to keep local version or server version. This is important because automatic merging might lose important data.

## Version Tracking

Each list and card has version and lastModifiedAt fields. The version increments on every update (boardReducer.js line 57, 118). This helps detect if server data changed while we were offline.

## Real Bug I Found

During testing I found that the merge was failing silently when lastModifiedAt was being compared. Fixed by skipping version and lastModifiedAt in the merge loop (helpers.js line 35).
