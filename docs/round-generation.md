# Mexicano Round Generation

## Overview

The `roundGenerator` utility generates consecutive rounds for Mexicano tournaments with automatic fair player rotation when the number of players cannot be divided by 4.

## Usage Example

```typescript
import { generateNextRound } from '../utils/roundGenerator'
import type { StoredTournament } from '../schemas/tournament'

// Get your tournament from the store
const tournament: StoredTournament = useTournaments().getTournament(id)

// Generate the next round
const newMatches = generateNextRound(tournament)

// Append to tournament and save
tournament.matches.push(...newMatches)
useTournaments().updateTournament(tournament)
```

## Features

### Fair Player Rotation
When player count is not divisible by 4, the algorithm:
1. Tracks how many times each player has sat out
2. Selects players with fewest sit-outs
3. Randomizes selection among those with equal sit-out counts
4. Ensures everyone gets equal rest over multiple rounds

**Example**: With 10 players over 5 rounds, each player sits out exactly once.

### Two Pairing Strategies

#### Random Pairing (Initial Rounds)
- Used for first N rounds (configurable via `mexicanoRandomRounds`, default: 2)
- Shuffles all active players randomly
- Groups them into teams of 2

#### Ranking-Based Pairing (After Random Phase)
- Uses current tournament standings
- Two matchup styles supported:

**'1&4vs2&3'** (default):
```
Court 1: [1st, 4th] vs [2nd, 3rd]
Court 2: [5th, 8th] vs [6th, 7th]
...
```

**'1&3vs2&4'**:
```
Court 1: [1st, 3rd] vs [2nd, 4th]
Court 2: [5th, 7th] vs [6th, 8th]
...
```

## Integration with Tournament Page

When implementing the Tournament page, use this pattern:

```typescript
function TournamentPage() {
  const { id } = useParams()
  const { getTournament, updateTournament } = useTournaments()
  const tournament = getTournament(id)
  
  const handleStartNextRound = () => {
    if (!tournament) return
    
    const newMatches = generateNextRound(tournament)
    if (newMatches.length === 0) {
      // Handle error (invalid format or not enough players)
      return
    }
    
    const updatedTournament = {
      ...tournament,
      matches: [...tournament.matches, ...newMatches]
    }
    
    updateTournament(updatedTournament)
  }
  
  // ... rest of component
}
```

## Validation

The generator validates:
- ✅ Tournament format must be 'mexicano'
- ✅ Minimum 4 players required
- ✅ Returns empty array on validation failure

## Testing

Comprehensive test suite covers:
- Random and ranking-based pairing
- Fair sit-out rotation over multiple rounds
- Both matchup styles ('1&4vs2&3' and '1&3vs2&4')
- Edge cases (4 players, 10+ players, partial rounds)
- Court limit enforcement

Run tests:
```bash
npm test roundGenerator
```

## Future: Americano Support

The utility currently only supports Mexicano format. Americano generation will be added in a future iteration with different pairing constraints:
- Avoid same partners across rounds
- Avoid same opponents across rounds
- Pure random rotation without ranking phase
