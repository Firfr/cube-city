import { BUILDING_INTERACTIONS } from '../../constants/building-interactions.js'
import { BUILDING_DATA } from '../../constants/constants.js'

/**
 * 检查建筑是否有相互作用配置
 * @param {string} buildingType - 建筑类型
 * @param {string} valueType - 属性类型
 * @returns {boolean} 是否有相互作用配置
 */
export function hasInteractionConfig(buildingType, valueType) {
  const interactions = BUILDING_INTERACTIONS[buildingType]
  const modifiers = interactions?.modifiers?.[valueType]
  return modifiers && modifiers.length > 0
}

/**
 * 获取建筑当前等级的基础属性值
 * @param {string} buildingType - 建筑类型
 * @param {number} level - 建筑等级
 * @param {string} valueType - 属性类型（如 'pollution', 'coinOutput' 等）
 * @returns {number} 基础属性值
 */
export function getBuildingBaseValue(buildingType, level, valueType) {
  const buildingData = BUILDING_DATA[buildingType]
  if (!buildingData?.levels?.[level]) {
    console.warn(`Building data not found: ${buildingType} level ${level}`)
    return 0
  }

  return buildingData.levels[level][valueType] || 0
}

/**
 * 计算建筑的修正后数值（考虑升级等级和相互作用）
 * @param {object} gameState - 游戏状态
 * @param {string} buildingType - 建筑类型
 * @param {number} level - 建筑等级
 * @param {number} x - X坐标
 * @param {number} y - Y坐标
 * @param {string} valueType - 属性类型
 * @returns {number} 修正后的数值
 */
export function calculateModifiedValue(gameState, buildingType, level, x, y, valueType) {
  // 1. 直接从metadata获取tile的detail信息，避免重复查找BUILDING_DATA
  const tile = gameState.getTile(x, y)
  const baseValue = tile?.detail?.[valueType]
  if (!baseValue && baseValue !== 0)
    return 0 // 允许0值（如道路的属性）

  // 2. 获取相互作用配置
  const interactions = BUILDING_INTERACTIONS[buildingType]
  const modifiers = interactions?.modifiers?.[valueType]
  if (!modifiers || modifiers.length === 0)
    return baseValue

  let finalValue = baseValue
  let totalEffect = 0

  // 3. 应用所有修正器
  modifiers.forEach((modifier) => {
    if (modifier.requireAll === false) {
      // 如果只需要满足其中一个条件
      let hasAnyTarget = false
      for (const target of modifier.targets) {
        if (checkBuildingsInRange(gameState, x, y, [target], modifier.range)) {
          hasAnyTarget = true
          break
        }
      }
      if (hasAnyTarget) {
        totalEffect += modifier.effect
      }
    }
    else {
      // 需要检查具体目标数量的情况
      const targetCount = countTargetsInRange(
        gameState,
        x,
        y,
        modifier.targets,
        modifier.range,
      )

      if (targetCount > 0) {
        let effectValue = modifier.effect

        // 处理可叠加效果
        if (modifier.stackable) {
          const stacks = Math.min(targetCount, modifier.maxStacks || targetCount)
          effectValue *= stacks
        }

        totalEffect += effectValue
      }
    }
  })

  // 4. 应用总修正效果
  if (totalEffect !== 0) {
    if (totalEffect < 0) {
      // 负效果：减少百分比
      finalValue *= (1 + totalEffect)
    }
    else {
      // 正效果：增加百分比
      finalValue *= (1 + totalEffect)
    }
  }

  return Math.max(0, finalValue)
}

/**
 * 高效获取建筑属性值（优先使用metadata中的detail，必要时才计算相互作用）
 * @param {object} gameState - 游戏状态
 * @param {number} x - X坐标
 * @param {number} y - Y坐标
 * @param {string} valueType - 属性类型
 * @returns {number} 最终属性值
 */
