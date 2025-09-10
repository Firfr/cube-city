<script setup>
import { CountUp } from 'countup.js'
import { onMounted, ref, watch } from 'vue'

const props = defineProps({
  value: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    default: 1,
  },
  separator: {
    type: String,
    default: ',',
  },
  prefix: {
    type: String,
    default: '',
  },
  suffix: {
    type: String,
    default: '',
  },
})

const numberEl = ref(null)
let countUpInstance = null

onMounted(() => {
  const options = {
    duration: props.duration,
    separator: props.separator,
    prefix: props.prefix,
    suffix: props.suffix,
  }
  countUpInstance = new CountUp(numberEl.value, props.value, options)
  if (!countUpInstance.error) {
    countUpInstance.start()
  }
  else {
    console.error(countUpInstance.error)
  }
})

watch(() => props.value, (newVal, oldVal) => {
  if (countUpInstance) {
    const options = {
      startVal: oldVal,
      duration: props.duration,
      separator: props.separator,
      prefix: props.prefix,
      suffix: props.suffix,
    }
    countUpInstance = new CountUp(numberEl.value, newVal, options)
    if (!countUpInstance.error) {
      countUpInstance.start()
    }
    else {
      console.error(countUpInstance.error)
    }
  }
})
</script>

<template>
  <span ref="numberEl" />
</template>
