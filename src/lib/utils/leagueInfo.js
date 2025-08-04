 /*   STEP 1   */
export const leagueID = "1220061871822868480"; // your league ID
export const leagueName = "🏆 Welcome to the Champion’s Club"; // your league name
export const dues = 100; // (optional) used in template constitution page
export const dynasty = true; // true for dynasty leagues, false for redraft and keeper
export const enableBlog = false; // requires VITE_CONTENTFUL_ACCESS_TOKEN and VITE_CONTENTFUL_SPACE environment variables

/*   STEP 2   */
export const homepageText = `
<p><strong><em>Where Legacies Are Built. Not Borrowed.</em></strong></p>
<p>This isn’t your average fantasy football league. <strong>The Champion’s Club</strong> is a dynasty league for the <em>bold</em>, the <em>strategic</em>, and the <em>relentless</em>. Here, you're not just drafting for the season — <strong>you’re building an empire</strong>. Every trade, every pick, every decision carries weight <em>beyond just Week 1</em>. Because when you're in the Club, you're not playing for a trophy — <strong>you're playing for legacy</strong>.</p>
<p>Founded on <strong>grit</strong>, <strong>rivalry</strong>, and <strong>years of heated competition</strong>, the Champion’s Club is where <em>friendships are tested</em>, <em>dynasties are forged</em>, and <strong>legends are written</strong>. Whether you're a long-standing titan defending your turf or a rising contender eyeing the throne, every season is a fresh chance to <em>etch your name into Club history</em>.</p>
<p><strong>Get your roster ready. Check the waivers. Lock in those trades.</strong> And above all, <em>bring the fire</em>. Because in the Champion’s Club, <strong>only one can rule</strong> — but <em>everyone remembers the journey</em>.</p>
`;

/*   STEP 3   */
/*
3 managers as an example. Uncomment (remove the //) before each line to make it live code
If you're having trouble, reference the Training Wheels' Manager Section
https://github.com/nmelhado/league-page/blob/master/TRAINING_WHEELS.md#ii-adding-managers-and-changing-the-homepage-text
*/

// To omit an optional field, set it's value to null

