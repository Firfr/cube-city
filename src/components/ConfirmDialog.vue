<script setup>
import { useGameState } from '@/stores/useGameState'
import { computed } from 'vue'

const props = defineProps({
  show: Boolean,
  title: {
    type: String,
    default: 'Title',
  },
  message: {
    type: String,
    default: 'No message',
  },
  confirmText: {
    type: String,
    default: 'Confirm',
  },
  cancelText: {
    type: String,
    default: 'Cancel',
  },
  action: {
    type: String,
    default: 'select',
  },
})

const emits = defineEmits(['confirm', 'cancel'])
// const gameState = useGameState()
// const currentMode = computed(() => gameState.currentMode)
// ====== 主题色与 icon 映射 ======
const MODE_THEME = {
  select: {
    color: '#FFBB00', // 黄色
    tw: 'from-yellow-400 to-yellow-600',
    border: 'border-yellow-400',
    shadow: 'shadow-yellow-400',
    icon: '⬆️',
  },
  build: {
    color: '#00FF33', // 绿色
    tw: 'from-green-400 to-green-600',
    border: 'border-green-400',
    shadow: 'shadow-green-400',
    icon: '🏗️',
  },
  relocate: {
    color: '#0044FF', // 蓝色
    tw: 'from-blue-400 to-blue-600',
    border: 'border-blue-400',
    shadow: 'shadow-blue-400',
    icon: '🚧',
  },
  demolish: {
    color: '#FF3000', // 红色
    tw: 'from-red-400 to-red-600',
    border: 'border-red-400',
    shadow: 'shadow-red-400',
    icon: '💥',
  },
}

const modeTheme = computed(() => MODE_THEME[props.action] || MODE_THEME.select)

function onConfirm() {
  emits('confirm')
}
function onCancel() {
  emits('cancel')
}
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
    <div class="relative bg-[#181c24] shadow-lg px-6 py-8 min-w-[320px] max-w-[90vw] w-[580px] border rounded-lg" :class="modeTheme.border">
      <!-- 标题 -->
      <h2 class="text-center text-[2rem] font-bold tracking-widest uppercase mb-1 select-none" :style="{ color: modeTheme.color, textShadow: `0 0 8px ${modeTheme.color}, 0 0 24px ${modeTheme.color}, 0 0 40px ${modeTheme.color}` }">
        {{ title }}
      </h2>
      <!-- 分割线 -->
      <div class="h-[2px] w-full mb-4" :style="{ background: modeTheme.color }" />
      <!-- 动态图标 -->
      <div class="flex justify-center mb-4">
        <span class="text-[3.5rem] select-none icon-animate" :style="{ filter: `drop-shadow(0 0 12px ${modeTheme.color})` }">{{ modeTheme.icon }}</span>
      </div>
      <!-- 提示语 -->
      <p class="text-center text-gray-200 text-xl mb-4 whitespace-pre-line">
        <slot v-if="$slots.default" />
        <span v-else v-html="message" />
      </p>
      <!-- 按钮区 -->
      <div class="flex justify-center gap-4">
        <button
          class="w-36 py-2 text-lg font-bold rounded border-2 hover:text-white transition uppercase tracking-wider shadow-md"
          :style="{ background: '#2c3440', color: modeTheme.color, borderColor: modeTheme.color }"
          @click="onConfirm"
        >
          {{ confirmText }}
        </button>
        <button
          class="w-36 py-2 text-lg font-bold rounded border-2 hover:bg-white transition uppercase tracking-wider shadow-md"
          :style="{ background: modeTheme.color, color: '#fff', borderColor: modeTheme.color }"
          @click="onCancel"
        >
          {{ cancelText }}
        </button>
      </div>
      <!-- 发光边框 -->
      <div
        class="pointer-events-none absolute inset-0 rounded-lg border-2 animate-glow"
        :style="{ 'borderColor': modeTheme.color, '--theme-color': modeTheme.color }"
      />
    </div>
  </div>
</template>

<style scoped>
.icon-animate {
  animation: icon-bounce 1.2s infinite alternate cubic-bezier(0.4,0,0.2,1);
  display: inline-block;
}
@keyframes icon-bounce {
  from { transform: scale(1) rotate(-8deg); }
  50%  { transform: scale(1.15) rotate(8deg); }
  to   { transform: scale(1) rotate(-8deg); }
}
.animate-glow {
  animation: glow 1.5s infinite alternate;
  box-shadow: 0 0 12px var(--theme-color), 0 0 32px var(--theme-color);
}
@keyframes glow {
  from { box-shadow: 0 0 8px var(--theme-color), 0 0 16px var(--theme-color); }
  to   { box-shadow: 0 0 24px var(--theme-color), 0 0 48px var(--theme-color); }
}
</style>
