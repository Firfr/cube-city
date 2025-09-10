<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { BUILDING_CATEGORIES, BUILDING_DATA, BUILDING_MODES } from '../constants/constants'
import { useGameState } from '../stores/useGameState'
// i18n
const { t } = useI18n()
// 建筑分类
const buildingCategories = computed(() => BUILDING_CATEGORIES)
// 建筑数据（数组结构，type为唯一标识）
const buildingData = computed(() => BUILDING_DATA)
// 操作模式
const modes = computed(() => BUILDING_MODES)

const gameState = useGameState()
const selectedBuilding = computed(() => gameState.selectedBuilding)
const currentMode = computed(() => gameState.currentMode)

const language = computed(() => gameState.language)
// 按分类筛选建筑
function buildingsByCategory(catKey) {
  // 只返回分类匹配且 visible !== false 的建筑
  return Object.values(buildingData.value).filter(b => b.category === catKey && b.visible !== false)
}
// 选中建筑时，pinia 存储 buildingType（type 字段）
function selectBuilding({ type, name, level = 1 }) {
  // 仅在 BUILD 模式下允许选中
  if (currentMode.value !== 'build')
    return
  if (selectedBuilding.value?.type === type && selectedBuilding.value?.level === level)
    return
  gameState.setSelectedBuilding({ type, level })
  gameState.addToast(`${t('selectedIndicator.selected')}: ${name[language.value]}`, 'info')
}
function setMode(mode) {
  if (currentMode.value === mode)
    return
  gameState.setMode(mode)
  gameState.setSelectedBuilding(null)
  gameState.addToast(`MODE : ${mode.toUpperCase()} CHANGE`, 'info')
}

// 键盘快捷键映射
const modeKeyMap = {
  d: 'demolish',
  r: 'relocate',
  b: 'build',
  s: 'select',
}

function handleKeydown(e) {
  const key = e.key.toLowerCase()
  if (modeKeyMap[key]) {
    setMode(modeKeyMap[key])
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <aside class="w-72 industrial-panel shadow-industrial overflow-y-auto relative z-[10] custom-scrollbar">
    <div class="p-4">
      <h2 class="text-lg font-bold text-industrial-accent uppercase tracking-wide mb-4 border-b border-gray-600 pb-2">
        <span class="neon-text">{{ $t('buildingSidebar.constructionUnits') }}</span>
      </h2>
      <!-- 建筑分类与卡片 -->
      <div v-for="cat in buildingCategories" :key="cat.key" class="mb-6">
        <h3 class="text-sm font-bold text-gray-300 mb-3 uppercase flex items-center" :class="language === 'zh' ? 'tracking-[0.3rem]' : ''">
          <span class="w-2 h-2 rounded-full mr-2" :class="[cat.color]" />
          {{ cat.label[language] }}
        </h3>
        <div class="grid grid-cols-2 gap-2">
          <div
            v-for="b in buildingsByCategory(cat.key)" :key="b.type"
            class="building-card-industrial rounded-lg p-3 cursor-pointer"
            :class="[
              selectedBuilding?.type === b.type ? 'ring-2 ring-industrial-accent' : '',
              currentMode !== 'build' && (selectedBuilding?.type !== b.type) ? 'pointer-events-none opacity-50 grayscale' : '',
            ]"
            :title="currentMode !== 'build' ? $t('buildingSidebar.switchToBuildMode') : ''"
            @click="selectBuilding(b)"
          >
            <div class="text-2xl text-center mb-1">
              {{ b.icon }}
            </div>
            <div class="text-xs text-center font-bold  text-gray-300" :class="language === 'zh' ? 'tracking-[0.3rem]' : ''">
              {{ b.name[language] }}
            </div>
            <div class="text-xs text-center text-industrial-yellow">
              <span class="text-xs">⚡</span>
              <span class="tracking-widest">{{ b.levels[1].cost }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 操作模式 -->
      <div class="mt-6 pt-4 border-t border-gray-600">
        <h3 class="text-sm font-bold text-gray-300 mb-3 uppercase" :class="language === 'zh' ? 'tracking-[0.3rem]' : 'tracking-wide'">
          {{ $t('buildingSidebar.operationMode') }}
        </h3>
        <div class="space-y-2">
          <button
            v-for="mode in modes" :key="mode.key"
            class="industrial-button w-full text-white font-bold py-2 px-3 text-sm uppercase"
            :class="[
              language === 'zh' ? 'tracking-[0.3rem]' : 'tracking-wide',
              currentMode === mode.key ? 'bg-industrial-accent' : '',
            ]"
            @click="setMode(mode.key)"
          >
            <span v-html="mode.icon" /> {{ mode.label[language] }}
          </button>
        </div>
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
