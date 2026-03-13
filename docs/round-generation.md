# Tournament Round Generation

## Overview

The `roundGenerator` utility generates consecutive rounds for both Mexicano and Americano tournaments with automatic fair player rotation when the number of players cannot be divided by 4.

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
1. Computes required sitters per round (`playerCount % 4`)
2. Uses deterministic cyclic sit-out rotation by round index
3. Keeps sit-out distribution balanced over time (difference between max and min sits is at most 1)

**Example**: With 10 players over 5 rounds, each player sits out exactly once.

## Americano Pairing Strategy

Americano pairing maximizes diversity while staying performant:
1. Builds partnership and opponent history from finished matches
2. Uses exact configuration enumeration for small search spaces and adaptive sampled generation for large spaces
3. Explores multiple valid team splits for each 4-player group (`ab/cd`, `ac/bd`, `ad/bc`)
4. Deduplicates candidate rounds using a canonical round fingerprint
5. Scores each candidate and selects the best one

Scoring priorities:
- Repeat partner penalty is higher than repeat opponent penalty
- Repeated pairings are penalized quadratically to avoid recurring combinations
- Recently repeated full-round setups get a light additional penalty to reduce recurring whole-round patterns

### Mathematical Limits

Perfectly unique pairings are not always possible.

For `n` active players, the number of unique partner pairs is:

$$
\binom{n}{2} = \frac{n(n-1)}{2}
$$

If the tournament requires more partnership slots than this value across rounds, repeats are unavoidable.

### Counting Configurations Correctly

For 4 active players on 1 court, there are 24 player permutations but only 3 unique team-vs-team configurations.
The generator optimizes over unique configurations, not raw permutations.

### Two Pairing Strategies

#### Pre-Ranking Phase (Mexicano)
- Round 1 is fully random
- If `mexicanoRandomRounds > 1`, rounds 2..N in the pre-ranking phase use Americano diversity optimization
- This improves early-round partner and opponent variety before switching to ranking-based pairings

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
- ✅ Tournament format must be supported (`mexicano` or `americano`)
- ✅ Minimum 4 players required
- ✅ Returns empty array on validation failure

## Testing

Comprehensive test suite covers:
- Random and ranking-based pairing
- Fair sit-out rotation over multiple rounds
- Americano diversity optimization and history scoring
- Finished-match-only history behavior in Americano
- Both matchup styles ('1&4vs2&3' and '1&3vs2&4')
- Edge cases (4 players, 10+ players, partial rounds)
- Court limit enforcement

Run tests:
```bash
npm test roundGenerator
```

## Notes

Mexicano and Americano both use the same deterministic sit-out rotation, but they differ in matchup generation:
- Mexicano can switch from random rounds to ranking-based rounds
- Americano always optimizes partner/opponent diversity from historical results
