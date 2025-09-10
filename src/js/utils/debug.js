import { Pane } from 'tweakpane'

export default class Debug {
  constructor() {
    this.active = window.location.hash === '#debug'

    if (this.active) {
      this.ui = new Pane()
      // 动态设置 tweakpane 容器的 z-index
      const paneEl = document.querySelector('.tp-dfwv')
      if (paneEl) {
        paneEl.style.zIndex = '9999'
      }
    }
  }
}
