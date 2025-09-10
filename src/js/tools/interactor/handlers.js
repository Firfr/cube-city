import { BUILDING_DATA } from '@/constants/constants.js'
import { eventBus } from '@/js/utils/event-bus.js'
import {
  canPlaceBuilding,
  showBuildingPlacedToast,
  showBuildingRemovedToast,
  showToast,
  swapBuilding,
  updateAdjacentRoads,
} from './utils.js'

// =================================================================================
//  各模式下的具体逻辑处理器
// =================================================================================

/**
 * [选择模式] 逻辑
 * @param {Interactor} ctx - Interactor 实例
 * @param {object} tile - 选中的地块
 */
export function handleSelectMode(ctx, tile) {
  const building = tile?.buildingInstance
  if (!building)
    return

  // 选中建筑
  ctx.gameState.setSelectedBuilding({ type: building.type, level: building.level || 1 })
  ctx.gameState.setSelectedPosition(tile.position)
}

/**
 * [建造模式] 逻辑
 * @param {Interactor} ctx - Interactor 实例
 * @param {object} tile - 选中的地块
 */
export function handleBuildMode(ctx, tile) {
  const buildingTypeToBuild = ctx.gameState.selectedBuilding?.type
  const buildingLevelToBuild = 1
  if (!tile)
    return
  const { x, y } = tile
  const metadata = ctx.gameState.metadata
  const canBuild = canPlaceBuilding(x, y, buildingTypeToBuild, metadata)
  if (!buildingTypeToBuild || !canBuild || tile.buildingInstance) {
    const message = ctx.gameState.language === 'zh'
      ? '先建个路吧！建筑只能建在道路旁边。（特例：风力发电与公园可任意建造）'
      : 'Build a road first! Buildings can only be placed next to roads. (Exception: Wind Power and Parks can be built anywhere)'
    showToast('error', message)
    return
  }
  // 通过 Pinia 修改 metadata
  ctx.gameState.setTile(x, y, {
    type: 'ground',
    building: buildingTypeToBuild,
    direction: 0, // 可根据实际情况
    level: buildingLevelToBuild,
    // 新增建筑详情
    detail: BUILDING_DATA[buildingTypeToBuild]?.levels[buildingLevelToBuild],
    // 产出因子 可能因为某些因素而影响产出，比如人口、科技等
    outputFactor: 1,
  })
  if (ctx.gameState.credits < BUILDING_DATA[buildingTypeToBuild]?.levels[buildingLevelToBuild]?.cost) {
    const message = ctx.gameState.language === 'zh'
      ? '资金不足，无法建造。'
      : 'Insufficient funds, unable to build.'
    showToast('error', message)
    return
  }
  ctx.gameState.updateCredits(-BUILDING_DATA[buildingTypeToBuild]?.levels[buildingLevelToBuild]?.cost)
  // ...后续同步 Three.js 层刷新
  tile.setBuilding(buildingTypeToBuild, buildingLevelToBuild, 0)
  tile.setType('ground')
  updateAdjacentRoads(tile, ctx.experience.world.city)
  showBuildingPlacedToast(buildingTypeToBuild, tile, buildingLevelToBuild, ctx.gameState)
}

/**
 * [拆除模式] 逻辑
 * @param {Interactor} ctx - Interactor 实例
 * @param {object} tile - 选中的地块
 */
export function handleDemolishMode(ctx, tile) {
  if (!tile)
    return

  if (tile.buildingInstance) {
    // 有建筑，需要UI确认
    eventBus.emit('ui:confirm-action', {
      action: 'demolish',
      tileId: tile.id,
      tileName: tile.name || '',
      buildingType: tile.buildingInstance.type,
      buildingLevel: tile.buildingInstance.level,
    })
    // 选中建筑
    ctx.gameState.setSelectedBuilding({ type: tile.buildingInstance.type, level: tile.buildingInstance.level || 1 })
    ctx.gameState.setSelectedPosition(tile.position)
  }
  else {
    // 没建筑，直接变草地
    tile.setType('grass')
    ctx._clearSelection()
  }
}

/**
 * [搬迁模式] 逻辑
 * @param {Interactor} ctx - Interactor 实例
 * @param {object} tile - 选中的地块
 */
