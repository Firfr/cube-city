// 建筑分类（RCI & ESG）
export const BUILDING_CATEGORIES = [
  { key: 'residential', label: {
    zh: '住宅',
    en: 'Residential',
  }, color: 'bg-blue-400' },
  { key: 'commercial', label: {
    zh: '商业',
    en: 'Commercial',
  }, color: 'bg-yellow-400' },
  { key: 'industrial', label: {
    zh: '工业',
    en: 'Industrial',
  }, color: 'bg-red-400' },
  { key: 'infrastructure', label: {
    zh: '基础设施',
    en: 'Infrastructure',
  }, color: 'bg-purple-400' },
  { key: 'environment', label: {
    zh: '环境',
    en: 'Environment',
  }, color: 'bg-green-400' },
  { key: 'social', label: {
    zh: '社会',
    en: 'Social',
  }, color: 'bg-pink-400' },
  { key: 'governance', label: {
    zh: '治理',
    en: 'Governance',
  }, color: 'bg-gray-400' },
]

/**
 * 建筑数据结构定义
 * @typedef {object} BuildingData
 * @property {object} name - 建筑名称
 * @property {string} name.zh - 中文名称
 * @property {string} name.en - 英文名称
 * @property {string} type - 建筑类型标识符
 * @property {string} icon - 建筑图标(emoji)
 * @property {object} buildingType - 建筑类型名称
 * @property {string} buildingType.zh - 建筑类型中文名
 * @property {string} buildingType.en - 建筑类型英文名
 * @property {string} category - 建筑分类(residential|commercial|industrial|infrastructure|governance)
 * @property {object} levels - 建筑等级配置
 * @property {object} levels[level] - 每个等级的具体配置
 * @property {object} levels[level].displayName - 该等级显示名称
 * @property {string} levels[level].displayName.zh - 中文显示名
 * @property {string} levels[level].displayName.en - 英文显示名
 * @property {number} levels[level].cost - 建造成本
 * @property {number} levels[level].maxPopulation - 最大人口容量
 * @property {number} levels[level].powerUsage - 电力消耗
 * @property {number} levels[level].pollution - 污染值
 * @property {number|null} levels[level].upgradeCost - 升级到下一等级的成本(null表示无法升级)
 * @property {number|null} levels[level].nextLevel - 下一等级编号(null表示无下一等级)
 * @property {boolean} levels[level].visible - 是否在建造菜单中可见
 */

