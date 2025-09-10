import * as THREE from 'three'

import Experience from '../experience.js'

export default class Environment {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.debug = this.experience.debug.ui
    this.debugActive = this.experience.debug.active

    // Setup
    this.setSunLight()
    this.setAmbientLight()
    this.setEnvironmentMap()
    this.setHemisphereLight()
    this.debuggerInit()
  }

  setSunLight() {
    this.sunLightColor = '#ffffff'
    this.sunLightIntensity = 0.8
    this.sunLight = new THREE.DirectionalLight(
      this.sunLightColor,
      this.sunLightIntensity,
    )

    this.sunLight.castShadow = true
    this.sunLight.shadow.camera.far = 60
    this.sunLight.shadow.camera.left = -10
    this.sunLight.shadow.camera.right = 10
    this.sunLight.shadow.camera.top = 10
    this.sunLight.shadow.camera.bottom = -10
    this.sunLight.shadow.mapSize.set(2048, 2048)
    this.sunLight.shadow.normalBias = 0.05
    this.sunLightPosition = new THREE.Vector3(17, 12, 6.5)
    this.sunLight.position.copy(this.sunLightPosition)
    this.scene.add(this.sunLight)

    // 设置 sunLight Target
    this.sunLight.target = new THREE.Object3D()
    this.sunLightTarget = new THREE.Vector3(9, 0, 9)
    this.sunLight.target.position.copy(this.sunLightTarget)
    this.scene.add(this.sunLight.target)

    this.helper = new THREE.CameraHelper(this.sunLight.shadow.camera)
    this.helper.visible = false
    this.scene.add(this.helper)

    // 添加 sunLightHelper
    this.sunLightHelper = new THREE.DirectionalLightHelper(this.sunLight, 5)
    this.sunLightHelper.visible = false
    this.scene.add(this.sunLightHelper)
  }

  // 添加半球光
  setHemisphereLight() {
    // 创建半球光 - 天空颜色为浅蓝色,地面颜色为暖色
    this.hemisphereLight = new THREE.HemisphereLight(
      '#fff', // 天空颜色
      '#579749', // 地面颜色
      0.7, // 光照强度
    )

    // 设置光源位置
    this.hemisphereLight.position.set(0, 20, 0)

    // 添加到场景
    this.scene.add(this.hemisphereLight)

    // 添加辅助显示器(默认隐藏)
    this.hemisphereLightHelper = new THREE.HemisphereLightHelper(this.hemisphereLight, 5)
    this.hemisphereLightHelper.visible = true
    this.scene.add(this.hemisphereLightHelper)
  }

  setAmbientLight() {
    this.ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5)
    this.scene.add(this.ambientLight)
  }

  setEnvironmentMap() {
    this.environmentMap = {}
    this.environmentMap.intensity = 0.3
    this.environmentMap.texture = this.resources.items.environmentMapTexture
    this.environmentMap.texture.colorSpace = THREE.SRGBColorSpace

    this.scene.environment = this.environmentMap.texture
  }

  updateSunLightPosition() {
    this.sunLight.position.copy(this.sunLightPosition)
    this.sunLight.target.position.copy(this.sunLightTarget)
    this.helper.update()
  }

  updateSunLightColor() {
    this.sunLight.color.set(this.sunLightColor)
  }

  updateSunLightIntensity() {
    this.sunLight.intensity = this.sunLightIntensity
  }

  debuggerInit() {
    if (this.debugActive) {
      const environmentFolder = this.debug.addFolder({
        title: 'Environment',
        expanded: false,
      })

      environmentFolder.addBinding(this.scene, 'environmentIntensity', {
        min: 0,
        max: 2,
        step: 0.01,
        label: 'Intensity',
      })

      const sunLightFolder = this.debug.addFolder({
        title: 'Sun Light',
        expanded: false,
      })

      sunLightFolder
        .addBinding(this, 'sunLightPosition', {
          label: 'Light Position',
        })
        .on('change', this.updateSunLightPosition.bind(this))

      sunLightFolder
        .addBinding(this, 'sunLightTarget', {
          label: 'Light Target',
        })
        .on('change', this.updateSunLightPosition.bind(this))

      sunLightFolder
        .addBinding(this, 'sunLightColor', {
          label: 'Light Color',
          view: 'color',
        })
        .on('change', this.updateSunLightColor.bind(this))

      sunLightFolder
        .addBinding(this, 'sunLightIntensity', {
          label: 'Light Intensity',
          min: 0,
          max: 20,
          step: 0.1,
        })
        .on('change', this.updateSunLightIntensity.bind(this))

      // 添加 shadowCamera 参数调控
      const shadowCamera = this.sunLight.shadow.camera
      const shadowCameraFolder = sunLightFolder.addFolder({
        title: 'Shadow Camera',
        expanded: false,
      })
      shadowCameraFolder.addBinding(shadowCamera, 'left', {
        label: 'Shadow Left',
        min: -100,
        max: 0,
        step: 0.1,
      }).on('change', () => {
        shadowCamera.updateProjectionMatrix()
        this.helper.update()
      })
      shadowCameraFolder.addBinding(shadowCamera, 'right', {
        label: 'Shadow Right',
        min: 0,
        max: 100,
        step: 0.1,
      }).on('change', () => {
        shadowCamera.updateProjectionMatrix()
        this.helper.update()
      })
      shadowCameraFolder.addBinding(shadowCamera, 'top', {
        label: 'Shadow Top',
        min: 0,
        max: 100,
        step: 0.1,
      }).on('change', () => {
        shadowCamera.updateProjectionMatrix()
        this.helper.update()
      })
      shadowCameraFolder.addBinding(shadowCamera, 'bottom', {
        label: 'Shadow Bottom',
        min: -100,
        max: 0,
        step: 0.1,
      }).on('change', () => {
        shadowCamera.updateProjectionMatrix()
        this.helper.update()
      })

      sunLightFolder.addBinding(this.helper, 'visible', {
        label: 'Helper',
      })

      sunLightFolder.addBinding(this.sunLightHelper, 'visible', {
        label: 'SunLight Helper',
      })

      if (this.axesHelper) {
        this.debug.addBinding(this.axesHelper, 'visible', {
          label: 'Axes',
        })
      }

      // ===== Hemisphere Light 控制面板 =====
      const hemisphereLightFolder = this.debug.addFolder({
        title: 'Hemisphere Light',
        expanded: false,
      })
      // 天空颜色
      hemisphereLightFolder.addBinding(this.hemisphereLight, 'color', {
        label: 'Sky Color',
        color: { type: 'float' },
        view: 'color',
      }).on('change', () => {
        // 颜色变更后自动更新
        this.hemisphereLight.color.set(this.hemisphereLight.color)
      })
      // 地面颜色
      hemisphereLightFolder.addBinding(this.hemisphereLight, 'groundColor', {
        label: 'Ground Color',
        color: { type: 'float' },
        view: 'color',
      }).on('change', () => {
        this.hemisphereLight.groundColor.set(this.hemisphereLight.groundColor)
      })
      // 光照强度
      hemisphereLightFolder.addBinding(this.hemisphereLight, 'intensity', {
        label: 'Intensity',
        min: 0,
        max: 5,
        step: 0.01,
      })
    }
  }
}
