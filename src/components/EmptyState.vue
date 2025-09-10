<script setup>
import { useI18n } from 'vue-i18n'
// 只定义 props，不赋值变量

const _props = defineProps({
  currentMode: { type: String, required: true },
})
</script>

<template>
  <div class="relative h-full flex items-center justify-center p-6">
    <transition name="fade-slide" mode="out-in">
      <div :key="currentMode" class="text-center max-w-md">
        <template v-if="currentMode === 'select'">
          <!-- 选择模式内容 -->
          <div class="relative mb-6">
            <div class="text-8xl mb-4 transform hover:scale-110 transition-transform duration-300">
              <div class="inline-block p-4 py-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                🔍
              </div>
            </div>
            <div class="absolute -top-1 -right-1 w-4 h-4 bg-blue-400 rounded-full animate-ping" />
          </div>
          <h3 class="text-xl font-bold text-white mb-3 uppercase tracking-wider">
            Selection Mode
          </h3>
          <div class="space-y-3">
            <p class="text-slate-300 text-sm leading-relaxed">
              Click any building in the scene to view detailed information and statistics
            </p>
            <div class="bg-slate-800/50 backdrop-blur-sm rounded-lg p-3 border border-slate-700">
              <div class="flex items-center justify-center space-x-2 text-xs text-slate-400">
                <span class="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                <span>Ready to inspect buildings</span>
              </div>
            </div>
          </div>
        </template>
        <template v-else-if="currentMode === 'build'">
          <!-- 建造模式内容 -->
          <div class="relative mb-6">
            <div class="text-8xl mb-4 transform hover:scale-110 transition-transform duration-300">
              <div class="inline-block p-4 py-6 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl shadow-lg">
                🏗️
              </div>
            </div>
            <div class="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping" />
          </div>
          <h3 class="text-xl font-bold text-white mb-3 uppercase tracking-wider">
            Build Mode
          </h3>
          <div class="space-y-4">
            <p class="text-slate-300 text-sm leading-relaxed">
              Select a building type from the sidebar, then click on any empty tile to construct it
            </p>
            <div class="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-lg p-4 border border-yellow-500/30">
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0">
                  <svg class="w-5 h-5 text-yellow-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="text-left">
                  <p class="text-yellow-200 text-xs font-medium uppercase tracking-wide mb-1">
                    Strategic Tip
                  </p>
                  <p class="text-yellow-100 text-xs leading-relaxed">
                    Power supply, environmental factors, and resident satisfaction directly impact population growth and coin production
                  </p>
                </div>
              </div>
            </div>
            <!-- 新增贴士 提醒用户可通过左右方向键调整东南西北方向 -->
            <div class="bg-slate-800/50 backdrop-blur-sm rounded-lg p-3 border border-slate-700">
              <p class="text-slate-300 text-sm">
                Press <kbd class="px-1.5 py-0.5 bg-blue-500 text-white rounded text-xs font-bold">←</kbd> or <kbd class="px-1.5 py-0.5 bg-blue-500 text-white rounded text-xs font-bold">→</kbd> to adjust the direction of the camera
              </p>
            </div>
          </div>
        </template>
        <template v-else-if="currentMode === 'relocate'">
          <!-- 搬迁模式内容 -->
          <div class="relative mb-6">
            <div class="text-8xl mb-4 transform hover:scale-110 transition-transform duration-300">
              <div class="inline-block p-4 py-6 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl shadow-lg">
                🚧
              </div>
            </div>
            <div class="absolute -top-1 -right-1 w-4 h-4 bg-cyan-400 rounded-full animate-ping" />
          </div>
          <h3 class="text-xl font-bold text-white mb-3 uppercase tracking-wider">
            Relocation Mode
          </h3>
          <div class="space-y-4">
            <div class="space-y-3">
              <div class="bg-slate-800/50 backdrop-blur-sm rounded-lg p-3 border border-slate-700">
                <div class="flex items-center space-x-2 text-sm text-slate-200">
                  <kbd class="px-2 py-1 bg-slate-700 rounded text-xs font-mono">R</kbd>
                  <span>Rotate selected building</span>
                </div>
              </div>
              <div class="bg-slate-800/50 backdrop-blur-sm rounded-lg p-3 border border-slate-700">
                <p class="text-slate-300 text-sm">
                  Click tile <span class="px-1.5 py-0.5 bg-blue-500 text-white rounded text-xs font-bold">A</span>
                  then tile <span class="px-1.5 py-0.5 bg-green-500 text-white rounded text-xs font-bold">B</span>
                  to relocate building
                </p>
              </div>
            </div>
            <div class="bg-red-500/20 backdrop-blur-sm rounded-lg p-3 border border-red-500/30">
              <div class="flex items-start space-x-2">
                <svg class="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
                <div class="text-left">
                  <p class="text-red-200 text-xs">
                    Tile <span class="font-bold">A</span> must have a building<br>
                    Tile <span class="font-bold">B</span> must be empty
                  </p>
                  <p class="text-red-300 text-xs mt-2">
                    Press <kbd class="px-1 py-0.5 bg-red-700 rounded text-xs">ESC</kbd> to cancel
                  </p>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-else-if="currentMode === 'demolish'">
          <!-- 拆除模式内容 -->
          <div class="relative mb-6">
            <div class="text-8xl mb-4 transform hover:scale-110 transition-transform duration-300">
              <div class="inline-block p-4 py-6 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg">
                💥
              </div>
            </div>
            <div class="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full animate-ping" />
          </div>
          <h3 class="text-xl font-bold text-white mb-3 uppercase tracking-wider">
            Demolition Mode
          </h3>
          <div class="space-y-4">
            <p class="text-slate-300 text-sm leading-relaxed">
              Click on any building in the scene to demolish it permanently
            </p>
            <div class="bg-green-500/20 backdrop-blur-sm rounded-lg p-4 border border-green-500/30">
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-1.092a4.535 4.535 0 001.676-.662C13.398 12.766 14 11.991 14 11c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 8.092V6.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V4z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="text-left">
                  <p class="text-green-200 text-xs font-medium uppercase tracking-wide mb-1">
                    Material Recovery
                  </p>
                  <p class="text-green-100 text-xs">
                    70% of construction materials will be refunded to your inventory
                  </p>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4,0,0.2,1), transform 0.3s cubic-bezier(0.4,0,0.2,1);
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(24px) scale(0.98);
}
.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
</style>
