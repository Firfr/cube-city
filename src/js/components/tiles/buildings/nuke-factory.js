import Building from '../building.js'

// 核工厂类建筑
export default class NukeFactory extends Building {
  constructor(type = 'nuke_factory', level = 1, direction = 0, options = {}) {
    super(type, level, direction, options)

    // 使用新的配置系统，但核工厂有特殊的安全要求需要保留
    this.statusConfig = [
      // 继承基础的状态配置（包括道路检查和配置文件中的所有效果）
      ...super.getDefaultStatusConfig(),

      // === 特殊状态（核工厂的复杂安全逻辑） ===

      // 人口过载风险（特殊的密度检查）
      {
        statusType: 'OVER_POPULATION',
        condition: (building, gs) => {
          // 周围人口密度过高时激活风险警告
          const nearbyHouses = this.countTargetsInRange(['house', 'house2'], 3, gs)
          return nearbyHouses > 2 // 周围超过2栋住宅时警告
        },
        effect: { type: 'overPopulation', offsetY: 0.8 },
      },
    ]
  }

  countTargetsInRange(targets, range, gameState) {
    if (!gameState)
      return 0

    let count = 0
    for (let dx = -range; dx <= range; dx++) {
      for (let dy = -range; dy <= range; dy++) {
        if (dx === 0 && dy === 0)
          continue

        const neighborTile = gameState.getTile(this.x + dx, this.y + dy)
        if (neighborTile && targets.includes(neighborTile.building)) {
          count++
        }
      }
    }
    return count
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
