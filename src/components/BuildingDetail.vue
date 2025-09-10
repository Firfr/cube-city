<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
// 只定义 props，不赋值变量

const _props = defineProps({
  building: { type: Object, required: true },
  selectedPosition: {
    type: Object,
    default: () => ({
      x: 0,
      y: 0,
    }),
  },
  currentMode: { type: String, required: true },
})

const _emit = defineEmits(['upgrade', 'repair', 'demolish'])
const { t, locale } = useI18n()

const nextLevelData = computed(() => {
  if (_props.building.nextLevel && _props.building.levels) {
    return _props.building.levels[_props.building.nextLevel]
  }
  return null
})

const upgradeImprovements = computed(() => {
  if (!nextLevelData.value) {
    return []
  }

  const current = _props.building
  const next = nextLevelData.value
  const improvements = []

  const checkImprovement = (key, positiveIsGood) => {
    if (next[key] !== undefined && current[key] !== undefined) {
      const diff = next[key] - current[key]
      if (diff !== 0) {
        const isGood = positiveIsGood ? diff > 0 : diff < 0
        improvements.push({
          label: t(`buildingDetails.${key}`),
          value: `${diff > 0 ? '+' : ''}${diff}`,
          color: isGood ? 'text-industrial-green' : 'text-industrial-red',
          icon: {
            maxPopulation: '👥',
            powerUsage: '⚡',
            pollution: '💩',
            coinOutput: '💰',
            powerOutput: '⚡',
          }[key],
        })
      }
    }
  }

  checkImprovement('maxPopulation', true) // More population is good
  checkImprovement('coinOutput', true) // More coin output is good
  checkImprovement('powerOutput', true) // More power output is good
  checkImprovement('powerUsage', false) // More power usage is bad
  checkImprovement('pollution', false) // More pollution is bad

  return improvements
})
</script>

