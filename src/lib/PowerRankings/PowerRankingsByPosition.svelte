<script>
	import BarChart from '$lib/BarChart.svelte';
    import { generateGraph, getTeamFromTeamManagers, round, predictScores, loadPlayers } from '$lib/utils/helper';
    export let nflState, rostersData, leagueTeamManagers, playersInfo, leagueData;

    const rosters = rostersData.rosters;

    let validGraph = false;

    let graphs = [];

    let seasonOver = false;

    let players = playersInfo.players;

    const buildRankings = () => {
        const rosterPowers = [];
        let week = nflState.week;
        if(week == 0) {
            week = 1;
        }
        let max = 0;

        for(const rosterID in rosters) {
            const roster = rosters[rosterID];
            if(!roster.players) continue;
            validGraph = true;

            const rosterPlayers = [];

            for(const rosterPlayer of roster.players) {
                const player = players[rosterPlayer];
                if(!player) continue;

                // Only include QB, WR, RB, TE
                if(!['QB', 'WR', 'RB', 'TE'].includes(player.pos)) continue;

                rosterPlayers.push({
                    name: player.ln,
                    pos: player.pos,
                    wi: player.wi
                });
            }

            const rosterPower = {
                rosterID,
                manager: getTeamFromTeamManagers(leagueTeamManagers, rosterID),
                powerScore: 0,
            };

            const seasonEnd = 18;
            if(week >= seasonEnd) {
                seasonOver = true;
            }

            for(let i = week; i < seasonEnd; i++) {
                rosterPower.powerScore += predictScores(rosterPlayers, i, leagueData);
            }

            if(rosterPower.powerScore > max) {
                max = rosterPower.powerScore;
            }

            rosterPowers.push(rosterPower);
        }

        for(const rosterPower of rosterPowers) {
            rosterPower.powerScore = round(rosterPower.powerScore / max * 100);
        }

        const powerGraph = {
            stats: rosterPowers,
            x: "Manager",
            y: "Power Ranking",
            stat: "",
            header: "Power Rankings - Offense Only",
            field: "powerScore",
            short: "ROS Power Ranking"
        };

        graphs = [
            generateGraph(powerGraph, leagueData.season),
        ];
    };

    buildRankings();

    const refreshPlayers = async () => {
        const newPlayersInfo = await loadPlayers(null, true);
        players = newPlayersInfo.players;
        buildRankings();
    };

    if(playersInfo.stale) {
        refreshPlayers();
    }

    let curGraph = 0;
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
{/if}
