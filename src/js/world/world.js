import City from '../components/tiles/city.js'
import Experience from '../experience.js'
import Interactor from '../tools/interactor.js'
import Environment from './environment.js'
import SceneMetadata from './scene-metadata.js'

export default class World {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources

    // 新增：场景元数据管理器
    this.experience.sceneMetadata = new SceneMetadata()
    // Environment
    this.resources.on('ready', () => {
      // Setup
      this.environment = new Environment()
      // 实例化城市地皮
      this.city = new City()

      // 交互系统
      this.interactor = new Interactor(this.city.root)
    })
  }

  update() {
    // 若 city 有 update 行为可调用
    if (this.city && this.city.update) {
      this.city.update()
    }
    if (this.interactor && this.interactor.update) {
      this.interactor.update()
    }
  }
}
