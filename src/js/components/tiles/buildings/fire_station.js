import Building from '../building.js'

export default class FireStation extends Building {
  constructor(type = 'fire_station', level = 1, direction = 0, options = {}) {
    super(type, level, direction, options)

    // 使用新的配置系统，大部分状态效果已在配置文件中定义
    this.statusConfig = [
      // 继承基础的状态配置（包括道路检查和配置文件中的所有效果）
      ...super.getDefaultStatusConfig(),

      // === 特殊状态（无法配置化的复杂逻辑） ===
      // 缺少电力（全局状态检查）
      {
        statusType: 'MISSING_POWER',
        condition: (building, gs) => gs.power > gs.maxPower,
        effect: { type: 'missPower', offsetY: 0.7 },
      },
    ]
  }

  getCost() {
    return this.options.buildingData?.cost || 0
  }

  // 重写 update 方法以调用新的轮循系统
  update() {
    // 调用父类的新轮循逻辑
    super.update()
  }
}
