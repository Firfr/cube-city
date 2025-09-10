// 初始场景元数据
// 每个元素: { type: 'grass' | 'road', building: null | 'house' | 'house-2' }
// direction: 0/1/2/3 分别代表 右/下/左/上 四个方向
import { SIZE } from '@/constants/constants.js'
// 生成指定 size 的场景元数据
export function generateMetadata(size = SIZE) {
  function randomDirection() {
    // 随机返回 0, 1, 2, 3
    return Math.floor(Math.random() * 4)
  }
  return Array.from({ length: size }, (_, y) =>
    Array.from({ length: size }, (_, x) => {
      // 统一遍历 SIZE x SIZE 区域，x/y 均为 0~15
      // 允许在任意位置生成 road+house
      if (x === 8 && y === 8) {
        return {
          type: 'ground',
          building: 'factory',
          direction: 0, // house 随机方向
          x,
          y,
        }
      }
      return { type: 'grass', building: null, x, y }
    }))
}

// 默认导出 17x17 的初始元数据
const metadata = generateMetadata(SIZE)
export default metadata
