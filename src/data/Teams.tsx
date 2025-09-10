import { matches } from './Matches'
import { Team } from '../model/Team'

export const playerData = [
  'Scores',
  '3PM',
  'FTM',
  'EFF',
  'Fouls',
  'Assists',
  'Rebounds',
  'Steals',
  'Blocks',
  'Turnovers',
]

export const teamNames: { id: number; name: string }[] = [
  { id: 1, name: 'Soli-Kidzzz' },
  { id: 2, name: 'Big Shot' },
  { id: 3, name: 'Midmen' },
  { id: 4, name: 'Team One' },
  { id: 5, name: 'Uni Brummies' },
]

export function getPlayerImage(team: string, name: string) {
  const teamName = team.replace(/\s+/g, '')
  const playerName = name.replace(/\s+/g, '')
  return `/images/player/${teamName}/${playerName}.png`
}

// Utility to generate all teams and player stats from matches
export function generateTeamsFromMatches(): Team[] {
  const teamMap: Record<string, Team> = {}
  const teamLastMatch: Record<
    string,
    { date: Date; result: 'win' | 'loss' | 'draw' | 'undefined' }
  > = {}

  // Ensure all teams from teamNames are present, even if they have no matches
  for (const { id, name } of teamNames) {
    if (!teamMap[name]) {
      teamMap[name] = {
        id,
        name,
        logo: `/images/team/${name.replace(/\s+/g, '')}.jpg`,
        win: 0,
        loss: 0,
        draw: 0,
        points: 0,
        lastMatch: 'undefined',
        matches: 0,
        players: [],
      }
    }
  }

  for (const match of matches) {
    // Determine match result for each team
    let homeResult: 'win' | 'loss' | 'draw' | 'undefined' = 'undefined'
    let awayResult: 'win' | 'loss' | 'draw' | 'undefined' = 'undefined'
    if (match.status === 'completed') {
      if (match.isDraw) {
        homeResult = 'draw'
        awayResult = 'draw'
      } else if (match.score?.home! > match.score?.away!) {
        homeResult = 'win'
        awayResult = 'loss'
      } else {
        homeResult = 'loss'
        awayResult = 'win'
      }
    }

    for (const side of ['home', 'away'] as const) {
      const teamName = match.team[side].name
      if (!teamMap[teamName]) {
        teamMap[teamName] = {
          id: Object.keys(teamMap).length + 1,
          name: teamName,
          logo: `/images/team/${teamName.replace(/\s+/g, '')}.jpg`,
          win: 0,
          loss: 0,
          draw: 0,
          points: 0,
          lastMatch: 'undefined',
          matches: 0,
          players: [],
        }
      }
      if (typeof teamMap[teamName].matches === 'number') {
        teamMap[teamName].matches += 1
      }

      // Track last match result by date
      if (match.status === 'completed') {
        const result = side === 'home' ? homeResult : awayResult
        if (
          !teamLastMatch[teamName] ||
          new Date(match.date) > teamLastMatch[teamName].date
        ) {
          teamLastMatch[teamName] = {
            date: new Date(match.date),
            result,
          }
        }
        // Update win/loss/draw/points
        if (teamMap[teamName] !== undefined) {
          if (result === 'win') teamMap[teamName].win! += 1
          if (result === 'loss') teamMap[teamName].loss! += 1
          if (result === 'draw') teamMap[teamName].draw! += 1
          // Example points: 3 for win, 1 for draw, 0 for loss
          if (result === 'win') teamMap[teamName].points! += 3
          if (result === 'draw') teamMap[teamName].points! += 1
        }
      }

      // Add/update player stats
      for (const mp of match.team[side].players) {
        let player = teamMap[teamName].players.find((p) => p.name === mp.name)
        if (!player) {
          player = {
            id: teamMap[teamName].players.length + 1,
            name: mp.name,
            team: teamName,
            number: mp.number || '',
            position: mp.position || '',
            image: getPlayerImage(teamName, mp.name),
            scores: 0,
            threePoints: 0,
            ftm: 0,
            fouls: 0,
            assists: 0,
            rebounds: 0,
            steals: 0,
            blocks: 0,
            turnovers: 0,
            games: 0,
          }
          teamMap[teamName].players.push(player)
        }

        if (typeof player.scores === 'number') player.scores += mp.scores ?? 0
        if (typeof player.threePoints === 'number')
          player.threePoints += mp.threePoints ?? 0
        if (typeof player.ftm === 'number') player.ftm += mp.ftm ?? 0
        if (typeof player.fouls === 'number') player.fouls += mp.fouls ?? 0
        if (typeof player.assists === 'number')
          player.assists += mp.assists ?? 0
        if (typeof player.rebounds === 'number')
          player.rebounds += mp.rebounds ?? 0
        if (typeof player.steals === 'number') player.steals += mp.steals ?? 0
        if (typeof player.blocks === 'number') player.blocks += mp.blocks ?? 0
        if (typeof player.turnovers === 'number')
          player.turnovers += mp.turnovers ?? 0
        if (typeof player.games === 'number') player.games += 1
        player.eff =
          (player.scores || 0) +
          (player.assists || 0) +
          (player.rebounds || 0) +
          (player.blocks || 0) +
          (player.steals || 0) -
          (player.fouls || 0) -
          (player.turnovers || 0)
      }
    }
  }

  // Set lastMatch for each team
  for (const teamName in teamMap) {
    if (teamLastMatch[teamName]) {
      teamMap[teamName].lastMatch = teamLastMatch[teamName].result
    } else {
      teamMap[teamName].lastMatch = 'undefined'
    }
  }

  return Object.values(teamMap)
}

// Usage:
export const teams: Team[] = generateTeamsFromMatches()
