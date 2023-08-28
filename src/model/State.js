const Player = require("./Player")

const PLAYER_1 = Player("tolo", "giavazzi", "pass1111")
const PLAYER_2 = Player("ivan", "aaa", "pass1111")
const PLAYER_3 = Player("fra", "aaa", "pass1111")
const PLAYER_4 = Player("dennis", "aaa", "pass1111")
const PLAYER_5 = Player("ema", "aaa", "pass1111")
const PLAYER_6 = Player("cari", "aaa", "pass1111")
const PLAYER_7 = Player("nico", "aaa", "pass1111")
const PLAYER_8 = Player("davide", "aaa", "pass1111")

const State = () => {
    return {
        clients: new Map(),
        timer: {
            start_value: 15,
            current_value: undefined,   // TODO: this is not used!!!!
            holder: undefined
        },
        players: [PLAYER_1, PLAYER_2, PLAYER_3, PLAYER_4, PLAYER_5, PLAYER_6, PLAYER_7, PLAYER_8],
    }
}

module.exports = State