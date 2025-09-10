import { DEG2RAD } from 'three/src/math/MathUtils.js'
import Experience from '../../../experience.js'
import Building from '../building.js'

/**
 * 代表道路的建筑类型.
 * 它的模型会根据相邻的道路自动更新.
 */
export default class Road extends Building {
  constructor(type = 'road', level = 1, direction = 0, options = {}) {
    super(type, level, direction, options)

    this.experience = new Experience()
    this.resources = this.experience.resources

    this.type = 'road'
    this.name = 'Road'
    this.style = 'straight' // 默认样式
    this.hideTerrain = true
    this.mesh.position.set(0, 0.01, 0)
  }

  /**
   * 根据相邻地块是否也是道路来更新道路模型
   * @param {City} city
   */
  refreshView(city) {
    // 建筑是作为子对象添加到Tile上的，所以它的parent就是Tile实例
    const tile = this.parent
    if (!tile)
      return

    const [x, y] = tile.name.split('-').slice(1).map(Number)

    // 检查相邻地块的建筑类型
    const top = city.getTile(x, y - 1)?.buildingInstance?.type === 'road'
    const bottom = city.getTile(x, y + 1)?.buildingInstance?.type === 'road'
    const left = city.getTile(x - 1, y)?.buildingInstance?.type === 'road'
    const right = city.getTile(x + 1, y)?.buildingInstance?.type === 'road'

    let resourceName = 'road' // 默认为直线
    let rotationY = 0

    // --- 判断道路样式和旋转角度 ---

    // 四向交叉口
    if (top && bottom && left && right) {
      resourceName = 'road4Way'
      rotationY = 0
    }
    // T 型交叉口
    else if (!top && bottom && left && right) { // 下、左、右
      resourceName = 'road3Way'
      rotationY = 0
    }
    else if (top && !bottom && left && right) { // 上、左、右
      resourceName = 'road3Way'
      rotationY = 180 * DEG2RAD
    }
    else if (top && bottom && !left && right) { // 上、下、右
      resourceName = 'road3Way'
      rotationY = 90 * DEG2RAD
    }
    else if (top && bottom && left && !right) { // 上、下、左
      resourceName = 'road3Way'
      rotationY = 270 * DEG2RAD
    }
    // 弯道
    else if (top && !bottom && left && !right) { // 上、左
      resourceName = 'roadBend'
      rotationY = 180 * DEG2RAD
    }
    else if (top && !bottom && !left && right) { // 上、右
      resourceName = 'roadBend'
      rotationY = 90 * DEG2RAD
    }
    else if (!top && bottom && left && !right) { // 下、左
      resourceName = 'roadBend'
      rotationY = 270 * DEG2RAD
    }
    else if (!top && bottom && !left && right) { // 下、右
      resourceName = 'roadBend'
      rotationY = 0
    }
    // 直线
    else if (top && bottom && !left && !right) { // 上、下
      resourceName = 'road'
      rotationY = 0
    }
    else if (!top && !bottom && left && right) { // 左、右
      resourceName = 'road'
      rotationY = 90 * DEG2RAD
    }
    // 断头路 (使用直线模型)
    else if (top && !bottom && !left && !right) { // 上
      resourceName = 'road'
      rotationY = 0 // 直线模型本身是垂直的，对应上/下
    }
    else if (!top && bottom && !left && !right) { // 下
      resourceName = 'road'
      rotationY = 0
    }
    else if (!top && !bottom && left && !right) { // 左
      resourceName = 'road'
      rotationY = 90 * DEG2RAD // 旋转90度变为水平
    }
    else if (!top && !bottom && !left && right) { // 右
      resourceName = 'road'
      rotationY = 90 * DEG2RAD
    }

    const resource = this.resources.items[resourceName]

    if (resource && resource.scene) {
      // 使用 SimObject 的方法来初始化模型，这会处理材质克隆等
      const newMesh = this.initMeshFromResource(resource)
      if (newMesh) {
        newMesh.rotation.y = rotationY
        newMesh.scale.set(0.98, 1, 0.98)
        newMesh.position.set(0, 0.01, 0)
        this.setMesh(newMesh)
      }
    }
  }

  /**
   * 返回此对象的HTML表示形式
   * @returns {string}
   */
  toHTML() {
    let html = super.toHTML()
    html += `
    <span class="info-label">Style </span>
    <span class="info-value">${this.style}</span>
    <br>
    `
    return html
  }
}
