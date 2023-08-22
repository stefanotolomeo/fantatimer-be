const fs = require("fs");
/*INFO
numbers are in the following format: ATLaa where:
- A: ACTIVITY - 1 digit
- T: TASK - 1 digit
- L: LEVEL - 1 digit
- aa: action - 2 digits
*/

var pois = {};
definePOIs();

// TODO: get from DB
const Data = () => {
  return {
    activities: [
      activityTutorial,
      activityDesensibilizzazione,
      activityTraining,
    ],
    controllers: users("Operatore", 20),
    players: users("Utente", 20),
    eddies: [eddie_1, eddie_2, eddie_3, eddie_4],
    mirini: [mirino_1, mirino_2, mirino_3, mirino_4],
    images: [image_1, image_2, image_3, image_4, image_1, image_4, image_2],
  };
};

const sound_1 = {
  id: 10,
  name: "Annuncio",
  description: "Annuncio cassa",
  src: "annuncio.mp3",
  volume: 0.5, // Range 0 to 1 (step by 0.1)
  isLoop: false,
  isMuted: false,
  isMaxVolume: false,
};

const sound_2 = {
  id: 11,
  name: "Brusio",
  description: "Brusio di sottofondo",
  src: "brusio.mp3",
  volume: 0.5, // Range 0 to 1 (step by 0.1)
  isLoop: false,
  isMuted: false,
  isMaxVolume: false,
};

const sound_3 = {
  id: 12,
  name: "Carrello",
  description: "Carrello che passa",
  src: "carrello.mp3",
  volume: 0.5, // Range 0 to 1 (step by 0.1)
  isLoop: false,
  isMuted: false,
  isMaxVolume: false,
};

// Failure once POI is completed.
const defaultFailure = {
  // IMAGE - The fixed image to be shown as reward
  image_info: {
    src: "eddie/eddie_riprova.png", // Source of the image
    duration: 5000, // Duration (in millis) to be shown
  },
  next_info: {
    // ACTION - It can alternatively:
    // (1) seek into this action (setting next_time), or
    // (2) change action (set next_action_number)
    time: undefined, // Case (1): set to seek internally to this action, otherwise undefined
    action_number: undefined, // Case (2): set to seek externally to this action, otherwise undefined.
  },
};

// Success once POI is completed.
const defaultSuccess = {
  // IMAGE - The fixed image to be shown as reward
  image_info: {
    src: "eddie/eddie_successo.png", // Source of the image
    duration: 5000, // Duration (in millis) to be shown
  },

  next_info: {
    // ACTION - It can alternatively:
    // (1) seek into this action (setting next_time), or
    // (2) change action (set next_action_number)
    time: undefined, // Case (1): set to seek internally to this action, otherwise undefined
    action_number: 2, // Case (2): set to seek externally to this action, otherwise undefined.
  },
};

const defaultPOI = {
  start_time: 5, // N. of seconds from the start of the video (00:00) The range time to which it's needed to check the POI
  end_time: 15, // N. of seconds from the start of the video (00:00)
  focus_time: 3000, // millis, the time to be focused on this POI
  check_frequency: 500, // millis, the frequency at which the player-view must be checked
  background_color: "red", // Like Focus, the World color (omit the field or set undefined to hide - i.e. use "transparent")
  background_opacity: 0.5, // Like Focus, the World opacity  (omit the field or set undefined to use hide - i.e. use 0)
  position: {
    x: -2.56,
    y: 1.6,
    z: -0.2,
  },
  radius: 0.6,
  success: defaultSuccess,
  failure: defaultFailure,
};

function newPOI(config) {
  var defaultConfig = {
    startTime: 0,
    endTime: 10,
    successNextTime: undefined,
    successNextAction: undefined,
    failureNextTime: undefined,
    failureNextAction: undefined,
    radius: 0.5,
    level: 1,
  };

  var cfg = JSON.parse(JSON.stringify(config));
  for (var c in defaultConfig) {
    if (c in config && config[c] !== undefined) {
      cfg[c] = config[c];
    } else {
      cfg[c] = defaultConfig[c];
    }
  }

  if (cfg.level == 1) {
    cfg.backgroundOpacity = 0.85;
  } else if (cfg.level == 2) {
    cfg.backgroundOpacity = 0.6;
  } else if (cfg.level == 3) {
    cfg.backgroundOpacity = 0.35;
  } else if (cfg.level >= 4) {
    cfg.backgroundOpacity = 0;
  }
  //cfg.backgroundOpacity = 0.85; //FOR DEBUG PURPOSES

  var poi = {
    start_time: cfg.startTime, // N. of seconds from the start of the video (00:00) The range time to which it's needed to check the POI
    end_time: cfg.endTime, // N. of seconds from the start of the video (00:00)
    focus_time: 3000, // millis, the time to be focused on this POI
    check_frequency: 500, // millis, the frequency at which the player-view must be checked
    background_color: "black", // Like Focus, the World color (omit the field or set undefined to hide - i.e. use "transparent")
    background_opacity: cfg.backgroundOpacity, // Like Focus, the World opacity  (omit the field or set undefined to use hide - i.e. use 0 for hide and 0.99 for full show)
    position: {
      x: cfg.x,
      y: cfg.y,
      z: cfg.z,
    },
    radius: cfg.radius,
    success: {
      // IMAGE - The fixed image to be shown as reward
      image_info: {
        src: "eddie/eddie_successo.png", // Source of the image
        duration: 2000, // Duration (in millis) to be shown
      },
      next_info: {
        // ACTION - It can alternatively:
        // (1) seek into this action (setting next_time), or
        // (2) change action (set next_action_number)
        time: cfg.successNextTime, // Case (1): set to seek internally to this action, otherwise undefined
        action_number: cfg.successNextAction, // Case (2): set to seek externally to this action, otherwise undefined.
      },
    },
    failure: {
      // IMAGE - The fixed image to be shown as reward
      image_info: {
        src: "eddie/eddie_riprova.png", // Source of the image
        duration: 2000, // Duration (in millis) to be shown
      },
      next_info: {
        // ACTION - It can alternatively:
        // (1) seek into this action (setting next_time), or
        // (2) change action (set next_action_number)
        time: cfg.failureNextTime, // Case (1): set to seek internally to this action, otherwise undefined
        action_number: cfg.failureNextAction, // Case (2): set to seek externally to this action, otherwise undefined.
      },
    },
  };

  return poi;
}

