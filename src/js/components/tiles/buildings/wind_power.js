import Building from '../building.js'

export default class WindPower extends Building {
  constructor(type = 'wind_power', level = 1, direction = 0, options = {}) {
    super(type, level, direction, options)

    this.fanRotationSpeed = 0.01 + Math.random() * 0.02

    // 使用新的配置系统，大部分状态效果已在配置文件中定义
    this.statusConfig = [
      // 继承基础的状态配置（包括道路检查和配置文件中的所有效果）

      {
        statusType: 'POWER_BOOST',
        condition: (building, gs) => {
          // 太阳能发电站正常运行时激活
          return gs.power >= 0
        },
        effect: { type: 'powerup', offsetY: 0.6 },
      },
    ]
  }

  getCost() {
    return this.options.buildingData?.cost || 0
  }

  // 风力发电提供清洁电力
  getPower() {
    return 30
  }

  // 重写 update 方法以调用新的轮循系统
  update() {
    // 调用父类的新轮循逻辑
    super.update()

    this.mesh.traverse((child) => {
      if (child.name === 'fan') {
        child.rotation.x += this.fanRotationSpeed
      }
    })
  }
}
