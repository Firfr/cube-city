/**
 * 建筑相互作用配置系统
 * 定义建筑之间的相互影响和UI状态效果
 */
export const BUILDING_INTERACTIONS = {
  chemistry_factory: {
    // 不再定义base值，直接定义修正器
    modifiers: {
      pollution: [
        {
          targets: ['factory'],
          range: 3,
          effect: 0.2, // 增加20%污染
          description: '附近工厂形成工业集群，减少污染排放',
        },
        {
          targets: ['garbage_station'],
          range: 2,
          effect: -0.3, // 垃圾站进一步减少30%污染
          description: '垃圾站处理工业废料',
        },
      ],
      coinOutput: [
        {
          targets: ['factory'],
          range: 2,
          effect: 0.2, // 增加20%收入
          description: '工业集群协同效应',
        },
        {
          targets: ['garbage_station', 'park'],
          range: 3,
          effect: 0.15, // 清洁环境增加15%收入
          description: '良好环境提升生产效率',
          requireAll: false, // 只需要其中一种即可
        },
      ],
    },
    // UI状态效果配置
    statusEffects: [
      {
        type: 'MISSING_FACTORY_SUPPORT',
        condition: { targets: ['factory'], range: 3, inverse: true },
        effect: { type: 'pollutionUpBuff', offsetY: 0.7 },
      },
      {
        type: 'MISSING_CLEANUP',
        condition: { targets: ['garbage_station'], range: 3, inverse: true },
        effect: { type: 'pollutionUpBuff', offsetY: 0.7 },
      },
      {
        type: 'GETTING_CLEANUP',
        condition: { targets: ['garbage_station'], range: 3, inverse: false },
        effect: { type: 'pollutionDownBuff', offsetY: 0.7 },
      },

    ],
  },

  garbage_station: {
    statusEffects: [
      {
        type: 'GETTING_CLEANUP',
        condition: { targets: ['factory', 'chemistry_factory'], range: 3, inverse: false },
        effect: { type: 'pollutionLowerBuff', offsetY: 0.7 },
      },
    ],
  },
  factory: {
    modifiers: {
      pollution: [
        {
          targets: ['park', 'hero_park', 'sun_power', 'wind_power'],
          range: 1,
          effect: -0.25, // 每个相邻公园减少25%
          description: '相邻绿化减少污染',
          stackable: true, // 可叠加效果
        },
        {
          targets: ['chemistry_factory'],
          range: 1,
          effect: -0.25,
          description: '化学工厂减少污染',
          stackable: false,
        },
      ],
      coinOutput: [
        {
          targets: ['water_tower'],
          range: 1,
          effect: 0.25,
          description: '水塔增加收入',
          stackable: true,
          maxStacks: 4,
        },
      ],
    },
    statusEffects: [
      {
        type: 'POLLUTION_WARNING',
        condition: { targets: ['park', 'hero_park', 'sun_power', 'wind_power'], range: 1, inverse: true },
        effect: { type: 'pollutionUpBuff', offsetY: 0.7 },
      },
    ],
  },

  water_tower: {
    statusEffects: [
      {
        type: 'ECONOMIC_BOOST',
        condition: { targets: ['shop'], range: 1, inverse: false },
        effect: { type: 'coinBuff' },
      },
    ],
  },

  // 商业建筑的相互作用
  shop: {
    modifiers: {
      coinOutput: [
        {
          targets: ['park', 'hero_park'],
          range: 1,
          effect: 0.1, // 相邻公园增加10%收入
          description: '优美环境吸引顾客',
          stackable: true,
          maxStacks: 4,
        },
      ],
    },
    statusEffects: [
      {
        type: 'CUSTOMER_BOOST',
        condition: { targets: ['park', 'hero_park'], range: 1, inverse: false },
        effect: { type: 'happy', offsetY: 0.7 },
      },
    ],
  },

  office: {
    modifiers: {
      coinOutput: [
        {
          targets: ['park', 'hero_park'],
          range: 1,
          effect: 0.12, // 公园环境提升办公效率
          description: '优美环境提升办公效率',
          stackable: true,
          maxStacks: 4,
        },
      ],
    },
    statusEffects: [
      {
        type: 'ENVIRONMENT_BOOST',
        condition: { targets: ['park', 'hero_park'], range: 1, inverse: false },
        effect: { type: 'happy', offsetY: 0.7 },
      },
    ],
  },

  // 住宅建筑的相互作用
  house: {
    modifiers: {
      maxPopulation: [
        {
          targets: ['park', 'hero_park'],
          range: 1,
          effect: 0.1, // 每个相邻公园增加10%人口容量
          description: '公园环境吸引更多居民',
          stackable: true,
          maxStacks: 4,
        },
        {
          targets: ['factory', 'chemistry_factory'],
          range: 1,
          effect: -0.15,
          description: '工厂环境减少居民',
          stackable: true,
          maxStacks: 4,
        },
      ],
    },
    statusEffects: [
      {
        type: 'ENVIRONMENT_BOOST',
        condition: { targets: ['park', 'hero_park'], range: 1, inverse: false },
        effect: { type: 'happy', offsetY: 0.7 },
      },
      {
        type: 'SAD',
        condition: { targets: ['factory', 'chemistry_factory'], range: 1, inverse: false },
        effect: { type: 'sad', offsetY: 0.7 },
      },
    ],
  },

  house2: {
    modifiers: {
      maxPopulation: [
        {
          targets: ['park', 'hero_park'],
          range: 1,
          effect: 0.1, // 每个相邻公园增加10%人口容量
          description: '公园环境吸引更多居民',
          stackable: true,
          maxStacks: 4,
        },
        {
          targets: ['factory', 'chemistry_factory'],
          range: 1,
          effect: -0.15,
          description: '工厂环境减少居民',
          stackable: true,
          maxStacks: 4,
        },
      ],
    },
    statusEffects: [
      {
        type: 'ENVIRONMENT_BOOST',
        condition: { targets: ['park', 'hero_park'], range: 1, inverse: false },
        effect: { type: 'happy', offsetY: 0.7 },
      },
      {
        type: 'SAD',
        condition: { targets: ['factory', 'chemistry_factory'], range: 1, inverse: false },
        effect: { type: 'sad', offsetY: 0.7 },
      },
    ],
  },

  // 电力设施的相互作用
  sun_power: {
    modifiers: {
      powerOutput: [
        {
          targets: ['house', 'house2'],
          range: 1,
          effect: 0.05, // 每个相邻住宅增加5%发电效率
          description: '清洁环境提升太阳能效率',
          stackable: true,
          maxStacks: 4,
        },
        {
          targets: ['sun_power', 'wind_power'],
          range: 1,
          effect: 0.05,
          description: '发电设施相邻也会提升发电效率',
          stackable: true,
          maxStacks: 4,
        },
      ],
    },
    statusEffects: [
      {
        type: 'EFFICIENCY_BOOST',
        condition: { targets: ['house', 'house2', 'wind_power', 'sun_power'], range: 1, inverse: false },
        effect: { type: 'powerBuff', offsetY: 0.7 },
      },
      {
        type: 'GETTING_CLEANUP',
        condition: { targets: ['factory', 'chemistry_factory'], range: 1, inverse: false },
        effect: { type: 'pollutionDownBuff', offsetY: 0.7 },
      },

    ],
  },

  wind_power: {
    modifiers: {
      powerOutput: [
        {
          targets: ['park', 'hero_park'],
          range: 1,
          effect: 0.08, // 开阔环境提升风电效率
          description: '开阔环境增强风力发电',
          stackable: true,
          maxStacks: 4,
        },
      ],
    },
    statusEffects: [
      {
        type: 'WIND_BOOST',
        condition: { targets: ['park', 'hero_park'], range: 1, inverse: false },
        effect: { type: 'powerup', offsetY: 0.7 },
      },
    ],
  },

  park: {
    statusEffects: [
      {
        type: 'HUMAN_BOOST',
        condition: { targets: ['house', 'house2'], range: 1, inverse: false },
        effect: { type: 'humanBuff', offsetY: 0.7 },
      },
      {
        type: 'COIN_BOOST',
        condition: { targets: ['shop', 'office'], range: 1, inverse: false },
        effect: { type: 'coinBuff', offsetY: 0.7 },
      },
      {
        type: 'GETTING_CLEANUP',
        condition: { targets: ['factory', 'chemistry_factory'], range: 1, inverse: false },
        effect: { type: 'pollutionDownBuff', offsetY: 0.7 },
      },
    ],
  },

}
