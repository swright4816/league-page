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
        const rosterPowersByCategory = {
            Starters: [],
            QB: [],
            RB: [],
            WR: [],
            TE: [],
            FLEX: [],
            Bench: []
        };
        let week = nflState.week;
        if (week == 0) week = 1;
        const maxByCategory = {
            Starters: 0,
            QB: 0,
            RB: 0,
            WR: 0,
            TE: 0,
            FLEX: 0,
            Bench: 0
        };

        // Cache scores to avoid redundant predictScores calls
        const scoreCache = new Map();
        const getPlayerScore = (player, week) => {
            const key = `${player.player_id}-${week}`;
            if (!scoreCache.has(key)) {
                const score = predictScores([{ name: player.ln, pos: player.pos, wi: player.wi }], week, leagueData);
                scoreCache.set(key, score);
                console.log(`Player ${player.ln} (${player.pos}) week ${week} score:`, score);
            }
            return scoreCache.get(key);
        };

        for (const rosterID in rosters) {
            const roster = rosters[rosterID];
            if (!roster.players || roster.players.length === 0) continue;
            validGraph = true;

            const allPlayers = roster.players
                .map(pid => players[pid])
                .filter(p => p && p.pos && p.wi && typeof p.wi[week]?.proj_pts === 'number');
            console.log(`Roster ${rosterID} allPlayers count:`, allPlayers.length);

            const getProjectedStarters = (week) => {
                const projected = allPlayers.map(p => ({
                    player: p,
                    score: getPlayerScore(p, week)
                }));

                const byPos = { QB: [], RB: [], WR: [], TE: [], FLEX: [] };
                for (const p of projected) {
                    const pos = p.player.pos;
                    if (byPos[pos]) byPos[pos].push(p);
                    if (['RB', 'WR', 'TE'].includes(pos)) byPos.FLEX.push(p);
                }

                for (const pos in byPos) {
                    byPos[pos].sort((a, b) => b.score - a.score);
                }

                const starters = [];
                if (byPos.QB.length > 0) starters.push(byPos.QB[0]); // 1 QB
                starters.push(...byPos.RB.slice(0, Math.min(2, byPos.RB.length))); // 2 RB
                starters.push(...byPos.WR.slice(0, Math.min(2, byPos.WR.length))); // 2 WR
                if (byPos.TE.length > 0) starters.push(byPos.TE[0]); // 1 TE

                const fixedPositionIds = new Set(starters.map(p => p.player.player_id));
                const flexPool = byPos.FLEX.filter(p => !fixedPositionIds.has(p.player.player_id));
                starters.push(...flexPool.slice(0, Math.min(3, flexPool.length))); // 3 FLEX

                const usedIds = new Set(starters.map(p => p.player.player_id));
                return { starters, usedIds, fixedPositionIds };
            };

            const rosterPower = {
                rosterID,
                manager: getTeamFromTeamManagers(leagueTeamManagers, rosterID),
                Starters: 0,
                QB: 0,
                RB: 0,
                WR: 0,
                TE: 0,
                FLEX: 0,
                Bench: 0
            };

            const seasonEnd = 18;
            if (week >= seasonEnd) seasonOver = true;

            for (let i = week; i < seasonEnd; i++) {
                const { starters, usedIds, fixedPositionIds } = getProjectedStarters(i);
                const starterPlayers = starters.map(p => ({
                    name: p.player.ln,
                    pos: p.player.pos,
                    wi: p.player.wi
                }));

                // Starters score
                rosterPower.Starters += predictScores(starterPlayers, i, leagueData);

                // QB score
                const qb = starters.find(s => s.player.pos === 'QB');
                if (qb) {
                    rosterPower.QB += getPlayerScore(qb.player, i);
                    console.log(`Roster ${rosterID} week ${i} QB:`, qb.player.ln);
                }

                // RB score
                const rbs = starters.filter(s => s.player.pos === 'RB').slice(0, 2);
                let rbScore = 0;
                for (const rb of rbs) {
                    rbScore += getPlayerScore(rb.player, i);
                    console.log(`Roster ${rosterID} week ${i} RB ${rb.player.ln} score:`, getPlayerScore(rb.player, i));
                }
                rosterPower.RB += rbScore;

                // WR score
                const wrs = starters.filter(s => s.player.pos === 'WR').slice(0, 2);
                let wrScore = 0;
                for (const wr of wrs) {
                    wrScore += getPlayerScore(wr.player, i);
                    console.log(`Roster ${rosterID} week ${i} WR ${wr.player.ln} score:`, getPlayerScore(wr.player, i));
                }
                rosterPower.WR += wrScore;

                // TE score
                const te = starters.find(s => s.player.pos === 'TE');
                if (te) {
                    rosterPower.TE += getPlayerScore(te.player, i);
                    console.log(`Roster ${rosterID} week ${i} TE:`, te.player.ln);
                }

                // FLEX score
                const flexPlayers = allPlayers
                    .filter(p => ['RB', 'WR', 'TE'].includes(p.pos) && !fixedPositionIds.has(p.player_id))
                    .map(p => ({
                        player: p,
                        score: getPlayerScore(p, i)
                    }))
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 3);
                const flexScore = flexPlayers.reduce((sum, p) => sum + p.score, 0);
                rosterPower.FLEX += flexScore;
                console.log(`Roster ${rosterID} week ${i} FLEX players:`, flexPlayers.map(p => ({ name: p.player.ln, pos: p.player.pos, score: p.score })));

                // Bench score
                const benchPlayers = allPlayers
                    .filter(p => !usedIds.has(p.player_id))
                    .map(p => ({
                        player: p,
                        score: getPlayerScore(p, i)
                    }))
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 5);
                const benchScore = benchPlayers.reduce((sum, p) => sum + p.score, 0);
                rosterPower.Bench += benchScore;
                console.log(`Roster ${rosterID} week ${i} Bench players:`, benchPlayers.map(p => ({ name: p.player.ln, pos: p.player.pos, score: p.score })));
            }

            console.log(`Roster ${rosterID} raw scores:`, rosterPower);

            // Update max scores
            for (const category of Object.keys(maxByCategory)) {
                if (rosterPower[category] > maxByCategory[category]) {
                    maxByCategory[category] = rosterPower[category];
                }
            }

            rosterPowersByCategory.Starters.push({ ...rosterPower, powerScore: rosterPower.Starters });
            rosterPowersByCategory.QB.push({ ...rosterPower, powerScore: rosterPower.QB });
            rosterPowersByCategory.RB.push({ ...rosterPower, powerScore: rosterPower.RB });
            rosterPowersByCategory.WR.push({ ...rosterPower, powerScore: rosterPower.WR });
            rosterPowersByCategory.TE.push({ ...rosterPower, powerScore: rosterPower.TE });
            rosterPowersByCategory.FLEX.push({ ...rosterPower, powerScore: rosterPower.FLEX });
            rosterPowersByCategory.Bench.push({ ...rosterPower, powerScore: rosterPower.Bench });
        }

        console.log('Max scores by category:', maxByCategory);

        // Normalize scores
        for (const category of Object.keys(rosterPowersByCategory)) {
            for (const rosterPower of rosterPowersByCategory[category]) {
                rosterPower.powerScore = maxByCategory[category] > 0
                    ? round(rosterPower.powerScore / maxByCategory[category] * 100)
                    : 0;
            }
        }

        console.log('Roster powers after normalization:', rosterPowersByCategory);

        graphs = Object.keys(rosterPowersByCategory).map(category => ({
            stats: rosterPowersByCategory[category],
            x: 'Manager',
            y: 'Power Ranking',
            stat: '',
            header: `${category} Power Rankings`,
            field: 'powerScore',
            short: `${category} Power`
        })).map(graph => generateGraph(graph, leagueData.season));
    };

    buildRankings();

    const refreshPlayers = async () => {
        const newPlayersInfo = await loadPlayers(null, true);
        players = newPlayersInfo.players;
        console.log('Refreshed players count:', Object.keys(players).length);
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
