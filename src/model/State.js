const Data = require("./Data")
const Game = require("./game/Game")

const State = () => {
    return {
        data: Data(),
        clients: {
            player_vr: {},      // The VR-Client-Player
            player_pr: {},      // The PR-Client-Player
            controller: {},     // The Client-Controller
        },
        gamers: {
            player_vr: {},      // The Player-VR which is playing
            player_pr: {},      // The Player-PR which is playing
            controller: {},     // The Controller which is handling the game
        },
        game: Game(),           // The game info
        requests: new Map()     // A Map of KEY=Request-ID, VALUE=Message  
    }
}

module.exports = State