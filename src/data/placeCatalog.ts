export type PlaceItem = {
  id: string;
  categoryId: string;
  title: string;
  region: string;
  description: string;
  latitude: number;
  longitude: number;
  imageName: string;
};

export type PlaceCategory = {
  id: string;
  title: string;
  imageName: string;
};

export const placeCategories: PlaceCategory[] = [
  {
    id: 'all-categories',
    title: 'All Categories',
    imageName: 'cat_all_volcanic_realm.png',
  },
  {
    id: 'active-volcano-views',
    title: 'Active Volcano Views',
    imageName: 'cat_active_fire_peaks.png',
  },
  {
    id: 'lava-landscapes',
    title: 'Lava Landscapes',
    imageName: 'cat_lava_terrain_lines.png',
  },
  {
    id: 'crater-adventures',
    title: 'Crater Adventures',
    imageName: 'cat_crater_ring_trails.png',
  },
  {
    id: 'geothermal-wonders',
    title: 'Geothermal Wonders',
    imageName: 'cat_geothermal_steam_basin.png',
  },
];

export const placeCatalog: PlaceItem[] = [
  {
    id: 'fagradalsfjall-volcano',
    categoryId: 'active-volcano-views',
    title: 'Fagradalsfjall Volcano',
    region: 'Reykjanes Peninsula',
    description:
      'Located on the Reykjanes Peninsula, Fagradalsfjall became world-famous after its eruption in 2021, marking the beginning of a new volcanic cycle in the region. Visitors can hike across newly formed lava fields and observe how the landscape is still evolving after the eruption. The area offers dramatic views of hardened lava flows, volcanic ridges, and steaming ground in certain spots. The hike to the viewpoints is considered one of the most fascinating volcanic walks in Iceland.',
    latitude: 63.893,
    longitude: -22.269,
    imageName: 'place_fagradalsfjall_flow_view.png',
  },
  {
    id: 'eyjafjallajokull-volcano',
    categoryId: 'active-volcano-views',
    title: 'Eyjafjallajökull Volcano',
    region: 'South Iceland',
    description:
      'Eyjafjallajökull gained global attention during its 2010 eruption, which sent ash high into the atmosphere and disrupted air travel across Europe. Beneath the glacier lies a powerful volcanic system that has shaped the surrounding landscape for centuries. Today the volcano can be viewed from scenic roads and viewpoints where visitors can see glaciers, valleys carved by meltwater, and wide volcanic plains. The contrast between ice and fire makes this location one of Iceland’s most iconic natural landmarks.',
    latitude: 63.633,
    longitude: -19.633,
    imageName: 'place_eyjafjallajokull_ice_fire.png',
  },
  {
    id: 'hekla-volcano',
    categoryId: 'active-volcano-views',
    title: 'Hekla Volcano',
    region: 'Icelandic Highlands',
    description:
      'Hekla is one of Iceland’s most active and historically significant volcanoes. Throughout the Middle Ages it was often referred to as the “Gateway to Hell” due to its frequent eruptions and dramatic lava flows. The volcano rises above the surrounding highlands and can sometimes be climbed when conditions allow. From a distance, Hekla’s long volcanic ridge dominates the horizon, reminding visitors of Iceland’s powerful geological forces beneath the surface.',
    latitude: 63.983,
    longitude: -19.7,
    imageName: 'place_hekla_ridge_panorama.png',
  },
  {
    id: 'grimsvotn-volcano',
    categoryId: 'active-volcano-views',
    title: 'Grímsvötn Volcano',
    region: 'Vatnajökull Glacier Region',
    description:
      'Hidden beneath the massive Vatnajökull glacier, Grímsvötn is Iceland’s most frequently erupting volcano. Its eruptions often interact with glacial ice, creating dramatic steam clouds and sudden glacial floods known as jökulhlaups. While the volcano itself lies beneath the ice, the surrounding glacier landscapes and volcanic plains offer breathtaking views of this powerful volcanic system. The region is considered one of the most geologically dynamic areas in Iceland.',
    latitude: 64.417,
    longitude: -17.333,
    imageName: 'place_grimsvotn_glacier_field.png',
  },
  {
    id: 'katla-volcano-viewpoint',
    categoryId: 'active-volcano-views',
    title: 'Katla Volcano Viewpoint',
    region: 'Mýrdalsjökull Glacier Area',
    description:
      'Katla is a massive volcano concealed beneath the Mýrdalsjökull glacier in southern Iceland. It is known for its powerful eruptions that historically caused massive floods and dramatic landscape changes. From nearby viewpoints, visitors can observe the glacier covering the volcano and the vast black sand plains created by past eruptions. The scale of the surrounding volcanic terrain gives a strong sense of the immense forces that shape Iceland’s landscape.',
    latitude: 63.633,
    longitude: -19.05,
    imageName: 'place_katla_black_sands_view.png',
  },

  {
    id: 'eldhraun-lava-field',
    categoryId: 'lava-landscapes',
    title: 'Eldhraun Lava Field',
    region: 'South Iceland',
    description:
      'Eldhraun is one of the largest lava fields on Earth, created during the catastrophic Laki eruption in 1783. Today the entire field is covered with thick green moss that grows over the rough volcanic rock, creating an almost surreal landscape. Walking through the area feels like stepping onto another planet, where waves of lava stretch across the horizon. The contrast between the dark volcanic stone and the soft green moss makes this one of Iceland’s most unique natural environments.',
    latitude: 63.783,
    longitude: -18.067,
    imageName: 'place_eldhraun_moss_waves.png',
  },
  {
    id: 'hallmundarhraun-lava-field',
    categoryId: 'lava-landscapes',
    title: 'Hallmundarhraun Lava Field',
    region: 'West Iceland',
    description:
      'Formed by ancient eruptions in western Iceland, Hallmundarhraun is a vast lava field filled with caves, lava tunnels, and unusual volcanic formations. Beneath the surface lie some of the country’s most impressive lava caves, including the famous Surtshellir. The rugged landscape reveals how molten lava once flowed across the region, leaving behind hardened rivers of stone and dramatic geological patterns.',
    latitude: 64.7,
    longitude: -20.8,
    imageName: 'place_hallmundarhraun_stone_rivers.png',
  },
  {
    id: 'dimmuborgir-lava-formations',
    categoryId: 'lava-landscapes',
    title: 'Dimmuborgir Lava Formations',
    region: 'Lake Mývatn Area',
    description:
      'Known as the “Dark Castles,” Dimmuborgir is a surreal volcanic landscape filled with towering lava pillars, arches, and strange rock formations. These structures were formed when lava flowed over wetlands thousands of years ago, creating hollow lava structures that later collapsed into unusual shapes. The area is filled with walking trails that allow visitors to explore these natural formations and experience one of Iceland’s most mysterious volcanic landscapes.',
    latitude: 65.592,
    longitude: -16.91,
    imageName: 'place_dimmuborgir_dark_castles.png',
  },
  {
    id: 'berserkjahraun-lava-field',
    categoryId: 'lava-landscapes',
    title: 'Berserkjahraun Lava Field',
    region: 'Snæfellsnes Peninsula',
    description:
      'This dramatic lava field stretches across the Snæfellsnes Peninsula and features jagged black rock formations created by ancient eruptions. The landscape is rugged and wild, with lava ridges rising from the ground in chaotic patterns. Small patches of moss and grass slowly reclaim the volcanic rock, adding texture and color to the dark terrain. The region is also tied to Icelandic sagas, giving the landscape both geological and cultural significance.',
    latitude: 64.925,
    longitude: -23.09,
    imageName: 'place_berserkjahraun_rugged_lines.png',
  },
  {
    id: 'leitarhraun-lava-field',
    categoryId: 'lava-landscapes',
    title: 'Leitarhraun Lava Field',
    region: 'Southwestern Iceland',
    description:
      'Leitarhraun is a large lava field formed thousands of years ago by eruptions in the Bláfjöll volcanic system. The lava once flowed across large areas of southwestern Iceland and helped shape the terrain near modern settlements. Today the field contains hardened lava waves, volcanic ridges, and unusual rock formations that reveal how the lava once moved across the land. It offers a fascinating look at Iceland’s long volcanic history.',
    latitude: 64.0,
    longitude: -21.7,
    imageName: 'place_leitarhraun_ancient_flow.png',
  },

  {
    id: 'hverfjall-crater',
    categoryId: 'crater-adventures',
    title: 'Hverfjall Crater',
    region: 'Lake Mývatn',
    description:
      'Hverfjall is one of the most symmetrical volcanic craters in Iceland and rises dramatically above the surrounding plains near Lake Mývatn. The crater is nearly one kilometer wide and can be explored by walking along its rim. From the top, visitors can see vast lava fields, volcanic deserts, and the unique landscapes of northern Iceland. The hike is relatively short but provides spectacular views of the region’s volcanic geology.',
    latitude: 65.608,
    longitude: -16.875,
    imageName: 'place_hverfjall_rim_walk.png',
  },
  {
    id: 'kerid-crater',
    categoryId: 'crater-adventures',
    title: 'Kerið Crater',
    region: 'Golden Circle',
    description:
      'Kerið is a colorful volcanic crater famous for its bright blue lake surrounded by deep red volcanic rock. The crater was formed thousands of years ago and is part of Iceland’s popular Golden Circle route. Visitors can walk along the rim for panoramic views or descend to the lake at the bottom of the crater. The vibrant colors and perfect circular shape make Kerið one of the most photographed volcanic sites in Iceland.',
    latitude: 64.041,
    longitude: -20.885,
    imageName: 'place_kerid_blue_lake_ring.png',
  },
  {
    id: 'saxholl-crater',
    categoryId: 'crater-adventures',
    title: 'Saxhóll Crater',
    region: 'Snæfellsjökull National Park',
    description:
      'Saxhóll is a beautifully shaped volcanic crater located within Snæfellsjökull National Park. A long staircase leads visitors to the top of the crater where they can enjoy sweeping views of surrounding lava fields and the dramatic Snæfellsjökull glacier. The symmetrical shape of the crater and its location within a rugged volcanic landscape make it a favorite stop for travelers exploring the peninsula.',
    latitude: 64.858,
    longitude: -23.781,
    imageName: 'place_saxholl_highland_steps.png',
  },
  {
    id: 'grabrok-crater',
    categoryId: 'crater-adventures',
    title: 'Grábrók Crater',
    region: 'West Iceland',
    description:
      'Grábrók is a steep volcanic crater located along Iceland’s Ring Road and can be climbed using a marked trail and wooden steps. From the summit, visitors can observe the surrounding lava fields that were created by ancient eruptions. The crater offers a striking example of Iceland’s volcanic terrain and provides an accessible volcanic hike for travelers passing through the region.',
    latitude: 64.774,
    longitude: -21.54,
    imageName: 'place_grabrok_ring_road_view.png',
  },
  {
    id: 'askja-crater',
    categoryId: 'crater-adventures',
    title: 'Askja Crater',
    region: 'Icelandic Highlands',
    description:
      'Askja is a remote volcanic caldera located deep within Iceland’s highlands. Inside the caldera lies the deep blue Öskjuvatn lake, one of the deepest lakes in the country. The area is known for its dramatic volcanic scenery, barren landscapes, and powerful geological history. Reaching Askja requires a journey through the rugged highlands, making it one of the most adventurous volcanic destinations in Iceland.',
    latitude: 65.033,
    longitude: -16.75,
    imageName: 'place_askja_remote_caldera.png',
  },

  {
    id: 'geysir-geothermal-area',
    categoryId: 'geothermal-wonders',
    title: 'Geysir Geothermal Area',
    region: 'Haukadalur',
    description:
      'The Geysir geothermal field is one of Iceland’s most famous natural attractions and the place where the word “geyser” originated. Although the original Great Geysir erupts only occasionally today, the nearby Strokkur geyser erupts regularly, sending hot water high into the air. The surrounding area is filled with steaming vents, bubbling pools, and colorful mineral deposits created by geothermal activity.',
    latitude: 64.313,
    longitude: -20.3,
    imageName: 'place_geysir_steam_column.png',
  },
  {
    id: 'haukadalur-valley',
    categoryId: 'geothermal-wonders',
    title: 'Haukadalur Valley',
    region: 'Southwest Iceland',
    description:
      'Haukadalur is a geothermal valley filled with powerful hot springs, steaming ground, and colorful mineral formations. The landscape constantly changes as geothermal water flows through the earth’s crust. Visitors walking through the area can see bubbling pools, rising steam, and bright mineral patterns on the ground. The valley provides a fascinating look at the geothermal forces that shape Iceland’s landscape.',
    latitude: 64.317,
    longitude: -20.3,
    imageName: 'place_haukadalur_mineral_ground.png',
  },
  {
    id: 'namaskard-geothermal-area',
    categoryId: 'geothermal-wonders',
    title: 'Námaskarð Geothermal Area',
    region: 'Near Lake Mývatn',
    description:
      'Námaskarð is a surreal geothermal region near Lake Mývatn where the ground is colored with shades of yellow, orange, and red due to mineral deposits. The area is filled with boiling mud pots, steaming vents, and strong geothermal activity. Walking trails allow visitors to explore the strange landscape and witness the raw geothermal power beneath the surface.',
    latitude: 65.64,
    longitude: -16.808,
    imageName: 'place_namaskard_color_fields.png',
  },
  {
    id: 'krysuvik-geothermal-area',
    categoryId: 'geothermal-wonders',
    title: 'Krýsuvík Geothermal Area',
    region: 'Reykjanes Peninsula',
    description:
      'Located on the Reykjanes Peninsula, Krýsuvík is a dramatic geothermal valley known for its bubbling mud pools and colorful mineral-rich ground. Steam constantly rises from cracks in the earth while geothermal gases create vibrant patterns in the soil. The area is easily accessible and provides an impressive introduction to Iceland’s geothermal environments.',
    latitude: 63.895,
    longitude: -22.052,
    imageName: 'place_krysuvik_steam_valley.png',
  },
  {
    id: 'hverir-geothermal-field',
    categoryId: 'geothermal-wonders',
    title: 'Hverir Geothermal Field',
    region: 'North Iceland',
    description:
      'Hverir is one of the most visually striking geothermal fields in Iceland. The ground here appears almost alien, covered in bright mineral deposits and dotted with steaming vents and boiling mud pools. The strong smell of sulfur fills the air as visitors walk along marked paths through the geothermal landscape. The dramatic scenery highlights the powerful geothermal activity beneath the region.',
    latitude: 65.64,
    longitude: -16.808,
    imageName: 'place_hverir_earth_steam.png',
  },
];

export const getPlacesByCategory = (categoryId: string): PlaceItem[] => {
  if (categoryId === 'all-categories') {
    return placeCatalog;
  }

  return placeCatalog.filter(item => item.categoryId === categoryId);
};