export function getEffectiveBuildingValue(gameState, x, y, valueType) {
  const tile = gameState.getTile(x, y)
  if (!tile?.building || !tile?.detail)
    return 0

  const baseValue = tile.detail[valueType]
  if (!baseValue && baseValue !== 0)
    return 0

  // 检查是否有相互作用配置，没有就直接返回基础值（大幅提升性能）
  if (!hasInteractionConfig(tile.building, valueType)) {
    return baseValue
  }

  // 只对有相互作用的建筑进行复杂计算
  return calculateModifiedValue(gameState, tile.building, tile.level || 1, x, y, valueType)
}

/**
 * 计算范围内目标建筑的数量（支持叠加效果）
 * @param {object} gameState - 游戏状态
 * @param {number} centerX - 中心X坐标
 * @param {number} centerY - 中心Y坐标
 * @param {string[]} targets - 目标建筑类型数组
 * @param {number} range - 检查范围
 * @returns {number} 目标建筑数量
 */
export function countTargetsInRange(gameState, centerX, centerY, targets, range) {
  let count = 0

  for (let dx = -range; dx <= range; dx++) {
    for (let dy = -range; dy <= range; dy++) {
      if (dx === 0 && dy === 0)
        continue

      const tile = gameState.getTile(centerX + dx, centerY + dy)
      if (tile && targets.includes(tile.building)) {
        count++
      }
    }
  }

  return count
}

/**
 * 检查是否满足状态效果条件
 * @param {object} gameState - 游戏状态
 * @param {string} buildingType - 建筑类型
 * @param {number} x - X坐标
 * @param {number} y - Y坐标
 * @param {object} statusConfig - 状态配置
 * @param {object} statusConfig.condition - 状态条件
 * @param {string[]} statusConfig.condition.targets - 目标建筑类型数组
 * @param {number} statusConfig.condition.range - 检查范围
 * @param {boolean} statusConfig.condition.requireAll - 是否需要所有目标都存在
 * @param {boolean} statusConfig.condition.inverse - 是否取反
 * @returns {boolean} 是否满足条件
 */
export function checkStatusCondition(gameState, buildingType, x, y, statusConfig) {
  const hasTargets = checkBuildingsInRange(
    gameState,
    x,
    y,
    statusConfig.condition.targets,
    statusConfig.condition.range,
    statusConfig.condition.requireAll,
  )

  return statusConfig.condition.inverse ? !hasTargets : hasTargets
}

/**
 * 检查指定范围内是否存在目标建筑（原有的范围检查函数，保持兼容）
 * @param {object} gameState - 游戏状态
 * @param {number} centerX - 中心X坐标
 * @param {number} centerY - 中心Y坐标
 * @param {string[]} targets - 目标建筑类型数组
 * @param {number} range - 检查范围
 * @param {boolean} requireAll - 是否需要所有目标都存在
 * @returns {boolean} 是否找到目标建筑
 */
export function checkBuildingsInRange(gameState, centerX, centerY, targets, range, requireAll = false) {
  const foundTargets = new Set()

  for (let dx = -range; dx <= range; dx++) {
    for (let dy = -range; dy <= range; dy++) {
      if (dx === 0 && dy === 0)
        continue

      const tile = gameState.getTile(centerX + dx, centerY + dy)
      if (tile && targets.includes(tile.building)) {
        foundTargets.add(tile.building)
        if (!requireAll)
          return true // 找到一个就够了
      }
    }
  }

  return requireAll ? foundTargets.size === targets.length : foundTargets.size > 0
}

/**
 * 获取建筑的所有状态效果配置
 * @param {string} buildingType - 建筑类型
 * @returns {Array} 状态效果配置数组
 */
export function getBuildingStatusEffects(buildingType) {
  const interactions = BUILDING_INTERACTIONS[buildingType]
  return interactions?.statusEffects || []
}

/**
 * 调试函数：获取建筑的所有修正器信息
 * @param {string} buildingType - 建筑类型
 * @param {string} valueType - 属性类型
 * @returns {Array} 修正器信息数组
 */
export function getBuildingModifiers(buildingType, valueType) {
  const interactions = BUILDING_INTERACTIONS[buildingType]
  return interactions?.modifiers?.[valueType] || []
}
