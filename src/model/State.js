const Player = require("./Player")

const PLAYER_1 = Player("tolo", "gia", "aaa")
const PLAYER_2 = Player("ivan", "sen", "bbb")
const PLAYER_3 = Player("fra", "sky", "ccc")
const PLAYER_4 = Player("dennis", "rea", "ddd")
const PLAYER_5 = Player("ema", "vig", "eee")
const PLAYER_6 = Player("cari", "ich", "fff")
const PLAYER_7 = Player("nico", "rob", "ggg")
const PLAYER_8 = Player("davide", "don", "eee")

const State = () => {
    return {
        clients: new Map(),
        timer: {
            start_value: 15,
            current_value: undefined,
            holder: undefined,
            is_started: false,
        },
        players: [PLAYER_1, PLAYER_2, PLAYER_3, PLAYER_4, PLAYER_5, PLAYER_6, PLAYER_7, PLAYER_8],
    }
}

module.exports = State