# Development Utilities

This document describes the development utilities available for testing and debugging the Padel Boy application.

## Overview

The dev utilities are automatically loaded in development mode and exposed globally via the `devUtils` object. These utilities help developers test various scenarios, manage localStorage, and debug issues.

## Available Commands

All commands are accessible through the browser console via the `devUtils` global object.

### `devUtils.addRandomTournament()`

Generates and adds a random tournament to localStorage.

**Usage:**
```javascript
devUtils.addRandomTournament()
```

**What it does:**
- Generates a tournament with random:
  - Format (Americano or Mexicano)
  - Player count (4-40, multiples of 4)
  - Points per game (16, 21, 24, or 32)
  - 2-6 random matches with random results
- Adds player names from a predefined list
- Saves directly to localStorage
- **Requires page refresh** to see changes in UI

**Example output:**
```
✅ Random tournament added: Test Tournament abc123 abc123def
Tournament details: {...}
🔄 Refresh the page to see changes
```

---

### `devUtils.addMultipleTournaments(count)`

Adds multiple random tournaments at once.

**Usage:**
```javascript
devUtils.addMultipleTournaments(5)  // Adds 5 tournaments
devUtils.addMultipleTournaments()   // Adds 5 tournaments (default)
```

**Parameters:**
- `count` (number, optional): Number of tournaments to add. Default: 5

**Use cases:**
- Testing pagination (when implemented)
- Testing date grouping with many tournaments
- Performance testing with large datasets
- Testing search functionality

---

### `devUtils.flushTournaments()`

Removes all tournaments from localStorage.

**Usage:**
```javascript
devUtils.flushTournaments()
```

**What it does:**
- Completely removes the `tournament-storage` key from localStorage
- Clears all saved tournaments
- **Requires page refresh** to see changes

**⚠️ Warning:** This action cannot be undone. All tournament data will be permanently deleted.

**Example output:**
```
✅ All tournaments flushed from localStorage
🔄 Refresh the page to see changes
```

---

### `devUtils.listTournaments()`

Lists all tournaments currently stored in localStorage.

**Usage:**
```javascript
devUtils.listTournaments()
```

**What it does:**
- Reads tournaments from localStorage
- Prints a formatted list with:
  - Tournament name
  - ID
  - Format (Americano/Mexicano)
  - Player count

**Example output:**
```
📋 Total tournaments: 3
1. Test Tournament abc123 (abc123def) - americano - 8 players
2. Sunday Game (def456ghi) - mexicano - 12 players
3. Test Tournament xyz789 (xyz789abc) - americano - 16 players
```

---

### `devUtils.addCorruptedTournament()`

Adds a corrupted tournament to test error handling.

**Usage:**
```javascript
devUtils.addCorruptedTournament()
```

**What it does:**
- Adds a tournament with missing required fields
- Used to test error boundaries and validation
- Tests the corruption detection UI
- **Requires page refresh** to see error handling

**Use cases:**
- Testing error handling in PastTournaments page
- Testing corruption banner component
- Verifying validation logic
- Testing data migration scenarios

---

### `devUtils.generateRandomTournament()`

Generates a random tournament object without saving it.

**Usage:**
```javascript
const tournament = devUtils.generateRandomTournament()
console.log(tournament)
```

**Returns:** A valid `StoredTournament` object

**Use cases:**
- Inspecting tournament structure
- Custom testing scenarios
- Manual data manipulation

---

## Common Workflows

### Testing with Fresh Data

1. Flush existing tournaments:
   ```javascript
   devUtils.flushTournaments()
   ```

2. Add test tournaments:
   ```javascript
   devUtils.addMultipleTournaments(10)
   ```

3. Refresh the page to see changes

### Testing Date Grouping

1. Add multiple random tournaments:
   ```javascript
   devUtils.addMultipleTournaments(15)
   ```

2. Navigate to Past Tournaments page
3. Verify tournaments are grouped by date (Today, Yesterday, This Week, Month/Year)

### Testing Error Handling

1. Add a corrupted tournament:
   ```javascript
   devUtils.addCorruptedTournament()
   ```

2. Refresh the page
3. Verify error banner appears
4. Test "Remove Corrupted Data" button
5. Verify corrupted data is cleaned up

### Testing Search Functionality

1. Add multiple tournaments with distinct names:
   ```javascript
   devUtils.addMultipleTournaments(15)
   ```

2. Navigate to Past Tournaments page
3. Test search with various queries

### Quick Reset

```javascript
devUtils.flushTournaments()
location.reload()
```

---

## Under the Hood

### localStorage Structure

Tournaments are stored in localStorage under the key `tournament-storage`:

```json
{
  "state": {
    "tournaments": [
      {
        "version": 1,
        "id": "abc123def",
        "name": "Test Tournament",
        "format": "americano",
        "pointsPerGame": 21,
        "numberOfCourts": 2,
        "isFixedPairs": false,
        "playerCount": 8,
        "players": [...],
        "matches": [...]
      }
    ]
  },
  "version": 0
}
```

### Data Validation

All tournaments are validated against the `storedTournamentSchema` when loaded from localStorage. Invalid tournaments are:
- Detected on page load
- Tracked separately as "corrupted"
- Can be removed via UI banner

---

## Best Practices

1. **Always refresh after using dev utils** - Changes to localStorage don't automatically update Zustand state
2. **Flush before major testing** - Start with clean slate to avoid confusion
3. **Use `listTournaments()` frequently** - Verify data state during debugging
4. **Test corruption handling** - Ensure app gracefully handles invalid data
5. **Don't commit changes to `devUtils.ts`** - Keep it generic for all developers

---

## Troubleshooting

### Dev utils not available

**Problem:** `devUtils is not defined` in console

**Solution:**
- Ensure you're running in development mode (`npm run dev`)
- Check that `src/main.tsx` imports `./utils/devUtils`
- Verify `import.meta.env.DEV` is true

### Changes not visible after using dev utils

**Problem:** Used `addRandomTournament()` but don't see new tournament

**Solution:**
- Refresh the page (F5 or Cmd+R)
- Dev utils modify localStorage directly, Zustand state updates on page load
