import config from "./config"
import * as helpers from "./helpers"

import { Controller } from "./controller"
import { start } from "./start"

const global = {
  config,
  helpers,
  start,

  run() {
    return this.getController().processElements()
  },

  process(...elements) {
    for (let element of Array.from(elements)) {
      this.getController().processElement(element)
    }

    return elements.length
  },

  getController() {
    if (this.controller == null) this.controller = new Controller()

    return this.controller
  }
}

window.LocalTime = global

export default global
