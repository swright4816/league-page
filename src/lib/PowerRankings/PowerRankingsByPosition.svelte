<script>
    import BarChart from '$lib/BarChart.svelte';
    import { generateGraph, getTeamFromTeamManagers, round, predictScores, loadPlayers } from '$lib/utils/helper';
    export let nflState, rostersData, leagueTeamManagers, playersInfo, leagueData;

    const rosters = rostersData.rosters;
    let validGraph = false;
    let graphs = [];
    let seasonOver = false;
    let players = playersInfo.players;
    let curGraph = 0;

    const buildRankings = () => {
        const rosterPowers = [];
        let week = nflState.week;
        if (week == 0) week = 1;
        let max = 0;

        for (const rosterID in rosters) {
            const roster = rosters[rosterID];
            if (!roster.players || roster.players.length === 0) continue;
            validGraph = true;

            const allPlayers = roster.players
                .map(pid => players[pid])
                .filter(p => p && p.pos && p.wi && p.ln);
            console.log(`Roster ${rosterID} players:`, allPlayers);

            const getProjectedStarters = (week) => {
                const projected = allPlayers.map(p => ({
                    player: p,
                    score: predictScores([{
                        name: p.ln,
                        pos: p.pos,
                        wi: p.wi
                    }], week, leagueData)
                }));
                console.log(`Week ${week} projected:`, projected);

                const byPos = { QB: [], RB: [], WR: [], TE: [], FLEX: [] };
                for (const p of projected) {
                    const pos = p.player.pos;
                    if (byPos[pos]) byPos[pos].push(p);
                    if (['RB', 'WR', 'TE'].includes(pos)) byPos.FLEX.push(p);
                }
                console.log(`Week ${week} byPos:`, byPos);

                for (const pos in byPos) {
                    byPos[pos].sort((a, b) => b.score - a.score);
                }

                const starters = [];
                if (byPos.QB.length > 0) starters.push(byPos.QB[0]);
                starters.push(...byPos.RB.slice(0, Math.min(2, byPos.RB.length)));
                starters.push(...byPos.WR.slice(0, Math.min(2, byPos.WR.length)));
                if (byPos.TE.length > 0) starters.push(byPos.TE[0]);

                const usedIds = new Set(starters.map(p => p.player.player_id));
                const flexPool = byPos.FLEX.filter(p => !usedIds.has(p.player.player_id));
                console.log(`Week ${week} flexPool:`, flexPool);
                starters.push(...flexPool.slice(0, Math.min(3, flexPool.length)));

                console.log(`Week ${week} starters:`, starters);

                return starters.map(p => ({
                    name: p.player.ln,
                    pos: p.player.pos,
                    wi: p.player.wi
                }));
            };

            const rosterPower = {
                rosterID,
                manager: getTeamFromTeamManagers(leagueTeamManagers, rosterID),
                powerScore: 0,
            };

            const seasonEnd = 18;
            if (week >= seasonEnd) seasonOver = true;

            for (let i = week; i < seasonEnd; i++) {
                const starters = getProjectedStarters(i);
                const score = predictScores(starters, i, leagueData);
                console.log(`Week ${i} score for roster ${rosterID}:`, score);
                rosterPower.powerScore += score;
            }

            if (rosterPower.powerScore > max) max = rosterPower.powerScore;
            rosterPowers.push(rosterPower);
        }

        for (const rosterPower of rosterPowers) {
            rosterPower.powerScore = max > 0 ? round(rosterPower.powerScore / max * 100) : 0;
        }

        const powerGraph = {
            stats: rosterPowers,
            x: "Manager",
            y: "Power Ranking",
            stat: "",
            header: "Rest of Season Power Rankings (Starters Only)",
            field: "powerScore",
            short: "ROS Starter Power"
        };

        graphs = [generateGraph(powerGraph, leagueData.season)];
        console.log('Generated graphs:', graphs);
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
