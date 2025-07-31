const buildRankings = () => {
    const rosterPowers = [];
    let week = nflState.week;
    if (week == 0) week = 1;

    let max = 0;

    for (const rosterID in rosters) {
        const roster = rosters[rosterID];
        if (!roster.players) continue;

        validGraph = true;

        // Filter and map player objects with their projections for a given week
        const allPlayers = roster.players
            .map(pid => players[pid])
            .filter(p => p && p.pos && p.wi);

        const getProjectedStarters = (week) => {
            // Map each player to their projected score
            const projected = allPlayers.map(p => ({
                player: p,
                score: predictScores([{
                    name: p.ln,
                    pos: p.pos,
                    wi: p.wi
                }], week, leagueData)
            }));

            // Group by position
            const byPos = {
                QB: [],
                RB: [],
                WR: [],
                TE: [],
                FLEX: [] // will be reused
            };

            for (const p of projected) {
                const pos = p.player.pos;
                if (byPos[pos]) byPos[pos].push(p);
                if (['RB', 'WR', 'TE'].includes(pos)) byPos.FLEX.push(p);
            }

            // Sort positions by projection
            for (const pos in byPos) {
                byPos[pos].sort((a, b) => b.score - a.score);
            }

            const starters = [];

            if (byPos.QB.length > 0) starters.push(byPos.QB[0]);
            starters.push(...byPos.RB.slice(0, 2));
            starters.push(...byPos.WR.slice(0, 2));
            if (byPos.TE.length > 0) starters.push(byPos.TE[0]);

            // For FLEX: take top 3 remaining RB/WR/TE not already used
            const usedIds = new Set(starters.map(p => p.player.player_id));
            const flexPool = byPos.FLEX.filter(p => !usedIds.has(p.player.player_id));
            starters.push(...flexPool.slice(0, 3));

            return starters.map(p => ({
                name: p.player.ln,
                pos: p.player.pos,
                wi: p.player.wi
            }));
        }

        const rosterPower = {
            rosterID,
            manager: getTeamFromTeamManagers(leagueTeamManagers, rosterID),
            powerScore: 0,
        };

        const seasonEnd = 18;
        if (week >= seasonEnd) seasonOver = true;

        for (let i = week; i < seasonEnd; i++) {
            const starters = getProjectedStarters(i);
            rosterPower.powerScore += predictScores(starters, i, leagueData);
        }

        if (rosterPower.powerScore > max) max = rosterPower.powerScore;

        rosterPowers.push(rosterPower);
    }

    // Normalize scores to 0–100 scale
    for (const rosterPower of rosterPowers) {
        rosterPower.powerScore = round(rosterPower.powerScore / max * 100);
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

    graphs = [
        generateGraph(powerGraph, leagueData.season),
    ];
}
