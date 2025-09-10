// src/composables/useBuilding.js
import { BUILDING_DATA } from '@/constants/constants'
import { useGameState } from '@/stores/useGameState'
import { useI18n } from 'vue-i18n'

export function useBuilding() {
  const gameState = useGameState()
  const { t, locale } = useI18n()

  // 获取下一级建筑等级
  const getNextLevel = (buildingType, level = 1) => {
    const building = BUILDING_DATA[buildingType]
    if (!building || !building.levels)
      return null
    return building.levels[level].nextLevel
  }

  // 根据 action 推断实际的 buildingLevel
  const resolveBuildingLevel = (action, buildingType, level = 1) => {
    if (action === 'upgrade') {
      return getNextLevel(buildingType, level)
    }
    else {
      return level
    }
  }

  // 获取建筑花费，支持 action 参数
  const getBuildingCost = (actionOrType, buildingTypeOrLevel, levelMaybe) => {
    let action, buildingType, level
    // 兼容老参数格式
    if (typeof actionOrType === 'string' && ['upgrade', 'demolish', 'relocate'].includes(actionOrType)) {
      action = actionOrType
      buildingType = buildingTypeOrLevel
      level = levelMaybe ?? 1
    }
    else {
      action = null
      buildingType = actionOrType
      level = buildingTypeOrLevel ?? 1
    }
    const buildingLevel = action ? resolveBuildingLevel(action, buildingType, level) : level
    const building = BUILDING_DATA[buildingType]
    return building?.levels?.[buildingLevel]?.cost || 0
  }

  // 获取建筑退款金额 (70%)，支持 action 参数
  const getBuildingRefund = (actionOrType, buildingTypeOrLevel, levelMaybe) => {
    return getBuildingCost(actionOrType, buildingTypeOrLevel, levelMaybe) * 0.7
  }

  // 处理建筑操作的对话框配置
  const getDialogConfig = (action, buildingType, level = 1) => {
    let buildingLevel = resolveBuildingLevel(action, buildingType, level)
    if (action === 'upgrade' && !buildingLevel) {
      gameState.addToast(t('error.noNextLevel'), 'error')
      return null
    }
    const buildingName = `${BUILDING_DATA[buildingType]?.levels[buildingLevel]?.displayName?.[locale.value]} Lv.${buildingLevel}`
    const buildingCost = getBuildingCost(action, buildingType, level)
    const configs = {
      upgrade: {
        title: t('dialog.selectTitle'),
        message: t('dialog.selectMessage', {
          building: buildingName,
          cost: buildingCost,
        }),
        confirmText: t('dialog.selectConfirm'),
        cost: buildingCost,
      },
      demolish: {
        title: t('dialog.demolishTitle'),
        message: t('dialog.demolishMessage', {
          building: buildingName,
          refund: getBuildingRefund(action, buildingType, level),
        }),
        confirmText: t('dialog.demolishConfirm'),
        cost: buildingCost,
      },
      relocate: {
        title: t('dialog.relocateTitle'),
        message: t('dialog.relocateMessage', {
          building: buildingName,
        }),
        confirmText: t('dialog.relocateConfirm'),
        cost: 0,
      },
    }

    return {
      ...configs[action],
      cancelText: t('common.cancel'),
      action,
      buildingType,
      buildingLevel: level,
    }
  }

  // 判断是否可以执行操作
  const canAffordOperation = (action, buildingType, level = 1) => {
    const cost = getBuildingCost(action, buildingType, level)
    return action === 'demolish' || gameState.credits >= cost
  }

  // 处理建筑操作的金额变动
  const handleBuildingTransaction = (action, buildingType, level = 1) => {
    if (!canAffordOperation(action, buildingType, level)) {
      gameState.addToast(t('error.insufficientFunds'), 'error')
      return false
    }
    switch (action) {
      case 'demolish':
        gameState.updateCredits(getBuildingRefund(action, buildingType, level))
        gameState.updateTile(gameState.selectedPosition.x, gameState.selectedPosition.z, { building: null, level: 0 })
        break
      case 'upgrade':
        gameState.updateCredits(-getBuildingCost(action, buildingType, level))
        gameState.updateTile(gameState.selectedPosition.x, gameState.selectedPosition.z, { level: level + 1 })
        break
      case 'relocate':
        gameState.updateCredits(-100)
        break
      default:
        break
      // 可以添加其他操作类型
    }
    return true
  }

  return {
    getBuildingCost,
    getBuildingRefund,
    getDialogConfig,
    handleBuildingTransaction,
    canAffordOperation,
    getNextLevel,
  }
}