const task_desensibilizzazione_spesa1 = {
  id: 11000,
  number: 1,
  name: "Spesa 1 - banane, biscotti, sapone",
  num_effects: 4,
  description: "Desensibilizzazione con spesa: banane, biscotti, sapone",
  levels: [
    {
      number: 1,
      intro_video:
        "desensibilizzazione/desensibilizzazione_task_level1_action1.mp4",
      actions: [
        {
          number: 11101,
          name: "Ingresso",
          default_volume: 0.2,
          source:
            "desensibilizzazione/desensibilizzazione_task_level1_action1.mp4",
          start_time: 0, // The time (in second) at which the action should start
        },
        {
          number: 11102,
          name: "Lista completa",
          default_volume: 0.2,
          source:
            "desensibilizzazione/desensibilizzazione_task_level1_action1.mp4",
          start_time: 9, // The time (in second) at which the action should start
        },
        {
          number: 11103,
          name: "Scelta corsia",
          default_volume: 0.2,
          source:
            "desensibilizzazione/desensibilizzazione_task_level1_action1.mp4",
          start_time: 14, // The time (in second) at which the action should start
        },
        {
          number: 11104,
          name: "Banane",
          default_volume: 0.2,
          source:
            "desensibilizzazione/desensibilizzazione_task_level1_action1.mp4",
          start_time: 28, // The time (in second) at which the action should start
        },
        {
          number: 11105,
          name: "Lista no banane",
          default_volume: 0.2,
          source:
            "desensibilizzazione/desensibilizzazione_task_level1_action1.mp4",
          start_time: 41, // The time (in second) at which the action should start
        },
        {
          number: 11106,
          name: "Biscotti",
          default_volume: 0.2,
          source:
            "desensibilizzazione/desensibilizzazione_task_level1_action1.mp4",
          start_time: 59, // The time (in second) at which the action should start
        },
        {
          number: 11107,
          name: "Lista no banane e biscotti",
          default_volume: 0.2,
          source:
            "desensibilizzazione/desensibilizzazione_task_level1_action1.mp4",
          start_time: 72, // The time (in second) at which the action should start
        },
        {
          number: 11108,
          name: "Sapone",
          default_volume: 0.2,
          source:
            "desensibilizzazione/desensibilizzazione_task_level1_action1.mp4",
          start_time: 90, // The time (in second) at which the action should start
        },
        {
          number: 11109,
          name: "Cassa",
          default_volume: 0.2,
          source:
            "desensibilizzazione/desensibilizzazione_task_level1_action1.mp4",
          start_time: 104, // The time (in second) at which the action should start
        },
        {
          number: 11110,
          name: "Uscita",
          default_volume: 0.2,
          source:
            "desensibilizzazione/desensibilizzazione_task_level1_action1.mp4",
          start_time: 155, // The time (in second) at which the action should start
        },
      ],
    },
    {
      number: 2,
      intro_video:
        "desensibilizzazione/desensibilizzazione_task_level2_action1.mp4",
      actions: [
        {
          number: 11201,
          name: "Ingresso",
          default_volume: 0.4,
          source:
            "desensibilizzazione/desensibilizzazione_task_level2_action1.mp4",
          start_time: 0, // The time (in second) at which the action should start
        },
        {
          number: 11202,
          name: "Lista completa",
          default_volume: 0.4,
          source:
            "desensibilizzazione/desensibilizzazione_task_level2_action1.mp4",
          start_time: 9, // The time (in second) at which the action should start
        },
        {
          number: 11203,
          name: "Scelta corsia",
          default_volume: 0.4,
          source:
            "desensibilizzazione/desensibilizzazione_task_level2_action1.mp4",
          start_time: 14, // The time (in second) at which the action should start
        },
        {
          number: 11204,
          name: "Banane",
          default_volume: 0.4,
          source:
            "desensibilizzazione/desensibilizzazione_task_level2_action1.mp4",
          start_time: 28, // The time (in second) at which the action should start
        },
        {
          number: 11205,
          name: "Lista no banane",
          default_volume: 0.4,
          source:
            "desensibilizzazione/desensibilizzazione_task_level2_action1.mp4",
          start_time: 41, // The time (in second) at which the action should start
        },
        {
          number: 11206,
          name: "Biscotti",
          default_volume: 0.4,
          source:
            "desensibilizzazione/desensibilizzazione_task_level2_action1.mp4",
          start_time: 59, // The time (in second) at which the action should start
        },
        {
          number: 11207,
          name: "Lista no banane e biscotti",
          default_volume: 0.4,
          source:
            "desensibilizzazione/desensibilizzazione_task_level2_action1.mp4",
          start_time: 72, // The time (in second) at which the action should start
        },
        {
          number: 11208,
          name: "Sapone",
          default_volume: 0.4,
          source:
            "desensibilizzazione/desensibilizzazione_task_level2_action1.mp4",
          start_time: 90, // The time (in second) at which the action should start
        },
        {
          number: 11209,
          name: "Cassa",
          default_volume: 0.4,
          source:
            "desensibilizzazione/desensibilizzazione_task_level2_action1.mp4",
          start_time: 104, // The time (in second) at which the action should start
        },
        {
          number: 11210,
          name: "Uscita",
          default_volume: 0.4,
          source:
            "desensibilizzazione/desensibilizzazione_task_level2_action1.mp4",
          start_time: 155, // The time (in second) at which the action should start
        },
      ],
    },
    {
      number: 3,
      intro_video:
        "desensibilizzazione/desensibilizzazione_task_level3_action1.mp4",
      actions: [
        {
          number: 11301,
          name: "Ingresso",
          default_volume: 0.6,
          source:
            "desensibilizzazione/desensibilizzazione_task_level3_action1.mp4",
          start_time: 0, // The time (in second) at which the action should start
        },
        {
          number: 11302,
          name: "Lista completa",
          default_volume: 0.6,
          source:
            "desensibilizzazione/desensibilizzazione_task_level3_action1.mp4",
          start_time: 9, // The time (in second) at which the action should start
        },
        {
          number: 11303,
          name: "Scelta corsia",
          default_volume: 0.6,
          source:
            "desensibilizzazione/desensibilizzazione_task_level3_action1.mp4",
          start_time: 14, // The time (in second) at which the action should start
        },
        {
          number: 11304,
          name: "Banane",
          default_volume: 0.6,
          source:
            "desensibilizzazione/desensibilizzazione_task_level3_action1.mp4",
          start_time: 28, // The time (in second) at which the action should start
        },
        {
          number: 11305,
          name: "Lista no banane",
          default_volume: 0.6,
          source:
            "desensibilizzazione/desensibilizzazione_task_level3_action1.mp4",
          start_time: 41, // The time (in second) at which the action should start
        },
        {
          number: 11306,
          name: "Biscotti",
          default_volume: 0.6,
          source:
            "desensibilizzazione/desensibilizzazione_task_level3_action1.mp4",
          start_time: 59, // The time (in second) at which the action should start
        },
        {
          number: 11307,
          name: "Lista no banane e biscotti",
          default_volume: 0.6,
          source:
            "desensibilizzazione/desensibilizzazione_task_level3_action1.mp4",
          start_time: 72, // The time (in second) at which the action should start
        },
        {
          number: 11308,
          name: "Sapone",
          default_volume: 0.6,
          source:
            "desensibilizzazione/desensibilizzazione_task_level3_action1.mp4",
          start_time: 90, // The time (in second) at which the action should start
        },
        {
          number: 11309,
          name: "Cassa",
          default_volume: 0.6,
          source:
            "desensibilizzazione/desensibilizzazione_task_level3_action1.mp4",
          start_time: 104, // The time (in second) at which the action should start
        },
        {
          number: 11310,
          name: "Uscita",
          default_volume: 0.6,
          source:
            "desensibilizzazione/desensibilizzazione_task_level3_action1.mp4",
          start_time: 155, // The time (in second) at which the action should start
        },
      ],
    },
    {
      number: 4,
      intro_video:
        "desensibilizzazione/desensibilizzazione_task_level4_action1.mp4",
      actions: [
        {
          number: 11401,
          name: "Ingresso",
          default_volume: 0.8,
          source:
            "desensibilizzazione/desensibilizzazione_task_level4_action1.mp4",
          start_time: 0, // The time (in second) at which the action should start
        },
        {
          number: 11402,
          name: "Lista completa",
          default_volume: 0.8,
          source:
            "desensibilizzazione/desensibilizzazione_task_level4_action1.mp4",
          start_time: 9, // The time (in second) at which the action should start
        },
        {
          number: 11403,
          name: "Scelta corsia",
          default_volume: 0.8,
          source:
            "desensibilizzazione/desensibilizzazione_task_level4_action1.mp4",
          start_time: 14, // The time (in second) at which the action should start
        },
        {
          number: 11404,
          name: "Banane",
          default_volume: 0.8,
          source:
            "desensibilizzazione/desensibilizzazione_task_level4_action1.mp4",
          start_time: 28, // The time (in second) at which the action should start
        },
        {
          number: 11405,
          name: "Lista no banane",
          default_volume: 0.8,
          source:
            "desensibilizzazione/desensibilizzazione_task_level4_action1.mp4",
          start_time: 41, // The time (in second) at which the action should start
        },
        {
          number: 11406,
          name: "Biscotti",
          default_volume: 0.8,
          source:
            "desensibilizzazione/desensibilizzazione_task_level4_action1.mp4",
          start_time: 59, // The time (in second) at which the action should start
        },
        {
          number: 11407,
          name: "Lista no banane e biscotti",
          default_volume: 0.8,
          source:
            "desensibilizzazione/desensibilizzazione_task_level4_action1.mp4",
          start_time: 72, // The time (in second) at which the action should start
        },
        {
          number: 11408,
          name: "Sapone",
          default_volume: 0.8,
          source:
            "desensibilizzazione/desensibilizzazione_task_level4_action1.mp4",
          start_time: 90, // The time (in second) at which the action should start
        },
        {
          number: 11409,
          name: "Cassa",
          default_volume: 0.8,
          source:
            "desensibilizzazione/desensibilizzazione_task_level4_action1.mp4",
          start_time: 104, // The time (in second) at which the action should start
        },
        {
          number: 11410,
          name: "Uscita",
          default_volume: 0.8,
          source:
            "desensibilizzazione/desensibilizzazione_task_level4_action1.mp4",
          start_time: 155, // The time (in second) at which the action should start
        },
      ],
    },
    {
      number: 5,
      intro_video:
        "desensibilizzazione/desensibilizzazione_task_level5_action1.mp4",
      actions: [
        {
          number: 11501,
          name: "Ingresso",
          default_volume: 1,
          source:
            "desensibilizzazione/desensibilizzazione_task_level5_action1.mp4",
          start_time: 0, // The time (in second) at which the action should start
        },
        {
          number: 11502,
          name: "Lista completa",
          default_volume: 1,
          source:
            "desensibilizzazione/desensibilizzazione_task_level5_action1.mp4",
          start_time: 9, // The time (in second) at which the action should start
        },
        {
          number: 11503,
          name: "Scelta corsia",
          default_volume: 1,
          source:
            "desensibilizzazione/desensibilizzazione_task_level5_action1.mp4",
          start_time: 14, // The time (in second) at which the action should start
        },
        {
          number: 11504,
          name: "Banane",
          default_volume: 1,
          source:
            "desensibilizzazione/desensibilizzazione_task_level5_action1.mp4",
          start_time: 28, // The time (in second) at which the action should start
        },
        {
          number: 11505,
          name: "Lista no banane",
          default_volume: 1,
          source:
            "desensibilizzazione/desensibilizzazione_task_level5_action1.mp4",
          start_time: 41, // The time (in second) at which the action should start
        },
        {
          number: 11506,
          name: "Biscotti",
          default_volume: 1,
          source:
            "desensibilizzazione/desensibilizzazione_task_level5_action1.mp4",
          start_time: 59, // The time (in second) at which the action should start
        },
        {
          number: 11507,
          name: "Lista no banane e biscotti",
          default_volume: 1,
          source:
            "desensibilizzazione/desensibilizzazione_task_level5_action1.mp4",
          start_time: 72, // The time (in second) at which the action should start
        },
        {
          number: 11508,
          name: "Sapone",
          default_volume: 1,
          source:
            "desensibilizzazione/desensibilizzazione_task_level5_action1.mp4",
          start_time: 90, // The time (in second) at which the action should start
        },
        {
          number: 11509,
          name: "Cassa",
          default_volume: 1,
          source:
            "desensibilizzazione/desensibilizzazione_task_level5_action1.mp4",
          start_time: 104, // The time (in second) at which the action should start
        },
        {
          number: 11510,
          name: "Uscita",
          default_volume: 1,
          source:
            "desensibilizzazione/desensibilizzazione_task_level5_action1.mp4",
          start_time: 155, // The time (in second) at which the action should start
        },
      ],
    },
  ],
};

