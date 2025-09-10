<script setup>
import { eventBus } from '@/js/utils/event-bus.js'
import { useGameState } from '@/stores/useGameState.js'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import AnimatedNumber from './AnimatedNumber.vue'
import AudioManager from './AudioManager.vue'
import GuideModal from './GuideModal.vue'

const gameState = useGameState()
const { credits, totalJobs, maxPopulation, territory, citySize, cityLevel, cityName, language, showMapOverview, gameDay, power, maxPower, musicEnabled, musicVolume, isPlayingMusic } = storeToRefs(gameState)

// 音乐相关
const showVolumeSlider = ref(false)

// 音乐控制方法
function toggleMusic() {
  gameState.toggleMusic()
}

function handleVolumeChange(event) {
  const volume = Number.parseFloat(event.target.value)
  gameState.setMusicVolume(volume)
}

// 警告状态
const populationWarning = computed(() => totalJobs.value > maxPopulation.value)
const powerWarning = computed(() => power.value > maxPower.value)

// 监听异常状态并触发警告
watch([totalJobs, maxPopulation, power, maxPower], ([newTotalJobs, newMaxPopulation, newPower, newMaxPower], [oldTotalJobs, oldMaxPopulation, oldPower, oldMaxPower]) => {
  // 人口警告：当就业岗位超过人口容量时
  if (newTotalJobs > newMaxPopulation && !(oldTotalJobs > oldMaxPopulation)) {
    eventBus.emit('toast:add', {
      message: language.value === 'zh' ? '⚠️ 就业岗位不足！人口容量已超负荷' : '⚠️ Job shortage! Population capacity exceeded',
      type: 'warning',
    })
  }

  // 电力警告：当耗电量超过发电量时
  if (newPower > newMaxPower && !(oldPower > oldMaxPower)) {
    eventBus.emit('toast:add', {
      message: language.value === 'zh' ? '⚡ 电力不足！发电量无法满足需求' : '⚡ Power shortage! Power generation insufficient',
      type: 'error',
    })
  }
}, { immediate: true })

function toggleLang() {
  gameState.setLanguage(language.value === 'zh' ? 'en' : 'zh')
}

function toggleMapOverview() {
  gameState.setShowMapOverview(!showMapOverview.value)
}

// 新手指南状态
const showGuide = ref(false)

function toggleGuide() {
  showGuide.value = !showGuide.value
}

// 显示新手指南
function showGuideModal() {
  showGuide.value = true
}
</script>

