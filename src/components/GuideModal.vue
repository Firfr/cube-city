<script setup>
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const _props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'showGuide'])

const { locale } = useI18n()

// 内容切换状态
const showQuickReference = ref(false)

// localStorage 相关常量
const FIRST_VISIT_KEY = 'cubecity_first_visit'

// 检查是否首次访问
function isFirstVisit() {
  return !localStorage.getItem(FIRST_VISIT_KEY)
}

// 标记已访问
function markAsVisited() {
  localStorage.setItem(FIRST_VISIT_KEY, 'true')
}

// 组件挂载时检查首次访问状态
onMounted(() => {
  if (isFirstVisit()) {
    // 首次访问时自动显示新手教程
    emit('showGuide')
    // 标记为已访问
    markAsVisited()
  }
})

function closeModal() {
  emit('close')
  showQuickReference.value = false // 关闭时重置状态
}

// 防止点击内容区域时关闭弹窗
function handleContentClick(e) {
  e.stopPropagation()
}

// 切换显示内容
function toggleContent() {
  showQuickReference.value = !showQuickReference.value
}
</script>

<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    @click="closeModal"
  >
    <div
      class="industrial-panel shadow-industrial max-w-4xl w-full max-h-[90vh] overflow-hidden"
      @click="handleContentClick"
    >
      <!-- 标题栏 -->
      <div class="p-4 border-b border-gray-600 flex justify-between items-center">
        <h2 class="text-xl font-bold text-industrial-accent uppercase tracking-wide neon-text">
          🏙️ {{ locale === 'zh' ? 'CubeCity 新手游玩指南' : 'CubeCity Beginner Guide' }}
        </h2>
        <div class="flex items-center space-x-3">
          <!-- 切换按钮 -->
          <button
            class="px-3 py-1 rounded bg-industrial-green text-white font-bold shadow hover:bg-industrial-green/80 transition text-sm"
            @click="toggleContent"
          >
            {{ showQuickReference ? (locale === 'zh' ? '📖 新手指南' : '📖 Guide') : (locale === 'zh' ? '📋 速查表' : '📋 Quick Ref  (Important)') }}
          </button>
          <!-- GitHub 链接 -->
          <a
            href="https://github.com/hexianWeb/CubeCity"
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray-400 hover:text-white transition-colors text-2xl"
            title="GitHub Repository"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
            </svg>
          </a>
          <button
            class="text-gray-400 hover:text-white transition-colors text-2xl"
            @click="closeModal"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)] custom-scrollbar">
        <!-- 重要提示：建造需先修路 -->
        <div
          class="mb-5 p-4 rounded border text-center shadow-industrial border-industrial-yellow text-white/80 bg-gray-800/60"
        >
          <div class="text-2xl md:text-3xl font-extrabold leading-snug">
            🚧 {{
              locale === 'zh'
                ? '建造建筑前必须先修建道路（建筑只能建在道路旁）'
                : 'Build a road first before placing buildings (buildings must be next to roads)'
            }}
          </div>
          <div class="mt-2 text-base md:text-lg font-semibold text-gray-300">
            {{
              locale === 'zh'
                ? '特例：风力发电与公园可在任意地块建造'
                : 'Exception: Wind Power and Parks can be built anywhere'
            }}
          </div>
        </div>
        <!-- 新手指南内容 -->
        <div v-if="!showQuickReference" class="space-y-6 text-gray-300">
          <!-- 游戏简介 -->
          <section>
            <h3 class="text-lg font-bold text-industrial-accent uppercase tracking-wide mb-3 neon-text">
              1. 🎮 {{ locale === 'zh' ? '游戏简介' : 'Game Introduction' }}
            </h3>
            <p class="text-sm leading-relaxed mb-3">
              {{ locale === 'zh' ? 'CubeCity 是一款以城市建设为核心的模拟经营游戏。你将从一块空地起步，逐步建造住宅、商业、工业、环境等多种建筑，合理布局道路，管理金币与人口，打造属于你的理想城市。' : 'CubeCity is a city-building simulation game where you start from an empty plot and gradually construct residential, commercial, industrial, and environmental buildings.' }}
            </p>
            <div class="bg-gray-800/50 p-3 rounded">
              <h4 class="text-sm font-bold text-industrial-yellow mb-2 uppercase">
                {{ locale === 'zh' ? '核心特色' : 'Core Features' }}:
              </h4>
              <ul class="text-sm space-y-1">
                <li>🏗️ {{ locale === 'zh' ? '3D 城市建设与资源管理' : '3D City Building & Resource Management' }}</li>
                <li>🏠 {{ locale === 'zh' ? 'RCI & ESG 多维建筑体系' : 'RCI & ESG Multi-dimensional Building System' }}</li>
                <li>💾 {{ locale === 'zh' ? '本地存储、响应式 UI' : 'Local Storage & Responsive UI' }}</li>
                <li>🎨 {{ locale === 'zh' ? '丰富的扩展与自定义空间' : 'Rich Extensions & Customization' }}</li>
              </ul>
            </div>
          </section>

          <!-- 快速开始 -->
          <section>
            <h3 class="text-lg font-bold text-industrial-accent uppercase tracking-wide mb-3 neon-text">
              2. 🚀 {{ locale === 'zh' ? '快速开始' : 'Quick Start' }}
            </h3>
            <div class="bg-gray-800/50 p-3 rounded">
              <ol class="text-sm space-y-2 list-decimal list-inside">
                <li>{{ locale === 'zh' ? '打开游戏，点击"开始新城市"' : 'Open the game and click "Start New City"' }}</li>
                <li>{{ locale === 'zh' ? '你将获得一块16x16格的空地和初始金币 💰' : 'You will get a 16x16 plot and initial coins 💰' }}</li>
                <li>{{ locale === 'zh' ? '通过左侧建筑面板选择建筑类型，点击地图上的地皮进行放置' : 'Select building types from the left panel and click on plots to place them' }}</li>
                <li>{{ locale === 'zh' ? '观察城市发展，合理扩展地皮、升级建筑，体验城市成长的乐趣！' : 'Observe city development, expand plots and upgrade buildings to experience city growth!' }}</li>
              </ol>
            </div>
          </section>

          <!-- 基础操作 -->
          <section>
            <h3 class="text-lg font-bold text-industrial-accent uppercase tracking-wide mb-3 neon-text">
              3. 🎯 {{ locale === 'zh' ? '基础操作' : 'Basic Operations' }}
            </h3>

            <div class="space-y-4">
              <!-- 建筑操作 -->
              <div class="bg-gray-800/50 p-3 rounded">
                <h4 class="text-sm font-bold text-industrial-yellow mb-2 uppercase">
                  {{ locale === 'zh' ? '建筑操作' : 'Building Operations' }}:
                </h4>
                <ul class="text-sm space-y-1">
                  <li><span class="text-industrial-green">🏗️</span> {{ locale === 'zh' ? '选择建筑：左侧面板点击建筑卡片' : 'Select Building: Click building cards in left panel' }}</li>
                  <li><span class="text-industrial-green">📍</span> {{ locale === 'zh' ? '放置建筑：选择后点击空地建造' : 'Place Building: Click empty plot to build' }}</li>
                  <li><span class="text-industrial-green">🚧</span> {{ locale === 'zh' ? '移动建筑：切换到搬迁模式' : 'Move Building: Switch to relocation mode' }}</li>
                  <li><span class="text-industrial-green">⬆️</span> {{ locale === 'zh' ? '升级建筑：满足条件可升级' : 'Upgrade Building: Upgrade when conditions met' }}</li>
                  <li><span class="text-industrial-green">💥</span> {{ locale === 'zh' ? '拆除建筑：切换到拆除模式' : 'Demolish Building: Switch to demolition mode' }}</li>
                </ul>
              </div>

              <!-- 快捷键 -->
              <div class="bg-gray-800/50 p-3 rounded">
                <h4 class="text-sm font-bold text-industrial-yellow mb-2 uppercase">
                  {{ locale === 'zh' ? '快捷键操作' : 'Keyboard Shortcuts' }}:
                </h4>
                <ul class="text-sm space-y-1">
                  <li><span class="text-industrial-blue">{{ locale === 'zh' ? 'R键' : 'R Key' }}</span> 🔄 {{ locale === 'zh' ? '旋转建筑方向' : 'Rotate building direction' }}</li>
                  <li><span class="text-industrial-blue">{{ locale === 'zh' ? 'ESC键' : 'ESC Key' }}</span> ❌ {{ locale === 'zh' ? '取消当前操作' : 'Cancel current operation' }}</li>
                  <li><span class="text-industrial-blue">{{ locale === 'zh' ? '鼠标右键' : 'Mouse Right Key' }}</span> 🖱️ {{ locale === 'zh' ? '取消选择' : 'Cancel selection' }}</li>
                  <li><span class="text-industrial-blue">{{ locale === 'zh' ? '鼠标滚轮' : 'Mouse Scroll' }}</span> 📏 {{ locale === 'zh' ? '缩放视角' : 'Zoom view' }}</li>
                </ul>
              </div>

              <!-- 模式切换 -->
              <div class="bg-gray-800/50 p-3 rounded">
                <h4 class="text-sm font-bold text-industrial-yellow mb-2 uppercase">
                  {{ locale === 'zh' ? '模式切换' : 'Mode Switching' }}:
                </h4>
                <div class="grid grid-cols-2 gap-2 text-sm">
                  <div class="flex items-center space-x-2">
                    <span>🔍</span>
                    <span>{{ locale === 'zh' ? '选择：查看建筑信息' : 'Select: View building info' }}</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span>🏗️</span>
                    <span>{{ locale === 'zh' ? '建造：放置新建筑' : 'Build: Place new buildings' }}</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span>🚧</span>
                    <span>{{ locale === 'zh' ? '搬迁：移动建筑' : 'Relocate: Move buildings' }}</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span>💥</span>
                    <span>{{ locale === 'zh' ? '拆除：删除建筑' : 'Demolish: Delete buildings' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- 建筑系统 -->
          <section>
            <h3 class="text-lg font-bold text-industrial-accent uppercase tracking-wide mb-3 neon-text">
              4. 🏢 {{ locale === 'zh' ? '建筑系统详解' : 'Building System Details' }}
            </h3>

            <div class="space-y-4">
              <!-- 建筑分类 -->
              <div class="bg-gray-800/50 p-3 rounded">
                <h4 class="text-sm font-bold text-industrial-yellow mb-2 uppercase">
                  {{ locale === 'zh' ? '建筑分类' : 'Building Categories' }}:
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <h5 class="font-bold text-industrial-green mb-1">
                      🏠 {{ locale === 'zh' ? '住宅类' : 'Residential' }}
                    </h5>
                    <ul class="space-y-1 text-gray-400">
                      <li>🏠 {{ locale === 'zh' ? '住宅：基础住宅' : 'House: Basic residential' }}</li>
                      <li>🏡 {{ locale === 'zh' ? '民宅：高级住宅' : 'Mansion: Advanced residential' }}</li>
                    </ul>
                  </div>
                  <div>
                    <h5 class="font-bold text-industrial-green mb-1">
                      🏬 {{ locale === 'zh' ? '商业类' : 'Commercial' }}
                    </h5>
                    <ul class="space-y-1 text-gray-400">
                      <li>🏬 {{ locale === 'zh' ? '商店：基础商业' : 'Shop: Basic commercial' }}</li>
                      <li>🏢 {{ locale === 'zh' ? '办公室：高级商业' : 'Office: Advanced commercial' }}</li>
                    </ul>
                  </div>
                  <div>
                    <h5 class="font-bold text-industrial-green mb-1">
                      🏭 {{ locale === 'zh' ? '工业类' : 'Industrial' }}
                    </h5>
                    <ul class="space-y-1 text-gray-400">
                      <li>🏭 {{ locale === 'zh' ? '工厂：基础工业' : 'Factory: Basic industrial' }}</li>
                      <li>🧪 {{ locale === 'zh' ? '化学工厂：高级工业' : 'Chemical Plant: Advanced industrial' }}</li>
                      <li>☢️ {{ locale === 'zh' ? '核电站：发电设施' : 'Nuclear Plant: Power generation' }}</li>
                    </ul>
                  </div>
                  <div>
                    <h5 class="font-bold text-industrial-green mb-1">
                      🌳 {{ locale === 'zh' ? '环境类' : 'Environmental' }}
                    </h5>
                    <ul class="space-y-1 text-gray-400">
                      <li>🌳 {{ locale === 'zh' ? '公园：提升环境' : 'Park: Improve environment' }}</li>
                      <li>🗑️ {{ locale === 'zh' ? '垃圾站：处理垃圾' : 'Garbage Station: Process waste' }}</li>
                      <li>☀️ {{ locale === 'zh' ? '太阳能：清洁发电' : 'Solar Panel: Clean power' }}</li>
                      <li>🌬️ {{ locale === 'zh' ? '风力发电：清洁发电' : 'Wind Turbine: Clean power' }}</li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- 建筑相互作用 -->
              <div class="bg-gray-800/50 p-3 rounded">
                <h4 class="text-sm font-bold text-industrial-yellow mb-2 uppercase">
                  {{ locale === 'zh' ? '建筑相互作用' : 'Building Interactions' }}:
                </h4>
                <div class="text-sm space-y-2">
                  <div class="flex items-start space-x-2">
                    <span class="text-industrial-green">🏠 + 🌳</span>
                    <span>{{ locale === 'zh' ? '住宅靠近公园：+10%人口容量' : 'House near Park: +10% population capacity' }}</span>
                  </div>
                  <div class="flex items-start space-x-2">
                    <span class="text-industrial-green">🏬 + 🌳</span>
                    <span>{{ locale === 'zh' ? '商店靠近公园：+10%收入' : 'Shop near Park: +10% income' }}</span>
                  </div>
                  <div class="flex items-start space-x-2">
                    <span class="text-industrial-green">🏭 + 🌳</span>
                    <span>{{ locale === 'zh' ? '工厂靠近公园：-25%污染' : 'Factory near Park: -25% pollution' }}</span>
                  </div>
                  <div class="flex items-start space-x-2">
                    <span class="text-industrial-green">🏠 + 🏭</span>
                    <span>{{ locale === 'zh' ? '住宅靠近工厂：-15%人口容量' : 'House near Factory: -15% population capacity' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- 资源管理 -->
          <section>
            <h3 class="text-lg font-bold text-industrial-accent uppercase tracking-wide mb-3 neon-text">
              5. 💰 {{ locale === 'zh' ? '资源管理系统' : 'Resource Management' }}
            </h3>

            <div class="bg-gray-800/50 p-3 rounded">
              <h4 class="text-sm font-bold text-industrial-yellow mb-2 uppercase">
                {{ locale === 'zh' ? '主要资源' : 'Main Resources' }}:
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div class="flex items-center space-x-2">
                  <span class="text-industrial-green text-lg">💰</span>
                  <span>{{ locale === 'zh' ? '金币：建造、升级、扩地' : 'Coins: Build, upgrade, expand' }}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="text-industrial-blue text-lg">👥</span>
                  <span>{{ locale === 'zh' ? '人口：住宅容量决定' : 'Population: Determined by housing capacity' }}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="text-industrial-yellow text-lg">⚡</span>
                  <span>{{ locale === 'zh' ? '电力：建筑消耗，需发电厂' : 'Power: Building consumption, needs power plants' }}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="text-gray-400 text-lg">🌫️</span>
                  <span>{{ locale === 'zh' ? '污染：工业产生，环境建筑降低' : 'Pollution: Industrial production, environmental buildings reduce' }}</span>
                </div>
              </div>
            </div>
          </section>

          <!-- 进阶技巧 -->
          <section>
            <h3 class="text-lg font-bold text-industrial-accent uppercase tracking-wide mb-3 neon-text">
              6. 🎯 {{ locale === 'zh' ? '进阶技巧' : 'Advanced Tips' }}
            </h3>

            <div class="bg-gray-800/50 p-3 rounded">
              <h4 class="text-sm font-bold text-industrial-yellow mb-2 uppercase">
                {{ locale === 'zh' ? '布局策略' : 'Layout Strategy' }}:
              </h4>
              <ul class="text-sm space-y-2">
                <li>🏠 + 🌳 {{ locale === 'zh' ? '住宅靠近公园：提升满意度' : 'House near Park: Increase satisfaction' }}</li>
                <li>🏭 → 🏠 {{ locale === 'zh' ? '工业远离住宅：减少污染影响' : 'Industry away from houses: Reduce pollution' }}</li>
                <li>🏬 + 🌳 {{ locale === 'zh' ? '商业靠近公园：提升收入' : 'Commerce near Park: Increase income' }}</li>
                <li>🏭 + 🗑️ {{ locale === 'zh' ? '工业靠近垃圾站：减少污染' : 'Industry near garbage station: Reduce pollution' }}</li>
                <li>⚡ + 🏠 {{ locale === 'zh' ? '发电设施靠近住宅：提升效率' : 'Power facilities near houses: Increase efficiency' }}</li>
              </ul>
            </div>
          </section>

          <!-- 常见问题 -->
          <section>
            <h3 class="text-lg font-bold text-industrial-accent uppercase tracking-wide mb-3 neon-text">
              7. ❓ {{ locale === 'zh' ? '常见问题解答' : 'FAQ' }}
            </h3>

            <div class="space-y-3">
              <div class="bg-gray-800/50 p-3 rounded">
                <h4 class="text-sm font-bold text-industrial-yellow mb-1">
                  {{ locale === 'zh' ? 'Q：金币不够怎么办？' : 'Q: Not enough coins?' }}
                </h4>
                <p class="text-sm text-gray-400">
                  {{ locale === 'zh' ? 'A：优先建造商业、工业建筑，提升金币产出' : 'A: Prioritize commercial and industrial buildings to increase coin output' }}
                </p>
              </div>

              <div class="bg-gray-800/50 p-3 rounded">
                <h4 class="text-sm font-bold text-industrial-yellow mb-1">
                  {{ locale === 'zh' ? 'Q：人口增长缓慢？' : 'Q: Slow population growth?' }}
                </h4>
                <p class="text-sm text-gray-400">
                  {{ locale === 'zh' ? 'A：增加住宅容量，提升满意度，建造更多就业岗位' : 'A: Increase housing capacity, improve satisfaction, build more jobs' }}
                </p>
              </div>

              <div class="bg-gray-800/50 p-3 rounded">
                <h4 class="text-sm font-bold text-industrial-yellow mb-1">
                  {{ locale === 'zh' ? 'Q：城市污染太高？' : 'Q: Too much pollution?' }}
                </h4>
                <p class="text-sm text-gray-400">
                  {{ locale === 'zh' ? 'A：多建公园、垃圾站，远离住宅区布置工业' : 'A: Build more parks and garbage stations, keep industry away from residential areas' }}
                </p>
              </div>
            </div>
          </section>

          <!-- 游戏小贴士 -->
          <section>
            <h3 class="text-lg font-bold text-industrial-accent uppercase tracking-wide mb-3 neon-text">
              8. 💡 {{ locale === 'zh' ? '游戏小贴士' : 'Game Tips' }}
            </h3>

            <div class="bg-gray-800/50 p-3 rounded">
              <ul class="text-sm space-y-2">
                <li>🏗️ {{ locale === 'zh' ? '合理布局：住宅靠近公园、医院可提升满意度' : 'Reasonable layout: Houses near parks and hospitals increase satisfaction' }}</li>
                <li>💰 {{ locale === 'zh' ? '资源平衡：保持人口、就业、金币、满意度、电力等多项资源的平衡' : 'Resource balance: Maintain balance of population, jobs, coins, satisfaction, power, etc.' }}</li>
                <li>⬆️ {{ locale === 'zh' ? '升级优先级：优先升级产出高、影响大的建筑' : 'Upgrade priority: Prioritize buildings with high output and impact' }}</li>
                <li>📊 {{ locale === 'zh' ? '关注状态提示：建筑顶部会出现各种状态图标，及时处理可避免损失' : 'Watch status indicators: Various status icons appear on building tops, handle them promptly to avoid losses' }}</li>
                <li>💾 {{ locale === 'zh' ? '自动保存：游戏自动保存，无需担心丢失进度' : 'Auto-save: Game auto-saves, no need to worry about losing progress' }}</li>
                <li>🎮 {{ locale === 'zh' ? '享受过程：城市建设是一个渐进的过程，享受每一步的成长' : 'Enjoy the process: City building is a gradual process, enjoy every step of growth' }}</li>
                <li>⚡ {{ locale === 'zh' ? '性能优化：建议在 chrome://flags 中开启 GPU 加速以获得更好的游戏体验' : 'Performance optimization: Enable GPU acceleration in chrome://flags for better gaming experience' }}</li>
              </ul>
            </div>
          </section>
        </div>

        <!-- 建筑相互作用速查表 -->
        <div v-if="showQuickReference" class="space-y-6 text-gray-300">
          <section>
            <h3 class="text-lg font-bold text-industrial-accent uppercase tracking-wide mb-3 neon-text">
              📋 {{ locale === 'zh' ? '建筑相互作用速查表' : 'Building Interaction Quick Reference' }}
            </h3>
            <p class="text-sm text-gray-400 mb-4">
              {{ locale === 'zh' ? '建筑之间会产生相互影响，合理布局能获得额外加成。距离为1表示相邻，距离为2-3表示2-3格范围内。' : 'Buildings interact with each other, proper layout provides additional bonuses. Distance 1 means adjacent, distance 2-3 means within 2-3 tiles.' }}
            </p>

            <!-- 住宅建筑相互作用 -->
            <div class="bg-gray-800/50 p-4 rounded mb-4">
              <h4 class="text-sm font-bold text-industrial-green mb-3 uppercase">
                🏠 {{ locale === 'zh' ? '住宅建筑相互作用' : 'Residential Building Interactions' }}
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div class="flex items-start space-x-2">
                  <span class="text-industrial-green font-bold">🏠 + 🌳</span>
                  <span>{{ locale === 'zh' ? '每个相邻公园：+10%人口容量' : 'Each adjacent park: +10% population capacity' }}</span>
                </div>
                <div class="flex items-start space-x-2">
                  <span class="text-industrial-green font-bold">🏠 + 🗽</span>
                  <span>{{ locale === 'zh' ? '每个相邻纪念碑：+10%人口容量' : 'Each adjacent monument: +10% population capacity' }}</span>
                </div>
                <div class="flex items-start space-x-2">
                  <span class="text-industrial-red font-bold">🏠 + 🏭</span>
                  <span>{{ locale === 'zh' ? '每个相邻工厂：-15%人口容量' : 'Each adjacent factory: -15% population capacity' }}</span>
                </div>
                <div class="flex items-start space-x-2">
                  <span class="text-industrial-red font-bold">🏠 + 🧪</span>
                  <span>{{ locale === 'zh' ? '每个相邻化学工厂：-15%人口容量' : 'Each adjacent chemical plant: -15% population capacity' }}</span>
                </div>
              </div>
            </div>

            <!-- 商业建筑相互作用 -->
            <div class="bg-gray-800/50 p-4 rounded mb-4">
              <h4 class="text-sm font-bold text-industrial-green mb-3 uppercase">
                🏬 {{ locale === 'zh' ? '商业建筑相互作用' : 'Commercial Building Interactions' }}
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div class="flex items-start space-x-2">
                  <span class="text-industrial-green font-bold">🏬 + 🌳</span>
                  <span>{{ locale === 'zh' ? '每个相邻公园：+10%收入' : 'Each adjacent park: +10% income' }}</span>
                </div>
                <div class="flex items-start space-x-2">
                  <span class="text-industrial-green font-bold">🏢 + 🌳</span>
                  <span>{{ locale === 'zh' ? '每个相邻公园：+12%收入' : 'Each adjacent park: +12% income' }}</span>
                </div>
                <div class="flex items-start space-x-2">
                  <span class="text-industrial-green font-bold">🏬 + 🚰</span>
                  <span>{{ locale === 'zh' ? '相邻水塔：+25%收入' : 'Adjacent water tower: +25% income' }}</span>
                </div>
              </div>
            </div>

            <!-- 工业建筑相互作用 -->
            <div class="bg-gray-800/50 p-4 rounded mb-4">
              <h4 class="text-sm font-bold text-industrial-green mb-3 uppercase">
                🏭 {{ locale === 'zh' ? '工业建筑相互作用' : 'Industrial Building Interactions' }}
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div class="flex items-start space-x-2">
                  <span class="text-industrial-green font-bold">🏭 + 🌳</span>
                  <span>{{ locale === 'zh' ? '每个相邻公园：-25%污染' : 'Each adjacent park: -25% pollution' }}</span>
                </div>
                <div class="flex items-start space-x-2">
                  <span class="text-industrial-green font-bold">🏭 + 🧪</span>
                  <span>{{ locale === 'zh' ? '相邻化学工厂：-25%污染' : 'Adjacent chemical plant: -25% pollution' }}</span>
                </div>
                <div class="flex items-start space-x-2">
                  <span class="text-industrial-green font-bold">🏭 + 🚰</span>
                  <span>{{ locale === 'zh' ? '相邻水塔：+25%收入' : 'Adjacent water tower: +25% income' }}</span>
                </div>
                <div class="flex items-start space-x-2">
                  <span class="text-industrial-green font-bold">🧪 + 🏭</span>
                  <span>{{ locale === 'zh' ? '3格内有工厂：+20%收入' : 'Factory within 3 tiles: +20% income' }}</span>
                </div>
                <div class="flex items-start space-x-2">
                  <span class="text-industrial-green font-bold">🧪 + 🗑️</span>
                  <span>{{ locale === 'zh' ? '2-3格内有垃圾站：-30%污染' : 'Garbage station within 2-3 tiles: -30% pollution' }}</span>
                </div>
              </div>
            </div>

            <!-- 发电设施相互作用 -->
            <div class="bg-gray-800/50 p-4 rounded mb-4">
              <h4 class="text-sm font-bold text-industrial-green mb-3 uppercase">
                ⚡ {{ locale === 'zh' ? '发电设施相互作用' : 'Power Facility Interactions' }}
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div class="flex items-start space-x-2">
                  <span class="text-industrial-green font-bold">☀️ + 🏠</span>
                  <span>{{ locale === 'zh' ? '每个相邻住宅：+5%发电效率' : 'Each adjacent house: +5% power efficiency' }}</span>
                </div>
                <div class="flex items-start space-x-2">
                  <span class="text-industrial-green font-bold">☀️ + 🌬️</span>
                  <span>{{ locale === 'zh' ? '相邻发电设施：+5%发电效率' : 'Adjacent power facility: +5% power efficiency' }}</span>
                </div>
                <div class="flex items-start space-x-2">
                  <span class="text-industrial-green font-bold">🌬️ + 🌳</span>
                  <span>{{ locale === 'zh' ? '相邻公园：+8%发电效率' : 'Adjacent park: +8% power efficiency' }}</span>
                </div>
              </div>
            </div>

            <!-- 环境设施相互作用 -->
            <div class="bg-gray-800/50 p-4 rounded mb-4">
              <h4 class="text-sm font-bold text-industrial-green mb-3 uppercase">
                🌱 {{ locale === 'zh' ? '环境设施相互作用' : 'Environmental Facility Interactions' }}
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div class="flex items-start space-x-2">
                  <span class="text-industrial-green font-bold">🌳 + 🏠</span>
                  <span>{{ locale === 'zh' ? '相邻住宅：获得人口加成' : 'Adjacent houses: Population bonus' }}</span>
                </div>
                <div class="flex items-start space-x-2">
                  <span class="text-industrial-green font-bold">🌳 + 🏬</span>
                  <span>{{ locale === 'zh' ? '相邻商业：获得收入加成' : 'Adjacent commerce: Income bonus' }}</span>
                </div>
                <div class="flex items-start space-x-2">
                  <span class="text-industrial-green font-bold">🌳 + 🏭</span>
                  <span>{{ locale === 'zh' ? '相邻工业：获得污染降低' : 'Adjacent industry: Pollution reduction' }}</span>
                </div>
                <div class="flex items-start space-x-2">
                  <span class="text-industrial-green font-bold">🗑️ + 🏭</span>
                  <span>{{ locale === 'zh' ? '2-3格内工业：获得污染降低' : 'Industry within 2-3 tiles: Pollution reduction' }}</span>
                </div>
              </div>
            </div>

            <!-- 使用提示 -->
            <div class="bg-gray-800/50 p-4 rounded">
              <h4 class="text-sm font-bold text-industrial-yellow mb-2 uppercase">
                💡 {{ locale === 'zh' ? '使用提示' : 'Usage Tips' }}
              </h4>
              <ul class="text-sm space-y-1 text-gray-400">
                <li>• {{ locale === 'zh' ? '合理布局建筑，最大化相互作用效果' : 'Layout buildings properly to maximize interaction effects' }}</li>
                <li>• {{ locale === 'zh' ? '住宅远离工业，商业靠近公园' : 'Keep houses away from industry, place commerce near parks' }}</li>
                <li>• {{ locale === 'zh' ? '发电设施靠近住宅可提升效率' : 'Power facilities near houses increase efficiency' }}</li>
                <li>• {{ locale === 'zh' ? '环境设施可降低工业污染' : 'Environmental facilities reduce industrial pollution' }}</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 滚动条样式已移至全局样式文件 */
</style>
