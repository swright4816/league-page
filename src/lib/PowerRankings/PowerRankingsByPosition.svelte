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
                console.log(`Player ${player.player_id} (${player.ln}) week ${week} score:`, score);
            }
            return scoreCache.get(key);
        };

        for (const rosterID in rosters) {
            const roster = rosters[rosterID];
            if (!roster.players || roster.players.length === 0) continue;
            validGraph = true;

            const allPlayers = roster.players
                .map(pid => players[pid])
                .filter(p => p && p.pos && p.wi && p.ln);
            console.log(`Roster ${rosterID} allPlayers:`, allPlayers.map(p => ({ id: p.player_id, pos: p.pos, name: p.ln })));

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
                console.log(`Roster ${rosterID} week ${week} byPos:`, byPos);

                for (const pos in byPos) {
                    byPos[pos].sort((a, b) => b.score - a.score);
                }

                const starters = [];
                if (byPos.QB.length > 0) starters.push(byPos.QB[0]); // 1 QB
                starters.push(...byPos.RB.slice(0, Math.min(2, byPos.RB.length))); // 2 RB
                starters.push(...byPos.WR.slice(0, Math.min(2, byPos.WR.length))); // 2 WR
                if (byPos.TE.length > 0) starters.push(byPos.TE[0]); // 1 TE

                const usedIds = new Set(starters.map(p => p.player.player_id));
                const flexPool = byPos.FLEX.filter(p => !usedIds.has(p.player.player_id));
                starters.push(...flexPool.slice(0, Math.min(3, flexPool.length))); // 3 FLEX

                console.log(`Roster ${rosterID} week ${week} starters:`, starters.map(s => ({ id: s.player.player_id, pos: s.player.pos, score: s.score })));
                console.log(`Roster ${rosterID} week ${week} usedIds:`, [...usedIds]);

                return { starters, usedIds };
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
                // Get starters and their IDs
                const { starters, usedIds } = getProjectedStarters(i);
                const starterPlayers = starters.map(p => ({
                    name: p.player.ln,
                    pos: p.player.pos,
                    wi: p.player.wi
                }));

                // Starters score
                const startersScore = predictScores(starterPlayers, i, leagueData);
                rosterPower.Starters += startersScore;
                console.log(`Roster ${rosterID} week ${i} Starters score:`, startersScore);

                // QB score (top QB)
                const qb = starters.find(s => s.player.pos === 'QB');
                if (qb) {
                    const qbScore = getPlayerScore(qb.player, i);
                    rosterPower.QB += qbScore;
                    console.log(`Roster ${rosterID} week ${i} QB score:`, qbScore);
                }

                // WR score (top 2 WRs)
                const wrs = starters.filter(s => s.player.pos === 'WR').slice(0, 2);
                const wrScore = wrs.reduce((sum, p) => sum + getPlayerScore(p.player, i), 0);
                rosterPower.WR += wrScore;
                console.log(`Roster ${rosterID} week ${i} WR score:`, wrScore, 'for WRs:', wrs.map(w => w.player.ln));

                // TE score (top TE)
                const te = starters.find(s => s.player.pos === 'TE');
                if (te) {
                    const teScore = getPlayerScore(te.player, i);
                    rosterPower.TE += teScore;
                    console.log(`Roster ${rosterID} week ${i} TE score:`, teScore);
                }

                // FLEX score (top 3 RB/WR/TE not used as RB/WR/TE starters)
                const fixedPositionIds = new Set(
                    starters
                        .filter(s => ['RB', 'WR', 'TE'].includes(s.player.pos) && !s.player.pos.includes('FLEX'))
                        .map(s => s.player.player_id)
                );
                const flexPlayers = allPlayers
                    .filter(p => ['RB', 'WR', 'TE'].includes(p.pos) && !fixedPositionIds.has(p.player_id))
                    .map(p => ({
                        player: p,
                        score: getPlayerScore(p, i)
                    }))
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 3);
                const flexPlayerData = flexPlayers.map(p => ({
                    name: p.player.ln,
                    pos: p.player.pos,
                    wi: p.player.wi
                }));
                const flexScore = predictScores(flexPlayerData, i, leagueData);
                rosterPower.FLEX += flexScore;
                console.log(`Roster ${rosterID} week ${i} FLEX players:`, flexPlayers.map(p => ({ id: p.player.player_id, pos: p.player.pos, score: p.score })));
                console.log(`Roster ${rosterID} week ${i} FLEX score:`, flexScore);

                // Bench score (top 5 non-starters)
                const benchPlayers = allPlayers
                    .filter(p => !usedIds.has(p.player_id))
                    .map(p => ({
                        player: p,
                        score: getPlayerScore(p, i)
                    }))
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 5);
                const benchPlayerData = benchPlayers.map(p => ({
                    name: p.player.ln,
                    pos: p.player.pos,
                    wi: p.player.wi
                }));
                const benchScore = predictScores(benchPlayerData, i, leagueData);
                rosterPower.Bench += benchScore;
                console.log(`Roster ${rosterID} week ${i} Bench players:`, benchPlayers.map(p => ({ id: p.player.player_id, pos: p.player.pos, score: p.score })));
                console.log(`Roster ${rosterID} week ${i} Bench score:`, benchScore);
            }

            console.log(`Roster ${rosterID} final scores:`, rosterPower);

            // Update max scores
            for (const category of Object.keys(maxByCategory)) {
                if (rosterPower[category] > maxByCategory[category]) {
                    maxByCategory[category] = rosterPower[category];
                }
            }

            // Push to respective category arrays
            rosterPowersByCategory.Starters.push({ ...rosterPower, powerScore: rosterPower.Starters });
            rosterPowersByCategory.QB.push({ ...rosterPower, powerScore: rosterPower.QB });
            rosterPowersByCategory.WR.push({ ...rosterPower, powerScore: rosterPower.WR });
            rosterPowersByCategory.TE.push({ ...rosterPower, powerScore: rosterPower.TE });
            rosterPowersByCategory.FLEX.push({ ...rosterPower, powerScore: rosterPower.FLEX });
            rosterPowersByCategory.Bench.push({ ...rosterPower, powerScore: rosterPower.Bench });
        }

        console.log('Max scores by category:', maxByCategory);
        console.log('Roster powers before normalization:', rosterPowersByCategory);

        // Normalize scores for each category
        for (const category of Object.keys(rosterPowersByCategory)) {
            for (const rosterPower of rosterPowersByCategory[category]) {
                rosterPower.powerScore = maxByCategory[category] > 0
                    ? round(rosterPower.powerScore / maxByCategory[category] * 100)
                    : 0;
            }
        }

        console.log('Roster powers after normalization:', rosterPowersByCategory);

        // Generate graphs for each category
        graphs = Object.keys(rosterPowersByCategory).map(category => ({
            stats: rosterPowersByCategory[category],
            x: 'Manager',
            y: 'Power Ranking',
            stat: '',
            header: `${category} Power Rankings`,
            field: 'powerScore',
            short: `${category} Power`
        })).map(graph => generateGraph(graph, leagueData.season));

        console.log('Generated graphs:', graphs);
    };

    buildRankings();

    const refreshPlayers = async () => {
        const newPlayersInfo = await loadPlayers(null, true);
        players = newPlayersInfo.players;
        console.log('Refreshed players:', Object.keys(players));
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
