# Tournament Statistics Guide

This document explains all statistics calculated and displayed for tournaments and players in Padel Boy.

## Tournament Statistics

### Tournament Status
**status**: The current state of the tournament.
- **setup** - No matches have been finished yet, tournament is being prepared
- **playing** - Some matches are finished, tournament is in progress
- **finished** - All matches have been completed

### Match Statistics
**totalMatches**: Total number of matches in the tournament.

**finishedMatches**: Number of matches that have been completed.

**totalRounds**: Total number of rounds in the tournament. Each round consists of matches played simultaneously on all courts.

**completedRounds**: Number of rounds that have been fully completed. Only consecutive rounds from the beginning count (if round 2 is incomplete, rounds 3+ don't count as completed even if their matches are finished).

### Player Rankings
**standings**: Complete list of all players sorted by performance (see Sorting Order below).

**topPlayers**: Top 3 players from the standings (podium positions).

---

## Player Statistics

### Basic Information
**name**: Player's name.

**index**: Player's position in the original tournament setup (0-based).

### Match Results
**wins**: Number of matches won by the player.

**draws**: Number of matches that ended in a draw (when both teams score the same points).

**losses**: Number of matches lost by the player.

**gamesPlayed**: Total number of matches the player participated in.
```
gamesPlayed = wins + draws + losses
```

**gamesSitting**: Number of completed rounds where the player sat out (didn't play). This happens in tournaments where the number of players is not divisible by 4.

### Points
**points**: Total points earned from playing matches. Points are awarded based on match results:
- Winner score: `(pointsPerGame + scoreDelta) / 2` (rounded down)
- Loser score: `(pointsPerGame - scoreDelta) / 2` (rounded down)
- Draw (scoreDelta = 0): both teams receive the same score

For example, with `pointsPerGame = 24` and `scoreDelta = 4`:
- Winner gets: `14` points
- Loser gets: `10` points
- Total: 14 + 10 = 24 points (sum equals `pointsPerGame`)

**pointsFromSitting**: Bonus points awarded for sitting out rounds. This compensates players who sit out due to uneven participation.
```
pointsFromSitting = gamesSitting × (matchPoints × 50%, rounded up)
```
Examples by format:
- 16 points format: 8 points per sitting round
- 21 points format: 11 points per sitting round (10.5 rounded up)
- 24 points format: 12 points per sitting round
- 32 points format: 16 points per sitting round

**totalPointsWithSitting**: Combined total of earned points and sitting bonus points.
```
totalPointsWithSitting = points + pointsFromSitting
```

### Performance Metrics
**pointsPerGame**: Average points earned per match played. This is the primary ranking metric.
```
pointsPerGame = points ÷ gamesPlayed
```
Example: A player with 48 points from 2 games has 24 pointsPerGame.

**winRate**: Percentage of matches won (as a decimal between 0 and 1).
```
winRate = wins ÷ gamesPlayed
```
Example: A player with 2 wins from 3 games has a 0.667 winRate (66.7%).

---

## Player Sorting Order

Players in the standings are ranked using the following priority order:

1. **pointsPerGame** ↓ (descending) - Higher average performance wins
   - *Fairest metric for uneven participation*
   - Example: 48 points in 2 games (24 PPG) beats 60 points in 3 games (20 PPG)

2. **winRate** ↓ (descending) - Higher win percentage breaks ties
   - *Quality of performance indicator*

3. **totalPointsWithSitting** ↓ (descending) - More total points including sitting bonus breaks ties
   - *Accounts for both performance and tournament participation logistics*

4. **wins** ↓ (descending) - More victories breaks ties

5. **draws** ↓ (descending) - More draws breaks ties

6. **name** ↑ (alphabetical) - Alphabetical order as final tiebreaker

### Why This Sorting Order?

The sorting prioritizes **performance rate** over total accumulation to ensure fair rankings when players participate in different numbers of matches. A player who performs excellently in 2 games shouldn't rank below someone who performs poorly across 4 games just because they accumulated more total points.

This approach rewards:
- **Consistency**: High pointsPerGame shows reliable performance
- **Quality**: High winRate indicates competitive strength
- **Participation**: totalPointsWithSitting ensures fair comparison including sitting bonuses when performance is equal

---

## Example Scenario

Consider these three players after 3 rounds:

| Player  | Games | Wins | Draws | Losses | Points | Sitting | PPG  | Win Rate |
|---------|-------|------|-------|--------|--------|---------|------|----------|
| Alice   | 3     | 3    | 0     | 0      | 72     | 0       | 24.0 | 1.000    |
| Bob     | 2     | 1    | 1     | 0      | 44     | 1       | 22.0 | 0.500    |
| Charlie | 3     | 1    | 0     | 2      | 56     | 0       | 18.7 | 0.333    |

**Ranking: Alice > Bob > Charlie**

Why?
- Alice has the highest pointsPerGame (24.0)
- Bob has higher pointsPerGame (22.0) than Charlie (18.7), despite having fewer total points (44 vs 56)
- Bob's sitting bonus: 12 points (24 format × 50%), making totalPointsWithSitting = 56

---

## Notes

- Statistics are calculated only from **finished matches** with valid winner and scoreDelta data
- Incomplete matches don't contribute to any statistics
- **completedRounds** counts only consecutive completed rounds from the beginning
- Sitting points ensure players aren't penalized for tournament logistics in uneven participant scenarios