<template>
  <header class="industrial-panel p-4 m-2 shadow-industrial z-[10] relative ">
    <div class="flex justify-between items-center">
      <!-- 左侧资源信息 -->
      <div class="flex items-center space-x-6">
        <!-- 金币 -->
        <div class="resource-display rounded-lg px-4 py-2 flex items-center space-x-3  min-w-[10vw]">
          <div class="status-indicator status-online" />
          <div class="flex items-center space-x-2">
            <span class="text-industrial-green text-xl">💰</span>
            <div>
              <div class="text-sm text-gray-400 uppercase " :class="language === 'zh' ? 'tracking-[0.3rem]' : 'tracking-wide'">
                {{ $t('topbar.credits') }}
              </div>
              <div class="text-lg font-bold text-industrial-green neon-text">
                <AnimatedNumber :value="credits" :duration="3" separator="," />
              </div>
            </div>
          </div>
        </div>
        <!-- 人口 -->
        <div class="resource-display rounded-lg px-4 py-2 flex items-center space-x-3 min-w-[10vw]" :class="{ 'warning-pulse': populationWarning }">
          <div class="status-indicator" :class="populationWarning ? 'status-error' : 'status-online'" />
          <div class="flex items-center space-x-2">
            <span class="text-xl" :class="populationWarning ? 'text-red-500' : 'text-industrial-blue'">👥</span>
            <div>
              <div class="text-sm text-gray-400 uppercase" :class="language === 'zh' ? 'tracking-[0.3rem]' : 'tracking-wide'">
                {{ $t('topbar.population') }}
              </div>
              <div class="text-lg font-bold neon-text" :class="populationWarning ? 'text-red-500' : 'text-industrial-blue'">
                <AnimatedNumber :value="totalJobs" :duration="3" separator="," />/
                <AnimatedNumber :value="maxPopulation" :duration="3" separator="," />
              </div>
            </div>
          </div>
        </div>
        <!-- 地皮 -->
        <div class="resource-display rounded-lg px-4 py-2 flex items-center space-x-3">
          <div class="status-indicator status-warning" />
          <div class="flex items-center space-x-2">
            <span class="text-industrial-accent text-xl">🏭</span>
            <div>
              <div class="text-sm text-gray-400 uppercase" :class="language === 'zh' ? 'tracking-[0.3rem]' : 'tracking-wide'">
                {{ $t('topbar.territory') }}
              </div>
              <div class="text-lg font-bold text-industrial-accent neon-text">
                {{ territory }}×{{ citySize }}
              </div>
            </div>
          </div>
        </div>
        <!-- 电力 -->
        <div class="resource-display rounded-lg px-4 py-2 flex items-center space-x-3 min-w-[10vw]" :class="{ 'warning-pulse': powerWarning }">
          <div class="status-indicator" :class="powerWarning ? 'status-error' : 'status-online'" />
          <div class="flex items-center space-x-2">
            <span class="text-xl" :class="powerWarning ? 'text-red-500' : 'text-industrial-yellow'">⚡️</span>
            <div>
              <div class="text-sm text-gray-400 uppercase" :class="language === 'zh' ? 'tracking-[0.3rem]' : 'tracking-wide'">
                {{ $t('topbar.power') }}
              </div>
              <div class="text-lg font-bold neon-text" :class="powerWarning ? 'text-red-500' : 'text-industrial-yellow'">
                <AnimatedNumber :value="power" :duration="3" separator="," />/
                <AnimatedNumber :value="maxPower" :duration="3" separator="," />
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 右侧城市信息和按钮 -->
      <div class="text-right flex items-center space-x-4 mr-4">
        <!-- 城市信息 -->
        <div>
          <h1 class="text-2xl font-black text-industrial-accent neon-text uppercase tracking-wider">
            {{ cityName }}
          </h1>
          <div class="flex items-center justify-end space-x-2 mt-1">
            <div class="status-indicator status-online" />
            <span class="text-sm text-gray-400 uppercase tracking-wide">{{ $t('topbar.level') }} <span class="text-white">{{ cityLevel }}</span> • {{ $t('topbar.day') }} <span class="text-white">{{ gameDay }}</span> </span>
          </div>
        </div>

        <!-- 按钮区域 - 两列布局 -->
        <div class="grid grid-cols-3 gap-2">
          <!-- 第一行 -->
          <button class="px-2 py-1 rounded bg-gray-700 text-white text-sm font-medium hover:bg-gray-600 transition" @click="toggleLang">
            {{ language === 'zh' ? 'EN' : '中' }}
          </button>

          <button
            class="px-3 col-span-2 py-1 rounded bg-industrial-green text-white text-sm font-bold shadow hover:bg-industrial-green/80 transition"
            @click="toggleGuide"
          >
            📖 {{ language === 'zh' ? '指南' : 'Guide' }}
          </button>

          <!-- 第二行 -->
          <div class="relative">
            <button
              class="w-full px-2 py-1 rounded text-white text-sm font-bold shadow transition"
              :class="musicEnabled ? 'bg-industrial-blue hover:bg-industrial-blue/80' : 'bg-gray-600 hover:bg-gray-500'"
              :title="musicEnabled ? $t('topbar.music.pauseMusic') : $t('topbar.music.playMusic')"
              @click="toggleMusic"
              @mouseenter="showVolumeSlider = true"
              @mouseleave="showVolumeSlider = false"
            >
              {{ musicEnabled && isPlayingMusic ? '🔊' : '🔇' }}
            </button>

            <!-- 音量滑块 tooltip -->
            <div
              v-if="showVolumeSlider"
              class="absolute bottom-full left-1/2 transform -translate-x-1/2  p-3 bg-gray-800 rounded shadow-lg border border-gray-600 z-20 min-w-max"
              @mouseenter="showVolumeSlider = true"
              @mouseleave="showVolumeSlider = false"
            >
              <div class="flex items-center space-x-2 whitespace-nowrap">
                <span class="text-xs text-gray-400">🔉</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  :value="musicVolume"
                  class="w-20 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  @input="handleVolumeChange"
                >
                <span class="text-xs text-gray-400">🔊</span>
              </div>
              <div class="text-xs text-center text-gray-400 mt-1">
                {{ Math.round(musicVolume * 100) }}%
              </div>
            </div>
          </div>

          <button
            class="px-3 col-span-2 py-1 rounded bg-industrial-accent text-white text-sm font-bold shadow hover:bg-industrial-accent/80 transition"
            @click="toggleMapOverview"
          >
            {{ language === 'zh' ? (showMapOverview ? '🗺️ 隐藏' : '🗺️ 地图') : (showMapOverview ? '🗺️ Hide' : '🗺️ Map') }}
          </button>
        </div>
      </div>
    </div>

    <!-- 新手指南弹窗 -->
    <GuideModal
      :is-visible="showGuide"
      @close="showGuide = false"
      @show-guide="showGuideModal"
    />

    <!-- 音频管理器 -->
    <AudioManager />
  </header>
</template>

<style scoped>
/* 警告脉冲效果 */
.warning-pulse {
  animation: warning-pulse 2s ease-in-out infinite;
  border: 2px solid transparent;
  background: linear-gradient(45deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05));
}

@keyframes warning-pulse {
  0% {
    transform: scale(1);
    border-color: rgba(239, 68, 68, 0.3);
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
  }
  50% {
    transform: scale(1.02);
    border-color: rgba(239, 68, 68, 0.6);
    box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
  }
  100% {
    transform: scale(1);
    border-color: rgba(239, 68, 68, 0.3);
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
  }
}

/* 状态指示器样式 */
.status-error {
  background-color: #ef4444;
  box-shadow: 0 0 10px #ef4444;
  animation: error-blink 1s ease-in-out infinite;
}

@keyframes error-blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
