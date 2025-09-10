/**
 * 定义项目所需的静态资源列表。
 * Resources 类会根据 'type' 属性自动选择合适的加载器。
 *
 * 支持的资源类型 (type) 及其对应的加载器/方式:
 * - gltfModel:   GLTFLoader (支持 Draco 和 KTX2 压缩)
 * - texture:     TextureLoader (普通图像纹理, 如 jpg, png)
 * - cubeTexture: CubeTextureLoader (立方体贴图, 用于环境映射等)
 * - font:        FontLoader (加载字体文件, 通常是 json 格式)
 * - fbxModel:    FBXLoader (加载 FBX 模型)
 * - audio:       AudioLoader (加载音频文件)
 * - objModel:    OBJLoader (加载 OBJ 模型)
 * - hdrTexture:  RGBELoader (加载 HDR 环境贴图)
 * - svg:         SVGLoader (加载 SVG 文件作为纹理或数据)
 * - exrTexture:  EXRLoader (加载 EXR 高动态范围图像)
 * - video:       自定义加载逻辑，创建 VideoTexture (加载视频作为纹理)
 * - ktx2Texture: KTX2Loader (加载 KTX2 压缩纹理)
 */
export default [
  {
    name: 'environmentMapTexture',
    type: 'cubeTexture',
    path: [
      'textures/environmentMap/px.jpg',
      'textures/environmentMap/nx.jpg',
      'textures/environmentMap/py.jpg',
      'textures/environmentMap/ny.jpg',
      'textures/environmentMap/pz.jpg',
      'textures/environmentMap/nz.jpg',
    ],
  },
  { name: 'grass', type: 'gltfModel', path: 'models/tile-grass.glb' },
  { name: 'ground', type: 'gltfModel', path: 'models/tile-ground.glb' },
  // 房屋
  { name: 'house_level1', type: 'gltfModel', path: 'models/house_level1.glb' },
  { name: 'house_level2', type: 'gltfModel', path: 'models/house_level2.glb' },
  { name: 'house_level3', type: 'gltfModel', path: 'models/house_level3.glb' },
  { name: 'house2_level1', type: 'gltfModel', path: 'models/house2_level1.glb' },
  { name: 'house2_level2', type: 'gltfModel', path: 'models/house2_level2.glb' },
  { name: 'house2_level3', type: 'gltfModel', path: 'models/house2_level3.glb' },
  // shop
  { name: 'shop_level1', type: 'gltfModel', path: 'models/shop_level1.glb' },
  { name: 'shop_level2', type: 'gltfModel', path: 'models/shop_level2.glb' },
  { name: 'shop_level3', type: 'gltfModel', path: 'models/shop_level3.glb' },
  // office
  { name: 'office_level1', type: 'gltfModel', path: 'models/office_level1.glb' },
  { name: 'office_level2', type: 'gltfModel', path: 'models/office_level2.glb' },
  { name: 'office_level3', type: 'gltfModel', path: 'models/office_level3.glb' },
  // park
  { name: 'park_level1', type: 'gltfModel', path: 'models/tree_level1.glb' },
  { name: 'park_level2', type: 'gltfModel', path: 'models/tree_level2.glb' },
  { name: 'park_level3', type: 'gltfModel', path: 'models/tree_level3.glb' },
  // roadPass
  {
    name: 'road',
    type: 'gltfModel',
    path: 'models/road-straight.glb',
  },
  {
    name: 'roadBend',
    type: 'gltfModel',
    path: 'models/road-bend.glb',
  },
  {
    name: 'road3Way',
    type: 'gltfModel',
    path: 'models/road-3way.glb',
  },
  {
    name: 'road4Way',
    type: 'gltfModel',
    path: 'models/road-4way.glb',
  },
  // hospital
  { name: 'hospital_level1', type: 'gltfModel', path: 'models/hospital.glb' },
  // police
  { name: 'police_level1', type: 'gltfModel', path: 'models/police.glb' },
  // factory
  {
    name: 'factory_level1',
    type: 'gltfModel',
    path: 'models/factory.glb',
  },
  {
    name: 'fire_station_level1',
    type: 'gltfModel',
    path: 'models/fire_station.glb',
  },
  // chemistry
  {
    name: 'chemistry_factory_level1',
    type: 'gltfModel',
    path: 'models/chemistry_level1.glb',
  },
  {
    name: 'chemistry_factory_level2',
    type: 'gltfModel',
    path: 'models/chemistry_level2.glb',
  },
  {
    name: 'chemistry_factory_level3',
    type: 'gltfModel',
    path: 'models/chemistry_level3.glb',
  },
  // nuke
  {
    name: 'nuke_factory_level1',
    type: 'gltfModel',
    path: 'models/nuke_factory.glb',
  },
  // hero_park
  { name: 'hero_park_level1', type: 'gltfModel', path: 'models/hero_park.glb' },
  {
    name: 'garbage_station_level1',
    type: 'gltfModel',
    path: 'models/garbage_station.glb',
  },
  {
    name: 'sun_power_level1',
    type: 'gltfModel',
    path: 'models/sun_power.glb',
  },
  {
    name: 'wind_power_level1',
    type: 'gltfModel',
    path: 'models/wind_power.glb',
  },
  {
    name: 'water_tower_level1',
    type: 'gltfModel',
    path: 'models/water_tower.glb',
  },
  // smoke 用 perlin 噪声
  {
    name: 'perlinNoise',
    type: 'texture',
    path: 'textures/perlin.png',
  },
  // effect 专用texture
  // 电力 buff
  // 电力正常产出
  {
    name: 'powerOutPut',
    type: 'texture',
    path: 'textures/effect/power.png',
  },
  // 电力产出带有增益
  {
    name: 'powerOutBoost',
    type: 'texture',
    path: 'textures/effect/powerBuff.png',
  },

  {
    name: 'powerUnder',
    type: 'texture',
    path: 'textures/effect/miss-power.png',
  },
  // 人口 buff
  {
    name: 'CrewGain',
    type: 'texture',
    path: 'textures/effect/humanBuff.png',
  },
  {
    name: 'CrewDecay',
    type: 'texture',
    path: 'textures/effect/humanDebuff.png',
  },
  {
    name: 'CrewUnder',
    type: 'texture',
    path: 'textures/effect/miss-population.png',
  },
  {
    name: 'CrewOver',
    type: 'texture',
    path: 'textures/effect/over-population.png',
  },
  // 污染buff
  {
    name: 'pollutionUpBuff',
    type: 'texture',
    path: 'textures/effect/pollutionUp.png',
  },
  {
    name: 'pollutionDownBuff',
    type: 'texture',
    path: 'textures/effect/pollutionDown.png',
  },
  {
    name: 'pollutionLowerBuff',
    type: 'texture',
    path: 'textures/effect/pollutionlowerBuff.png',
  },
  // 金币 buff
  {
    name: 'coinBuff',
    type: 'texture',
    path: 'textures/effect/coinBuff.png',
  },
  // 表情
  {
    name: 'happy',
    type: 'texture',
    path: 'textures/effect/happy.png',
  },
  {
    name: 'sad',
    type: 'texture',
    path: 'textures/effect/sad.png',
  },
  {
    name: 'angry',
    type: 'texture',
    path: 'textures/effect/angry.png',
  },
  {
    name: 'upgrade',
    type: 'texture',
    path: 'textures/effect/upgrade.png',
  },
  {
    name: 'miss-road',
    type: 'texture',
    path: 'textures/effect/miss-road.png',
  },
]