const task_desensibilizzazione_spesa2 = {
  id: 12000,
  number: 2,
  name: "Spesa 2 - fragole, torta, spazzolino",
  num_effects: 4,
  description: "Desensibilizzazione con spesa: fragole, torta, spazzolino",
  levels: [
    {
      number: 1,
      intro_video:
        "desensibilizzazione/desensibilizzazione_task_level1_action2.mp4",
      actions: [
        {
          number: 12101,
          name: "Ingresso",
          default_volume: 0.2,
          source:
            "desensibilizzazione/desensibilizzazione_task_level1_action2.mp4",
          start_time: 0, // The time (in second) at which the action should start
        },
        {
          number: 12102,
          name: "Lista completa",
          default_volume: 0.2,
          source:
            "desensibilizzazione/desensibilizzazione_task_level1_action2.mp4",
          start_time: 9, // The time (in second) at which the action should start
        },
        {
          number: 12103,
          name: "Scelta corsia",
          default_volume: 0.2,
          source:
            "desensibilizzazione/desensibilizzazione_task_level1_action2.mp4",
          start_time: 14, // The time (in second) at which the action should start
        },
        {
          number: 12104,
          name: "Fragole",
          default_volume: 0.2,
          source:
            "desensibilizzazione/desensibilizzazione_task_level1_action2.mp4",
          start_time: 28, // The time (in second) at which the action should start
        },
        {
          number: 12105,
          name: "Lista no fragole",
          default_volume: 0.2,
          source:
            "desensibilizzazione/desensibilizzazione_task_level1_action2.mp4",
          start_time: 41, // The time (in second) at which the action should start
        },
        {
          number: 12106,
          name: "Torta",
          default_volume: 0.2,
          source:
            "desensibilizzazione/desensibilizzazione_task_level1_action2.mp4",
          start_time: 59, // The time (in second) at which the action should start
        },
        {
          number: 12107,
          name: "Lista no fragole e torta",
          default_volume: 0.2,
          source:
            "desensibilizzazione/desensibilizzazione_task_level1_action2.mp4",
          start_time: 72, // The time (in second) at which the action should start
        },
        {
          number: 12108,
          name: "Spazzolino",
          default_volume: 0.2,
          source:
            "desensibilizzazione/desensibilizzazione_task_level1_action2.mp4",
          start_time: 90, // The time (in second) at which the action should start
        },
        {
          number: 12109,
          name: "Cassa",
          default_volume: 0.2,
          source:
            "desensibilizzazione/desensibilizzazione_task_level1_action2.mp4",
          start_time: 104, // The time (in second) at which the action should start
        },
        {
          number: 12110,
          name: "Uscita",
          default_volume: 0.2,
          source:
            "desensibilizzazione/desensibilizzazione_task_level1_action2.mp4",
          start_time: 155, // The time (in second) at which the action should start
        },
      ],
    },
    {
      number: 2,
      intro_video:
        "desensibilizzazione/desensibilizzazione_task_level2_action2.mp4",
      actions: [
        {
          number: 12201,
          name: "Ingresso",
          default_volume: 0.4,
          source:
            "desensibilizzazione/desensibilizzazione_task_level2_action2.mp4",
          start_time: 0, // The time (in second) at which the action should start
        },
        {
          number: 12202,
          name: "Lista completa",
          default_volume: 0.4,
          source:
            "desensibilizzazione/desensibilizzazione_task_level2_action2.mp4",
          start_time: 9, // The time (in second) at which the action should start
        },
        {
          number: 12203,
          name: "Scelta corsia",
          default_volume: 0.4,
          source:
            "desensibilizzazione/desensibilizzazione_task_level2_action2.mp4",
          start_time: 14, // The time (in second) at which the action should start
        },
        {
          number: 12204,
          name: "Fragole",
          default_volume: 0.4,
          source:
            "desensibilizzazione/desensibilizzazione_task_level2_action2.mp4",
          start_time: 28, // The time (in second) at which the action should start
        },
        {
          number: 12205,
          name: "Lista no fragole",
          default_volume: 0.4,
          source:
            "desensibilizzazione/desensibilizzazione_task_level2_action2.mp4",
          start_time: 41, // The time (in second) at which the action should start
        },
        {
          number: 12206,
          name: "Torta",
          default_volume: 0.4,
          source:
            "desensibilizzazione/desensibilizzazione_task_level2_action2.mp4",
          start_time: 59, // The time (in second) at which the action should start
        },
        {
          number: 12207,
          name: "Lista no fragole e torta",
          default_volume: 0.4,
          source:
            "desensibilizzazione/desensibilizzazione_task_level2_action2.mp4",
          start_time: 72, // The time (in second) at which the action should start
        },
        {
          number: 12208,
          name: "Spazzolino",
          default_volume: 0.4,
          source:
            "desensibilizzazione/desensibilizzazione_task_level2_action2.mp4",
          start_time: 90, // The time (in second) at which the action should start
        },
        {
          number: 12209,
          name: "Cassa",
          default_volume: 0.4,
          source:
            "desensibilizzazione/desensibilizzazione_task_level2_action2.mp4",
          start_time: 104, // The time (in second) at which the action should start
        },
        {
          number: 12210,
          name: "Uscita",
          default_volume: 0.4,
          source:
            "desensibilizzazione/desensibilizzazione_task_level2_action2.mp4",
          start_time: 155, // The time (in second) at which the action should start
        },
      ],
    },
    {
      number: 3,
      intro_video:
        "desensibilizzazione/desensibilizzazione_task_level3_action2.mp4",
      actions: [
        {
          number: 12301,
          name: "Ingresso",
          default_volume: 0.6,
          source:
            "desensibilizzazione/desensibilizzazione_task_level3_action2.mp4",
          start_time: 0, // The time (in second) at which the action should start
        },
        {
          number: 12302,
          name: "Lista completa",
          default_volume: 0.6,
          source:
            "desensibilizzazione/desensibilizzazione_task_level3_action2.mp4",
          start_time: 9, // The time (in second) at which the action should start
        },
        {
          number: 12303,
          name: "Scelta corsia",
          default_volume: 0.6,
          source:
            "desensibilizzazione/desensibilizzazione_task_level3_action2.mp4",
          start_time: 14, // The time (in second) at which the action should start
        },
        {
          number: 12304,
          name: "Fragole",
          default_volume: 0.6,
          source:
            "desensibilizzazione/desensibilizzazione_task_level3_action2.mp4",
          start_time: 28, // The time (in second) at which the action should start
        },
        {
          number: 12305,
          name: "Lista no fragole",
          default_volume: 0.6,
          source:
            "desensibilizzazione/desensibilizzazione_task_level3_action2.mp4",
          start_time: 41, // The time (in second) at which the action should start
        },
        {
          number: 12306,
          name: "Torta",
          default_volume: 0.6,
          source:
            "desensibilizzazione/desensibilizzazione_task_level3_action2.mp4",
          start_time: 59, // The time (in second) at which the action should start
        },
        {
          number: 12307,
          name: "Lista no fragole e torta",
          default_volume: 0.6,
          source:
            "desensibilizzazione/desensibilizzazione_task_level3_action2.mp4",
          start_time: 72, // The time (in second) at which the action should start
        },
        {
          number: 12308,
          name: "Spazzolino",
          default_volume: 0.6,
          source:
            "desensibilizzazione/desensibilizzazione_task_level3_action2.mp4",
          start_time: 90, // The time (in second) at which the action should start
        },
        {
          number: 12309,
          name: "Cassa",
          default_volume: 0.6,
          source:
            "desensibilizzazione/desensibilizzazione_task_level3_action2.mp4",
          start_time: 104, // The time (in second) at which the action should start
        },
        {
          number: 12310,
          name: "Uscita",
          default_volume: 0.6,
          source:
            "desensibilizzazione/desensibilizzazione_task_level3_action2.mp4",
          start_time: 155, // The time (in second) at which the action should start
        },
      ],
    },
    {
      number: 4,
      intro_video:
        "desensibilizzazione/desensibilizzazione_task_level4_action2.mp4",
      actions: [
        {
          number: 12401,
          name: "Ingresso",
          default_volume: 0.8,
          source:
            "desensibilizzazione/desensibilizzazione_task_level4_action2.mp4",
          start_time: 0, // The time (in second) at which the action should start
        },
        {
          number: 12402,
          name: "Lista completa",
          default_volume: 0.8,
          source:
            "desensibilizzazione/desensibilizzazione_task_level4_action2.mp4",
          start_time: 9, // The time (in second) at which the action should start
        },
        {
          number: 12403,
          name: "Scelta corsia",
          default_volume: 0.8,
          source:
            "desensibilizzazione/desensibilizzazione_task_level4_action2.mp4",
          start_time: 14, // The time (in second) at which the action should start
        },
        {
          number: 12404,
          name: "Fragole",
          default_volume: 0.8,
          source:
            "desensibilizzazione/desensibilizzazione_task_level4_action2.mp4",
          start_time: 28, // The time (in second) at which the action should start
        },
        {
          number: 12405,
          name: "Lista no fragole",
          default_volume: 0.8,
          source:
            "desensibilizzazione/desensibilizzazione_task_level4_action2.mp4",
          start_time: 41, // The time (in second) at which the action should start
        },
        {
          number: 12406,
          name: "Torta",
          default_volume: 0.8,
          source:
            "desensibilizzazione/desensibilizzazione_task_level4_action2.mp4",
          start_time: 59, // The time (in second) at which the action should start
        },
        {
          number: 12407,
          name: "Lista no fragole e torta",
          default_volume: 0.8,
          source:
            "desensibilizzazione/desensibilizzazione_task_level4_action2.mp4",
          start_time: 72, // The time (in second) at which the action should start
        },
        {
          number: 12408,
          name: "Spazzolino",
          default_volume: 0.8,
          source:
            "desensibilizzazione/desensibilizzazione_task_level4_action2.mp4",
          start_time: 90, // The time (in second) at which the action should start
        },
        {
          number: 12409,
          name: "Cassa",
          default_volume: 0.8,
          source:
            "desensibilizzazione/desensibilizzazione_task_level4_action2.mp4",
          start_time: 104, // The time (in second) at which the action should start
        },
        {
          number: 12410,
          name: "Uscita",
          default_volume: 0.8,
          source:
            "desensibilizzazione/desensibilizzazione_task_level4_action2.mp4",
          start_time: 155, // The time (in second) at which the action should start
        },
      ],
    },
    {
      number: 5,
      intro_video:
        "desensibilizzazione/desensibilizzazione_task_level5_action2.mp4",
      actions: [
        {
          number: 12501,
          name: "Ingresso",
          default_volume: 1,
          source:
            "desensibilizzazione/desensibilizzazione_task_level5_action2.mp4",
          start_time: 0, // The time (in second) at which the action should start
        },
        {
          number: 12502,
          name: "Lista completa",
          default_volume: 1,
          source:
            "desensibilizzazione/desensibilizzazione_task_level5_action2.mp4",
          start_time: 9, // The time (in second) at which the action should start
        },
        {
          number: 12503,
          name: "Scelta corsia",
          default_volume: 1,
          source:
            "desensibilizzazione/desensibilizzazione_task_level5_action2.mp4",
          start_time: 14, // The time (in second) at which the action should start
        },
        {
          number: 12504,
          name: "Fragole",
          default_volume: 1,
          source:
            "desensibilizzazione/desensibilizzazione_task_level5_action2.mp4",
          start_time: 28, // The time (in second) at which the action should start
        },
        {
          number: 12505,
          name: "Lista no fragole",
          default_volume: 1,
          source:
            "desensibilizzazione/desensibilizzazione_task_level5_action2.mp4",
          start_time: 41, // The time (in second) at which the action should start
        },
        {
          number: 12506,
          name: "Torta",
          default_volume: 1,
          source:
            "desensibilizzazione/desensibilizzazione_task_level5_action2.mp4",
          start_time: 59, // The time (in second) at which the action should start
        },
        {
          number: 12507,
          name: "Lista no fragole e torta",
          default_volume: 1,
          source:
            "desensibilizzazione/desensibilizzazione_task_level5_action2.mp4",
          start_time: 72, // The time (in second) at which the action should start
        },
        {
          number: 12508,
          name: "Spazzolino",
          default_volume: 1,
          source:
            "desensibilizzazione/desensibilizzazione_task_level5_action2.mp4",
          start_time: 90, // The time (in second) at which the action should start
        },
        {
          number: 12509,
          name: "Cassa",
          default_volume: 1,
          source:
            "desensibilizzazione/desensibilizzazione_task_level5_action2.mp4",
          start_time: 104, // The time (in second) at which the action should start
        },
        {
          number: 12510,
          name: "Uscita",
          default_volume: 1,
          source:
            "desensibilizzazione/desensibilizzazione_task_level5_action2.mp4",
          start_time: 155, // The time (in second) at which the action should start
        },
      ],
    },
  ],
};