<template>
  <div>
    <!-- 建筑详情显示 -->
    <div class="text-center mb-6">
      <div class="text-6xl mb-3">
        {{ building.icon }}
      </div>
      <h3 class="text-xl font-bold text-industrial-accent uppercase tracking-wide neon-text">
        {{ building.displayName && building.displayName[locale] ? building.displayName[locale] : building.displayName }}
      </h3>
      <p class="text-sm text-gray-400 uppercase tracking-wide">
        {{ building.buildingType && building.buildingType[locale] ? building.buildingType[locale] : building.buildingType }}
      </p>
      <p v-if="building.displayName" class="text-xs text-gray-500 mt-1">
        {{ building.category }}
      </p>
    </div>
    <div class="space-y-4">
      <!-- 状态区块 -->
      <div class="resource-display rounded p-3">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm text-gray-400 uppercase tracking-wide">{{ t('buildingDetails.status') }}</span>
          <div class="flex items-center space-x-2">
            <div class="status-indicator status-online" />
            <span class="text-sm text-industrial-green uppercase">{{ t('buildingDetails.operational') }}</span>
          </div>
        </div>
        <div class="text-lg font-bold text-white uppercase flex items-center">
          <span class="text-xl mr-4 text-industrial-green">98%</span>
          <span class="text-lg text-gray-400 uppercase tracking-wide">{{ t('dashboardFooter.efficiency') }}</span>
        </div>
      </div>
      <!-- 产出/用电/就业/人口等区块 -->
      <div class="resource-display rounded p-3">
        <div class="text-sm text-gray-400 uppercase tracking-wide mb-1">
          {{ t('buildingDetails.production') }}
        </div>
        <div v-if="building.powerOutput" class="flex justify-between my-1">
          <span class="text-sm text-gray-300">{{ t('buildingDetails.powerOutput') }}:</span>
          <span class="text-sm font-bold text-industrial-yellow">+{{ building.powerOutput }} ⚡</span>
        </div>
        <div v-if="building.coinOutput" class="flex justify-between my-1">
          <span class="text-sm text-gray-300">{{ t('buildingDetails.coinOutput') }}:</span>
          <span class="text-sm font-bold text-industrial-yellow">+{{ building.coinOutput }} 💰</span>
        </div>
        <div v-if="building.powerUsage" class="flex justify-between my-1">
          <span class="text-sm text-gray-300">{{ t('buildingDetails.powerUsage') }}:</span>
          <span class="text-sm font-bold text-industrial-blue">-{{ building.powerUsage }} ⚡</span>
        </div>
        <div v-if="building.maxPopulation" class="flex justify-between my-1">
          <span class="text-sm text-gray-300">{{ t('buildingDetails.maxPopulation') }}:</span>
          <span class="text-sm font-bold text-industrial-blue">{{ building.maxPopulation }} 👥</span>
        </div>
        <div v-if="building.population" class="flex justify-between my-1">
          <span class="text-sm text-gray-300">{{ t('buildingDetails.workers') }}:</span>
          <span class="text-sm font-bold text-industrial-blue">{{ building.population }} 👨‍🏭</span>
        </div>
        <div v-if="building.pollution !== undefined" class="flex justify-between my-1">
          <span class="text-sm text-gray-300">{{ t('buildingDetails.pollution') }}:</span>
          <span class="text-sm font-bold text-industrial-green">{{ building.pollution }} {{ building.pollution > 0 ? '💩' : '🌳' }}</span>
        </div>
        <div v-if="building.cost" class="flex justify-between my-1">
          <span class="text-sm text-gray-300">{{ t('buildingDetails.cost') }}:</span>
          <span class="text-sm font-bold text-industrial-red">{{ building.cost }} 💰</span>
        </div>
      </div>
      <!-- 维护区块 -->
      <div class="resource-display rounded p-3">
        <div class="text-sm text-gray-400 uppercase tracking-wide mb-2">
          {{ t('buildingDetails.maintenance') }}
        </div>
        <div class="flex justify-between">
          <span class="text-sm text-gray-300">{{ t('buildingDetails.condition') }}:</span>
          <span class="text-sm font-bold text-industrial-yellow">85%</span>
        </div>
        <div class="flex justify-between">
          <span class="text-sm text-gray-300">{{ t('buildingDetails.nextService') }}:</span>
          <span class="text-sm font-bold text-gray-300">12h</span>
        </div>
      </div>
      <!-- 升级信息区块 -->
      <div v-if="currentMode === 'select'" class="resource-display rounded p-3">
        <div class="text-sm text-gray-400 uppercase tracking-wide mb-2">
          升级信息
        </div>
        <div class="flex justify-between">
          <span class="text-sm text-gray-300">当前等级:</span>
          <span class="text-sm font-bold text-industrial-yellow">Lv. {{ building.level }}</span>
        </div>

        <div v-if="nextLevelData">
          <div class="flex justify-between mt-1">
            <span class="text-sm text-gray-300">{{ t('buildingDetails.nextLevel') }}:</span>
            <span class="text-sm font-bold text-industrial-yellow">Lv. {{ building.nextLevel }}</span>
          </div>
          <div v-if="building.upgradeCost" class="flex justify-between mt-1">
            <span class="text-sm text-gray-300">{{ t('buildingDetails.upgradeCost') }}:</span>
            <span class="text-sm font-bold text-industrial-red">{{ building.upgradeCost }} 💰</span>
          </div>

          <!-- Improvements -->
          <div v-if="upgradeImprovements.length > 0" class="mt-2 pt-2 border-t border-gray-700">
            <div class="text-sm text-gray-400 uppercase tracking-wide mb-1">
              改进项
            </div>
            <div v-for="item in upgradeImprovements" :key="item.label" class="flex justify-between my-1">
              <span class="text-sm text-gray-300">{{ item.label }}:</span>
              <span class="text-sm font-bold" :class="item.color">
                {{ item.value }} {{ item.icon }}
              </span>
            </div>
          </div>
        </div>
        <div v-else class="mt-1">
          <span class="text-sm text-gray-400">最高等级</span>
        </div>
      </div>
      <!-- 建筑所在 Tile 位置 区块 -->
      <div v-if="currentMode === 'select'" class="resource-display rounded p-3">
        <div class="text-sm text-gray-400 uppercase tracking-wide mb-2">
          {{ t('buildingDetails.tile') }}
        </div>
        <div class="flex justify-between">
          <span class="text-sm font-bold text-industrial-blue">
            {{ selectedPosition.x }}, {{ selectedPosition.z }}
          </span>
        </div>
      </div>
    </div>
    <div v-if="currentMode === 'select'" class="mt-6 space-y-2">
      <button class="industrial-button w-full text-white font-bold py-3 px-4 text-sm uppercase tracking-wide" @click="$emit('upgrade')">
        ⬆️ {{ t('buildingDetails.upgradeUnit') }}
      </button>
      <button class="industrial-button w-full text-white font-bold py-3 px-4 text-sm uppercase tracking-wide" @click="$emit('repair')">
        🔧 {{ t('buildingDetails.maintenanceBtn') }}
      </button>
      <button class="industrial-button w-full text-white font-bold py-3 px-4 text-sm uppercase tracking-wide" @click="$emit('demolish')">
        💥 {{ t('buildingDetails.demolish') }}
      </button>
    </div>
  </div>
</template>
