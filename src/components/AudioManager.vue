<script setup>
import { useGameState } from '@/stores/useGameState.js'
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted, ref, watch } from 'vue'

const gameState = useGameState()
const { musicEnabled, musicVolume } = storeToRefs(gameState)

// 音频元素引用
const audioRef = ref(null)

// 播放列表
const playlist = ['/audio/song01.mp3', '/audio/song02.mp3']
let currentIndex = 0

// 初始化
onMounted(() => {
  if (audioRef.value) {
    // 设置初始音量
    audioRef.value.volume = musicVolume.value

    // 监听音频事件
    audioRef.value.addEventListener('ended', handleTrackEnded)
    audioRef.value.addEventListener('play', () => {
      gameState.setMusicPlaying(true)
    })
    audioRef.value.addEventListener('pause', () => {
      gameState.setMusicPlaying(false)
    })
    audioRef.value.addEventListener('error', (e) => {
      console.error('音频播放错误:', e)
      gameState.setMusicPlaying(false)
    })

    // 设置第一首歌
    audioRef.value.src = playlist[currentIndex]
  }
})

// 监听音乐开关状态
watch(musicEnabled, (enabled) => {
  if (!audioRef.value)
    return

  if (enabled) {
    playMusic()
  }
  else {
    pauseMusic()
  }
})

// 监听音量变化
watch(musicVolume, (volume) => {
  if (audioRef.value) {
    audioRef.value.volume = volume
  }
})

// 播放音乐
async function playMusic() {
  if (!audioRef.value || !musicEnabled.value)
    return

  try {
    await audioRef.value.play()
  }
  catch (error) {
    console.error('播放失败:', error)
    gameState.setMusicPlaying(false)
  }
}

// 暂停音乐
function pauseMusic() {
  if (audioRef.value && !audioRef.value.paused) {
    audioRef.value.pause()
  }
}

// 处理歌曲结束事件 - 自动切换到下一首
function handleTrackEnded() {
  currentIndex = (currentIndex + 1) % playlist.length
  audioRef.value.src = playlist[currentIndex]

  // 如果音乐开关是开启的，继续播放下一首
  if (musicEnabled.value) {
    playMusic()
  }
}

// 切换到下一首歌
function nextTrack() {
  if (!audioRef.value)
    return

  const wasPlaying = !audioRef.value.paused
  currentIndex = (currentIndex + 1) % playlist.length
  audioRef.value.src = playlist[currentIndex]

  if (wasPlaying && musicEnabled.value) {
    playMusic()
  }
}

// 组件卸载时清理
onUnmounted(() => {
  if (audioRef.value) {
    audioRef.value.removeEventListener('ended', handleTrackEnded)
    audioRef.value.pause()
    audioRef.value.src = ''
  }
})

// 暴露方法给父组件
defineExpose({
  playMusic,
  pauseMusic,
  nextTrack,
})
</script>

<template>
  <!-- 隐藏的 audio 元素，循环播放 -->
  <audio
    ref="audioRef"
    preload="auto"
    style="display:none"
  />
</template>
