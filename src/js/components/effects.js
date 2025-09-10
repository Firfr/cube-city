import gsap from 'gsap'
import * as THREE from 'three'

import outlineFragmentShader from '../../shaders/effects/outline/fragment.glsl'
import outlineVertexShader from '../../shaders/effects/outline/vertex.glsl'

/**
 * 广告牌效果工厂函数
 * @param {string} textureName - 要在广告牌上显示的纹理名称
 * @returns {object} - 返回一个包含 activate、deactivate、fadeOut 和 update 方法的效果处理器
 */
function billboardEffectFactory(textureName, duration = 2.5) {
  return {
    /**
     * @param {THREE.Mesh} mesh - 目标建筑
     * @param {object} config - 效果配置
     * @param {import('../../experience').default} experience - Experience 实例
     */
    activate(mesh, config, experience) {
      const texture = experience.resources.items[textureName]
      if (!texture) {
        console.warn(`Texture '${textureName}' not found for billboard effect.`)
        return null
      }

      // 清理所有现有的广告牌，但在轮循模式下会更温和
      this.cleanupExistingBillboards(mesh, false)

      // 调整纹理的色彩空间以保证颜色显示正确
      texture.colorSpace = THREE.SRGBColorSpace
      texture.needsUpdate = true // 确保更新生效

      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
        opacity: 0, // 初始透明度为0，用于缓入
      })

      const geometry = new THREE.PlaneGeometry(config.scale || 0.8, config.scale || 0.8)
      const billboard = new THREE.Mesh(geometry, material)
      // 无视射线
      billboard.raycast = () => {}
      billboard.name = `buff_billboard_${textureName}`

      // 计算广告牌的理想高度，并添加到建筑上
      // 使用原始建筑网格的边界框，而不是包含广告牌的整体边界框
      const box = new THREE.Box3().setFromObject(mesh)
      const height = box.max.y
      const startY = height + (config.offsetY || 0.3)
      billboard.position.set(0, startY, 0)
      mesh.add(billboard)

      // 缓入动画 + 浮动动画
      const tl = gsap.timeline()
      tl.to(material, { opacity: 1, duration: 0.5, ease: 'power2.out' })
      tl.to(
        billboard.position,
        {
          y: startY + 0.25, // 浮动高度
          duration,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        },
        '-=0.25', // 让浮动动画稍微提前开始，更自然
      )

      // 将时间线存储在广告牌的用户数据中，便于后续清理
      billboard.userData.timeline = tl
      billboard.userData.originalY = startY

      // 返回的实例中包含 experience，以便 update 方法使用
      return { billboard, timeline: tl, experience, startY, material }
    },

    /**
     * 专门的淡出方法，用于状态轮循时的平滑切换
     * @param {THREE.Mesh} mesh - 目标建筑
     * @param {object} instance - 广告牌实例
     * @param {Function} onComplete - 淡出完成回调
     */
    fadeOut(mesh, instance, onComplete) {
      if (!instance || !instance.billboard) {
        onComplete()
        return
      }

      // 立即停止所有相关动画
      if (instance.timeline) {
        instance.timeline.kill()
      }
      if (instance.billboard.userData.timeline) {
        instance.billboard.userData.timeline.kill()
      }

      // 执行快速淡出动画（比正常deactivate更快）
      gsap.to(instance.billboard.material, {
        opacity: 0,
        duration: 0.2, // 更快的淡出
        ease: 'power2.in',
        onComplete: () => {
          // 立即清理资源
          if (instance.billboard.parent) {
            instance.billboard.parent.remove(instance.billboard)
          }
          if (instance.billboard.geometry) {
            instance.billboard.geometry.dispose()
          }
          if (instance.billboard.material) {
            instance.billboard.material.dispose()
          }
          // 清理用户数据
          delete instance.billboard.userData.timeline
          delete instance.billboard.userData.originalY

          onComplete()
        },
      })
    },

    deactivate(mesh, instance) {
      if (instance && instance.billboard) {
        // 立即停止时间线动画
        if (instance.timeline) {
          instance.timeline.kill()
        }

        // 也检查并停止存储在用户数据中的时间线
        if (instance.billboard.userData.timeline) {
          instance.billboard.userData.timeline.kill()
        }

        // 缓出动画后清理资源
        gsap.to(instance.billboard.material, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => {
            if (instance.billboard.parent) {
              instance.billboard.parent.remove(instance.billboard)
            }
            instance.billboard.geometry.dispose()
            instance.billboard.material.dispose()
            // 清理用户数据
            delete instance.billboard.userData.timeline
            delete instance.billboard.userData.originalY
          },
        })
      }
    },

    // 新增 update 方法，使广告牌始终朝向相机
    update(mesh, instance) {
      if (instance && instance.billboard && instance.experience) {
        const camera = instance.experience.camera.instance
        if (camera) {
          instance.billboard.lookAt(camera.position)
        }
      }
    },

    /**
     * 清理现有广告牌的辅助方法
     * @param {THREE.Mesh} mesh - 目标建筑
     * @param {boolean} immediate - 是否立即清理（不使用动画）
     */
    cleanupExistingBillboards(mesh, immediate = true) {
      mesh.children.forEach((child) => {
        if (child.name && child.name.startsWith('buff_billboard_')) {
          // 立即停止任何正在进行的动画
          if (child.userData.timeline) {
            child.userData.timeline.kill()
          }

          if (immediate) {
            // 立即清理
            mesh.remove(child)
            if (child.geometry)
              child.geometry.dispose()
            if (child.material)
              child.material.dispose()
            delete child.userData.timeline
            delete child.userData.originalY
          }
          else {
            // 标记为待清理，但不立即移除
            child.userData.markedForRemoval = true
          }
        }
      })
    },
  }
}

