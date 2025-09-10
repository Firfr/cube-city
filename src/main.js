import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createApp, watch } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import en from './assets/i18n/en.json'
import zh from './assets/i18n/zh.json'
import { useGameState } from './stores/useGameState.js'
import './css/global.css'
import './scss/global.scss'
import './scss/index.scss'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: { zh, en },
})

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(i18n)
app.mount('#app')

// 监听 pinia 语言变化，动态切换 i18n 语言
const gameState = useGameState()
watch(
  () => gameState.language,
  (lang) => {
    i18n.global.locale.value = lang
  },
)