const task_desensibilizzazione_spesa3 = {
  id: 13000,
  number: 3,
  name: "Spesa 3 - arance, brioche, dentifricio",
  num_effects: 4,
  description: "Desensibilizzazione con spesa: arance, brioche, dentifricio",
  levels: [
    {
      number: 1,
      intro_video: undefined,
      actions: [
        {
          number: 13101,
          name: "Ingresso",
          default_volume: 0.2,
          source:
            "desensibilizzazione/desensibilizzazione_task_level1_action3.mp4",
          start_time: 0, // The time (in second) at which the action should start
        },
        {
          number: 13102,
          name: "Lista completa",
          default_volume: 0.2,
          source:
            "desensibilizzazione/desensibilizzazione_task_level1_action3.mp4",
          start_time: 9, // The time (in second) at which the action should start
        },
        {
          number: 13103,
          name: "Scelta corsia",
          default_volume: 0.2,
          source:
            "desensibilizzazione/desensibilizzazione_task_level1_action3.mp4",
          start_time: 14, // The time (in second) at which the action should start
        },
        {
          number: 13104,
          name: "Arance",
          default_volume: 0.2,
          source:
            "desensibilizzazione/desensibilizzazione_task_level1_action3.mp4",
          start_time: 28, // The time (in second) at which the action should start
        },
        {
          number: 13105,
          name: "Lista no arance",
          default_volume: 0.2,
          source:
            "desensibilizzazione/desensibilizzazione_task_level1_action3.mp4",
          start_time: 41, // The time (in second) at which the action should start
        },
        {
          number: 13106,
          name: "Brioche",
          default_volume: 0.2,
          source:
            "desensibilizzazione/desensibilizzazione_task_level1_action3.mp4",
          start_time: 59, // The time (in second) at which the action should start
        },
        {
          number: 13107,
          name: "Lista no arance e brioche",
          default_volume: 0.2,
          source:
            "desensibilizzazione/desensibilizzazione_task_level1_action3.mp4",
          start_time: 72, // The time (in second) at which the action should start
        },
        {
          number: 13108,
          name: "Dentifricio",
          default_volume: 0.2,
          source:
            "desensibilizzazione/desensibilizzazione_task_level1_action3.mp4",
          start_time: 90, // The time (in second) at which the action should start
        },
        {
          number: 13109,
          name: "Cassa",
          default_volume: 0.2,
          source:
            "desensibilizzazione/desensibilizzazione_task_level1_action3.mp4",
          start_time: 104, // The time (in second) at which the action should start
        },
        {
          number: 13110,
          name: "Uscita",
          default_volume: 0.2,
          source:
            "desensibilizzazione/desensibilizzazione_task_level1_action3.mp4",
          start_time: 155, // The time (in second) at which the action should start
        },
      ],
    },
    {
      number: 2,
      intro_video: undefined,
      actions: [
        {
          number: 13201,
          name: "Ingresso",
          default_volume: 0.4,
          source:
            "desensibilizzazione/desensibilizzazione_task_level2_action3.mp4",
          start_time: 0, // The time (in second) at which the action should start
        },
        {
          number: 13202,
          name: "Lista completa",
          default_volume: 0.4,
          source:
            "desensibilizzazione/desensibilizzazione_task_level2_action3.mp4",
          start_time: 9, // The time (in second) at which the action should start
        },
        {
          number: 13203,
          name: "Scelta corsia",
          default_volume: 0.4,
          source:
            "desensibilizzazione/desensibilizzazione_task_level2_action3.mp4",
          start_time: 14, // The time (in second) at which the action should start
        },
        {
          number: 13204,
          name: "Arance",
          default_volume: 0.4,
          source:
            "desensibilizzazione/desensibilizzazione_task_level2_action3.mp4",
          start_time: 28, // The time (in second) at which the action should start
        },
        {
          number: 13205,
          name: "Lista no arance",
          default_volume: 0.4,
          source:
            "desensibilizzazione/desensibilizzazione_task_level2_action3.mp4",
          start_time: 41, // The time (in second) at which the action should start
        },
        {
          number: 13206,
          name: "Brioche",
          default_volume: 0.4,
          source:
            "desensibilizzazione/desensibilizzazione_task_level2_action3.mp4",
          start_time: 59, // The time (in second) at which the action should start
        },
        {
          number: 13207,
          name: "Lista no arance e brioche",
          default_volume: 0.4,
          source:
            "desensibilizzazione/desensibilizzazione_task_level2_action3.mp4",
          start_time: 72, // The time (in second) at which the action should start
        },
        {
          number: 13208,
          name: "Dentifricio",
          default_volume: 0.4,
          source:
            "desensibilizzazione/desensibilizzazione_task_level2_action3.mp4",
          start_time: 90, // The time (in second) at which the action should start
        },
        {
          number: 13209,
          name: "Cassa",
          default_volume: 0.4,
          source:
            "desensibilizzazione/desensibilizzazione_task_level2_action3.mp4",
          start_time: 104, // The time (in second) at which the action should start
        },
        {
          number: 13210,
          name: "Uscita",
          default_volume: 0.4,
          source:
            "desensibilizzazione/desensibilizzazione_task_level2_action3.mp4",
          start_time: 155, // The time (in second) at which the action should start
        },
      ],
    },
    {
      number: 3,
      intro_video: undefined,
      actions: [
        {
          number: 13301,
          name: "Ingresso",
          default_volume: 0.6,
          source:
            "desensibilizzazione/desensibilizzazione_task_level3_action3.mp4",
          start_time: 0, // The time (in second) at which the action should start
        },
        {
          number: 13302,
          name: "Lista completa",
          default_volume: 0.6,
          source:
            "desensibilizzazione/desensibilizzazione_task_level3_action3.mp4",
          start_time: 9, // The time (in second) at which the action should start
        },
        {
          number: 13303,
          name: "Scelta corsia",
          default_volume: 0.6,
          source:
            "desensibilizzazione/desensibilizzazione_task_level3_action3.mp4",
          start_time: 14, // The time (in second) at which the action should start
        },
        {
          number: 13304,
          name: "Arance",
          default_volume: 0.6,
          source:
            "desensibilizzazione/desensibilizzazione_task_level3_action3.mp4",
          start_time: 28, // The time (in second) at which the action should start
        },
        {
          number: 13305,
          name: "Lista no arance",
          default_volume: 0.6,
          source:
            "desensibilizzazione/desensibilizzazione_task_level3_action3.mp4",
          start_time: 41, // The time (in second) at which the action should start
        },
        {
          number: 13306,
          name: "Brioche",
          default_volume: 0.6,
          source:
            "desensibilizzazione/desensibilizzazione_task_level3_action3.mp4",
          start_time: 59, // The time (in second) at which the action should start
        },
        {
          number: 13307,
          name: "Lista no arance e brioche",
          default_volume: 0.6,
          source:
            "desensibilizzazione/desensibilizzazione_task_level3_action3.mp4",
          start_time: 72, // The time (in second) at which the action should start
        },
        {
          number: 13308,
          name: "Dentifricio",
          default_volume: 0.6,
          source:
            "desensibilizzazione/desensibilizzazione_task_level3_action3.mp4",
          start_time: 90, // The time (in second) at which the action should start
        },
        {
          number: 13309,
          name: "Cassa",
          default_volume: 0.6,
          source:
            "desensibilizzazione/desensibilizzazione_task_level3_action3.mp4",
          start_time: 104, // The time (in second) at which the action should start
        },
        {
          number: 13310,
          name: "Uscita",
          default_volume: 0.6,
          source:
            "desensibilizzazione/desensibilizzazione_task_level3_action3.mp4",
          start_time: 155, // The time (in second) at which the action should start
        },
      ],
    },
    {
      number: 4,
      intro_video: undefined,
      actions: [
        {
          number: 13401,
          name: "Ingresso",
          default_volume: 0.8,
          source:
            "desensibilizzazione/desensibilizzazione_task_level4_action3.mp4",
          start_time: 0, // The time (in second) at which the action should start
        },
        {
          number: 13402,
          name: "Lista completa",
          default_volume: 0.8,
          source:
            "desensibilizzazione/desensibilizzazione_task_level4_action3.mp4",
          start_time: 9, // The time (in second) at which the action should start
        },
        {
          number: 13403,
          name: "Scelta corsia",
          default_volume: 0.8,
          source:
            "desensibilizzazione/desensibilizzazione_task_level4_action3.mp4",
          start_time: 14, // The time (in second) at which the action should start
        },
        {
          number: 13404,
          name: "Arance",
          default_volume: 0.8,
          source:
            "desensibilizzazione/desensibilizzazione_task_level4_action3.mp4",
          start_time: 28, // The time (in second) at which the action should start
        },
        {
          number: 13405,
          name: "Lista no arance",
          default_volume: 0.8,
          source:
            "desensibilizzazione/desensibilizzazione_task_level4_action3.mp4",
          start_time: 41, // The time (in second) at which the action should start
        },
        {
          number: 13406,
          name: "Brioche",
          default_volume: 0.8,
          source:
            "desensibilizzazione/desensibilizzazione_task_level4_action3.mp4",
          start_time: 59, // The time (in second) at which the action should start
        },
        {
          number: 13407,
          name: "Lista no arance e brioche",
          default_volume: 0.8,
          source:
            "desensibilizzazione/desensibilizzazione_task_level4_action3.mp4",
          start_time: 72, // The time (in second) at which the action should start
        },
        {
          number: 13408,
          name: "Dentifricio",
          default_volume: 0.8,
          source:
            "desensibilizzazione/desensibilizzazione_task_level4_action3.mp4",
          start_time: 90, // The time (in second) at which the action should start
        },
        {
          number: 13409,
          name: "Cassa",
          default_volume: 0.8,
          source:
            "desensibilizzazione/desensibilizzazione_task_level4_action3.mp4",
          start_time: 104, // The time (in second) at which the action should start
        },
        {
          number: 13410,
          name: "Uscita",
          default_volume: 0.8,
          source:
            "desensibilizzazione/desensibilizzazione_task_level4_action3.mp4",
          start_time: 155, // The time (in second) at which the action should start
        },
      ],
    },
    {
      number: 5,
      intro_video: undefined,
      actions: [
        {
          number: 13501,
          name: "Ingresso",
          default_volume: 1,
          source:
            "desensibilizzazione/desensibilizzazione_task_level5_action3.mp4",
          start_time: 0, // The time (in second) at which the action should start
        },
        {
          number: 13502,
          name: "Lista completa",
          default_volume: 1,
          source:
            "desensibilizzazione/desensibilizzazione_task_level5_action3.mp4",
          start_time: 9, // The time (in second) at which the action should start
        },
        {
          number: 13503,
          name: "Scelta corsia",
          default_volume: 1,
          source:
            "desensibilizzazione/desensibilizzazione_task_level5_action3.mp4",
          start_time: 14, // The time (in second) at which the action should start
        },
        {
          number: 13504,
          name: "Arance",
          default_volume: 1,
          source:
            "desensibilizzazione/desensibilizzazione_task_level5_action3.mp4",
          start_time: 28, // The time (in second) at which the action should start
        },
        {
          number: 13505,
          name: "Lista no arance",
          default_volume: 1,
          source:
            "desensibilizzazione/desensibilizzazione_task_level5_action3.mp4",
          start_time: 41, // The time (in second) at which the action should start
        },
        {
          number: 13506,
          name: "Brioche",
          default_volume: 1,
          source:
            "desensibilizzazione/desensibilizzazione_task_level5_action3.mp4",
          start_time: 59, // The time (in second) at which the action should start
        },
        {
          number: 13507,
          name: "Lista no arance e brioche",
          default_volume: 1,
          source:
            "desensibilizzazione/desensibilizzazione_task_level5_action3.mp4",
          start_time: 72, // The time (in second) at which the action should start
        },
        {
          number: 13508,
          name: "Dentifricio",
          default_volume: 1,
          source:
            "desensibilizzazione/desensibilizzazione_task_level5_action3.mp4",
          start_time: 90, // The time (in second) at which the action should start
        },
        {
          number: 13509,
          name: "Cassa",
          default_volume: 1,
          source:
            "desensibilizzazione/desensibilizzazione_task_level5_action3.mp4",
          start_time: 104, // The time (in second) at which the action should start
        },
        {
          number: 13510,
          name: "Uscita",
          default_volume: 1,
          source:
            "desensibilizzazione/desensibilizzazione_task_level5_action3.mp4",
          start_time: 155, // The time (in second) at which the action should start
        },
      ],
    },
  ],
};

