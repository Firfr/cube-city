<script setup>
import { useGameState } from '@/stores/useGameState.js'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const show = ref(false)
const enableMusic = ref(true) // 默认开启背景音乐
const STORAGE_KEY = 'gameState' // pinia 默认以 store.$id 作为 key
const RECENTLY_REJECTED_KEY = 'recentlyRejected'
const REJECTED_DURATION = 3000 // ms

onMounted(() => {
  const rejectedAt = localStorage.getItem(RECENTLY_REJECTED_KEY)
  const now = Date.now()
  if (rejectedAt && now - Number(rejectedAt) < REJECTED_DURATION) {
    show.value = false
    return
  }
  // 检查 localStorage 是否有存档
  if (localStorage.getItem(STORAGE_KEY)) {
    show.value = true
  }
})

function onAccept() {
  // 设置音乐开关状态
  const gameState = useGameState()
  if (enableMusic.value) {
    gameState.enableMusic()
  }
  else {
    gameState.disableMusic()
  }
  // 什么都不用做，pinia 会自动恢复
  show.value = false
}

function onReject() {
  // 清空存档并重置
  localStorage.removeItem(STORAGE_KEY)
  const gameState = useGameState()
  gameState.resetAll()

  // 设置音乐开关状态
  if (enableMusic.value) {
    gameState.enableMusic()
    gameState.setMusicPlaying(true)
  }
  else {
    gameState.disableMusic()
    gameState.setMusicPlaying(false)
  }

  localStorage.setItem(RECENTLY_REJECTED_KEY, Date.now().toString())
  window.location.reload()
  show.value = false
}
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-40">
    <div class="bg-industrial-panel bg-black bg-opacity-70 rounded-xl shadow-industrial p-6 w-[90vw] max-w-lg mx-auto text-center">
      <h3 class="text-xl font-bold text-industrial-accent uppercase tracking-wide mb-2">
        继续上一局游戏吗？
      </h3>
      <p class="text-lg text-gray-400 mb-4">
        检测到上一次的游戏存档，您想继续吗？
      </p>

      <div class="flex flex-col gap-3">
        <button class="industrial-button w-full text-white font-bold py-3 px-4 text-sm uppercase tracking-wide" @click="onAccept">
          是的，继续上一局游戏
        </button>
        <button class=" w-full text-white font-bold py-3 px-4 text-sm uppercase tracking-wide bg-industrial-red hover:bg-red-700" @click="onReject">
          不，开始新游戏
        </button>
      </div>

      <!-- 音乐开启提示 -->
      <!-- 背景音乐选择 -->
      <label class="flex items-center justify-center space-x-3 cursor-pointer mt-4">
        <input
          v-model="enableMusic"
          type="checkbox"
          class="w-4 h-4 text-industrial-blue bg-gray-700 border-gray-600 rounded focus:ring-industrial-blue focus:ring-2"
        >
        <span class="text-white/60 font-medium">
          🎵 {{ locale === 'zh' ? '点击右上角音乐按钮(没有声音，重新关闭在打开)' : 'Click the music button in the top right corner' }}
        </span>
      </label>
      <!-- GPU加速提示 -->
      <div class="mt-4 p-3 bg-yellow-600/20 border border-yellow-500/30 rounded-lg">
        <div class="flex items-center justify-center space-x-2 text-yellow-300/80 text-sm">
          <span class="text-lg">⚡</span>
          <span>{{ locale === 'zh' ? '建议在 chrome://flags 中开启 GPU 加速以获得更好的游戏体验' : 'Enable GPU acceleration in chrome://flags for better gaming experience' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- tailwindcss 风格，无需 scoped -->