export const BUILDING_DATA = {
  // ===================== 住宅建筑 =====================
  house: {
    name: { zh: '住宅', en: 'Residential' },
    type: 'house',
    icon: '🏠',
    buildingType: { zh: '住宅建筑', en: 'Residential Building' },
    category: 'residential',
    levels: {
      1: {
        displayName: { zh: '普通住宅', en: 'Basic Residential' },
        cost: 300,
        maxPopulation: 30, // 36→30 (覆盖工厂20+商店10)
        powerUsage: 10,
        pollution: 2,
        coinOutput: 5, // 5/300=0.0167
        upgradeCost: 600,
        nextLevel: 2,
        visible: true,
        category: 'residential',
      },
      2: {
        displayName: { zh: '高级住宅', en: 'Advanced Residential' },
        cost: 600,
        maxPopulation: 72, // 90→72 (覆盖高级商店20+化学工厂55)
        powerUsage: 15,
        pollution: 3,
        coinOutput: 11, // 11/600=0.0183
        upgradeCost: 1200,
        nextLevel: 3,
        visible: false,
        category: 'residential',
      },
      3: {
        displayName: { zh: '豪华住宅', en: 'Luxury Residential' },
        cost: 1200,
        maxPopulation: 120, // 144→120 (覆盖购物中心40+现代化工厂80)
        powerUsage: 20,
        pollution: 5,
        coinOutput: 24, // 24/1200=0.0200
        upgradeCost: null,
        nextLevel: null,
        visible: false,
        category: 'residential',
      },
    },
  },

  house2: {
    name: { zh: '民宅', en: 'House' },
    type: 'house2',
    icon: '🏡',
    buildingType: { zh: '住宅建筑', en: 'Residential Building' },
    category: 'residential',
    levels: {
      1: {
        displayName: { zh: '普通民宅', en: 'Basic House' },
        cost: 400,
        maxPopulation: 39, // 42→39 (1.3倍覆盖率)
        powerUsage: 8,
        pollution: 1,
        coinOutput: 7, // 7/400=0.0175 (原6→7)
        upgradeCost: 800,
        nextLevel: 2,
        visible: true,
        category: 'residential',
      },
      2: {
        displayName: { zh: '高级民宅', en: 'Advanced House' },
        cost: 800,
        maxPopulation: 98, // 102→98 (1.3倍覆盖率)
        powerUsage: 12,
        pollution: 2,
        coinOutput: 14, // 14/800=0.0175
        upgradeCost: 1600,
        nextLevel: 3,
        visible: false,
        category: 'residential',
      },
      3: {
        displayName: { zh: '豪华民宅', en: 'Luxury House' },
        cost: 1600,
        maxPopulation: 156, // 168→156 (1.3倍覆盖率)
        powerUsage: 18,
        pollution: 3,
        coinOutput: 32, // 32/1600=0.0200
        upgradeCost: null,
        nextLevel: null,
        visible: false,
        category: 'residential',
      },
    },
  },

  // ===================== 工业建筑 =====================
  factory: {
    name: { zh: '工厂', en: 'Factory' },
    type: 'factory',
    icon: '🏭',
    buildingType: { zh: '工业建筑', en: 'Industrial Building' },
    category: 'industrial',
    levels: {
      1: {
        displayName: { zh: '普通工厂', en: 'Basic Factory' },
        cost: 500,
        powerUsage: 40,
        pollution: 22, // 20→22 (污染/成本=0.044)
        coinOutput: 70, // 70/500=0.140
        population: 20, // 工作岗位不变
        upgradeCost: 1000,
        nextLevel: null,
        visible: true,
        category: 'industrial',
      },
    },
  },

  chemistry_factory: {
    name: { zh: '化学工厂', en: 'Chemistry Factory' },
    type: 'chemistry_factory',
    icon: '🧪',
    buildingType: { zh: '化学工厂', en: 'Chemistry Factory' },
    category: 'industrial',
    levels: {
      1: {
        displayName: { zh: '化学工厂', en: 'Chemistry Factory' },
        cost: 1000,
        powerUsage: 60,
        pollution: 45, // 保持45 (污染/成本=0.045)
        coinOutput: 140, // 150→140 (140/1000=0.140)
        population: 35, // 工作岗位不变
        upgradeCost: 1500,
        nextLevel: 2,
        visible: true,
        category: 'industrial',
      },
      2: {
        displayName: { zh: '高级化学工厂', en: 'Advanced Chemistry Factory' },
        cost: 1500,
        powerUsage: 80,
        pollution: 65,
        coinOutput: 240, // 240/1500=0.160 (效率↑)
        population: 55,
        upgradeCost: 2000,
        nextLevel: 3,
        visible: false,
        category: 'industrial',
      },
      3: {
        displayName: { zh: '现代化化学工厂', en: 'Modern Chemistry Factory' },
        cost: 2000,
        powerUsage: 100,
        pollution: 90,
        coinOutput: 350, // 350/2000=0.175 (效率↑)
        population: 80,
        upgradeCost: null,
        nextLevel: null,
        visible: false,
        category: 'industrial',
      },
    },
  },

  nuke_factory: {
    name: { zh: '核电站', en: 'Nuclear Power Plant' },
    type: 'nuke_factory',
    icon: '☢️',
    buildingType: { zh: '核电站', en: 'Nuclear Power Plant' },
    category: 'industrial',
    levels: {
      1: {
        displayName: { zh: '核电站', en: 'Nuclear Power Plant' },
        cost: 5000,
        powerOutput: 300,
        pollution: 40,
        coinOutput: 0, // 50→0 (原则6)
        population: 50,
        upgradeCost: null,
        nextLevel: null,
        visible: true,
        category: 'commercial',
      },
    },
  },

  // ===================== 商业建筑 =====================
  shop: {
    name: { zh: '商店', en: 'Shop' },
    type: 'shop',
    icon: '🏬',
    buildingType: { zh: '商业建筑', en: 'Commercial Building' },
    category: 'commercial',
    levels: {
      1: {
        displayName: { zh: '普通商店', en: 'Basic Shop' },
        cost: 400,
        powerUsage: 15,
        pollution: 6, // 5→6 (污染/成本=0.015)
        coinOutput: 24, // 25→24 (24/400=0.060)
        population: 10, // 工作岗位不变
        upgradeCost: 800,
        nextLevel: 2,
        visible: true,
      },
      2: {
        displayName: { zh: '高级商店', en: 'Advanced Shop' },
        cost: 800,
        powerUsage: 25,
        pollution: 8,
        coinOutput: 60, // 60/800=0.075 (效率↑)
        population: 20,
        upgradeCost: 1600,
        nextLevel: 3,
        visible: false,
        category: 'commercial',
      },
      3: {
        displayName: { zh: '购物中心', en: 'Shopping Center' },
        cost: 1600,
        powerUsage: 40,
        pollution: 12,
        coinOutput: 140, // 140/1600=0.0875 (效率↑)
        population: 40,
        upgradeCost: null,
        nextLevel: null,
        visible: false,
        category: 'commercial',
      },
    },
  },

  office: {
    name: { zh: '办公室', en: 'Office' },
    type: 'office',
    icon: '🏢',
    buildingType: { zh: '办公建筑', en: 'Office Building' },
    category: 'commercial',
    levels: {
      1: {
        displayName: { zh: '普通办公室', en: 'Basic Office' },
        cost: 500,
        powerUsage: 30,
        pollution: 7, // 8→7 (污染/成本=0.014)
        coinOutput: 30, // 35→30 (30/500=0.060)
        population: 15, // 工作岗位不变
        upgradeCost: 1000,
        nextLevel: 2,
        visible: true,
        category: 'commercial',
      },
      2: {
        displayName: { zh: '高级办公室', en: 'Advanced Office' },
        cost: 1000,
        powerUsage: 45,
        pollution: 12,
        coinOutput: 80, // 80/1000=0.080 (效率↑)
        population: 30,
        upgradeCost: 2000,
        nextLevel: 3,
        visible: false,
        category: 'commercial',
      },
      3: {
        displayName: { zh: '商务中心', en: 'Business Center' },
        cost: 2000,
        powerUsage: 65,
        pollution: 18,
        coinOutput: 180, // 180/2000=0.090 (效率↑)
        population: 60,
        upgradeCost: null,
        nextLevel: null,
        visible: false,
        category: 'commercial',
      },
    },
  },

  // ===================== 环境设施 =====================
  park: {
    name: { zh: '公园', en: 'Park' },
    type: 'park',
    icon: '🌳',
    buildingType: { zh: '环境设施', en: 'Environmental Facility' },
    category: 'social',
    levels: {
      1: {
        displayName: { zh: '小公园', en: 'Small Park' },
        cost: 200,
        powerUsage: 5,
        pollution: -10, // -10/200=-0.05
        population: 0,
        upgradeCost: 400,
        nextLevel: 2,
        visible: true,
        category: 'social',
      },
      2: {
        displayName: { zh: '社区公园', en: 'Community Park' },
        cost: 400,
        powerUsage: 8,
        pollution: -20, // -20/400=-0.05
        population: 0,
        upgradeCost: 800,
        nextLevel: 3,
        visible: false,
        category: 'social',
      },
      3: {
        displayName: { zh: '城市公园', en: 'City Park' },
        cost: 800,
        powerUsage: 12,
        pollution: -40, // -30→-40 (-40/800=-0.05)
        population: 0,
        upgradeCost: null,
        nextLevel: null,
        visible: false,
        category: 'social',
      },
    },
  },

  garbage_station: {
    name: { zh: '垃圾站', en: 'Garbage Station' },
    type: 'garbage_station',
    icon: '🗑️',
    buildingType: { zh: '环境设施', en: 'Environmental Facility' },
    category: 'environment',
    levels: {
      1: {
        displayName: { zh: '垃圾站', en: 'Garbage Station' },
        cost: 500,
        powerUsage: 20,
        pollution: -15, // -15/500=-0.03
        population: 10,
        upgradeCost: null,
        nextLevel: null,
        visible: true,
        category: 'environment',
      },
    },
  },

  sun_power: {
    name: { zh: '太阳能电板', en: 'Solar Panel' },
    type: 'sun_power',
    icon: '☀️',
    buildingType: { zh: '环境设施', en: 'Environmental Facility' },
    category: 'environment',
    levels: {
      1: {
        displayName: { zh: '太阳能电板', en: 'Solar Panel' },
        cost: 800,
        powerOutput: 50,
        pollution: -10,
        population: 5,
        coinOutput: 0, // 50→0 (原则6)
        upgradeCost: null,
        nextLevel: null,
        visible: true,
        category: 'environment',
      },
    },
  },

  water_tower: {
    name: { zh: '水塔', en: 'Water Tower' },
    type: 'water_tower',
    icon: '🚰',
    buildingType: { zh: '环境设施', en: 'Environmental Facility' },
    category: 'environment',
    levels: {
      1: {
        displayName: { zh: '水塔', en: 'Water Tower' },
        cost: 700,
        powerUsage: 15,
        pollution: 0,
        population: 3,
        upgradeCost: null,
        nextLevel: null,
        visible: true,
        category: 'environment',
      },
    },
  },

  wind_power: {
    name: { zh: '风力发电塔', en: 'Wind Power' },
    type: 'wind_power',
    icon: '🌬️',
    buildingType: { zh: '环境设施', en: 'Environmental Facility' },
    category: 'environment',
    levels: {
      1: {
        displayName: { zh: '风力发电塔', en: 'Wind Power' },
        cost: 900,
        powerOutput: 70,
        pollution: -15,
        population: 5,
        upgradeCost: null,
        nextLevel: null,
        visible: true,
        category: 'environment',
      },
    },
  },

  hero_park: {
    name: { zh: '英雄纪念碑', en: 'Hero Monument' },
    type: 'hero_park',
    icon: '🗽',
    buildingType: { zh: '社会设施', en: 'Social Facility' },
    category: 'social',
    levels: {
      1: {
        displayName: { zh: '英雄纪念碑', en: 'Hero Monument' },
        cost: 1200,
        powerUsage: 10,
        pollution: -5,
        population: 0,
        upgradeCost: null,
        nextLevel: null,
        visible: true,
        category: 'social',
      },
    },
  },

  // ===================== 基础设施 =====================
  road: {
    name: { zh: '道路', en: 'Road' },
    type: 'road',
    icon: '🛣️',
    buildingType: { zh: '道路', en: 'Road' },
    category: 'infrastructure',
    levels: {
      1: {
        displayName: { zh: '道路', en: 'Road' },
        cost: 0,
        powerUsage: 0,
        pollution: 0,
        population: 0,
        upgradeCost: null,
        nextLevel: null,
        visible: true,
        category: 'infrastructure',
      },
    },
  },

  // ===================== 治理设施 =====================
  hospital: {
    name: { zh: '医院', en: 'Hospital' },
    type: 'hospital',
    icon: '🏥',
    buildingType: { zh: '社会设施', en: 'Social Facility' },
    category: 'governance',
    levels: {
      1: {
        displayName: { zh: '医院', en: 'Hospital' },
        cost: 1000,
        powerUsage: 40,
        pollution: 0,
        population: 40,
        upgradeCost: null,
        nextLevel: null,
        visible: true,
        category: 'governance',
      },
    },
  },

  police: {
    name: { zh: '警察局', en: 'Police Station' },
    type: 'police',
    icon: '👮',
    buildingType: { zh: '治理设施', en: 'Governance Facility' },
    category: 'governance',
    levels: {
      1: {
        displayName: { zh: '警察局', en: 'Police Station' },
        cost: 1200,
        powerUsage: 30,
        pollution: 0,
        population: 25,
        upgradeCost: null,
        nextLevel: null,
        visible: true,
        category: 'governance',
      },
    },
  },

  fire_station: {
    name: { zh: '消防站', en: 'Fire Station' },
    type: 'fire_station',
    icon: '🚒',
    buildingType: { zh: '社会设施', en: 'Social Facility' },
    category: 'governance',
    levels: {
      1: {
        displayName: { zh: '消防站', en: 'Fire Station' },
        cost: 900,
        powerUsage: 35,
        pollution: 0,
        population: 20,
        upgradeCost: null,
        nextLevel: null,
        visible: true,
        category: 'governance',
      },
    },
  },
}
// 操作模式常量
export const BUILDING_MODES = [
  { key: 'select', label: {
    zh: '选择',
    en: 'Select',
  }, icon: '🔍' },
  { key: 'build', label: {
    zh: '建造',
    en: 'Build',
  }, icon: '🏗️' },
  { key: 'relocate', label: {
    zh: '搬迁',
    en: 'Relocate',
  }, icon: '🚧' },
  { key: 'demolish', label: {
    zh: '拆除',
    en: 'Demolish',
  }, icon: '💥' },
]

