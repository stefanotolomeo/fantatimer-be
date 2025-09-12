const Player = require("./Player")

const PLAYER_1 = Player("tolo", "giavazzi", "dispiaze")
const PLAYER_2 = Player("ivan-ale", "sentenza", "tantononvinceteuncazzo")
const PLAYER_3 = Player("fra-albi", "skymagic", "dinuovocampioni")
const PLAYER_4 = Player("paco-balbo", "ichiufforta", "ioamostefanodattesi")
const PLAYER_5 = Player("fabri", "fcportici", "troppoforte")
const PLAYER_6 = Player("cari", "lamberteam", "vivairagassi")
const PLAYER_7 = Player("nico", "robbdematt", "anchesimpaticamente")
const PLAYER_8 = Player("davide-bonny", "donandres", "minchiabbonny")

const State = () => {
    return {
        clients: new Map(),
        timer: {
            start_value: 10,
            current_value: undefined,
            holder: undefined,
            is_started: false,
        },
        players: [PLAYER_1, PLAYER_2, PLAYER_3, PLAYER_4, PLAYER_5, PLAYER_6, PLAYER_7, PLAYER_8],
    }
}

module.exports = State