const activityDesensibilizzazione = {
  id: 1,
  name: "Desensibilizzazione",
  level: 2,
  description: "Desensibilizzazione uditiva attraverso l’esposizione in vr.",
  image: "preview_desensibilization.png",
  tasks: [
    task_desensibilizzazione_spesa1,
    task_desensibilizzazione_spesa2,
    task_desensibilizzazione_spesa3,
  ],
  sounds: [sound_1, sound_2, sound_3],
};

const task_training_1_ingresso = {
  id: 1,
  number: 1,
  name: "Ingresso",
  num_effects: 4,
  description: "Ingresso del supermercato",
  levels: [
    {
      number: 1,
      intro_video: undefined,
      actions: [
        {
          number: 1,
          name: "Fuori dal supermercato",
          source: "training/training_task1_level1_2_3_action1.mp4",
          start_time: 0,
          poi: newPOI({
            x: -2.56,
            y: 1.6,
            z: -0.2,
            startTime: 1,
            endTime: 11,
            successNextTime: 43,
            successNextAction: 2,
            DELETED_failureNextTime: 0,
            DELETED_failureNextAction: 1,
            level: 1,
          }),
        },
        {
          number: 2,
          name: "Verso l'ingresso",
          source: "training/training_task1_level1_2_3_action1.mp4",
          start_time: 44,
        },
      ],
    },
    {
      number: 2,
      intro_video: undefined,
      actions: [
        {
          number: 1,
          name: "Fuori dal supermercato",
          source: "training/training_task1_level1_2_3_action1.mp4",
          start_time: 0,
          poi: newPOI({
            x: -2.56,
            y: 1.6,
            z: -0.2,
            startTime: 1,
            endTime: 11,
            successNextTime: 43,
            successNextAction: 2,
            DELETED_failureNextTime: 0,
            DELETED_failureNextAction: 1,
            level: 2,
          }),
        },
        {
          number: 2,
          name: "Verso l'ingresso",
          source: "training/training_task1_level1_2_3_action1.mp4",
          start_time: 44,
        },
      ],
    },
    {
      number: 3,
      intro_video: undefined,
      actions: [
        {
          number: 1,
          name: "Fuori dal supermercato",
          source: "training/training_task1_level1_2_3_action1.mp4",
          start_time: 0,
          poi: newPOI({
            x: -2.56,
            y: 1.6,
            z: -0.2,
            startTime: 1,
            endTime: 11,
            successNextTime: 43,
            successNextAction: 2,
            DELETED_failureNextTime: 0,
            DELETED_failureNextAction: 1,
            level: 3,
          }),
        },
        {
          number: 2,
          name: "Verso l'ingresso",
          source: "training/training_task1_level1_2_3_action1.mp4",
          start_time: 44,
        },
      ],
    },
    {
      number: 4,
      intro_video: undefined,
      actions: [
        {
          number: 1,
          name: "Fuori dal supermercato",
          source: "training/training_task1_level4_5_action1.mp4",
          start_time: 0,
          poi: newPOI({
            x: -2.56,
            y: 1.6,
            z: -0.2,
            startTime: 1,
            endTime: 11,
            successNextTime: 43,
            successNextAction: 2,
            DELETED_failureNextTime: 0,
            DELETED_failureNextAction: 1,
            level: 4,
          }),
        },
        {
          number: 2,
          name: "Verso l'ingresso",
          source: "training/training_task1_level4_5_action1.mp4",
          start_time: 44,
        },
      ],
    },
    {
      number: 5,
      intro_video: undefined,
      actions: [
        {
          number: 1,
          name: "Fuori dal supermercato",
          source: "training/training_task1_level4_5_action1.mp4",
          start_time: 0,
          poi: newPOI({
            x: -2.56,
            y: 1.6,
            z: -0.2,
            startTime: 1,
            endTime: 11,
            successNextTime: 43,
            successNextAction: 2,
            DELETED_failureNextTime: 0,
            DELETED_failureNextAction: 1,
            level: 5,
          }),
        },
        {
          number: 2,
          name: "Verso l'ingresso",
          source: "training/training_task1_level4_5_action1.mp4",
          start_time: 44,
        },
      ],
    },
  ],
};

const task_training_2_lista1 = {
  id: 2,
  number: 2,
  name: "Lista 1 (banane, biscotti e sapone)",
  num_effects: 4,
  description: "Lista, scelta corsie e prodotti, cassa e uscita",
  levels: [
    task_training_2_lista1_levelGenerator(1),
    task_training_2_lista1_levelGenerator(2),
    task_training_2_lista1_levelGenerator(3),
    task_training_2_lista1_levelGenerator(4),
    task_training_2_lista1_levelGenerator(5),
  ],
};

function task_training_2_lista1_levelGenerator(level) {
  var result = {
    number: level,
    actions: [
      {
        number: 1,
        name: "Lista 1 completa",
        source: "training/training_task2_level1_2_3_4_5_action1.mp4",
        start_time: 0,
        end_time: 60,
      },
      {
        number: 2,
        name: "Corsie (corsia 1)",
        source: "training/training_task2_level" + level + "_action4.mp4",
        start_time: 0,
        poi: newPOI({
          x: -0.4590054025456811,
          y: 2.5369742734530156,
          z: 1.5319472754889836,
          startTime: 0,
          endTime: 10,
          successNextTime: undefined,
          successNextAction: 3,
          DELETED_failureNextTime: 0,
          DELETED_failureNextAction: 2,
          level: level,
        }),
      },
      {
        number: 3,
        name: "Zoom Corsia 1",
        source: "training/training_task2_level1_2_3_4_5_action7.mp4",
        start_time: 0,
      },
      {
        number: 4,
        name: "Trova Banane",
        source: "training/training_task3_level" + level + "_action1.mp4",
        start_time: 64,
        end_time: 120,
        poi: newPOI({
          x: getPOI(level, 2, 4, "x"),
          y: getPOI(level, 2, 4, "y"),
          z: getPOI(level, 2, 4, "z"),
          startTime: 64,
          endTime: 74,
          successNextTime: 120,
          successNextAction: 5,
          DELETED_failureNextTime: 64,
          DELETED_failureNextAction: 4,
          level: level,
        }),
      },
      {
        number: 5,
        name: "Banane nel carrello",
        source: "training/training_task3_level" + level + "_action1.mp4",
        start_time: 120,
      },
      {
        number: 6,
        name: "Lista no banane",
        source: "training/training_task3_level" + level + "_action6.mp4",
        start_time: 0,
        end_time: 60,
      },
      {
        number: 7,
        name: "Corsie (corsia 2)",
        source: "training/training_task2_level" + level + "_action5.mp4",
        start_time: 0,
        poi: newPOI({
          x: -1.275073149800262,
          y: 2.715295847878345,
          z: -0.0017194705713835302,
          startTime: 0,
          endTime: 10,
          successNextTime: undefined,
          successNextAction: 8,
          DELETED_failureNextTime: 0,
          DELETED_failureNextAction: 7,
          level: level,
        }),
      },
      {
        number: 8,
        name: "Zoom Corsia 2",
        source: "training/training_task2_level1_2_3_4_5_action8.mp4",
        start_time: 0,
      },
      {
        number: 9,
        name: "Trova Biscotti",
        source: "training/training_task3_level" + level + "_action6.mp4",
        start_time: 64,
        end_time: 120,
        poi: newPOI({
          x: getPOI(level, 2, 9, "x"),
          y: getPOI(level, 2, 9, "y"),
          z: getPOI(level, 2, 9, "z"),
          startTime: 64,
          endTime: 74,
          successNextTime: 120,
          successNextAction: 10,
          DELETED_failureNextTime: 64,
          DELETED_failureNextAction: 9,
          level: level,
        }),
      },
      {
        number: 10,
        name: "Biscotti nel carrello",
        source: "training/training_task3_level" + level + "_action6.mp4",
        start_time: 120,
      },
      {
        number: 11,
        name: "Lista no banane e biscotti",
        source: "training/training_task3_level" + level + "_action9.mp4",
        start_time: 0,
        end_time: 60,
      },
      {
        number: 12,
        name: "Corsie (corsia 3)",
        source: "training/training_task2_level" + level + "_action6.mp4",
        start_time: 0,
        poi: newPOI({
          x: -0.5111636382987969,
          y: 2.5696524615019807,
          z: -1.4591115386805569,
          startTime: 0,
          endTime: 10,
          successNextTime: undefined,
          successNextAction: 13,
          DELETED_failureNextTime: 0,
          DELETED_failureNextAction: 12,
          level: level,
        }),
      },
      {
        number: 13,
        name: "Zoom Corsia 3",
        source: "training/training_task2_level1_2_3_4_5_action9.mp4",
        start_time: 0,
      },
      {
        number: 14,
        name: "Trova Sapone",
        source: "training/training_task3_level" + level + "_action9.mp4",
        start_time: 64,
        end_time: 120,
        poi: newPOI({
          x: getPOI(level, 2, 14, "x"),
          y: getPOI(level, 2, 14, "y"),
          z: getPOI(level, 2, 14, "z"),
          startTime: 64,
          endTime: 74,
          successNextTime: 120,
          successNextAction: 15,
          DELETED_failureNextTime: 64,
          DELETED_failureNextAction: 14,
          level: level,
        }),
      },
      {
        number: 15,
        name: "Sapone nel Carrello",
        source: "training/training_task3_level" + level + "_action9.mp4",
        start_time: 120,
      },
    ],
  };

  var exit = [];

  if (level <= 3) {
    exit = [
      {
        number: 16,
        name: "Cassa",
        source: "training/training_task4_level1_2_3_action3.mp4",
        start_time: 0,
        end_time: 30,
      },
      {
        number: 17,
        name: "Guarda l'uscita",
        source: "training/training_task4_level1_2_3_action3.mp4",
        start_time: 34,
        end_time: 80,
        poi: newPOI({
          x: -2.5540690752500006,
          y: 1.5231551164486459,
          z: -0.3714169371649222,
          startTime: 35,
          endTime: 80,
          successNextTime: 83,
          successNextAction: 18,
          DELETED_failureNextTime: 40,
          DELETED_failureNextAction: 17,
          level: level,
        }),
      },
      {
        number: 18,
        name: "Esci",
        source: "training/training_task4_level1_2_3_action3.mp4",
        start_time: 85,
      },
    ];
  } else {
    exit = [
      {
        number: 16,
        name: "Cassa",
        source: "training/training_task4_level4_5_action3.mp4",
        start_time: 0,
        end_time: 30,
      },
      {
        number: 17,
        name: "Uscita",
        source: "training/training_task4_level4_5_action3.mp4",
        start_time: 34,
        end_time: 80,
        poi: newPOI({
          x: -2.5540690752500006,
          y: 1.5231551164486459,
          z: -0.3714169371649222,
          startTime: 35,
          endTime: 80,
          successNextTime: 83,
          successNextAction: 18,
          DELETED_failureNextTime: 40,
          DELETED_failureNextAction: 17,
          level: level,
        }),
      },
      {
        number: 18,
        name: "Esci",
        source: "training/training_task4_level4_5_action3.mp4",
        start_time: 85,
      },
    ];
  }

  for (var action of exit) {
    result.actions.push(action);
  }

  return result;
}

