import { BUILD_COLOR, BUILD_COLOR_OPACITY, BUILD_INVALID_COLOR, BUILD_INVALID_COLOR_OPACITY, DEMOLISH_COLOR, DEMOLISH_COLOR_OPACITY, HIGHLIGHTED_COLOR, RELOCATE_COLOR, RELOCATE_COLOR_OPACITY, SELECTED_COLOR, SELECTED_COLOR_OPACITY, SIMOBJECT_DEFAULT_OPACITY, SIMOBJECT_SELECTED_OPACITY } from '@/constants/constants.js'
import gsap from 'gsap'
import * as THREE from 'three'

// SimObject 互动基类，所有可交互对象继承自此类
export default class SimObject extends THREE.Object3D {
  /** @type {THREE.Mesh?} */
  #mesh = null
  /** @type {THREE.Vector3} */
  #worldPos = new THREE.Vector3()

  /**
   * @param {number} x 对象的 x 坐标
   * @param {number} y 对象的 y 坐标
   * @param {object} resource 可选，threejs 资源对象（如 gltf 加载结果）
   */
  constructor(x = 0, y = 0, resource = null) {
    super()
    this.name = 'SimObject'
    this.position.x = x
    this.position.z = y
    // 如果传入资源，自动初始化 mesh
    if (resource) {
      const mesh = this.initMeshFromResource(resource)
      if (mesh) {
        this.setMesh(mesh)
      }
    }
  }

  /**
   * 从 threejs 资源对象（如 gltf 加载结果）初始化 mesh，并克隆材质
   * @param {object} resource - threejs 资源对象，需包含 scene 属性
   * @returns {THREE.Object3D|null}
   */
  initMeshFromResource(resource) {
    if (!resource || !resource.scene)
      return null
    // 克隆模型
    const mesh = resource.scene.clone()
    // 遍历所有子节点，克隆材质并设置透明，userData 指向自身
    mesh.traverse((child) => {
      child.userData = this
      if (child instanceof THREE.Mesh && child.material) {
        child.receiveShadow = true
        child.castShadow = true
        child.material = child.material.clone()
        child.material.transparent = true
      }
    })
    return mesh
  }

  // 获取世界坐标 x
  get x() {
    this.getWorldPosition(this.#worldPos)
    return Math.floor(this.#worldPos.x)
  }

  // 获取世界坐标 y (实际为 z 轴)
  get y() {
    this.getWorldPosition(this.#worldPos)
    return Math.floor(this.#worldPos.z)
  }

  /** @type {THREE.Mesh?} */
  get mesh() {
    return this.#mesh
  }

  /** 设置 mesh 并自动加入场景图 */
  setMesh(value) {
    // 移除旧 mesh
    if (this.#mesh) {
      // 彻底清除所有资源
      this.#mesh.traverse((obj) => {
        if (obj.material) {
          obj.material?.dispose()
        }
      })
      this.#mesh.geometry?.dispose()
      this.#mesh.texture?.dispose()
      this.dispose()
      this.remove(this.#mesh)
    }
    this.#mesh = value
    if (this.#mesh) {
      this.add(this.#mesh)
    }
  }

  // 可重写：模拟行为
  simulate(_city) {}

  // 设置选中高亮
  setSelected(value) {
    if (value) {
      this.#setMeshEmission(SELECTED_COLOR)
      this.#setMeshOpacity(SIMOBJECT_SELECTED_OPACITY)
    }
    else {
      this.#setMeshEmission(0)
      this.#setMeshOpacity(SIMOBJECT_DEFAULT_OPACITY)
    }
  }

  /**
   * 设置聚焦高亮，根据当前操作模式调整颜色和透明度
   * @param {boolean} value 是否聚焦
   * @param {string} mode 操作模式，可选：'select' | 'build' | 'relocate' | 'demolish'，默认为 'select'
   */
  setFocused(value, mode = 'select') {
    // mode 到颜色和透明度的映射
    let emissionColor = HIGHLIGHTED_COLOR
    let opacity = SIMOBJECT_SELECTED_OPACITY
    switch (mode) {
      case 'select':
        emissionColor = SELECTED_COLOR
        opacity = SELECTED_COLOR_OPACITY
        break
      case 'build':
        emissionColor = BUILD_COLOR
        opacity = BUILD_COLOR_OPACITY
        break
      case 'build-invalid':
        emissionColor = BUILD_INVALID_COLOR
        opacity = BUILD_INVALID_COLOR_OPACITY
        break
      case 'relocate':
        emissionColor = RELOCATE_COLOR
        opacity = RELOCATE_COLOR_OPACITY
        break
      case 'demolish':
        emissionColor = DEMOLISH_COLOR
        opacity = DEMOLISH_COLOR_OPACITY
        break
      default:
        emissionColor = HIGHLIGHTED_COLOR
        opacity = SIMOBJECT_SELECTED_OPACITY
    }
    if (value) {
      this.#setMeshEmission(emissionColor)
      this.#setMeshOpacity(opacity)
      // 使用gsap实现y轴yoyo动画
      if (this.mesh) {
        // 先停止可能已有动画
        gsap.killTweensOf(this.mesh.position)
        gsap.to(this.mesh.position, {
          y: 0.13,
          duration: 0.41,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
        })
      }
    }
    else {
      // 取消聚焦，恢复默认
      this.#setMeshEmission(0)
      this.#setMeshOpacity(SIMOBJECT_DEFAULT_OPACITY)
      if (this.mesh) {
        // 停止动画并复位y轴
        gsap.killTweensOf(this.mesh.position)
        // 直接回到初始y（假设聚焦只加了0.1）
        gsap.to(this.mesh.position, { y: 0, duration: 0.2, overwrite: true })
      }
    }
  }

  // 设置 mesh 的发光色
  #setMeshEmission(color) {
    if (!this.mesh)
      return
    this.mesh.traverse(obj => obj.material?.emissive?.setHex(color))
  }

  // 设置 mesh 的透明度
  #setMeshOpacity(opacity) {
    if (!this.mesh)
      return
    this.mesh.traverse(obj => obj.material && (obj.material.opacity = opacity))
  }

  /**
   * 返回该地皮的 HTML 信息（TailwindCSS 美化）
   * @returns {string} HTML representation of this tile
   */
  toHTML() {
    let html = `
      <div class="info-heading text-lg font-bold mb-2 text-blue-700">地块信息</div>
      <div class="flex flex-col gap-1">
        <div><span class="info-label text-gray-500">坐标：</span>
        <span class="info-value text-gray-800">X: ${this.x}, Y: ${this.y}</span></div>
        <div><span class="info-label text-gray-500">地形：</span>
        <span class="info-value text-gray-800">${this.type}</span></div>
    `
    if (this.building) {
      // 方向文本映射
      const dirMap = ['右', '下', '左', '上']
      const dirText = dirMap[this.direction % 4] || this.direction
      html += `<div><span class="info-label text-gray-500">建筑：</span><span class="info-value text-gray-800">${this.building}（朝向：${dirText}）</span></div>`
    }
    html += '</div>'
    return html
  }

  // 清理资源
  dispose() {
    if (!this.#mesh)
      return
    this.#mesh.traverse((obj) => {
      if (obj.material) {
        obj.material?.dispose()
      }
    })
  }
}