// 效果处理器注册表
const BuffEffects = {
  /**
   * 缩放效果处理器
   */
  scale: {
    activate(mesh, config) {
      const originalScale = { x: mesh.scale.x, y: mesh.scale.y, z: mesh.scale.z }
      const animation = gsap.to(mesh.scale, {
        x: originalScale.x * (config.amount || 1.1),
        y: originalScale.y * (config.amount || 1.1),
        z: originalScale.z * (config.amount || 1.1),
        duration: config.duration || 1.5,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      })
      animation.originalScale = originalScale // 保存原始缩放值
      return animation
    },
    deactivate(mesh, animation) {
      if (animation) {
        const originalScale = animation.originalScale
        animation.kill()
        // 平滑地恢复原始大小
        gsap.to(mesh.scale, { x: originalScale.x, y: originalScale.y, z: originalScale.z, duration: 0.3 })
      }
    },
  },

  /**
   * 描边效果处理器 (基于 ShaderMaterial)
   * 遍历模型所有子网格，为每个子网格创建一个描边外壳
   */
  outline: {
    activate(mesh, config) {
      const outlineMeshes = []
      // 材质可以共享，以提高性能
      const outlineMaterial = new THREE.ShaderMaterial({
        uniforms: {
          // 初始厚度为0，通过GSAP动画实现缓入效果
          uThickness: { value: 0 },
          // 默认颜色改为升级的金黄色
          uColor: { value: new THREE.Color(config.color || '#FFD700') },
        },
        vertexShader: outlineVertexShader,
        fragmentShader: outlineFragmentShader,
        side: THREE.BackSide,
      })

      // 使用 GSAP 动画化描边厚度，实现缓入效果
      const animation = gsap.to(outlineMaterial.uniforms.uThickness, {
        value: config.thickness || 0.02,
        duration: config.duration || 0.5,
        ease: 'power2.out',
      })

      mesh.traverse((child) => {
        // 关键：检查 child 是否已经是我们创建的外壳，防止无限循环
        if (child.isMesh && child.name !== 'buff_outline_shell') {
          const outlineMesh = new THREE.Mesh(child.geometry, outlineMaterial)
          outlineMesh.name = 'buff_outline_shell'
          child.add(outlineMesh) // 将外壳作为子对象添加，以保持相对位置
          outlineMeshes.push(outlineMesh)
        }
      })

      // 返回外壳数组、材质和动画实例，以便销毁
      return { outlineMeshes, outlineMaterial, animation }
    },
    deactivate(mesh, instance) {
      if (instance && instance.outlineMaterial) {
        // 停止可能正在进行的激活画
        if (instance.animation) {
          instance.animation.kill()
        }

        // 创建一个缓出的动画，动画结束后再执行清理
        gsap.to(instance.outlineMaterial.uniforms.uThickness, {
          value: 0,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => {
            // 销毁材质
            if (instance.outlineMaterial) {
              instance.outlineMaterial.dispose()
            }
            // 从父对象中移除所有外壳网格
            if (instance.outlineMeshes && instance.outlineMeshes.length > 0) {
              instance.outlineMeshes.forEach((outlineMesh) => {
                if (outlineMesh.parent) {
                  outlineMesh.parent.remove(outlineMesh)
                }
                // 不需要再销毁几何体，因为是共享的
              })
            }
          },
        })
      }
    },
  },

  // 由工厂函数创建的广告牌效果
  // 电力产出
  powerup: billboardEffectFactory('powerOutPut'),
  // 电力增幅
  powerBuff: billboardEffectFactory('powerOutBoost'),
  // 电力缺失
  missPower: billboardEffectFactory('powerUnder'),
  // 人员增加
  humanBuff: billboardEffectFactory('CrewGain'),
  // 人员减少
  humanDeBuff: billboardEffectFactory('CrewDecay'),
  // 人员缺失
  missPopulation: billboardEffectFactory('CrewUnder'),
  // 人员过多
  overPopulation: billboardEffectFactory('CrewOver'),
  // 污染增加
  pollutionUpBuff: billboardEffectFactory('pollutionUpBuff'),
  // 污染减少
  pollutionDownBuff: billboardEffectFactory('pollutionDownBuff'),
  // 降低
  pollutionLowerBuff: billboardEffectFactory('pollutionLowerBuff'),
  // 金币增加
  coinBuff: billboardEffectFactory('coinBuff'),
  // 升级
  upgrade: billboardEffectFactory('upgrade', 0.5),
  // 开心
  happy: billboardEffectFactory('happy'),
  // 悲伤
  sad: billboardEffectFactory('sad'),
  // 愤怒
  angry: billboardEffectFactory('angry'),
  // 新增状态指示器效果
  missRoad: billboardEffectFactory('miss-road'),
}

export { BuffEffects }
