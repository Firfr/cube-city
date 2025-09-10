import { SIZE } from '@/constants/constants.js'
// 场景元数据管理类
import { generateMetadata } from './metadata.js'

export default class SceneMetadata {
  constructor(size = 16) {
    // 记录当前 size
    this.size = size
    // 初始化元数据
    this.metadata = generateMetadata(size)
  }

  // 生成指定 size 的元数据，并替换当前元数据
  generateData(size = SIZE) {
    this.size = size
    this.metadata = generateMetadata(size)
    return this.metadata
  }

  // 获取指定位置的元数据
  get(x, y) {
    if (
      y >= 0 && y < this.metadata.length
      && x >= 0 && x < this.metadata[y].length
    ) {
      return this.metadata[y][x]
    }
    return null
  }

  // 设置指定位置的元数据
  set(x, y, data) {
    if (
      y >= 0 && y < this.metadata.length
      && x >= 0 && x < this.metadata[y].length
    ) {
      this.metadata[y][x] = { ...this.metadata[y][x], ...data }
    }
  }

  // 重置为初始元数据（当前 size）
  reset() {
    this.metadata = generateMetadata(this.size)
  }

  // 获取全部元数据（每次都重新生成，保证最新）
  getAll(size = this.size) {
    return this.generateData(size)
  }
}