const task_training_3_lista2 = {
  id: 3,
  number: 3,
  name: "Lista 2 (arance, brioches, dentifricio)",
  num_effects: 4,
  description: "Lista, scelta corsie e prodotti, cassa e uscita",
  levels: [
    task_training_3_lista2_levelGenerator(1),
    task_training_3_lista2_levelGenerator(2),
    task_training_3_lista2_levelGenerator(3),
    task_training_3_lista2_levelGenerator(4),
    task_training_3_lista2_levelGenerator(5),
  ],
};

function task_training_3_lista2_levelGenerator(level) {
  var result = {
    number: level,
    actions: [
      {
        number: 1,
        name: "Lista 3 completa",
        source: "training/training_task2_level1_2_3_4_5_action3.mp4",
        start_time: 0,
        end_time: 60,
      },
      {
        number: 2,
        name: "Corsie (corsia 1)",
        source: "training/training_task2_level" + level + "_action4.mp4",
        start_time: 0,
        poi: newPOI({
          x: -0.4590054025456811,
          y: 2.5369742734530156,
          z: 1.5319472754889836,
          startTime: 0,
          endTime: 10,
          successNextTime: undefined,
          successNextAction: 3,
          DELETED_failureNextTime: 0,
          DELETED_failureNextAction: 2,
          level: level,
        }),
      },
      {
        number: 3,
        name: "Zoom Corsia 1",
        source: "training/training_task2_level1_2_3_4_5_action7.mp4",
        start_time: 0,
      },
      {
        number: 4,
        name: "Trova Arance",
        source: "training/training_task3_level" + level + "_action2.mp4",
        start_time: 64,
        end_time: 120,
        poi: newPOI({
          x: getPOI(level, 3, 4, "x"),
          y: getPOI(level, 3, 4, "y"),
          z: getPOI(level, 3, 4, "z"),
          startTime: 64,
          endTime: 74,
          successNextTime: 120,
          successNextAction: 5,
          DELETED_failureNextTime: 64,
          DELETED_failureNextAction: 4,
          level: level,
        }),
      },
      {
        number: 5,
        name: "Arance nel carrello",
        source: "training/training_task3_level" + level + "_action2.mp4",
        start_time: 120,
      },
      {
        number: 6,
        name: "Lista no arance",
        source: "training/training_task3_level" + level + "_action7.mp4",
        start_time: 0,
        end_time: 60,
      },
      {
        number: 7,
        name: "Corsie (corsia 2)",
        source: "training/training_task2_level" + level + "_action5.mp4",
        start_time: 0,
        poi: newPOI({
          x: -1.275073149800262,
          y: 2.715295847878345,
          z: -0.0017194705713835302,
          startTime: 0,
          endTime: 10,
          successNextTime: undefined,
          successNextAction: 8,
          DELETED_failureNextTime: 0,
          DELETED_failureNextAction: 7,
          level: level,
        }),
      },
      {
        number: 8,
        name: "Zoom Corsia 2",
        source: "training/training_task2_level1_2_3_4_5_action8.mp4",
        start_time: 0,
      },
      {
        number: 9,
        name: "Trova Brioches",
        source: "training/training_task3_level" + level + "_action7.mp4",
        start_time: 64,
        end_time: 120,
        poi: newPOI({
          x: getPOI(level, 3, 9, "x"),
          y: getPOI(level, 3, 9, "y"),
          z: getPOI(level, 3, 9, "z"),
          startTime: 64,
          endTime: 74,
          successNextTime: 120,
          successNextAction: 10,
          DELETED_failureNextTime: 64,
          DELETED_failureNextAction: 9,
          level: level,
        }),
      },
      {
        number: 10,
        name: "Brioches nel carrello",
        source: "training/training_task3_level" + level + "_action7.mp4",
        start_time: 120,
      },
      {
        number: 11,
        name: "Lista no arance e brioches",
        source: "training/training_task3_level" + level + "_action10.mp4",
        start_time: 0,
        end_time: 60,
      },
      {
        number: 12,
        name: "Corsie (corsia 3)",
        source: "training/training_task2_level" + level + "_action6.mp4",
        start_time: 0,
        poi: newPOI({
          x: -0.5111636382987969,
          y: 2.5696524615019807,
          z: -1.4591115386805569,
          startTime: 0,
          endTime: 10,
          successNextTime: undefined,
          successNextAction: 13,
          DELETED_failureNextTime: 0,
          DELETED_failureNextAction: 12,
          level: level,
        }),
      },
      {
        number: 13,
        name: "Zoom Corsia 3",
        source: "training/training_task2_level1_2_3_4_5_action9.mp4",
        start_time: 0,
      },
      {
        number: 14,
        name: "Trova Dentifricio",
        source: "training/training_task3_level" + level + "_action10.mp4",
        start_time: 64,
        end_time: 120,
        poi: newPOI({
          x: getPOI(level, 3, 14, "x"),
          y: getPOI(level, 3, 14, "y"),
          z: getPOI(level, 3, 14, "z"),
          startTime: 64,
          endTime: 74,
          successNextTime: 120,
          successNextAction: 15,
          DELETED_failureNextTime: 64,
          DELETED_failureNextAction: 14,
          level: level,
        }),
      },
      {
        number: 15,
        name: "Dentifricio nel Carrello",
        source: "training/training_task3_level" + level + "_action10.mp4",
        start_time: 120,
      },
    ],
  };

  var exit = [];

  if (level <= 3) {
    exit = [
      {
        number: 16,
        name: "Cassa",
        source: "training/training_task4_level1_2_3_action1.mp4",
        start_time: 0,
        end_time: 30,
      },
      {
        number: 17,
        name: "Uscita",
        source: "training/training_task4_level1_2_3_action1.mp4",
        start_time: 34,
        end_time: 80,
        poi: newPOI({
          x: -2.5540690752500006,
          y: 1.5231551164486459,
          z: -0.3714169371649222,
          startTime: 35,
          endTime: 80,
          successNextTime: 83,
          successNextAction: 18,
          DELETED_failureNextTime: 40,
          DELETED_failureNextAction: 17,
          level: level,
        }),
      },
      {
        number: 18,
        name: "Esci",
        source: "training/training_task4_level1_2_3_action1.mp4",
        start_time: 85,
      },
    ];
  } else {
    exit = [
      {
        number: 16,
        name: "Cassa",
        source: "training/training_task4_level4_5_action1.mp4",
        start_time: 0,
        end_time: 30,
      },
      {
        number: 17,
        name: "Uscita",
        source: "training/training_task4_level4_5_action1.mp4",
        start_time: 34,
        end_time: 80,
        poi: newPOI({
          x: -2.5540690752500006,
          y: 1.5231551164486459,
          z: -0.3714169371649222,
          startTime: 35,
          endTime: 80,
          successNextTime: 83,
          successNextAction: 18,
          DELETED_failureNextTime: 40,
          DELETED_failureNextAction: 17,
          level: level,
        }),
      },
      {
        number: 18,
        name: "Esci",
        source: "training/training_task4_level4_5_action1.mp4",
        start_time: 85,
      },
    ];
  }

  for (var action of exit) {
    result.actions.push(action);
  }

  return result;
}

const task_training_4_lista3 = {
  id: 4,
  number: 4,
  name: "Lista 3 (fragole, torta, spazzolino)",
  num_effects: 4,
  description: "Lista, scelta corsie e prodotti, cassa e uscita",
  levels: [
    task_training_4_lista3_levelGenerator(1),
    task_training_4_lista3_levelGenerator(2),
    task_training_4_lista3_levelGenerator(3),
    task_training_4_lista3_levelGenerator(4),
    task_training_4_lista3_levelGenerator(5),
  ],
};

function task_training_4_lista3_levelGenerator(level) {
  var result = {
    number: level,
    actions: [
      {
        number: 1,
        name: "Lista 3 completa",
        source: "training/training_task2_level1_2_3_4_5_action2.mp4",
        start_time: 0,
        end_time: 60,
      },
      {
        number: 2,
        name: "Corsie (corsia 1)",
        source: "training/training_task2_level" + level + "_action4.mp4",
        start_time: 0,
        poi: newPOI({
          x: -0.4590054025456811,
          y: 2.5369742734530156,
          z: 1.5319472754889836,
          startTime: 0,
          endTime: 10,
          successNextTime: undefined,
          successNextAction: 3,
          DELETED_failureNextTime: 0,
          DELETED_failureNextAction: 2,
          level: level,
        }),
      },
      {
        number: 3,
        name: "Zoom Corsia 1",
        source: "training/training_task2_level1_2_3_4_5_action7.mp4",
        start_time: 0,
      },
      {
        number: 4,
        name: "Trova Fragole",
        source: "training/training_task3_level" + level + "_action3.mp4",
        start_time: 64,
        end_time: 120,
        poi: newPOI({
          x: getPOI(level, 4, 4, "x"),
          y: getPOI(level, 4, 4, "y"),
          z: getPOI(level, 4, 4, "z"),
          startTime: 64,
          endTime: 74,
          successNextTime: 120,
          successNextAction: 5,
          DELETED_failureNextTime: 64,
          DELETED_failureNextAction: 4,
          level: level,
        }),
      },
      {
        number: 5,
        name: "Fragole nel carrello",
        source: "training/training_task3_level" + level + "_action3.mp4",
        start_time: 120,
      },
      {
        number: 6,
        name: "Lista no fragole",
        source: "training/training_task3_level" + level + "_action8.mp4",
        start_time: 0,
        end_time: 60,
      },
      {
        number: 7,
        name: "Corsie (corsia 2)",
        source: "training/training_task2_level" + level + "_action5.mp4",
        start_time: 0,
        poi: newPOI({
          x: -1.275073149800262,
          y: 2.715295847878345,
          z: -0.0017194705713835302,
          startTime: 0,
          endTime: 10,
          successNextTime: undefined,
          successNextAction: 8,
          DELETED_failureNextTime: 0,
          DELETED_failureNextAction: 7,
          level: level,
        }),
      },
      {
        number: 8,
        name: "Zoom Corsia 2",
        source: "training/training_task2_level1_2_3_4_5_action8.mp4",
        start_time: 0,
      },
      {
        number: 9,
        name: "Trova Torta",
        source: "training/training_task3_level" + level + "_action8.mp4",
        start_time: 64,
        end_time: 120,
        poi: newPOI({
          x: getPOI(level, 4, 9, "x"),
          y: getPOI(level, 4, 9, "y"),
          z: getPOI(level, 4, 9, "z"),
          startTime: 64,
          endTime: 74,
          successNextTime: 120,
          successNextAction: 10,
          DELETED_failureNextTime: 64,
          DELETED_failureNextAction: 9,
          level: level,
        }),
      },
      {
        number: 10,
        name: "Torta nel carrello",
        source: "training/training_task3_level" + level + "_action8.mp4",
        start_time: 120,
      },
      {
        number: 11,
        name: "Lista no fragole e torta",
        source: "training/training_task3_level" + level + "_action11.mp4",
        start_time: 0,
        end_time: 60,
      },
      {
        number: 12,
        name: "Corsie (corsia 3)",
        source: "training/training_task2_level" + level + "_action6.mp4",
        start_time: 0,
        poi: newPOI({
          x: -0.5111636382987969,
          y: 2.5696524615019807,
          z: -1.4591115386805569,
          startTime: 0,
          endTime: 10,
          successNextTime: undefined,
          successNextAction: 13,
          DELETED_failureNextTime: 0,
          DELETED_failureNextAction: 12,
          level: level,
        }),
      },
      {
        number: 13,
        name: "Zoom Corsia 3",
        source: "training/training_task2_level1_2_3_4_5_action9.mp4",
        start_time: 0,
      },
      {
        number: 14,
        name: "Trova Spazzolino",
        source: "training/training_task3_level" + level + "_action11.mp4",
        start_time: 64,
        end_time: 120,
        poi: newPOI({
          x: getPOI(level, 4, 14, "x"),
          y: getPOI(level, 4, 14, "y"),
          z: getPOI(level, 4, 14, "z"),
          startTime: 64,
          endTime: 74,
          successNextTime: 120,
          successNextAction: 15,
          DELETED_failureNextTime: 64,
          DELETED_failureNextAction: 14,
          level: level,
        }),
      },
      {
        number: 15,
        name: "Spazzolino nel Carrello",
        source: "training/training_task3_level" + level + "_action11.mp4",
        start_time: 120,
      },
    ],
  };

  var exit = [];

  if (level <= 3) {
    exit = [
      {
        number: 16,
        name: "Cassa",
        source: "training/training_task4_level1_2_3_action2.mp4",
        start_time: 0,
        end_time: 30,
      },
      {
        number: 17,
        name: "Uscita",
        source: "training/training_task4_level1_2_3_action2.mp4",
        start_time: 34,
        end_time: 80,
        poi: newPOI({
          x: -2.5540690752500006,
          y: 1.5231551164486459,
          z: -0.3714169371649222,
          startTime: 35,
          endTime: 80,
          successNextTime: 83,
          successNextAction: 18,
          DELETED_failureNextTime: 40,
          DELETED_failureNextAction: 17,
          level: level,
        }),
      },
      {
        number: 18,
        name: "Esci",
        source: "training/training_task4_level1_2_3_action2.mp4",
        start_time: 85,
      },
    ];
  } else {
    exit = [
      {
        number: 16,
        name: "Cassa",
        source: "training/training_task4_level4_5_action2.mp4",
        start_time: 0,
        end_time: 30,
      },
      {
        number: 17,
        name: "Uscita",
        source: "training/training_task4_level4_5_action2.mp4",
        start_time: 34,
        end_time: 80,
        poi: newPOI({
          x: -2.5540690752500006,
          y: 1.5231551164486459,
          z: -0.3714169371649222,
          startTime: 35,
          endTime: 80,
          successNextTime: 83,
          successNextAction: 18,
          DELETED_failureNextTime: 40,
          DELETED_failureNextAction: 17,
          level: level,
        }),
      },
      {
        number: 18,
        name: "Esci",
        source: "training/training_task4_level4_5_action2.mp4",
        start_time: 85,
      },
    ];
  }

  for (var action of exit) {
    result.actions.push(action);
  }

  return result;
}

