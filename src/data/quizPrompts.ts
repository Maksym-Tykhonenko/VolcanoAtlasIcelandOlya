export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
};

export type QuizLevel = {
  id: number;
  title: string;
  subtitle: string;
  resultWinTitle: string;
  resultWinText: string;
  resultLoseTitle: string;
  resultLoseText: string;
  imageName: string;
  questions: QuizQuestion[];
};

export const quizLevels: QuizLevel[] = [
  {
    id: 1,
    title: 'Level 1 — Fire Beneath the Ice',
    subtitle: 'Explore Icelandic volcanoes hidden beneath glaciers and shaped by fire and ice.',
    resultWinTitle: 'Level Complete',
    resultWinText:
      'You navigated the volcanic questions and reached the summit of this challenge. Keep exploring and uncover more secrets of Iceland’s powerful landscapes.',
    resultLoseTitle: 'Volcano Challenge Failed',
    resultLoseText:
      'This round didn’t reach the summit. Study the volcanic clues and try the challenge again.',
    imageName: 'quiz_lvl_steam_basin_mark.png',
    questions: [
      {
        id: '1-1',
        question: 'Which Icelandic volcano erupted in 2010 and disrupted air travel across Europe?',
        options: ['Hekla', 'Eyjafjallajökull', 'Katla', 'Askja'],
        correctAnswer: 'Eyjafjallajökull',
      },
      {
        id: '1-2',
        question: 'What type of geological boundary is responsible for Iceland’s volcanic activity?',
        options: ['Transform fault', 'Subduction zone', 'Mid-ocean ridge', 'Continental collision'],
        correctAnswer: 'Mid-ocean ridge',
      },
      {
        id: '1-3',
        question: 'What is the name of the massive glacier that covers several active volcanoes in Iceland?',
        options: ['Langjökull', 'Hofsjökull', 'Vatnajökull', 'Drangajökull'],
        correctAnswer: 'Vatnajökull',
      },
      {
        id: '1-4',
        question: 'What phenomenon occurs when a volcanic eruption melts glacier ice and causes sudden flooding?',
        options: ['Lava surge', 'Jökulhlaup', 'Pyroburst', 'Ash wave'],
        correctAnswer: 'Jökulhlaup',
      },
      {
        id: '1-5',
        question: 'Which Icelandic volcano is often called the “Gateway to Hell” in medieval stories?',
        options: ['Hekla', 'Katla', 'Bárðarbunga', 'Snæfellsjökull'],
        correctAnswer: 'Hekla',
      },
      {
        id: '1-6',
        question: 'Iceland sits directly on which geological feature?',
        options: ['Pacific Ring of Fire', 'East African Rift', 'Mid-Atlantic Ridge', 'Alpine Fault'],
        correctAnswer: 'Mid-Atlantic Ridge',
      },
    ],
  },
  {
    id: 2,
    title: 'Level 2 — Lava Worlds',
    subtitle: 'Learn how lava flows, moss-covered fields, and volcanic rock shape Iceland.',
    resultWinTitle: 'Level Complete',
    resultWinText:
      'You crossed the lava fields and completed this volcanic stage. New geological discoveries are waiting ahead.',
    resultLoseTitle: 'Volcano Challenge Failed',
    resultLoseText:
      'This lava round needs another try. Review the clues and continue your volcanic expedition.',
    imageName: 'quiz_lvl_crater_ring_mark.png',
    questions: [
      {
        id: '2-1',
        question: 'What is the name of the massive lava field created by the Laki eruption in 1783?',
        options: ['Eldhraun', 'Dimmuborgir', 'Leitarhraun', 'Berserkjahraun'],
        correctAnswer: 'Eldhraun',
      },
      {
        id: '2-2',
        question: 'What gives many Icelandic lava fields their green appearance?',
        options: ['Volcanic algae', 'Moss growth', 'Mineral crystals', 'Ash deposits'],
        correctAnswer: 'Moss growth',
      },
      {
        id: '2-3',
        question: 'Which Icelandic region is famous for strange lava formations called “Dark Castles”?',
        options: ['Þingvellir', 'Mývatn', 'Dimmuborgir', 'Hverir'],
        correctAnswer: 'Dimmuborgir',
      },
      {
        id: '2-4',
        question: 'What type of lava typically forms smooth, rope-like surfaces?',
        options: ['Pahoehoe lava', 'Basaltic ash', 'Andesitic lava', 'Pyroclastic flow'],
        correctAnswer: 'Pahoehoe lava',
      },
      {
        id: '2-5',
        question: 'Lava caves are usually formed when:',
        options: [
          'Lava flows underground through ice',
          'The outer surface of a lava flow hardens while lava continues flowing inside',
          'Magma solidifies instantly in air',
          'Lava mixes with ocean water',
        ],
        correctAnswer: 'The outer surface of a lava flow hardens while lava continues flowing inside',
      },
      {
        id: '2-6',
        question: 'What is the most common volcanic rock found in Iceland?',
        options: ['Granite', 'Basalt', 'Sandstone', 'Marble'],
        correctAnswer: 'Basalt',
      },
    ],
  },
  {
    id: 3,
    title: 'Level 3 — Crater Mysteries',
    subtitle: 'Discover how craters and calderas form across Iceland’s volcanic terrain.',
    resultWinTitle: 'Level Complete',
    resultWinText:
      'You explored the crater landscapes and unlocked the next mystery of Iceland’s volcanic world.',
    resultLoseTitle: 'Volcano Challenge Failed',
    resultLoseText:
      'This crater mission needs one more attempt. Revisit the questions and try again.',
    imageName: 'quiz_lvl_crater_basin_mark.png',
    questions: [
      {
        id: '3-1',
        question: 'What type of crater is Hverfjall in northern Iceland?',
        options: ['Shield crater', 'Explosion crater', 'Tephra crater', 'Caldera'],
        correctAnswer: 'Tephra crater',
      },
      {
        id: '3-2',
        question: 'Kerið crater is famous for what feature?',
        options: ['Lava waterfalls', 'A bright blue crater lake', 'A glacier inside the crater', 'A lava cave system'],
        correctAnswer: 'A bright blue crater lake',
      },
      {
        id: '3-3',
        question: 'A volcanic caldera forms when:',
        options: [
          'Lava cools too quickly',
          'A volcano collapses after a massive eruption empties its magma chamber',
          'Magma freezes underground',
          'Lava flows into the ocean',
        ],
        correctAnswer: 'A volcano collapses after a massive eruption empties its magma chamber',
      },
      {
        id: '3-4',
        question: 'Which remote Icelandic caldera contains the deep lake Öskjuvatn?',
        options: ['Askja', 'Hekla', 'Katla', 'Krafla'],
        correctAnswer: 'Askja',
      },
      {
        id: '3-5',
        question: 'The circular shape of many volcanic craters forms mainly because:',
        options: [
          'Lava always spreads evenly',
          'Magma pressure breaks the ground equally around the vent',
          'Wind erosion shapes the crater',
          'Glaciers carve the crater',
        ],
        correctAnswer: 'Magma pressure breaks the ground equally around the vent',
      },
      {
        id: '3-6',
        question: 'What is typically found at the center of a volcanic crater?',
        options: ['Magma chamber', 'Lava vent or conduit', 'Ocean water', 'Granite core'],
        correctAnswer: 'Lava vent or conduit',
      },
    ],
  },
  {
    id: 4,
    title: 'Level 4 — Geothermal Power',
    subtitle: 'Study geysers, mud pots, geothermal gases, and Iceland’s natural energy.',
    resultWinTitle: 'Level Complete',
    resultWinText:
      'You passed through the geothermal zone and revealed another layer of Iceland’s volcanic forces.',
    resultLoseTitle: 'Volcano Challenge Failed',
    resultLoseText:
      'This geothermal challenge was not completed. Recharge your knowledge and try again.',
    imageName: 'quiz_lvl_geyser_mark.png',
    questions: [
      {
        id: '4-1',
        question: 'The word “geyser” originates from which Icelandic geothermal site?',
        options: ['Hverir', 'Geysir', 'Krýsuvík', 'Námaskarð'],
        correctAnswer: 'Geysir',
      },
      {
        id: '4-2',
        question: 'Why do geysers erupt periodically?',
        options: ['Wind pressure', 'Underground steam pressure building up in confined spaces', 'Ocean tides', 'Earthquakes'],
        correctAnswer: 'Underground steam pressure building up in confined spaces',
      },
      {
        id: '4-3',
        question: 'What causes the bright colors often seen in geothermal areas?',
        options: ['Lava reflection', 'Mineral deposits and heat-loving bacteria', 'Frozen sulfur gas', 'Volcanic ash'],
        correctAnswer: 'Mineral deposits and heat-loving bacteria',
      },
      {
        id: '4-4',
        question: 'What gas is commonly responsible for the strong smell in geothermal areas?',
        options: ['Carbon dioxide', 'Methane', 'Hydrogen sulfide', 'Nitrogen'],
        correctAnswer: 'Hydrogen sulfide',
      },
      {
        id: '4-5',
        question: 'Which Icelandic geothermal field near Lake Mývatn has boiling mud pots and colorful soil?',
        options: ['Krýsuvík', 'Hverir', 'Eldhraun', 'Askja'],
        correctAnswer: 'Hverir',
      },
      {
        id: '4-6',
        question: 'Iceland uses geothermal energy primarily for:',
        options: ['Mining metals', 'Heating homes and generating electricity', 'Desalinating water', 'Cooling cities'],
        correctAnswer: 'Heating homes and generating electricity',
      },
    ],
  },
  {
    id: 5,
    title: 'Level 5 — Masters of Fire and Earth',
    subtitle: 'Answer advanced questions about volcano systems, lava flows, and Icelandic eruptions.',
    resultWinTitle: 'Level Complete',
    resultWinText:
      'You completed a more advanced stage and proved your growing understanding of Icelandic volcanology.',
    resultLoseTitle: 'Volcano Challenge Failed',
    resultLoseText:
      'This expert-level round needs another climb. Review the clues and return stronger.',
    imageName: 'quiz_lvl_fire_gate_mark.png',
    questions: [
      {
        id: '5-1',
        question: 'Approximately how many volcanoes exist in Iceland?',
        options: ['About 30', 'About 50', 'About 130', 'About 300'],
        correctAnswer: 'About 130',
      },
      {
        id: '5-2',
        question: 'Which Icelandic volcanic system produced one of the largest lava flows in recorded history in 2014–2015?',
        options: ['Hekla', 'Bárðarbunga', 'Katla', 'Krafla'],
        correctAnswer: 'Bárðarbunga',
      },
      {
        id: '5-3',
        question: 'Why are Icelandic eruptions often less explosive than many other volcanoes?',
        options: [
          'Magma contains less gas and is more fluid (basaltic)',
          'Iceland has colder magma',
          'Volcanoes are smaller',
          'Glaciers prevent explosions',
        ],
        correctAnswer: 'Magma contains less gas and is more fluid (basaltic)',
      },
      {
        id: '5-4',
        question: 'What type of volcano forms from many thin lava flows spreading outward?',
        options: ['Stratovolcano', 'Shield volcano', 'Composite volcano', 'Cinder cone'],
        correctAnswer: 'Shield volcano',
      },
      {
        id: '5-5',
        question: 'Iceland experiences volcanic eruptions roughly:',
        options: [
          'Once every 5–10 years on average',
          'Once every 100 years',
          'Once every 500 years',
          'Only during earthquakes',
        ],
        correctAnswer: 'Once every 5–10 years on average',
      },
      {
        id: '5-6',
        question: 'Why is Iceland one of the best places in the world to study volcanology?',
        options: [
          'It has the tallest volcanoes',
          'It sits on both a tectonic ridge and a mantle plume hotspot',
          'It has no glaciers',
          'It is the oldest volcanic island on Earth',
        ],
        correctAnswer: 'It sits on both a tectonic ridge and a mantle plume hotspot',
      },
    ],
  },
  {
    id: 6,
    title: 'Level 6 — Hidden Volcanoes',
    subtitle: 'Focus on subglacial eruptions and powerful volcanoes hidden beneath Icelandic ice.',
    resultWinTitle: 'Level Complete',
    resultWinText:
      'You uncovered the hidden fire beneath the glaciers and reached the next volcanic checkpoint.',
    resultLoseTitle: 'Volcano Challenge Failed',
    resultLoseText:
      'This hidden-volcano round slipped beneath the ice. Study the clues and try again.',
    imageName: 'quiz_lvl_hidden_ice_mark.png',
    questions: [
      {
        id: '6-1',
        question: 'Which volcano lies hidden beneath the Mýrdalsjökull glacier and is considered one of Iceland’s most powerful?',
        options: ['Katla', 'Hekla', 'Askja', 'Krafla'],
        correctAnswer: 'Katla',
      },
      {
        id: '6-2',
        question: 'What term describes a volcano covered by a glacier that erupts beneath the ice?',
        options: ['Ice volcano', 'Subglacial volcano', 'Polar vent', 'Frozen cone'],
        correctAnswer: 'Subglacial volcano',
      },
      {
        id: '6-3',
        question: 'What type of eruption occurs when magma interacts directly with ice or water?',
        options: ['Strombolian eruption', 'Plinian eruption', 'Phreatomagmatic eruption', 'Hawaiian eruption'],
        correctAnswer: 'Phreatomagmatic eruption',
      },
      {
        id: '6-4',
        question: 'Which Icelandic volcano is located under the Vatnajökull glacier and erupted in 2011?',
        options: ['Katla', 'Grímsvötn', 'Askja', 'Hverfjall'],
        correctAnswer: 'Grímsvötn',
      },
      {
        id: '6-5',
        question: 'What landform can form when lava erupts under thick ice and builds upward?',
        options: ['Lava plateau', 'Tuya volcano', 'Rift mountain', 'Basalt column'],
        correctAnswer: 'Tuya volcano',
      },
      {
        id: '6-6',
        question: 'Iceland has volcanic activity largely because it sits on:',
        options: [
          'Two colliding continents',
          'A tectonic rift and a mantle hotspot',
          'A giant magma ocean',
          'An extinct volcanic belt',
        ],
        correctAnswer: 'A tectonic rift and a mantle hotspot',
      },
    ],
  },
  {
    id: 7,
    title: 'Level 7 — Lava Dynamics',
    subtitle: 'Understand lava temperature, flow behavior, volcanic rocks, and cooling patterns.',
    resultWinTitle: 'Level Complete',
    resultWinText:
      'You followed the lava rivers and mastered another level of volcanic knowledge.',
    resultLoseTitle: 'Volcano Challenge Failed',
    resultLoseText:
      'This lava-dynamics round cooled too early. Revisit the clues and try again.',
    imageName: 'quiz_lvl_lava_flow_mark.png',
    questions: [
      {
        id: '7-1',
        question: 'What temperature can basaltic lava in Iceland typically reach?',
        options: ['500°C', '800°C', '1100°C', '1500°C'],
        correctAnswer: '1100°C',
      },
      {
        id: '7-2',
        question: 'What term describes a river-like flow of molten rock moving down a volcano?',
        options: ['Magma stream', 'Lava flow', 'Fire current', 'Pyro wave'],
        correctAnswer: 'Lava flow',
      },
      {
        id: '7-3',
        question: 'What forms when gas bubbles are trapped inside cooling lava?',
        options: ['Basalt columns', 'Lava foam', 'Vesicles', 'Ash glass'],
        correctAnswer: 'Vesicles',
      },
      {
        id: '7-4',
        question: 'Which volcanic rock is extremely light and can float on water?',
        options: ['Basalt', 'Granite', 'Pumice', 'Obsidian'],
        correctAnswer: 'Pumice',
      },
      {
        id: '7-5',
        question: 'What structure forms when lava cools slowly and contracts into hexagonal shapes?',
        options: ['Lava ridges', 'Basalt columns', 'Rock arches', 'Crater walls'],
        correctAnswer: 'Basalt columns',
      },
      {
        id: '7-6',
        question: 'What color is freshly erupted basaltic lava usually?',
        options: ['Yellow', 'Bright red or orange', 'Blue', 'White'],
        correctAnswer: 'Bright red or orange',
      },
    ],
  },
  {
    id: 8,
    title: 'Level 8 — Iceland’s Volcanic Geography',
    subtitle: 'Explore the volcanic zones, famous peninsulas, and crater lakes of Iceland.',
    resultWinTitle: 'Level Complete',
    resultWinText:
      'You mapped Iceland’s volcanic geography and unlocked the next expert stage.',
    resultLoseTitle: 'Volcano Challenge Failed',
    resultLoseText:
      'This geography round is not complete yet. Review the map clues and try again.',
    imageName: 'quiz_lvl_map_pin_mark.png',
    questions: [
      {
        id: '8-1',
        question: 'Which Icelandic peninsula has experienced several eruptions since 2021?',
        options: ['Westfjords', 'Reykjanes Peninsula', 'Snæfellsnes', 'Eastfjords'],
        correctAnswer: 'Reykjanes Peninsula',
      },
      {
        id: '8-2',
        question: 'Iceland’s volcanic zones mostly follow what geological structure?',
        options: ['Ocean trench', 'Rift zones along the Mid-Atlantic Ridge', 'Subduction arcs', 'Continental plates'],
        correctAnswer: 'Rift zones along the Mid-Atlantic Ridge',
      },
      {
        id: '8-3',
        question: 'Which famous glacier-covered volcano inspired Jules Verne’s novel “Journey to the Center of the Earth”?',
        options: ['Hekla', 'Snæfellsjökull', 'Katla', 'Askja'],
        correctAnswer: 'Snæfellsjökull',
      },
      {
        id: '8-4',
        question: 'Which lake was formed inside a volcanic caldera in the Icelandic highlands?',
        options: ['Mývatn', 'Öskjuvatn', 'Thingvallavatn', 'Lagarfljót'],
        correctAnswer: 'Öskjuvatn',
      },
      {
        id: '8-5',
        question: 'Which volcanic area in Iceland contains many fissures and lava fields formed by rifting?',
        options: ['Þingvellir', 'Eldhraun', 'Hverir', 'Haukadalur'],
        correctAnswer: 'Þingvellir',
      },
      {
        id: '8-6',
        question: 'Iceland’s landscape is constantly changing because:',
        options: [
          'Volcanoes erupt frequently and tectonic plates move apart',
          'The island is sinking',
          'Glaciers melt lava',
          'Earthquakes stop eruptions',
        ],
        correctAnswer: 'Volcanoes erupt frequently and tectonic plates move apart',
      },
    ],
  },
  {
    id: 9,
    title: 'Level 9 — Extreme Volcanic Events',
    subtitle: 'Study the most dramatic eruptions, ash clouds, and volcanic hazards in Iceland.',
    resultWinTitle: 'Level Complete',
    resultWinText:
      'You endured the extreme eruption stage and reached another volcanic milestone.',
    resultLoseTitle: 'Volcano Challenge Failed',
    resultLoseText:
      'This extreme-events round needs another attempt. Revisit the eruption clues and try again.',
    imageName: 'quiz_lvl_eruption_cloud_mark.png',
    questions: [
      {
        id: '9-1',
        question: 'Which eruption in 1783 caused massive lava flows and climate effects across Europe?',
        options: ['Hekla eruption', 'Laki eruption', 'Katla eruption', 'Askja eruption'],
        correctAnswer: 'Laki eruption',
      },
      {
        id: '9-2',
        question: 'What type of volcanic eruption produces tall ash columns reaching the stratosphere?',
        options: ['Hawaiian eruption', 'Strombolian eruption', 'Plinian eruption', 'Effusive eruption'],
        correctAnswer: 'Plinian eruption',
      },
      {
        id: '9-3',
        question: 'What volcanic hazard can move extremely fast down a volcano’s slopes?',
        options: ['Lava stream', 'Pyroclastic flow', 'Steam cloud', 'Basalt rain'],
        correctAnswer: 'Pyroclastic flow',
      },
      {
        id: '9-4',
        question: 'What natural phenomenon can occur when volcanic ash spreads across the sky?',
        options: ['Sun cooling and colorful sunsets', 'Magnetic storms', 'Ocean boiling', 'Lightning storms worldwide'],
        correctAnswer: 'Sun cooling and colorful sunsets',
      },
      {
        id: '9-5',
        question: 'What is the name of the long volcanic fissure system responsible for the Laki eruption?',
        options: ['Eldgjá', 'Lakagígar', 'Krafla ridge', 'Askja rift'],
        correctAnswer: 'Lakagígar',
      },
      {
        id: '9-6',
        question: 'What major environmental effect did the Laki eruption cause in the 18th century?',
        options: [
          'Ocean tides changed',
          'A global temperature drop and crop failures',
          'Continents moved apart',
          'Permanent volcanic winter',
        ],
        correctAnswer: 'A global temperature drop and crop failures',
      },
    ],
  },
  {
    id: 10,
    title: 'Level 10 — Volcanology Experts',
    subtitle: 'Answer professional volcanology questions about magma, gas, and tectonic processes.',
    resultWinTitle: 'Level Complete',
    resultWinText:
      'You completed an expert stage and proved strong volcanic knowledge across Iceland’s geology.',
    resultLoseTitle: 'Volcano Challenge Failed',
    resultLoseText:
      'This expert volcanology round needs another try. Refine your answers and continue.',
    imageName: 'quiz_lvl_expert_mark.png',
    questions: [
      {
        id: '10-1',
        question: 'What is the underground chamber where magma accumulates called?',
        options: ['Lava vault', 'Magma chamber', 'Fire cavity', 'Mantle pocket'],
        correctAnswer: 'Magma chamber',
      },
      {
        id: '10-2',
        question: 'What process creates new crust at mid-ocean ridges like the one under Iceland?',
        options: ['Subduction', 'Seafloor spreading', 'Continental uplift', 'Mantle freezing'],
        correctAnswer: 'Seafloor spreading',
      },
      {
        id: '10-3',
        question: 'What is the main gas released during volcanic eruptions?',
        options: ['Hydrogen', 'Water vapor', 'Helium', 'Oxygen'],
        correctAnswer: 'Water vapor',
      },
      {
        id: '10-4',
        question: 'What tool do volcanologists often use to measure ground deformation near volcanoes?',
        options: ['Barometer', 'Seismograph', 'GPS sensors', 'Thermometer'],
        correctAnswer: 'GPS sensors',
      },
      {
        id: '10-5',
        question: 'What phenomenon occurs when magma reaches the Earth’s surface?',
        options: ['Subduction', 'Eruption', 'Compression', 'Rift sealing'],
        correctAnswer: 'Eruption',
      },
      {
        id: '10-6',
        question: 'What branch of science studies volcanoes and magma?',
        options: ['Geochemistry', 'Seismology', 'Volcanology', 'Meteorology'],
        correctAnswer: 'Volcanology',
      },
    ],
  },
  {
    id: 11,
    title: 'Level 11 — Volcano Structure',
    subtitle: 'Learn the key parts of a volcano, from craters and conduits to magma underground.',
    resultWinTitle: 'Level Complete',
    resultWinText:
      'You decoded the structure of volcanoes and moved one stage deeper into the challenge.',
    resultLoseTitle: 'Volcano Challenge Failed',
    resultLoseText:
      'This structure round needs another attempt. Review the volcanic parts and try again.',
    imageName: 'quiz_lvl_structure_mark.png',
    questions: [
      {
        id: '11-1',
        question: 'What is the main opening at the top of a volcano called?',
        options: ['Basin', 'Vent', 'Crater', 'Shaft'],
        correctAnswer: 'Crater',
      },
      {
        id: '11-2',
        question: 'What is molten rock called when it is still underground?',
        options: ['Lava', 'Magma', 'Basalt', 'Ash'],
        correctAnswer: 'Magma',
      },
      {
        id: '11-3',
        question: 'What type of volcano forms broad, gently sloping sides?',
        options: ['Stratovolcano', 'Shield volcano', 'Cinder cone', 'Caldera volcano'],
        correctAnswer: 'Shield volcano',
      },
      {
        id: '11-4',
        question: 'What material is ejected into the air during many eruptions?',
        options: ['Granite dust', 'Volcanic ash', 'Limestone powder', 'Quartz sand'],
        correctAnswer: 'Volcanic ash',
      },
      {
        id: '11-5',
        question: 'What is the vertical channel that carries magma to the surface?',
        options: ['Lava tube', 'Volcanic conduit', 'Rift tunnel', 'Magma ridge'],
        correctAnswer: 'Volcanic conduit',
      },
      {
        id: '11-6',
        question: 'What is the large depression formed after a massive eruption called?',
        options: ['Crater', 'Basin', 'Caldera', 'Pit valley'],
        correctAnswer: 'Caldera',
      },
    ],
  },
  {
    id: 12,
    title: 'Level 12 — Iceland’s Geological Forces',
    subtitle: 'Understand tectonic rifting, mantle plumes, and the forces shaping Iceland.',
    resultWinTitle: 'Level Complete',
    resultWinText:
      'You mastered another geological stage and strengthened your volcanic expedition.',
    resultLoseTitle: 'Volcano Challenge Failed',
    resultLoseText:
      'This geological-forces round is incomplete. Review the Earth processes and try again.',
    imageName: 'quiz_lvl_geology_force_mark.png',
    questions: [
      {
        id: '12-1',
        question: 'Iceland is slowly splitting apart because:',
        options: ['Plates are colliding', 'Plates are sliding sideways', 'Plates are moving away from each other', 'Plates are sinking'],
        correctAnswer: 'Plates are moving away from each other',
      },
      {
        id: '12-2',
        question: 'The Icelandic hotspot is located in:',
        options: ['The Earth’s crust', 'The upper mantle plume', 'The outer core', 'The inner core'],
        correctAnswer: 'The upper mantle plume',
      },
      {
        id: '12-3',
        question: 'When magma cools quickly at the surface it forms:',
        options: ['Sedimentary rock', 'Metamorphic rock', 'Igneous rock', 'Crystal rock'],
        correctAnswer: 'Igneous rock',
      },
      {
        id: '12-4',
        question: 'Iceland’s volcanic rock is mostly:',
        options: ['Granite', 'Basalt', 'Marble', 'Sandstone'],
        correctAnswer: 'Basalt',
      },
      {
        id: '12-5',
        question: 'What creates many of Iceland’s long volcanic fissures?',
        options: ['Ocean currents', 'Tectonic rifting', 'Glacial pressure', 'Atmospheric erosion'],
        correctAnswer: 'Tectonic rifting',
      },
      {
        id: '12-6',
        question: 'What landscape feature forms when lava meets ocean water and cools rapidly?',
        options: ['Lava delta', 'Ice plateau', 'Rock shelf', 'Ash cliff'],
        correctAnswer: 'Lava delta',
      },
    ],
  },
  {
    id: 13,
    title: 'Level 13 — Lava and Rock',
    subtitle: 'Focus on volcanic rocks, lava tubes, ash deposits, and cooling processes.',
    resultWinTitle: 'Level Complete',
    resultWinText:
      'You identified the volcanic rocks and structures that shape Iceland’s lava worlds.',
    resultLoseTitle: 'Volcano Challenge Failed',
    resultLoseText:
      'This lava-and-rock round needs one more try. Study the clues and continue.',
    imageName: 'quiz_lvl_rock_mark.png',
    questions: [
      {
        id: '13-1',
        question: 'What glass-like volcanic rock forms when lava cools extremely fast?',
        options: ['Basalt', 'Obsidian', 'Granite', 'Andesite'],
        correctAnswer: 'Obsidian',
      },
      {
        id: '13-2',
        question: 'What are the long tunnels formed by flowing lava called?',
        options: ['Lava tubes', 'Rift caves', 'Fire tunnels', 'Magma paths'],
        correctAnswer: 'Lava tubes',
      },
      {
        id: '13-3',
        question: 'What shape do basalt columns often form when cooling?',
        options: ['Square', 'Circular', 'Hexagonal', 'Triangular'],
        correctAnswer: 'Hexagonal',
      },
      {
        id: '13-4',
        question: 'What term describes broken volcanic rock fragments?',
        options: ['Tephra', 'Basalite', 'Crustalite', 'Lava dust'],
        correctAnswer: 'Tephra',
      },
      {
        id: '13-5',
        question: 'What rock is formed from compressed volcanic ash?',
        options: ['Obsidian', 'Basalt', 'Tuff', 'Granite'],
        correctAnswer: 'Tuff',
      },
      {
        id: '13-6',
        question: 'What happens when lava cools slowly underground?',
        options: [
          'It forms large crystals in intrusive rock',
          'It disappears into magma',
          'It turns into ash',
          'It forms sediment layers',
        ],
        correctAnswer: 'It forms large crystals in intrusive rock',
      },
    ],
  },
  {
    id: 14,
    title: 'Level 14 — Volcano Monitoring',
    subtitle: 'Learn how scientists track eruptions, gases, earthquakes, and ground movement.',
    resultWinTitle: 'Level Complete',
    resultWinText:
      'You passed the monitoring stage and moved closer to becoming a true volcano expert.',
    resultLoseTitle: 'Volcano Challenge Failed',
    resultLoseText:
      'This monitoring round needs another attempt. Study the warning signs and try again.',
    imageName: 'quiz_lvl_monitor_mark.png',
    questions: [
      {
        id: '14-1',
        question: 'What instrument measures earthquakes around volcanoes?',
        options: ['Thermometer', 'Seismograph', 'Magnetometer', 'Altimeter'],
        correctAnswer: 'Seismograph',
      },
      {
        id: '14-2',
        question: 'Small earthquakes around volcanoes usually indicate:',
        options: ['Wind activity', 'Magma movement underground', 'Glacier melting', 'Ocean pressure'],
        correctAnswer: 'Magma movement underground',
      },
      {
        id: '14-3',
        question: 'What gas release is often monitored before eruptions?',
        options: ['Nitrogen', 'Oxygen', 'Sulfur dioxide', 'Helium'],
        correctAnswer: 'Sulfur dioxide',
      },
      {
        id: '14-4',
        question: 'What satellite technology helps track ground movement near volcanoes?',
        options: ['Radar interferometry (InSAR)', 'Radio mapping', 'Satellite photography', 'Solar scanning'],
        correctAnswer: 'Radar interferometry (InSAR)',
      },
      {
        id: '14-5',
        question: 'What can swelling ground around a volcano indicate?',
        options: ['Incoming storm', 'Magma building pressure underground', 'Soil erosion', 'Glacier expansion'],
        correctAnswer: 'Magma building pressure underground',
      },
      {
        id: '14-6',
        question: 'What is a volcanic hazard caused by melted ice and debris flow?',
        options: ['Pyroclastic wave', 'Lava river', 'Lahar', 'Magma storm'],
        correctAnswer: 'Lahar',
      },
    ],
  },
  {
    id: 15,
    title: 'Level 15 — Extreme Volcanology',
    subtitle: 'Complete the final stage with advanced questions about Iceland’s volcanic extremes.',
    resultWinTitle: 'Level Complete',
    resultWinText:
      'You reached the summit of the volcano quiz. Your knowledge now spans Iceland’s powerful fire and earth systems.',
    resultLoseTitle: 'Volcano Challenge Failed',
    resultLoseText:
      'The final volcanic challenge was not completed. Regroup, study the clues, and try again.',
    imageName: 'quiz_lvl_final_mark.png',
    questions: [
      {
        id: '15-1',
        question: 'What is the largest volcanic eruption type known for massive ash clouds?',
        options: ['Strombolian', 'Hawaiian', 'Plinian', 'Effusive'],
        correctAnswer: 'Plinian',
      },
      {
        id: '15-2',
        question: 'What volcanic island nation sits almost entirely on a rift and hotspot system?',
        options: ['Japan', 'Indonesia', 'Iceland', 'Philippines'],
        correctAnswer: 'Iceland',
      },
      {
        id: '15-3',
        question: 'What phenomenon creates glowing rivers of lava at night?',
        options: ['Magma reflection', 'Radiant heat from molten lava', 'Gas combustion', 'Mineral burning'],
        correctAnswer: 'Radiant heat from molten lava',
      },
      {
        id: '15-4',
        question: 'Which volcanic hazard moves fastest down a volcano’s slopes?',
        options: ['Lava flow', 'Pyroclastic flow', 'Ash fall', 'Mudflow'],
        correctAnswer: 'Pyroclastic flow',
      },
      {
        id: '15-5',
        question: 'What volcanic material can travel thousands of kilometers through the atmosphere?',
        options: ['Lava rock', 'Ash particles', 'Basalt blocks', 'Magma droplets'],
        correctAnswer: 'Ash particles',
      },
      {
        id: '15-6',
        question: 'Why do some Icelandic eruptions produce long lava rivers instead of explosions?',
        options: [
          'Magma is cooler',
          'Magma is basaltic and flows easily',
          'Volcanoes are smaller',
          'Iceland has less gas underground',
        ],
        correctAnswer: 'Magma is basaltic and flows easily',
      },
    ],
  },
];