// 其它全局常量
export const SIZE = 17
export const SIMOBJECT_SELECTED_OPACITY = 0.5 // 选中/高亮时透明度
export const SIMOBJECT_DEFAULT_OPACITY = 1.0 // 默认透明度
export const SELECTED_COLOR = 0xFFBB00
export const SELECTED_COLOR_OPACITY = 0.75
export const BUILD_COLOR = 0x00FF00
export const BUILD_COLOR_OPACITY = 0.7
export const DEMOLISH_COLOR = 0xFF3000
export const DEMOLISH_COLOR_OPACITY = 0.7
export const HIGHLIGHTED_COLOR = 0x555555
export const HIGHLIGHTED_COLOR_OPACITY = 0.7
export const RELOCATE_COLOR = 0x0303FF
export const RELOCATE_COLOR_OPACITY = 0.7
// 新增：建造无效时的橙色高亮
export const BUILD_INVALID_COLOR = 0x555555 // 橙色
export const BUILD_INVALID_COLOR_OPACITY = 0.7

// ===================== 稳定度系统配置 =====================
/**
 * 稳定度变化率配置（每秒基础值）
 * 实际使用时会根据游戏更新间隔（5秒）进行调整
 */
export const STABILITY_CONFIG = {
  // 基础稳定度
  BASE_STABILITY: 100,
  // 默认稳定变化率
  DEFAULT_STABILITY_CHANGE_RATE: 0.1,
  // 服务建筑带来的稳定度提升
  SERVICE_STABILITY_PER_SECOND: 0.06, // 0.05 → 0.06 (每5秒+0.3，略微增强)

  // 失业导致的稳定度下降
  UNEMPLOYMENT_STABILITY_PENALTY: 0.4, // 0.5 → 0.4 (每5秒×2.0，减轻失业惩罚)

  // 污染导致的稳定度下降
  POLLUTION_THRESHOLD: 60, // 50 → 60 (提高污染容忍度)
  POLLUTION_STABILITY_PENALTY: 0.15, // 0.2 → 0.15 (每5秒×0.75，减轻污染惩罚)

  // 电力不足导致的稳定度下降
  POWER_DEFICIT_STABILITY_PENALTY: 0.6, // 1.0 → 0.6 (每5秒×3.0，大幅减轻电力惩罚)

  // 游戏更新间隔（秒）
  UPDATE_INTERVAL: 5, // 每5秒更新一次
}

/**
 * 获取按更新间隔调整后的稳定度变化率
 * @param {number} baseRate - 每秒基础变化率
 * @returns {number} 按更新间隔调整后的变化率
 */
export function getAdjustedStabilityRate(baseRate) {
  return baseRate * STABILITY_CONFIG.UPDATE_INTERVAL
}