const activityTraining = {
  id: 2,
  name: "Training Cognitivo",
  level: 3,
  description: "Training cognitivo attraverso l’esposizione in vr.",
  image: "preview_training.png",
  tasks: [
    task_training_1_ingresso,
    task_training_2_lista1,
    task_training_3_lista2,
    task_training_4_lista3,
  ],
  sounds: [sound_1, sound_2, sound_3],
};

const task_tutorial = {
  id: 3,
  number: 1,
  name: "Tutorial",
  num_effects: 4,
  description: "Tutorial",
  levels: [
    {
      number: 1,
      intro_video: undefined,
      actions: [
        {
          number: 1,
          name: "Natura",
          source: "tutorial/MicroTutorial_0_NATURE.mp4",
          start_time: 0,
          end_time: 10,
          poi: newPOI({
            x: -2.56821925392965,
            y: 1.54848625110547,
            z: -0.021464062039390837,
            startTime: 0,
            endTime: 10,
            successNextTime: 10,
            successNextAction: 2,
            DELETED_failureNextTime: 0,
            DELETED_failureNextAction: 1,
            radius: 1,
            level: 3,
          }),
        },
        {
          number: 2,
          name: "Natura - elefante",
          source: "tutorial/MicroTutorial_0_NATURE.mp4",
          start_time: 10,
        },
        {
          number: 3,
          name: "Giocattoli",
          source: "tutorial/1.mp4",
          start_time: 0,
          end_time: 10,
          poi: newPOI({
            x: -2.3604912483662446,
            y: 1.492757141730799,
            z: 1.0858576878892756,
            startTime: 0,
            endTime: 10,
            successNextTime: 10,
            successNextAction: 4,
            DELETED_failureNextTime: 0,
            DELETED_failureNextAction: 3,
            radius: 0.5,
            level: 3,
          }),
        },
        {
          number: 4,
          name: "Giocattoli - Supermario",
          source: "tutorial/1.mp4",
          start_time: 10,
        },
        {
          number: 5,
          name: "Giochi",
          source: "tutorial/2.mp4",
          start_time: 0,
          end_time: 10,
          poi: newPOI({
            x: -2.3260963953851537,
            y: 1.568895193188044,
            z: 1.0536753307551403,
            startTime: 1,
            endTime: 10,
            successNextTime: 10,
            successNextAction: 6,
            DELETED_failureNextTime: 0,
            DELETED_failureNextAction: 5,
            radius: 0.5,
            level: 3,
          }),
        },
        {
          number: 6,
          name: "Giochi - Minecraft",
          source: "tutorial/2.mp4",
          start_time: 10,
        },
        {
          number: 7,
          name: "Dolci",
          source: "tutorial/3.mp4",
          start_time: 5,
          end_time: 10,
          poi: newPOI({
            x: -2.599615177607982,
            y: 1.4803983766878583,
            z: -0.17591604371000646,
            startTime: 0,
            endTime: 10,
            successNextTime: 10,
            successNextAction: 8,
            DELETED_failureNextTime: 0,
            DELETED_failureNextAction: 5,
            radius: 0.5,
            level: 3,
          }),
        },
        {
          number: 8,
          name: "Dolci - Cioccolato",
          source: "tutorial/3.mp4",
          start_time: 10,
        },
      ],
    },
  ],
};

const activityTutorial = {
  id: 3,
  name: "Tutorial",
  level: 1,
  description: "Tutorial delle esperienze in VR.",
  image: "preview_tutorial.png",
  tasks: [task_tutorial],
  sounds: [sound_1, sound_2, sound_3],
};

const task_test1 = {
  id: 1,
  number: 1,
  name: "Test - prima action cliccata",
  num_effects: 4,
  description:
    "Aspettativa: se clicco 'azione 1' le altre si disabilitano. Stato: non succede.",
  levels: [
    {
      number: 1,
      intro_video: undefined,
      actions: [
        {
          number: 1,
          name: "Azione 1",
          source: "test/test.mp4",
          start_time: 0,
          default_volume: 0.3,
        },
        {
          number: 2,
          name: "Azione 2",
          source: "test/test.mp4",
          start_time: 0,
          default_volume: 0.4,
        },
        {
          number: 3,
          name: "Azione 3",
          source: "test/test.mp4",
          start_time: 0,
          default_volume: 0.5,
        },
        {
          number: 4,
          name: "Azione 4",
          source: "test/test.mp4",
          start_time: 0,
          default_volume: 0.6,
        },
      ],
    },
  ],
};

const task_test2 = {
  id: 2,
  number: 2,
  name: "Test - caricamento video",
  num_effects: 4,
  description:
    "Aspettativa: dopo aver guardato Super Mario cambio video. Stato: ERRORE 'video_error' pur essendo lo stesso video. ",
  levels: [
    {
      number: 1,
      intro_video: undefined,
      actions: [
        {
          number: 3,
          name: "Guarda Super Mario",
          source: "tutorial/MicroTutorial_1_TOYS.mp4",
          start_time: 0,
          end_time: 10,
          poi: newPOI({
            x: -2.3604912483662446,
            y: 1.492757141730799,
            z: 1.0858576878892756,
            startTime: 0,
            endTime: 10,
            successNextTime: 10,
            successNextAction: 4,
            DELETED_failureNextTime: 0,
            DELETED_failureNextAction: 3,
            radius: 0.5,
          }),
        },
        {
          number: 4,
          name: "Zoom Super Mario",
          source: "tutorial/MicroTutorial_1_TOYS.mp4",
          start_time: 10,
        },
      ],
    },
  ],
};

const task_test3 = {
  id: 3,
  number: 3,
  name: "Test - action.success.next_info.time",
  num_effects: 4,
  description:
    "Aspettativa: al success o fail mi aspetto che vada alla seconda action al tempo 20. Stato: Non accade. Passa alla action corretta senza però considerare lo start_time della action.",
  levels: [
    {
      number: 1,
      intro_video: undefined,
      actions: [
        {
          number: 1,
          start_time: 0,
          name: "Cliccare qui",
          source: "test/test.mp4",
          poi: newPOI({
            x: -2.56,
            y: 1.6,
            z: -0.2,
            startTime: 0,
            endTime: 10,
            successNextTime: undefined,
            successNextAction: 2,
            DELETED_failureNextTime: undefined,
            DELETED_failureNextAction: 2,
          }),
        },
        {
          number: 2,
          start_time: 20,
          name: "Action di arrivo",
          source: "test/test.mp4",
        },
      ],
    },
  ],
};

const task_test4 = {
  id: 4,
  number: 4,
  name: "Test - start_time",
  num_effects: 4,
  description:
    "Aspettativa: che il video inizi a un tempo prefissato. Stato: PASSATO",
  levels: [
    {
      number: 1,
      intro_video: undefined,
      actions: [
        {
          number: 1,
          start_time: 10,
          name: "inizia a 10 sec",
          source: "test/test.mp4",
        },
        {
          number: 2,
          start_time: 20,
          name: "inizia a 20 sec",
          source: "test/test.mp4",
        },
      ],
    },
  ],
};

const task_test5 = {
  id: 5,
  number: 5,
  name: "Test - video loaded",
  num_effects: 4,
  description: "Aspettativa: che il video parta. Stato: video_error",
  levels: [
    {
      number: 1,
      intro_video: undefined,
      actions: [
        {
          number: 1,
          start_time: 0,
          name: "encoded",
          source: "tutorial/encoded/1.mp4",
        },
        {
          number: 2,
          start_time: 0,
          name: "injected",
          source: "tutorial/injected/1.mp4",
        },
        {
          number: 3,
          start_time: 0,
          name: "encoded",
          source: "tutorial/original/1.mp4",
        },
        {
          number: 4,
          start_time: 0,
          name: "injected",
          source: "tutorial/test/1.mp4",
        },
        {
          number: 5,
          start_time: 0,
          name: "encoded",
          source: "tutorial/whatsapp/1.mp4",
        },
        {
          number: 6,
          start_time: 0,
          name: "injected",
          source: "tutorial/youtube/1.mp4",
        },
      ],
    },
  ],
};

