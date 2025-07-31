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

  const rosters = rostersData.rosters || rostersData; // support either shape
  let players = playersInfo.players;

  let graphs = [];
  let curGraph = 0;
  let validGraph = false;

  const positions = ['QB', 'RB', 'WR', 'TE', 'FLEX', 'BENCH'];

  function buildPositionRankings() {
    const positionStatsByTeam = {};

    for (const rosterID in rosters) {
      const roster = rosters[rosterID];
      const teamName = getTeamFromTeamManagers(leagueTeamManagers, rosterID) || `Team ${rosterID}`;

      if (!roster.players) continue;
      validGraph = true;

      const teamPlayers = roster.players
        .map(pid => players[pid])
        .filter(p => p && p.position && p.wi !== undefined);

      const usedPlayerIds = new Set();
      const posTotals = {};

      const posLimits = { QB: 1, RB: 2, WR: 2, TE: 1 };

      for (const pos in posLimits) {
        const selected = teamPlayers
          .filter(p => p.position === pos)
          .sort((a, b) => b.wi - a.wi)
          .slice(0, posLimits[pos]);

        selected.forEach(p => usedPlayerIds.add(p.player_id));
        posTotals[pos] = selected.reduce((sum, p) => sum + p.wi, 0);
      }

      // FLEX: best 3 remaining RB/WR/TE
      const flex = teamPlayers
        .filter(p => ['RB', 'WR', 'TE'].includes(p.position) && !usedPlayerIds.has(p.player_id))
        .sort((a, b) => b.wi - a.wi)
        .slice(0, 3);

      flex.forEach(p => usedPlayerIds.add(p.player_id));
      posTotals.FLEX = flex.reduce((sum, p) => sum + p.wi, 0);

      // BENCH: best 5 remaining
      const bench = teamPlayers
        .filter(p => !usedPlayerIds.has(p.player_id))
        .sort((a, b) => b.wi - a.wi)
        .slice(0, 5);

      posTotals.BENCH = bench.reduce((sum, p) => sum + p.wi, 0);

      positionStatsByTeam[teamName] = posTotals;
    }

    // Create graph object for each position
    graphs = positions.map(pos => {
      const stats = Object.entries(positionStatsByTeam).map(([manager, posScores]) => ({
        Manager: manager,
        [pos]: round(posScores[pos] || 0)
      }));

      return generateGraph({
        stats,
        x: 'Manager',
        y: `${pos} Score`,
        stat: '',
        field: pos,
        header: `${pos} Positional Power Rankings`,
        short: `${pos} Power`
      }, leagueData.season);
    });
  }

  buildPositionRankings();

  const refreshPlayers = async () => {
    const newPlayersInfo = await loadPlayers(null, true);
    players = newPlayersInfo.players;
    buildPositionRankings();
  }

  if (playersInfo.stale) {
    refreshPlayers();
  }
</script>

<style>
  .enclosure {
    display: block;
    position: relative;
    width: 100%;
  }
</style>

{#if validGraph}
  <div class="enclosure">
    <BarChart {graphs} bind:curGraph={curGraph} {leagueTeamManagers} />
  </div>
{/if}