export function handleRelocateMode(ctx, tile) {
  if (!tile)
    return

  // 步骤1: 选择要搬迁的建筑
  if (!ctx.relocateFirst) {
    if (!tile.buildingInstance) {
      const message = ctx.gameState.language === 'zh'
        ? '请选择一个有建筑的地块进行搬迁。'
        : 'Please select a tile with a building to relocate.'
      showToast('error', message)
      ctx._clearSelection() // 清空无效选择
      return
    }
    ctx.relocateFirst = tile
    // 高亮已由 _setSelected 处理
    return
  }

  // 步骤2: 选择目标空地
  if (ctx.relocateFirst !== tile) {
    if (!canPlaceBuilding(tile.x, tile.y, ctx.relocateFirst.buildingInstance.type, ctx.gameState.metadata)) {
      const message = ctx.gameState.language === 'zh'
        ? '无法在此处搬迁，请选择合规地块。'
        : 'Cannot relocate here. Please choose a valid tile.'
      showToast('error', message)
      return
    }
    if (tile.buildingInstance) {
      const message = ctx.gameState.language === 'zh'
        ? '目标地块已被占用，无法搬迁。'
        : 'The target tile is occupied and cannot be used for relocation.'
      showToast('error', message)
      return
    }
    ctx.relocateSecond = tile
    ctx.relocateSecond.setFocused(true, 'relocate') // 保持目标地高亮

    // 发起UI确认
    eventBus.emit('ui:confirm-action', {
      action: 'relocate',
      tileId: ctx.relocateFirst.id,
      tileName: ctx.relocateFirst.name || '',
      buildingType: ctx.relocateFirst.buildingInstance.type,
      buildingLevel: ctx.relocateFirst.buildingInstance.level,
    })
  }
}

/**
 * [默认模式] 逻辑 (如查看信息)
 * @param {Interactor} ctx - Interactor 实例
 * @param {object} tile - 选中的地块
 */
export function handleDefaultMode(tile) {
  if (!tile)
    return
  eventBus.emit('ui:panel:show', { panel: 'building', data: tile })
}

// =================================================================================
//  UI确认后的具体动作
// =================================================================================

/**
 * 执行“确认升级”后的操作
 * @param {Interactor} ctx - Interactor 实例
 */
export function confirmUpgrade(ctx) {
  const building = ctx.selected?.buildingInstance
  if (building && typeof building.upgrade === 'function') {
    const newBuilding = building.upgrade()
    if (newBuilding) {
      ctx.selected.setBuilding(newBuilding.type, newBuilding.level || 1, newBuilding.direction)
      ctx.gameState.setTile(ctx.selected.x, ctx.selected.y, {
        detail: BUILDING_DATA[newBuilding.type]?.levels[newBuilding.level],
        outputFactor: BUILDING_DATA[newBuilding.type]?.levels[newBuilding.level]?.outputFactor || 1,
      })
      const message = ctx.gameState.language === 'zh'
        ? '建筑升级成功！'
        : 'Building upgraded successfully!'
      showToast('success', message)
    }
    else {
      const message = ctx.gameState.language === 'zh'
        ? '建筑已达到最高等级。'
        : 'The building has reached the maximum level.'
      showToast('error', message)
    }
  }
}

/**
 * 执行“确认拆除”后的操作
 * @param {Interactor} ctx - Interactor 实例
 */
export function confirmDemolish(ctx) {
  const tile = ctx.selected
  const building = tile.buildingInstance
  if (tile && building) {
    // 这里才修改 metadata
    ctx.gameState.setTile(tile.x, tile.y, {
      type: 'ground',
      building: null,
      direction: 0,
      level: 0,
    })
    tile.removeBuilding()
    showBuildingRemovedToast(building.type, tile, building.level, ctx.gameState)
    updateAdjacentRoads(tile, ctx.experience.world.city)
  }
}

/**
 * 执行“确认搬迁”后的操作
 * @param {Interactor} ctx - Interactor 实例
 */
export function confirmRelocate(ctx) {
  const sourceTile = ctx.relocateFirst
  const destTile = ctx.relocateSecond
  if (sourceTile && destTile) {
    // 交换 metadata
    const srcData = { ...ctx.gameState.getTile(sourceTile.x, sourceTile.y) }
    const dstData = { ...ctx.gameState.getTile(destTile.x, destTile.y) }
    ctx.gameState.setTile(destTile.x, destTile.y, srcData)
    ctx.gameState.setTile(sourceTile.x, sourceTile.y, { ...dstData, building: null, direction: 0, level: 0 })
    swapBuilding(sourceTile, destTile)
    const message = ctx.gameState.language === 'zh'
      ? '建筑搬迁成功！'
      : 'Building relocated successfully!'
    showToast('info', message)
    updateAdjacentRoads(sourceTile, ctx.experience.world.city)
    updateAdjacentRoads(destTile, ctx.experience.world.city)
  }
}

/**
 * 旋转建筑
 * @param {Interactor} ctx - Interactor 实例
 * @param {object} tile - 目标地块
 */
export function rotateBuilding(ctx, tile) {
  const building = tile?.buildingInstance
  // 道路不能旋转
  if (!building || building.type === 'road')
    return

  const { type, direction } = building
  tile.removeBuilding()
  tile.setBuilding(type, building.level || 1, (direction + 1) % 4)
  updateAdjacentRoads(tile, ctx.experience.world.city)
}