const activityTest = {
  id: 4,
  name: "Test",
  level: 1,
  description: "Test countdown in VR.",
  image: "preview_test.png",
  tasks: [task_test1, task_test2, task_test3, task_test4, task_test5],
  sounds: [sound_1, sound_2, sound_3],
};

/*-------------------------- USERS --------------------------*/

function users(type, max) {
  var users = [];
  var icon = "player";
  var prefix = "B";
  if (type == "Operatore") {
    var icon = "user";
    var prefix = "O";
  }

  for (var i = 1; i <= max; i++) {
    var user = {
      id: prefix + "M" + i,
      name: type,
      surname: prefix + "M" + i,
      icon: icon + "_icon.svg",
    };
    users.push(user);
  }
  for (var i = 1; i <= max; i++) {
    var user = {
      id: prefix + "V" + i,
      name: type,
      surname: prefix + "V" + i,
      icon: icon + "_icon.svg",
    };
    users.push(user);
  }

  var user = {
    id: prefix + "_prova",
    name: type,
    surname: "Prova",
    icon: icon + "_icon.svg",
  };
  users.push(user);

  return users;
}

const eddie_1 = {
  id: 1,
  label: "Pollice in su",
  image: "eddie_pollice_su.png",
};

const eddie_2 = {
  id: 2,
  label: "Pensieroso",
  image: "eddie_pensieroso.png",
};

const eddie_3 = {
  id: 3,
  label: "Riprova",
  image: "eddie_riprova.png",
};

const eddie_4 = {
  id: 4,
  label: "Successo",
  image: "eddie_successo.png",
};

const mirino_1 = {
  id: 1,
  label: "Cerchio",
  image: "mirino_cerchio.svg",
};

const mirino_2 = {
  id: 2,
  label: "Cerchio con gradiente",
  image: "mirino_cerchio_gradiente.svg",
};

const mirino_3 = {
  id: 3,
  label: "Quadrato",
  image: "mirino_quadrato.svg",
};

const mirino_4 = {
  id: 4,
  label: "Puntatore",
  image: "mirino_puntatore.svg",
};

const image_1 = {
  id: 1,
  label: "Freccia",
  image: "mirino_puntatore.svg",
};

const image_2 = {
  id: 2,
  label: "Mano",
  image: "mirino_quadrato.svg",
};

const image_3 = {
  id: 3,
  label: "Puntatore",
  image: "mirino_cerchio.svg",
};

const image_4 = {
  id: 4,
  label: "Indicazione",
  image: "mirino_cerchio_gradiente.svg",
};

function getPOI(level, task, action, axis) {
  //
  try {
    var value = pois[level][task][action][axis];
    //console.log("getting poi", level, task, action, axis, value);
    return value;
  } catch (error) {
    console.error("ERROR getting poi", level, task, action, axis, error);
    return 0;
  }
}

function definePOIs() {
  initPOIs();

  //Trova banane
  var task = 2;
  var action = 4;
  pois[1][task][action] = {
    x: -2.6334020365530635,
    y: 1.28307282711525,
    z: 0.6338543457695153,
  };
  pois[2][task][action] = {
    x: -2.073278567105505,
    y: 1.2395866987598712,
    z: 1.774342406105231,
  };
  pois[3][task][action] = {
    x: -1.7811777768652606,
    y: 1.1712742457160303,
    z: 2.1079016252294727,
  };
  pois[4][task][action] = {
    x: -2.0992032222148054,
    y: 1.1157792636759645,
    z: 1.8245998760036497,
  };
  pois[5][task][action] = {
    x: -2.139911310122937,
    y: 1.4426168390291685,
    z: 1.5237551493993633,
  };

  //Trova biscotti
  var task = 2;
  var action = 9;
  pois[1][task][action] = {
    x: -2.6341338229993365,
    y: 1.2741787784224687,
    z: -0.6472394536743034,
  };
  pois[2][task][action] = {
    x: -2.184016462135701,
    y: 1.8847477645683726,
    z: 0.8140865576762701,
  };
  pois[3][task][action] = {
    x: -2.258818038351143,
    y: 1.8718463816078543,
    z: -0.6154300028066856,
  };
  pois[4][task][action] = {
    x: -2.2950759697272227,
    y: 1.2393925187771562,
    z: 1.4769561730935263,
  };
  pois[5][task][action] = {
    x: -2.2628311448523313,
    y: 1.289847123738879,
    z: 1.4864643947637182,
  };

  //Trova sapone
  var task = 2;
  var action = 14;
  pois[1][task][action] = {
    x: -2.3627942917804288,
    y: 1.8448653959450292,
    z: 0.03554497683072989,
  };
  pois[2][task][action] = {
    x: -2.652280954440093,
    y: 1.0414013460123575,
    z: 0.9265644339953856,
  };
  pois[3][task][action] = {
    x: -2.8306674376770027,
    y: 0.9565162701197697,
    z: 0.24130639870509027,
  };
  pois[4][task][action] = {
    x: -2.777291166929069,
    y: 1.0057883043589948,
    z: -0.5152929548136913,
  };
  pois[5][task][action] = {
    x: -2.299869385457529,
    y: 1.8460327717091065,
    z: -0.5343524260557233,
  };

  //Trova Arance
  var task = 3;
  var action = 4;
  pois[1][task][action] = {
    x: -2.017444364118541,
    y: 1.1548715926602933,
    z: 1.8917957311937847,
  };
  pois[2][task][action] = {
    x: -2.245926048312811,
    y: 1.3146887756412533,
    z: 1.4903757377687603,
  };
  pois[3][task][action] = {
    x: -2.266520446710565,
    y: 0.9862599436568155,
    z: 1.6934679332432214,
  };
  pois[4][task][action] = {
    x: -2.5511632673811984,
    y: 1.3697276325427086,
    z: -0.7803674674941508,
  };
  pois[5][task][action] = {
    x: -2.50259362127303,
    y: 1.4494077413436448,
    z: -0.7906093579458129,
  };

  //Trova Brioches
  var task = 3;
  var action = 9;
  pois[1][task][action] = {
    x: -2.578660157112581,
    y: 1.2379377807007392,
    z: 0.8922247547017834,
  };
  pois[2][task][action] = {
    x: -1.9130228055154423,
    y: 1.8941831458363416,
    z: 1.3206265133739745,
  };
  pois[3][task][action] = {
    x: -2.7254791099551094,
    y: 1.2264347045668134,
    z: 0.2323393910621115,
  };
  pois[4][task][action] = {
    x: -2.0898627122364313,
    y: 1.8934315828846384,
    z: 1.0165308407075353,
  };
  pois[5][task][action] = {
    x: -2.0757179446696004,
    y: 1.8983847368821383,
    z: 1.0374073991599526,
  };

  //Trova Dentifricio
  var task = 3;
  var action = 14;
  pois[1][task][action] = {
    x: -2.7394573850303408,
    y: 1.0230410600458053,
    z: -0.6548026064559591,
  };
  pois[2][task][action] = {
    x: -2.8192561100960183,
    y: 0.9968097498834539,
    z: 0.2026342246485296,
  };
  //ERROR IN VIDEO
  pois[3][task][action] = {
    x: -2.7254791099551094,
    y: 1.2264347045668134,
    z: 0.2323393910621115,
  };
  pois[4][task][action] = {
    x: -2.322743493936783,
    y: 1.7941248216216945,
    z: -0.6095519398921114,
  };
  pois[5][task][action] = {
    x: -2.6967706137923315,
    y: 1.0049852230733585,
    z: 0.842937600646089,
  };

  //Trova Fragole
  var task = 4;
  var action = 4;
  pois[1][task][action] = {
    x: -2.6777477333758197,
    y: 0.9465199566187698,
    z: -0.953364720823284,
  };
  pois[2][task][action] = {
    x: -2.413625553065057,
    y: 1.4144172782403546,
    z: 1.07718666760487,
  };
  pois[3][task][action] = {
    x: -2.4180626697644274,
    y: 1.397908815302499,
    z: 1.0872505736725384,
  };
  pois[4][task][action] = {
    x: -2.7785375946427853,
    y: 0.9033456561124491,
    z: 0.664143807839454,
  };
  pois[5][task][action] = {
    x: -2.680079552626228,
    y: 1.1968190462707062,
    z: -0.6047714305939232,
  };

  //Trova Torta
  var task = 4;
  var action = 9;
  pois[1][task][action] = {
    x: -1.8821232438879032,
    y: 1.8894314354969008,
    z: 1.368507330882048,
  };
  pois[2][task][action] = {
    x: -2.7259427578207873,
    y: 1.2354840537533511,
    z: 0.1412499291705805,
  };
  pois[3][task][action] = {
    x: -2.1266437957225115,
    y: 1.3227323706740641,
    z: 1.6458322099732365,
  };
  pois[4][task][action] = {
    x: -2.294482346440179,
    y: 1.8531269983710885,
    z: -0.5331007995997256,
  };
  pois[5][task][action] = {
    x: -2.2850989972278657,
    y: 1.8750092674421808,
    z: -0.5003640838184255,
  };

  //Trova Spazzolino
  var task = 4;
  var action = 14;
  pois[1][task][action] = {
    x: -2.221072675891041,
    y: 1.8821539760956412,
    z: 0.7165225971902677,
  };
  pois[2][task][action] = {
    x: -2.2486392711067347,
    y: 1.8255178147055453,
    z: -0.7705192002439516,
  };
  pois[3][task][action] = {
    x: -2.6535643632699646,
    y: 1.1387113399071662,
    z: -0.8116906230479587,
  };
  pois[4][task][action] = {
    x: -2.7716173453702946,
    y: 1.1274549095398225,
    z: 0.16214782515790155,
  };
  pois[5][task][action] = {
    x: -2.3083164143346515,
    y: 1.8469364082114603,
    z: 0.4977311978012307,
  };

  /*pois[][][] = */
}

function initPOIs() {
  pois = {};
  for (var l = 1; l < 6; l++) {
    pois[l] = {};
    for (var t = 1; t < 5; t++) {
      pois[l][t] = {};
      for (var a = 0; a < 20; a++) {
        pois[l][t][a] = { x: 0, y: 0, z: 0 };
      }
    }
  }
}

verifyData();

function verifyData() {
  console.log("*************** VERIFYING DATA STARTED ***************");
  var data = Data();
  for (var activity of data.activities) {
    for (var task of activity.tasks) {
      for (var level of task.levels) {
        for (var action of level.actions) {
          var filename =
            __dirname + "/../../../edoo-resources/videos/" + action.source;
          var prodfilename = "C://EDOO//resources//videos//" + action.source;
          try {
            if (fs.existsSync(filename)) {
              //console.error(action.source + " exists in dev")
            } else if(fs.existsSync(prodfilename)){
              //console.error(action.source + " exists in prod")
            } else{
              console.warn(action.source + " does not exist");
            }
          } catch (err) {
            console.error(filename, prodfilename, err);
          }
        }
      }
    }
  }
  console.log("*************** VERIFYING DATA ENDED ***************");
}

module.exports = Data;
