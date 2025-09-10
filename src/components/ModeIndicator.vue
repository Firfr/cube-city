<script setup>
import gsap from 'gsap'
import { computed, ref, watch } from 'vue'
import { useGameState } from '../stores/useGameState'

const gameState = useGameState()
const modeLabel = computed(() => {
  switch (gameState.currentMode) {
    case 'build': return 'BUILD'
    case 'relocate': return 'RELOCATE'
    case 'demolish': return 'DEMOLISH'
    case 'select': return 'SELECT'
    default: return gameState.currentMode?.toUpperCase() || 'UNKNOWN'
  }
})

// 颜色 class
const modeColorClass = computed(() => {
  switch (gameState.currentMode) {
    case 'build': return 'text-green-500'
    case 'relocate': return 'text-blue-500'
    case 'demolish': return 'text-red-500'
    case 'select': return 'text-yellow-500'
    default: return 'text-industrial-accent'
  }
})

// 绑定 span 的 ref
const modeSpan = ref(null)

// 监听 mode 变化，触发 gsap 动画
watch(() => gameState.currentMode, (newVal, oldVal) => {
  if (newVal !== oldVal && modeSpan.value) {
    gsap.fromTo(
      modeSpan.value,
      { fontSize: 12 },
      {
        fontSize: 16,
        duration: 0.18,
        yoyo: true,
        repeat: 1,
        ease: 'bounce.out',
        clearProps: 'fontSize',
      },
    )
  }
})
</script>

<template>
  <div class="absolute top-4 left-4 resource-display rounded px-3 py-1">
    <span class="text-xs text-gray-400 uppercase tracking-wide">MODE:</span>
    <span
      ref="modeSpan"
      class="text-sm font-bold ml-2 transition-colors duration-200"
      :class="modeColorClass"
    >
      {{ modeLabel }}
    </span>
  </div>
</template>
