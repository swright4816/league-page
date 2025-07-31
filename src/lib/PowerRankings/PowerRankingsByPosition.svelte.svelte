<script>
  import BarChart from '$lib/BarChart.svelte';
  import {
    generateGraph,
    getTeamFromTeamManagers,
    round,
    predictScores,
    loadPlayers
  } from '$lib/utils/helper';

  export let nflState;
  export let rostersData;
  export let leagueTeamManagers;
  export let playersInfo;
  export let leagueData;

  let rankingsByPosition = [];

  const positions = ['QB', 'RB', 'WR', 'TE', 'FLEX', 'BENCH'];

  function calculateRankings() {
    let teamScores = {};

    for (const { roster_id, players } of rostersData) {
      const manager = leagueTeamManagers.find(m => m.roster_id === roster_id);
      const teamName = getTeamFromTeamManagers(leagueTeamManagers, roster_id) || `Team ${roster_id}`;

      const teamPlayers = players
        .map(pid => playersInfo[pid])
        .filter(p => p && p.position && p.fantasy_points !== undefined);

      const usedPlayerIds = new Set();
      const scores = {};

      // Core positions
      const posLimits = { QB: 1, RB: 2, WR: 2, TE: 1 };

      for (const pos in posLimits) {
        const filtered = teamPlayers
          .filter(p => p.position === pos)
          .sort((a, b) => b.fantasy_points - a.fantasy_points)
          .slice(0, posLimits[pos]);

        filtered.forEach(p => usedPlayerIds.add(p.player_id));
        scores[pos] = filtered.reduce((sum, p) => sum + p.fantasy_points, 0);
      }

      // FLEX: Best 2 RB/WR/TE not already used
      const flexPool = teamPlayers
        .filter(p => ['RB', 'WR', 'TE'].includes(p.position) && !usedPlayerIds.has(p.player_id))
        .sort((a, b) => b.fantasy_points - a.fantasy_points)
        .slice(0, 2);

      flexPool.forEach(p => usedPlayerIds.add(p.player_id));
      scores.FLEX = flexPool.reduce((sum, p) => sum + p.fantasy_points, 0);

      // BENCH: Top 3 players not yet used
      const bench = teamPlayers
        .filter(p => !usedPlayerIds.has(p.player_id))
        .sort((a, b) => b.fantasy_points - a.fantasy_points)
        .slice(0, 3);

      scores.BENCH = bench.reduce((sum, p) => sum + p.fantasy_points, 0);

      teamScores[teamName] = scores;
    }

    // Rank each team by position score
    const rankings = {};

    positions.forEach(pos => {
      const sorted = Object.entries(teamScores)
        .sort(([, a], [, b]) => (b[pos] || 0) - (a[pos] || 0))
        .map(([team]) => team);

      sorted.forEach((team, index) => {
        if (!rankings[team]) rankings[team] = {};
        rankings[team][pos] = index + 1;
      });
    });

    rankingsByPosition = Object.entries(rankings).map(([team, posRanks]) => ({
      team,
      ...posRanks
    }));
  }

  $: calculateRankings(); // Reactive on input
</script>

<style>
  table {
    margin: 2rem auto;
    border-collapse: collapse;
    width: 98%;
    max-width: 1000px;
  }

  th, td {
    border: 1px solid #aaa;
    padding: 0.5rem;
    text-align: center;
  }

  th {
    background-color: #f0f0f0;
  }

  h2 {
    text-align: center;
    margin-top: 2rem;
  }
</style>

<h2>Power Rankings by Position</h2>

<table>
  <thead>
    <tr>
      <th>Team</th>
      {#each positions as pos}
        <th>{pos}</th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each rankingsByPosition as row}
      <tr>
        <td>{row.team}</td>
        {#each positions as pos}
          <td>{row[pos]}</td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>
