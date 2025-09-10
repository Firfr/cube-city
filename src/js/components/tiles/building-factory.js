import ChemistryFactory from './buildings/chemistry-factory.js'
import Factory from './buildings/factory.js'
import FireStation from './buildings/fire_station.js'
import GarbageStation from './buildings/garbage_station.js'
import HeroPark from './buildings/hero_park.js'
import Hospital from './buildings/hospital.js'
import House2 from './buildings/house2.js'
import House from './buildings/house.js'
import NukeFactory from './buildings/nuke-factory.js'
import Office from './buildings/office.js'
import Park from './buildings/park.js'
import Police from './buildings/police.js'
import Road from './buildings/road.js'
import Shop from './buildings/shop.js'
import SunPower from './buildings/sun_power.js'
import WaterTower from './buildings/water_tower.js'
import WindPower from './buildings/wind_power.js'
// 未来可引入更多建筑

const BUILDING_CLASS_MAP = {
  house: House,
  house2: House2,
  factory: Factory,
  shop: Shop,
  office: Office,
  park: Park,
  police: Police,
  hospital: Hospital,
  road: Road,
  chemistry_factory: ChemistryFactory,
  nuke_factory: NukeFactory,
  fire_station: FireStation,
  sun_power: SunPower,
  water_tower: WaterTower,
  wind_power: WindPower,
  garbage_station: GarbageStation,
  hero_park: HeroPark,
  // 其他建筑类型可在此扩展
}

export function createBuilding(type, level = 1, direction = 0, options = {}) {
  const Cls = BUILDING_CLASS_MAP[type]
  if (Cls) {
    return new Cls(type, level, direction, options)
  }
  return null
}