export const managers = [
     {
    //  "roster": 1,  // ID of the roster that the manager manages (look at the order of the power rankings graph)
       "managerID": "741038570088894464",
       "name": "Samson",
    //   "tookOver": 2020, // (optional) used if a manager took over a team, delete this line or change to null otherwise
       "location": "Saint Louis", // (optional)
         "bio":  "The man.<br>The myth.<br>The legend.<br><br>Every league has a villain.<br>Every league has a genius.<br><strong>This one got both — and they call him Commish.</strong><br><br>He doesn’t just play the game — <strong>he built it</strong>.<br>The Commish isn’t your average manager.<br>He’s the architect behind every rule, the keeper of the schedules, and the one who watches from above as the rest of you scramble for relevance.<br><br>You draft.<br>He manipulates.<br>You react.<br><strong>He’s already five moves ahead.</strong><br><br>There are whispers of collusion.<br>Accusations of favoritism.<br>But the truth?<br><br><strong>He’s just better than you. Always has been.</strong>",
         "photo": "/managers/tyler_min.jpg", // square ratio recommended (no larger than 500x500)
    //   "fantasyStart": 2014, // (optional) when did the manager start playing fantasy football
       "favoriteTeam": "lar", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
       "mode": "Rebuild", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
       "rival": {
    //     name: "Rival", // Can be anything (usually your rival's name)
    //     link: 6, // manager array number within this array, or null to link back to all managers page
    //     image: "/managers/rival.jpg", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
       },
       "favoritePlayer": 8112, // (optional) this corresponds to the Sleeper player ID (https://api.sleeper.app/v1/players/nfl)
       "valuePosition": "Picks", // (optional) Favorite position (QB, WR, RB, TE, etc.)
       "rookieOrVets": "Rookies", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)
       "philosophy": "We don’t follow trends.<br>We create ecosystems.<br><br>We don’t react.<br>We orchestrate.<br><br>Others build teams.<br>We build legacies.<br><br>While they panic over injuries,<br>we're already reconfiguring the timeline.<br><br>While they argue over fairness,<br>we’re manipulating outcomes… not to dominate — that part’s automatic.<br><br>The rules were never for us.<br>They were for them — to survive.<br><br>This isn’t about luck.<br>It’s about mercy.<br><br>It’s about leverage.<br>Control.<br>Vision.<br>Execution.<br><br>We manipulate outcomes.<br>Not to win.<br>To give you the illusion that you have a chance.<br><br>We didn’t just write the rules.<br>We rewrote the game.<br><br><em>“By the time they make a move, we’ve already made history.”</em>",
       "tradingScale": 8, // 1 - 10
       "preferredContact": "Sleeper", // 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
     },
  
     {
    //   "roster": 2,  // (DEPRECATED! Don't use this anymore) ID of the roster that the manager manages (look at the order of the power rankings graph)
         "managerID": "720424373617520640",  // the user's manager ID, go to https://api.sleeper.app/v1/league/<your_league_id>/users to find user IDs (you can use older leagueIDs to find user IDs for managers that are no longer in the league)
         "name": "Bee",
    //   "tookOver": 2020, // (DEPRECATED! You don't need to use this anymore) (optional) used if a manager took over a team, delete this line or change to null otherwise
    //   "location": "Brooklyn", // (optional)
         "bio": "Brandon has never tasted the glory of a championship. Now? He’s snapped. Brandon has sold off every draft pick for the next three seasons—future be damned—all in a reckless, glorious bid to hoist the trophy this year. He’s mortgaged his future, his depth, and possibly his dignity. No trade is too wild. No player is off-limits. No move makes “sense.” He’s not building a dynasty. He’s staging a last stand. Win or die trying—and he’s cool with either.",
         "photo": "/managers/bee.jpg", // square ratio recommended (no larger than 500x500)
         "fantasyStart": 2014, // (optional) when did the manager start playing fantasy football
         "favoriteTeam": "lar", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
         "mode": "Win Now", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
         "rival": {
           name: "Rival", // Can be anything (usually your rival's name)
    //      link: 6, // manager array number within this array, or null to link back to all managers page
    //     image: "/managers/rival.jpg", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
         },
         "favoritePlayer": 6820, // (optional) this corresponds to the Sleeper player ID (https://api.sleeper.app/v1/players/nfl)
         "valuePosition": "WR", // (optional) Favorite position (QB, WR, RB, TE, etc.)
         "rookieOrVets": "Vets", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)
         "philosophy": "Fuck draft picks... Legends aren’t built on patience—they’re carved from chaos and desperation.", // (optional)
         "tradingScale": 5, // 1 - 10 (optional)
         "preferredContact": "Sleeper",  // (optional) 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
     },

     {
    //   "roster": 3,  // (DEPRECATED! Don't use this anymore) ID of the roster that the manager manages (look at the order of the power rankings graph)
         "managerID": "865007156980764672",  // the user's manager ID, go to https://api.sleeper.app/v1/league/<your_league_id>/users to find user IDs (you can use older leagueIDs to find user IDs for managers that are no longer in the league)
         "name": "Cody",
    //   "tookOver": 2020, // (DEPRECATED! You don't need to use this anymore) (optional) used if a manager took over a team, delete this line or change to null otherwise
    //   "location": "Brooklyn", // (optional)
         "bio": "Once the <strong>undisputed villain</strong> of the league, Cody built his legacy on cunning trades, cold-blooded timing, and a talent for turning chaos into wins. His name inspired groans. His success? <em>Hated</em> — but respected.<br><br>But empires fall.<br><br>The past few seasons have been bleak — only a fading shadow of the villain he was.<br>The league mocks him now, calling it <em>“the dark ages.”</em><br><br>But that’s the mistake.<br><br>He’s not gone.<br><strong>He’s waiting.</strong><br><br><strong>Villains don’t retire. They reload...</strong>",
         "photo": "/managers/cody1.jpg", // square ratio recommended (no larger than 500x500)
         "fantasyStart": 2014, // (optional) when did the manager start playing fantasy football
         "favoriteTeam": "sf", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
         "mode": "Win Now", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
         "rival": {
           name: "Tyler", // Can be anything (usually your rival's name)
           link: 3, // manager array number within this array, or null to link back to all managers page
           image: "/managers/tyler2.jpg", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
         },
         "favoritePlayer": 1426, // (optional) this corresponds to the Sleeper player ID (https://api.sleeper.app/v1/players/nfl)
         "valuePosition": "WR", // (optional) Favorite position (QB, WR, RB, TE, etc.)
         "rookieOrVets": "Rookies", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)
         "philosophy": "While you celebrated my losses and called it the dark ages, I was studying every weakness, every move, every smug little victory you thought you earned. You’ve mistaken silence for surrender. That was your first mistake. I’m not here to rebuild. I’m here to remind you who I am. This league used to fear me. Soon... it will again. <br> <br> <em>I’m not a monster… I’m inevitable.</em>", // (optional)
         "tradingScale": 6, // 1 - 10 (optional)
         "preferredContact": "Email",  // (optional) 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
    },
  
    {
    //     "roster": 4,  // (DEPRECATED! Don't use this anymore) ID of the roster that the manager manages (look at the order of the power rankings graph)
         "managerID": "986463156975271936",  // the user's manager ID, go to https://api.sleeper.app/v1/league/<your_league_id>/users to find user IDs (you can use older leagueIDs to find user IDs for managers that are no longer in the league)
         "name": "Tyler",
    //   "tookOver": 2020, // (DEPRECATED! You don't need to use this anymore) (optional) used if a manager took over a team, delete this line or change to null otherwise
    //   "location": "Brooklyn", // (optional)
         "bio": "A master of misdirection, Tyler thrives in the shadows of league politics. While publicly casting suspicion on every new rule proposal—always with a smug “just asking questions”—he’s quietly orchestrating schemes of his own behind the scenes. No rule change goes unchallenged, no commissioner move unmocked… yet somehow, his fingerprints are always just out of sight. In a league full of strategists, he plays the long con. Trust him at your own peril...",
         "photo": "/managers/tyler3.jpg", // square ratio recommended (no larger than 500x500)
    //   "fantasyStart": 2014, // (optional) when did the manager start playing fantasy football
         "favoriteTeam": "lar", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
         "mode": "Win Now", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
         "rival": {
    //     name: "Rival", // Can be anything (usually your rival's name)
    //     link: 6, // manager array number within this array, or null to link back to all managers page
    //     image: "/managers/rival.jpg", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
         },
         "favoritePlayer": 6786, // (optional) this corresponds to the Sleeper player ID (https://api.sleeper.app/v1/players/nfl)
         "valuePosition": "WR", // (optional) Favorite position (QB, WR, RB, TE, etc.)
         "rookieOrVets": "Rookies", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)
         "philosophy": "<em>Always keep your foes confused. If they are never certain who you are or what you want, they cannot know what you are like to do next.</em> <br> <br> If I can get you second-guessing your lineup, doubting a trade, panicking over “league collusion”… then I’ve already won. I plant the seed, step back, and watch the paranoia bloom. The weak follow. The loud get sloppy. And by the time they realize what’s happening, I’ve already made my move. You don’t need to outplay the league—you just need to make the league outplay itself. <br> <br> <em>There is no good and evil…There is only power, and those too weak to seek it.</em>", // (optional)
         "tradingScale": 7, // 1 - 10 (optional)
         "preferredContact": "Sleeper",  // (optional) 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
    },

    {
    //   "roster": 5,  // (DEPRECATED! Don't use this anymore) ID of the roster that the manager manages (look at the order of the power rankings graph)
         "managerID": "996574114322305024",  // the user's manager ID, go to https://api.sleeper.app/v1/league/<your_league_id>/users to find user IDs (you can use older leagueIDs to find user IDs for managers that are no longer in the league)
         "name": "Tim",
    //   "tookOver": 2020, // (DEPRECATED! You don't need to use this anymore) (optional) used if a manager took over a team, delete this line or change to null otherwise
    //   "location": "Brooklyn", // (optional)
         "bio": "Tim doesn’t scheme in shadows — he casts them.<br>Loud, confident, and utterly convinced of his supremacy, he doesn't just want to win — he wants you to know it’s inevitable.<br><br>His presence looms over every matchup. His confidence borders on madness. He believes the league bends to strength, and his will is unmatched.<br><br>You can doubt him. Mock him. Root against him.<br>It won’t matter. He’ll still believe his team is the best in the league.",
         "photo": "/managers/tim.jpg", // square ratio recommended (no larger than 500x500)
    //   "fantasyStart": 2014, // (optional) when did the manager start playing fantasy football
         "favoriteTeam": "blt", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
         "mode": "Win Now", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
         "rival": {
          name: "Rival", // Can be anything (usually your rival's name)
    //     link: 6, // manager array number within this array, or null to link back to all managers page
    //     image: "/managers/rival.jpg", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
         },
         "favoritePlayer": 167, // (optional) this corresponds to the Sleeper player ID (https://api.sleeper.app/v1/players/nfl)
         "valuePosition": "QB", // (optional) Favorite position (QB, WR, RB, TE, etc.)
         "rookieOrVets": "Rookies", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)
         "philosophy": "I’ll be waiting. Watching. Unshaken.<br><br><em>“You cannot hide. I see you. There is no escape.”</em><br><br>One ring. One champion.<br><strong>All shall fall.</strong>", // (optional)
         "tradingScale": 5, // 1 - 10 (optional)
         "preferredContact": "Carrier Pigeon",  // (optional) 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
    },
  
   {
  //  "roster": 6,  // ID of the roster that the manager manages (look at the order of the power rankings graph)
         "managerID": "1117977887900078080",
         "name": "John",
    //   "tookOver": 2020, // (optional) used if a manager took over a team, delete this line or change to null otherwise
    //   "location": "Brooklyn", // (optional)
         "bio":  "He spoke like a commander, boasted like a king, and fought with wit as his blade.<br> He strutted into last season like a conquering general.<br><br> But when the final whistle blew… there was no glory. No crown. Just silence.<br> And the cold, humiliating sting of last place.<br><br>Mocked. Forgotten.<br> Buried beneath the standings he once scoffed at.<br><br> But a true warrior doesn’t stay down. Not for long.<br><br> Now, from the ashes of defeat, <strong>John rises</strong> — fueled by revenge, sharpened by shame, and rebuilt for blood.<br> He trains in the shadows, watches every snap, and prepares to strike where it hurts most: <strong>your scoreboard</strong>.<br><br> This season… he isn’t here for laughs.<br> <strong>He’s here for redemption.</strong><br><br>",
         "photo": "/managers/john.jpg", // square ratio recommended (no larger than 500x500)
        "fantasyStart": 2014, // (optional) when did the manager start playing fantasy football
        "favoriteTeam": "nyj", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
         "mode": "Rebuild", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
         "rival": {
          name: "Rival", // Can be anything (usually your rival's name)
    //     link: 6, // manager array number within this array, or null to link back to all managers page
    //     image: "/managers/rival.jpg", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
        },
        "favoritePlayer": 1426, // (optional) this corresponds to the Sleeper player ID (https://api.sleeper.app/v1/players/nfl)
        "valuePosition": "WR", // (optional) Favorite position (QB, WR, RB, TE, etc.)
        "rookieOrVets": "Rookies", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)
         "philosophy": "We don’t chase hype.<br>We don’t fear projections.<br>We build with purpose.<br>We strike with precision.<br>And when the lights are brightest, we do not flinch.<br><br>The draft is war. The season is a battlefield.<br>There are no friends here — only foes and victims.<br>Our loyalty is to the scoreboard. Our currency is wins.<br>Every Sunday, we sharpen. Every matchup, we hunt.<br><br>We don’t talk to prove anything.<br>We win to prove everything.<br><br><em>“Champions aren’t remembered for their words, but their wins. And I will be remembered.”</em>",
         "tradingScale": 8, // 1 - 10
         "preferredContact": "Sleeper DM or Text", // 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
     },
  
    {
    //   "roster": 7,  // (DEPRECATED! Don't use this anymore) ID of the roster that the manager manages (look at the order of the power rankings graph)
         "managerID": "1120451840367345664",  // the user's manager ID, go to https://api.sleeper.app/v1/league/<your_league_id>/users to find user IDs (you can use older leagueIDs to find user IDs for managers that are no longer in the league)
         "name": "Cano",
    //   "tookOver": 2020, // (DEPRECATED! You don't need to use this anymore) (optional) used if a manager took over a team, delete this line or change to null otherwise
    //   "location": "Brooklyn", // (optional)
         "bio": "In every league meeting, he speaks first.<br><br>Outspoken. Unapologetic. Unshaken.<br><strong>Cano</strong> doesn’t whisper opinions — he launches them like proton torpedoes. You might not always agree, but in a galaxy of noise, <strong>his voice carries weight</strong>.<br><br>His squad, <strong>The Love Strikes Back</strong>, is a force of balance — fierce in battle, strategic in motion, and always, always in the hunt.<br>Year after year, he stands at the edge of glory. He’s finished second more times than most have made the playoffs.<br><br>But the championship? It remains just beyond the reach of his outstretched hand.<br><br>Some say he's cursed.<br>Others say he's destined.<br><br>But make no mistake — this isn’t a man haunted by defeat.<br>This is a commander biding his time, refining his plans, waiting for the stars to align.<br><br><strong>The galaxy has not heard the last of The Love Strikes Back.</strong>",
         "photo": "/managers/Cano.jpg", // square ratio recommended (no larger than 500x500)
    //   "fantasyStart": 2014, // (optional) when did the manager start playing fantasy football
         "favoriteTeam": "gb", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
         "mode": "Win Now", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
         "rival": {
          name: "Rival", // Can be anything (usually your rival's name)
    //     link: 6, // manager array number within this array, or null to link back to all managers page
    //     image: "/managers/rival.jpg", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
         },
    //   "favoritePlayer": 1426, // (optional) this corresponds to the Sleeper player ID (https://api.sleeper.app/v1/players/nfl)
         "valuePosition": "WR", // (optional) Favorite position (QB, WR, RB, TE, etc.)
         "rookieOrVets": "Rookies", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)
         "philosophy": "We do not panic.<br>We do not reach.<br>We move with precision. We draft with intent.<br>We are guided not by hype… but by instinct.<br><br>Ours is not a team built on luck — but on legacy.<br>Others chase flash. We pursue control.<br>The standings may not yet bear our name,<br>but the league knows who to fear when the matchups matter.<br><br>We speak boldly — because we’ve earned the right.<br>And when the stars align…<br>we strike.<br><br><em>The strike begins. The league ends. Execute FF Order 66.</em>", // (optional)
         "tradingScale": 7, // 1 - 10 (optional)
         "preferredContact": "Carrier Pigeon",  // (optional) 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
     },

       {
    //   "roster": 8,  // (DEPRECATED! Don't use this anymore) ID of the roster that the manager manages (look at the order of the power rankings graph)
         "managerID": "1125890116112781312",  // the user's manager ID, go to https://api.sleeper.app/v1/league/<your_league_id>/users to find user IDs (you can use older leagueIDs to find user IDs for managers that are no longer in the league)
         "name": "Cris",
    //   "tookOver": 2020, // (DEPRECATED! You don't need to use this anymore) (optional) used if a manager took over a team, delete this line or change to null otherwise
    //   "location": "Brooklyn", // (optional)
         "bio": "The One True Champion of the Realm <br>The Breaker of Brackets<br>Warden of the Waiver<br>The Quiet Storm<br>First of His Name, Last to Panic<br><br>In the age of chaos — where trades were traps and whispers louder than wins — Cris stood alone.<br>Silent. Stubborn. Unbothered.<br><br>He does not trade for attention. He does not speak in schemes.<br>While others plot, he perfects.<br><br>His teams are built on fundamentals, forged with patience, and sharpened with experience.<br>There is no smoke in his strategy — only steel.<br><br>Cris has never chased glory through politics.<br>He believes victory comes not through manipulation, but through mastery.<br><br>His silence is not weakness — it is discipline.<br>His calm is not passivity — it is the stillness before the kill.",
         "photo": "/managers/chris.jpg", // square ratio recommended (no larger than 500x500)
    //   "fantasyStart": 2014, // (optional) when did the manager start playing fantasy football
    //   "favoriteTeam": "nyj", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
    //   "mode": "Win Now", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
         "rival": {
          name: "Rival", // Can be anything (usually your rival's name)
    //     link: 6, // manager array number within this array, or null to link back to all managers page
    //     image: "/managers/rival.jpg", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
         },
    //   "favoritePlayer": 1426, // (optional) this corresponds to the Sleeper player ID (https://api.sleeper.app/v1/players/nfl)
    //   "valuePosition": "WR", // (optional) Favorite position (QB, WR, RB, TE, etc.)
    //   "rookieOrVets": "Rookies", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)
         "philosophy": "I don’t bluff. I don’t bait. I don’t beg.<br>While you scream about collusion and curse the fantasy gods, I’m stacking consistent points.<br><br>I don’t need chaos. I need a clean injury report and a strong RB2.<br>I don’t need to win the chat. I need to win the week.<br><br>When the snow falls, and your team rots... I’ll be standing there, lineup set, sword drawn.<br><br><em> Winter is coming... and your roster won’t survive it</em>", // (optional)
         "tradingScale": 0, // 1 - 10 (optional)
    //   "preferredContact": "Text",  // (optional) 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
    },
  
     {
    //   "roster": 9,  // (DEPRECATED! Don't use this anymore) ID of the roster that the manager manages (look at the order of the power rankings graph)
         "managerID": "1126364926445965312",  // the user's manager ID, go to https://api.sleeper.app/v1/league/<your_league_id>/users to find user IDs (you can use older leagueIDs to find user IDs for managers that are no longer in the league)
         "name": "Joe",
    //   "tookOver": 2020, // (DEPRECATED! You don't need to use this anymore) (optional) used if a manager took over a team, delete this line or change to null otherwise
    //   "location": "Brooklyn", // (optional)
         "bio": "Air horns. Air horns. Air horns. Air horns.<br><br>Joe didn’t ask to join the league. In fact, we’re still not entirely sure he knows he’s in it. <em>Comedy.</em><br><br>But seriously — Joe didn’t want to play. He thought fantasy would ruin football Sundays. The stress. The overthinking. The betrayal of rooting against your own team.<br>And worst of all… the thought of losing to Tim (which happened twice, both times in blowout fashion).<br><br>But temptation won.<br><br>And now? He’s fresh off his rookie season with a 5th place finish, the second-highest lineup IQ in the league, and more roster updates than he’d like to admit.<br><br>He plays it cool. Pretends it’s all beneath him.<br>He doesn’t talk trades. He doesn’t talk trash. Honestly, he barely talks football.<br><br>But those who know, know: Joe is sweating <strong>every</strong> Sunday.<br>He looks like he’s one missed extra point away from leaving the league—<br>and yet somehow... he’s still here, calm on the surface, chasing the championship.",
         "photo": "/managers/joe.jpg", // square ratio recommended (no larger than 500x500)
         "fantasyStart": 2024, // (optional) when did the manager start playing fantasy football
         "favoriteTeam": "tb", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
         "mode": "Win Now", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
         "rival": {
          name: "Rival", // Can be anything (usually your rival's name)
    //     link: 6, // manager array number within this array, or null to link back to all managers page
    //     image: "/managers/rival.jpg", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
         },
         "favoritePlayer": 7605, // (optional) this corresponds to the Sleeper player ID (https://api.sleeper.app/v1/players/nfl)
         "valuePosition": "WR", // (optional) Favorite position (QB, WR, RB, TE, etc.)
         "rookieOrVets": "Rookies", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)
    //   "philosophy": "Your fantasy team's philosophy", // (optional)
         "tradingScale": 1, // 1 - 10 (optional)
         "preferredContact": "Text",  // (optional) 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
    },

      {
    //   "roster": 10,  // (DEPRECATED! Don't use this anymore) ID of the roster that the manager manages (look at the order of the power rankings graph)
         "managerID": "1126366529311850496",  // the user's manager ID, go to https://api.sleeper.app/v1/league/<your_league_id>/users to find user IDs (you can use older leagueIDs to find user IDs for managers that are no longer in the league)
         "name": "Alex",
    //   "tookOver": 2020, // (DEPRECATED! You don't need to use this anymore) (optional) used if a manager took over a team, delete this line or change to null otherwise
    //   "location": "Brooklyn", // (optional)
         "bio": "bio": "In a league of shadows—where rivalries burn deep and whispers cast doubt—Alex stands above it.<br><br>He doesn’t fall for the schemes of the league manipulator (<em>aka Littlefinger</em>).<br>He doesn’t fear the villain.<br>He’s not bound by blood—he’d gladly slay Tim for a shot at the championship.<br><br>He’s here for one reason, and one reason only: <strong>to win.</strong><br>And win… he shall.<br><br>But there is no victory without suffering.<br><br>His first season in <em>The Champion’s Club</em> looked like collapse—a rebuild destined to happen.<br>But then came the trades. The moves. The silence between.<br><br>Now the “rebuild” looks more like a <strong>reload</strong>.<br>He’s not crashing the league. He’s embedding.<br>He’s not winning yet… but you feel him closing in.<br><br>And if you’re not paying attention?<br>You’ll wake up in Week 14 and realize Alex just took your playoff spot.",
    //   "photo": "/managers/name.jpg", // square ratio recommended (no larger than 500x500)
        "fantasyStart": 2014, // (optional) when did the manager start playing fantasy football
        "favoriteTeam": "nyj", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
         "mode": "Win Now", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
         "rival": {
          name: "Rival", // Can be anything (usually your rival's name)
    //     link: 6, // manager array number within this array, or null to link back to all managers page
    //     image: "/managers/rival.jpg", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
        },
         "favoritePlayer": 1426, // (optional) this corresponds to the Sleeper player ID (https://api.sleeper.app/v1/players/nfl)
        "valuePosition": "WR", // (optional) Favorite position (QB, WR, RB, TE, etc.)
        "rookieOrVets": "Rookies", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)
        "philosophy": "<br><em>No loyalty. No alliances. Just wins.</em>", // (optional)
        "tradingScale": 10, // 1 - 10 (optional)
        "preferredContact": "Sleeper",  // (optional) 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
    },
  ]
  
  
  /*   !!  !!  IMPORTANT  !!  !! */
  /*
  Below is the most up to-date version of a manager. Please leave this commented out
  and don't delete it. This will be updated if any fields are added, removed or changed
  and will allow updates without causing merge conflicts
  */
  
    // {
    //   "roster": 3,  // (DEPRECATED! Don't use this anymore) ID of the roster that the manager manages (look at the order of the power rankings graph)
    //   "managerID": "12345678",  // the user's manager ID, go to https://api.sleeper.app/v1/league/<your_league_id>/users to find user IDs (you can use older leagueIDs to find user IDs for managers that are no longer in the league)
    //   "name": "Your Name",
    //   "tookOver": 2020, // (DEPRECATED! You don't need to use this anymore) (optional) used if a manager took over a team, delete this line or change to null otherwise
    //   "location": "Brooklyn", // (optional)
    //   "bio": "Lorem ipsum...",
    //   "photo": "/managers/name.jpg", // square ratio recommended (no larger than 500x500)
    //   "fantasyStart": 2014, // (optional) when did the manager start playing fantasy football
    //   "favoriteTeam": "nyj", // (optional) favorite NFL team, (follows convention: nyj, sea, mia, etc.) MUST BE LOWERCASE
    //   "mode": "Win Now", // (optional) 'Win Now', 'Dynasty', or 'Rebuild' (anything else and you will need to add a new png to /static/ similar to the 'Rebuild.png' and 'Win Now.png' currently in there)
    //   "rival": {
    //     name: "Rival", // Can be anything (usually your rival's name)
    //     link: 6, // manager array number within this array, or null to link back to all managers page
    //     image: "/managers/rival.jpg", // either a specific manager photo or '/managers/everyone.png' or '/managers/question.png'
    //   },
    //   "favoritePlayer": 1426, // (optional) this corresponds to the Sleeper player ID (https://api.sleeper.app/v1/players/nfl)
    //   "valuePosition": "WR", // (optional) Favorite position (QB, WR, RB, TE, etc.)
    //   "rookieOrVets": "Rookies", // (optional) 'Rookies' or 'Vets' (anything else and you will need to add a new png to /static/ similar to the 'Rookies.png' and 'Vets.png' currently in there)
    //   "philosophy": "Your fantasy team's philosophy", // (optional)
    //   "tradingScale": 10, // 1 - 10 (optional)
    //   "preferredContact": "Text",  // (optional) 'Text', 'WhatsApp', 'Sleeper', 'Email', 'Phone', 'Discord', and 'Carrier Pigeon' are currently supplied in the template
    // },
    
