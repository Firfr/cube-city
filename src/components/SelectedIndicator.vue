<script setup>
import { computed } from 'vue'
import { useGameState } from '../stores/useGameState'

const gameState = useGameState()
// 这里简单显示类型，后续可根据 type 查表显示名称
const selectedBuilding = computed(() => gameState.selectedBuilding)
const selectedBuildingLabel = computed(() => selectedBuilding.value ? `${selectedBuilding.value.type?.toUpperCase()} (Lv.${selectedBuilding.value.level})` : 'NONE')
</script>

<template>
  <div v-if="selectedBuilding" class="absolute top-4 right-4 resource-display rounded px-3 py-1">
    <span class="text-xs text-gray-400 uppercase tracking-wide">SELECTED:</span>
    <span class="text-sm font-bold text-industrial-blue ml-2">{{ selectedBuildingLabel }}</span>
  </div>
</template>
