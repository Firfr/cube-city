<script setup>
import { eventBus } from '@/js/utils/event-bus.js'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { BUILDING_DATA } from '../constants/constants'
import { useGameState } from '../stores/useGameState'
import BuildingDetail from './BuildingDetail.vue'
import EmptyState from './EmptyState.vue'

const { t } = useI18n()
const gameState = useGameState()
const selectedBuilding = computed(() => gameState.selectedBuilding)
const currentMode = computed(() => gameState.currentMode)
const selectedPosition = computed(() => gameState.selectedPosition)
const building = computed(() => {
  if (!selectedBuilding.value)
    return {}
  const { type, level } = selectedBuilding.value
  const base = BUILDING_DATA[type] || {}
  const levelData = base.levels?.[level] || {}
  return { ...base, ...levelData, level }
})

// 升级建筑
function upgradeBuilding() {
  // TODO: 找到当前建筑的下一级建筑
  const data = {
    action: 'upgrade',
    buildingType: selectedBuilding.value.type,
    buildingLevel: selectedBuilding.value.level,
  }
  eventBus.emit('ui:confirm-action', data)
}

// 维修建筑
function repairBuilding() {
  const data = {
    action: 'repair',
    buildingType: selectedBuilding.value.type,
    buildingLevel: selectedBuilding.value.level,
  }
  eventBus.emit('ui:confirm-action', data)
}

// 拆除建筑
function demolishBuilding() {
  const data = {
    action: 'demolish',
    buildingType: selectedBuilding.value.type,
    buildingLevel: selectedBuilding.value.level,
  }
  eventBus.emit('ui:confirm-action', data)
}
</script>

<template>
  <aside class="w-80 industrial-panel shadow-industrial z-40 absolute right-2 top-2 bottom-2">
    <div class="p-4 h-full flex flex-col">
      <h2 class="text-lg font-bold text-industrial-accent uppercase tracking-wide mb-4 border-b border-gray-600 pb-2">
        <span class="neon-text">{{ t('buildingDetails.unitDetails') }}</span>
      </h2>
      <div class="flex-1 overflow-y-auto custom-scrollbar">
        <EmptyState v-if="!selectedBuilding" :current-mode="currentMode" />
        <BuildingDetail
          v-else
          :building="building"
          :selected-position="selectedPosition"
          :current-mode="currentMode"
          @upgrade="upgradeBuilding"
          @repair="repairBuilding"
          @demolish="demolishBuilding"
        />
      </div>
    </div>
  </aside>
</template>

<style scoped>
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #3b3b3b #18181b;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  background: #18181b;
  border-radius: 8px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #3b3b3b 60%, #ffb800 100%);
  border-radius: 8px;
  min-height: 24px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #ffb800 60%, #3b3b3b 100%);
}
.custom-scrollbar::-webkit-scrollbar-corner {
  background: #18181b;
}
</style>
