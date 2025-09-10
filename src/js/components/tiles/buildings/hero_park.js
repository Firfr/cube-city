import Building from '../building.js'

export default class HeroPark extends Building {
  constructor(type = 'hero_park', level = 1, direction = 0, options = {}) {
    super(type, level, direction, options)

    // 使用新的配置系统，但英雄公园有特殊的多条件增益逻辑
    this.statusConfig = [
      // 继承基础的状态配置（包括道路检查和配置文件中的所有效果）
      ...super.getDefaultStatusConfig(),
    ]
  }

  // 注意：原有的辅助方法已被新的配置系统替代

  getCost() {
    return this.options.buildingData?.cost || 0
  }

  // 重写 update 方法以调用新的轮循系统
  update() {
    // 调用父类的新轮循逻辑
    super.update()
  }
}
