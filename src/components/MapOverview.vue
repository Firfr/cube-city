<script setup>
import { BUILDING_DATA } from '@/constants/constants.js'
import { useGameState } from '@/stores/useGameState'
// 地图概览组件，展示17x17区块的建筑分布
import { storeToRefs } from 'pinia'

const { metadata } = storeToRefs(useGameState())

// 根据格子内容返回不同的 tailwind class
function tileClass(tile) {
  if (tile.building) {
    return 'bg-gray-300'
  }
  if (tile.type === 'grass') {
    return 'bg-lime-600'
  }
  if (tile.type === 'ground') {
    return 'bg-gray-200'
  }
  if (tile.type === 'road') {
    return 'bg-yellow-400'
  }
  // 其它类型默认灰色
  return 'bg-stone-600'
}

// 获取建筑icon
function getBuildingIcon(buildingType) {
  if (buildingType === 'road') {
    return 'R'
  }
  const found = BUILDING_DATA[buildingType]
  return found ? found.icon : '❓'
}

// 鼠标悬浮提示
function tileTooltip(x, y, tile) {
  if (tile.type === 'road')
    return `(${x},${y}) 道路`
  if (tile.building)
    return `(${x},${y}) 建筑: ${tile.building}`
  if (tile.type === 'grass')
    return `(${x},${y}) 草地`
  if (tile.type === 'ground')
    return `(${x},${y}) 地面`
  return `(${x},${y}) 空地`
}
</script>

<template>
  <div class="flex flex-col w-full h-full">
    <div class="text-center text-base sm:text-lg font-bold text-white mb-2 select-none">
      M A P
    </div>
    <div class="flex-1 w-full h-full aspect-square grid grid-cols-17 grid-rows-17 gap-[1px] bg-[#212121]  rounded-lg shadow-md overflow-hidden">
      <template v-for="(row, x) in metadata" :key="x">
        <template v-for="(tile, y) in row" :key="y">
          <div
            class="w-full h-full min-h-0 min-w-0 box-border flex items-center justify-center text-xs sm:text-base font-bold select-none relative transition-all duration-150 ease-out cursor-pointer rounded focus:outline-none group"
            :class="tileClass(tile)"
            :title="tileTooltip(x, y, tile)"
            tabindex="0"
          >
            <span v-if="!tile.building && tile.type === 'grass'" class="text-white">G</span>
            <span v-else-if="!tile.building && tile.type === 'ground'" class="text-yellow-900">P</span>
            <span v-else-if="tile.building" class="text-lg sm:text-xl">{{ getBuildingIcon(tile.building) }}</span>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<!-- 主要样式用 tailwind，极少自定义 -->
<style scoped>
.grid-cols-17 {
  grid-template-columns: repeat(17, minmax(0, 1fr));
}
.grid-rows-17 {
  grid-template-rows: repeat(17, minmax(0, 1fr));
}
</style>
