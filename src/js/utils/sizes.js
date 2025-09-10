import EventEmitter from './event-emitter.js'

export default class Sizes extends EventEmitter {
  /**
   * 初始化尺寸管理器
   * @param {HTMLElement} [element] - 可选的DOM元素,用于获取宽高
   */
  constructor(element) {
    super()

    // 设置目标元素
    this.element = element || window

    // 初始化尺寸
    this.updateSizes()

    // 监听resize事件
    window.addEventListener('resize', () => {
      this.updateSizes()
      this.trigger('resize')
    })
  }

  /**
   * 更新尺寸属性
   */
  updateSizes() {
    if (this.element === window) {
      this.width = window.innerWidth
      this.height = window.innerHeight
    }
    else {
      this.width = this.element.offsetWidth
      this.height = this.element.offsetHeight
    }

    this.aspect = this.width / this.height
    this.pixelRatio = Math.min(window.devicePixelRatio, 2)
  }
}
