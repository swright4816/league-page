const axios = require('axios'); // For making HTTP requests to Sleeper API

async function calculateScoresByPosition(leagueId, rosterId, week, season = "2025") {
  try {
    // Fetch all players to map IDs to names and positions
    const playersResponse = await axios.get('https://api.sleeper.app/v1/players/nfl');
    const allPlayers = playersResponse.data;

    // Fetch roster data to get starters
    const rosterResponse = await axios.get(`https://api.sleeper.app/v1/league/${leagueId}/rosters`);
    const roster = rosterResponse.data.find(r => r.roster_id === rosterId);
    if (!roster) {
      console.error(`Roster ${rosterId} not found in league ${leagueId}`);
      return {};
    }

    // Build roster object with only starters
    const rosterPlayers = roster.starters.map(playerId => {
      const playerData = allPlayers[playerId] || {};
      return {
        player_id: playerId,
        name: playerData.full_name || 'Unknown',
        position: playerData.position || 'Unknown',
        isStarter: true, // All players in starters array are starters
        isFlex: ['RB', 'WR', 'TE'].includes(playerData.position) && roster.starters.includes(playerId)
      };
    });

    // Fetch bench players (non-starters)
    const benchPlayers = (roster.players || [])
      .filter(playerId => !roster.starters.includes(playerId))
      .map(playerId => {
        const playerData = allPlayers[playerId] || {};
        return {
          player_id: playerId,
          name: playerData.full_name || 'Unknown',
          position: playerData.position || 'Unknown',
          isStarter: false,
          isFlex: false
        };
      });

    // Combine starters and bench for full roster
    const fullRoster = {
      id: rosterId,
      players: [...rosterPlayers, ...benchPlayers]
    };

    // Fetch projections for the week
    const projectionsResponse = await axios.get(`https://api.sleeper.app/v1/stats/nfl/projections/${season}/${week}?season_type=regular`);
    const projections = projectionsResponse.data || {};

    // Define valid positions
    const positions = ['QB', 'RB', 'WR', 'TE', 'FLEX'];
    const scoresByPosition = {};

    // Initialize scores for each position (only starters)
    positions.forEach(position => {
      const playersInPosition = rosterPlayers.filter(p => p.position === position);

      // Only include players with valid proj_pts (non-zero, non-null)
      scoresByPosition[position] = playersInPosition
        .filter(player => {
          const projData = projections[player.player_id] || {};
          const projPts = projData.pts_ppr || projData.pts_std || projData.pts_half_ppr || 0;
          player.proj_pts = projPts; // Update player object

          if (projPts === 0 || projPts == null) {
            console.debug(`Excluded ${player.name} (${position}) in week ${week}: proj_pts is ${projPts}`);
            return false;
          }
          return true;
        })
        .map(player => ({
          name: player.name,
          score: player.proj_pts
        }));

      // Log scores for valid players
      if (scoresByPosition[position].length > 0) {
        scoresByPosition[position].forEach(player => {
          console.debug(`Roster ${rosterId} week ${week} ${position} ${player.name} score: ${player.score}`);
        });
      } else {
        console.debug(`Roster ${rosterId} week ${week} ${position}: No valid players`);
      }
    });

    // Calculate total score for starters
    const totalScore = Object.values(scoresByPosition)
      .flat()
      .reduce((sum, player) => sum + player.score, 0);
    console.debug(`Roster ${rosterId} week ${week} Starters score: ${totalScore}`);

    // Log FLEX and Bench for debugging
    const flexPlayers = rosterPlayers.filter(p => p.isFlex);
    console.debug(`Roster ${rosterId} week ${week} FLEX:`, flexPlayers);
    console.debug(`Roster ${rosterId} week ${week} Bench:`, benchPlayers);

    return scoresByPosition;
  } catch (error) {
    console.error(`Error processing roster ${rosterId} for week ${week}, season ${season}:`, error.message);
    return {};
  }
}

// Example usage
calculateScoresByPosition('your_league_id', 9, 12).then(scores => {
  console.log('Final scores:', scores);
});
