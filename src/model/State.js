const Player = require("./Player")

const PLAYER_1 = Player("tolo", "giavazzi", "dispiace")
const PLAYER_2 = Player("ivan", "sentenza", "paracarri123")
const PLAYER_3 = Player("fra", "skymagic", "haigiavinto")
const PLAYER_4 = Player("dennis", "realsedriano", "fcmilan1")
const PLAYER_5 = Player("ema", "vighignolo", "pupilli")
const PLAYER_6 = Player("cari", "ichiuforta", "lautaro300")
const PLAYER_7 = Player("nico", "robbdematt", "anchesimpaticamente")
const PLAYER_8 = Player("davide", "donandres", "fcmilan2")

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