// 定义游戏模式，避免使用魔法字符串
export const MODES = {
  SELECT: 'select',
  BUILD: 'build',
  DEMOLISH: 'demolish',
  RELOCATE: 'relocate',
}

// 在这些模式下，选中的对象会保持高亮
export const PERSISTENT_HIGHLIGHT_MODES = [MODES.SELECT, MODES.RELOCATE, MODES.DEMOLISH]

// 可随意建造的建筑
export const FREE_BUILDING_TYPES = ['road', 'park', 'wind_power']
