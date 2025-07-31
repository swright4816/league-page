<script>
  import BarChart from '$lib/BarChart.svelte';
  import {
    generateGraph,
    getTeamFromTeamManagers,
    round,
    predictScores,
    loadPlayers
  } from '$lib/utils/helper';

  export let nflState, rostersData, leagueTeamManagers, playersInfo, leagueData;

  const rosters = rostersData.rosters;
  let validGraph = false;
  let graphs = [];
  let seasonOver = false;
  let players = playersInfo.players;
  let curGraph = 0;

  const buildRankings = () => {
    const rosterPowersByCategory = {
      Starters: [],
      QB: [],
      WR: [],
      TE: [],
      FLEX: [],
      Bench: []
    };

    let week = nflState.week;
    if (week === 0) week = 1;

    const maxByCategory = {
      Starters: 0,
      QB: 0,
      WR: 0,
      TE: 0,
      FLEX: 0,
      Bench: 0
    };

    const scoreCache = new Map();
    const getPlayerScore = (player, week) => {
      const key = `${player.player_id}-${week}`;
      if (!scoreCache.has(key)) {
        const score = predictScores([{ name: player.ln, pos: player.pos, wi: player.wi }], week, leagueData);
        scoreCache.set(key, score);
      }
      return scoreCache.get(key);
    };

    for (const rosterID in rosters) {
      const roster = rosters[rosterID];
      if (!roster.players || roster.players.length === 0) continue;
      validGraph = true;

      const allPlayers = roster.players
        .map(pid => players[pid])
        .filter(p => p && p.pos && p.wi && p.ln && p.player_id);

      const getProjectedStarters = (week) => {
        const projected = allPlayers.map(p => ({
          player: p,
          score: getPlayerScore(p, week)
        }));

        const byPos = { QB: [], RB: [], WR: [], TE: [], FLEX: [] };

        for (const p of projected) {
          const pos = p.player.pos;
          if (byPos[pos]) byPos[pos].push(p);
          if (["RB", "WR", "TE"].includes(pos)) byPos.FLEX.push(p);
        }

        for (const pos in byPos) {
          byPos[pos].sort((a, b) => b.score - a.score);
        }

        const starters = [];
        if (byPos.QB.length > 0) starters.push(byPos.QB[0]);
        starters.push(...byPos.RB.slice(0, 2));
        starters.push(...byPos.WR.slice(0, 2));
        if (byPos.TE.length > 0) starters.push(byPos.TE[0]);

        const fixedIds = new Set(starters.map(p => p.player.player_id));
        const flexPool = byPos.FLEX.filter(p => !fixedIds.has(p.player.player_id));
        const flexPlayers = flexPool.slice(0, 3);
        starters.push(...flexPlayers);

        const usedIds = new Set(starters.map(p => p.player.player_id));
        const fixedPositionIds = new Set(
          starters
            .filter(p => ["RB", "WR", "TE"].includes(p.player.pos))
            .map(p => p.player.player_id)
        );

        return { starters, usedIds, fixedPositionIds };
      };

      const rosterPower = {
        rosterID,
        manager: getTeamFromTeamManagers(leagueTeamManagers, rosterID),
        Starters: 0,
        QB: 0,
        WR: 0,
        TE: 0,
        FLEX: 0,
        Bench: 0
      };

      const seasonEnd = 18;
      if (week >= seasonEnd) seasonOver = true;

      for (let i = week; i < seasonEnd; i++) {
        const { starters, usedIds, fixedPositionIds } = getProjectedStarters(i);
        const starterPlayers = starters.map(p => ({ name: p.player.ln, pos: p.player.pos, wi: p.player.wi }));

        rosterPower.Starters += predictScores(starterPlayers, i, leagueData);

        const qb = starters.find(s => s.player.pos === 'QB');
        if (qb) rosterPower.QB += getPlayerScore(qb.player, i);

        const wrs = starters.filter(s => s.player.pos === 'WR').slice(0, 2);
        rosterPower.WR += wrs.reduce((sum, wr) => sum + getPlayerScore(wr.player, i), 0);

        const te = starters.find(s => s.player.pos === 'TE');
        if (te) rosterPower.TE += getPlayerScore(te.player, i);

        const flexPlayers = allPlayers
          .filter(p => ['RB', 'WR', 'TE'].includes(p.pos) && !fixedPositionIds.has(p.player_id))
          .map(p => ({ player: p, score: getPlayerScore(p, i) }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 3);
        rosterPower.FLEX += flexPlayers.reduce((sum, p) => sum + p.score, 0);

        const benchPlayers = allPlayers
          .filter(p => !usedIds.has(p.player_id))
          .map(p => ({ player: p, score: getPlayerScore(p, i) }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 5);
        rosterPower.Bench += benchPlayers.reduce((sum, p) => sum + p.score, 0);
      }

      for (const category of Object.keys(maxByCategory)) {
        if (rosterPower[category] > maxByCategory[category]) {
          maxByCategory[category] = rosterPower[category];
        }
      }

      for (const cat of Object.keys(rosterPowersByCategory)) {
        rosterPowersByCategory[cat].push({
          ...rosterPower,
          powerScore: rosterPower[cat]
        });
      }
    }

    for (const category of Object.keys(rosterPowersByCategory)) {
      const max = maxByCategory[category];
      for (const rosterPower of rosterPowersByCategory[category]) {
        rosterPower.powerScore = max > 0 ? round((rosterPower.powerScore / max) * 100, 1) : 0;
      }
    }

    graphs = Object.keys(rosterPowersByCategory).map(category => {
      return generateGraph({
        stats: rosterPowersByCategory[category],
        x: 'Manager',
        y: 'Power Ranking',
        stat: '',
        header: `${category} Power Rankings`,
        field: 'powerScore',
        short: `${category} Power`
      }, leagueData.season);
    });
  };

  buildRankings();

  const refreshPlayers = async () => {
    const newPlayersInfo = await loadPlayers(null, true);
    players = newPlayersInfo.players;
    buildRankings();
  };

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

{#if validGraph && !seasonOver}
  <div class="enclosure">
    <BarChart {graphs} bind:curGraph={curGraph} {leagueTeamManagers} />
  </div>
{:else}
  <p>No valid data to display chart.</p>
{/if}
