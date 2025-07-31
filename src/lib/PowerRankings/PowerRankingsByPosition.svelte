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
            BenchKay: 0
        };

        // Cache scores to avoid redundant predictScores calls
        const scoreCache = new Map();
        const getPlayerScore = (player, week) => {
            const key = `${player.player_id}-${week}`;
            if (!scoreCache.has(key)) {
                if (!player.wi[week]?.proj_pts) {
                    console.warn(`DEBUG: No proj_pts for ${player.ln} week ${week}:`, player.wi[week]);
                    return 0;
                }
                const score = predictScores([{ name: player.ln, pos: player.pos, wi: player.wi }], week, leagueData) || 0;
                scoreCache.set(key, score);
                console.log(`DEBUG: Player ${player.ln} (${player.pos}) week ${week} score:`, score);
            }
            return scoreCache.get(key);
        };

        // Test predictScores with sample input
        if (players[Object.keys(players)[0]]) {
            console.log('DEBUG: Test predictScores:', predictScores([{ 
                name: players[Object.keys(players)[0]].ln, 
                pos: players[Object.keys(players)[0]].pos, 
                wi: players[Object.keys(players)[0]].wi 
            }], week, leagueData));
            console.log('DEBUG: Sample leagueData:', leagueData);
        }

        for (const rosterID in rosters) {
            const roster = rosters[rosterID];
            if (!roster.players || roster.players.length === 0) {
                console.log(`DEBUG: Roster ${rosterID} has no players`, 'roster:', roster);
                continue;
            }
            validGraph = true;

            const allPlayers = roster.players
                .map(pid => players[pid])
                .filter(p => p && p.pos && p.wi && p.ln);
            if (allPlayers.length === 0) {
                console.log(`DEBUG: Roster ${rosterID} player IDs:`, roster.players);
                console.log('DEBUG: Available players:', Object.keys(players));
            }
            console.log(`DEBUG: Roster ${rosterID} allPlayers count:`, allPlayers.length, 'sample wi:', allPlayers[0]?.wi);

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
                console.log(`DEBUG: Roster ${rosterID} week ${week} byPos counts:`, {
                    QB: byPos.QB.length,
                    RB: byPos.RB.length,
                    WR: byPos.WR.length,
                    TE: byPos.TE.length,
                    FLEX: byPos.FLEX.length
                });

                for (const pos in byPos) {
                    byPos[pos].sort((a, b) => b.score - a.score);
                }

                const starters = [];
                const rankedIds = new Set(); // Track QB, RB, WR, TE used in rankings

                // QB
                if (byPos.QB.length > 0) {
                    starters.push(byPos.QB[0]);
                    rankedIds.add(byPos.QB[0].player.player_id);
                }

                // RB (top 2 for RB ranking)
                const rbStarters = byPos.RB.slice(0, Math.min(2, byPos.RB.length));
                starters.push(...rbStarters);
                rbStarters.forEach(rb => rankedIds.add(rb.player.player_id));

                // WR (top 2 for WR ranking)
                const wrStarters = byPos.WR.slice(0, Math.min(2, byPos.WR.length));
                starters.push(...wrStarters);
                wrStarters.forEach(wr => rankedIds.add(wr.player.player_id));

                // TE
                if (byPos.TE.length > 0) {
                    starters.push(byPos.TE[0]);
                    rankedIds.add(byPos.TE[0].player.player_id);
                }

                // FLEX starters (for Starters lineup)
                const flexPool = byPos.FLEX.filter(p => !rankedIds.has(p.player.player_id));
                const flexStarters = flexPool.slice(0, Math.min(3, flexPool.length));
                starters.push(...flexStarters);

                const usedIds = new Set(starters.map(p => p.player.player_id));
                console.log(`DEBUG: Roster ${rosterID} week ${week} starters count:`, starters.length, 'rankedIds:', [...rankedIds]);

                return { starters, usedIds, rankedIds };
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
                BenchB: 0
            };

            const seasonEnd = 18;
            if (week >= seasonEnd) seasonOver = true;

            for (let i = week; i < seasonEnd; i++) {
                const { starters, usedIds, rankedIds } = getProjectedStarters(i);
                const starterPlayers = starters.map(p => ({
                    name: p.player.ln,
                    pos: p.player.pos,
                    wi: p.player.wi
                }));

                // Starters score
                const startersScore = predictScores(starterPlayers, i, leagueData) || 0;
                rosterPower.Starters += startersScore;
                console.log(`DEBUG: Roster ${rosterID} week ${i} Starters score:`, startersScore);

                // QB score
                const qb = starters.find(s => s.player.pos === 'QB');
                if (qb) {
                    const qbScore = getPlayerScore(qb.player, i);
                    rosterPower.QB += qbScore;
                    console.log(`DEBUG: Roster ${rosterID} week ${i} QB ${qb.player.ln} score:`, qbScore);
                }

                // RB score
                const rbs = starters.filter(s => s.player.pos === 'RB').slice(0, 2);
                let rbScore = 0;
                for (const rb of rbs) {
                    const score = getPlayerScore(rb.player, i);
                    rbScore += score;
                    console.log(`DEBUG: Roster ${rosterID} week ${i} RB ${rb.player.ln} score:`, score);
                }
                rosterPower.RB += rbScore;

                // WR score
                const wrs = starters.filter(s => s.player.pos === 'WR').slice(0, 2);
                let wrScore = 0;
                for (const wr of wrs) {
                    const score = getPlayerScore(wr.player, i);
                    wrScore += score;
                    console.log(`DEBUG: Roster ${rosterID} week ${i} WR ${wr.player.ln} score:`, score);
                }
                rosterPower.WR += wrScore;

                // TE score
                const te = starters.find(s => s.player.pos === 'TE');
                if (te) {
                    const teScore = getPlayerScore(te.player, i);
                    rosterPower.TE += teScore;
                    console.log(`DEBUG: Roster ${rosterID} week ${i} TE ${te.player.ln} score:`, teScore);
                }

                // FLEX score (exclude QBs and ranked RB/WR/TE)
                const flexPlayers = allPlayers
                    .filter(p => ['RB', 'WR', 'TE'].includes(p.pos) && !rankedIds.has(p.player_id))
                    .map(p => ({
                        player: p,
                        score: getPlayerScore(p, i)
                    }))
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 3);
                const flexScore = flexPlayers.reduce((sum, p) => sum + p.score, 0);
                rosterPower.FLEX += flexScore;
                console.log(`DEBUG: Roster ${rosterID} week ${i} FLEX players:`, flexPlayers.map(p => ({ name: p.player.ln, pos: p.player.pos, score: p.score })));

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
                console.log(`DEBUG: Roster ${rosterID} week ${i} Bench players:`, benchPlayers.map(p => ({ name: p.player.ln, pos: p.player.pos, score: p.score })));
            }

            console.log(`DEBUG: Roster ${rosterID} raw scores:`, rosterPower);

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

        console.log('DEBUG: Max scores by category:', maxByCategory);
        console.log('DEBUG: Roster powers after normalization:', rosterPowersByCategory);

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
        console.log('DEBUG: Refreshed players count:', Object.keys(players).length);
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
