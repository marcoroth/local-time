import config from "./config"
import * as helpers from "./helpers"

import { Controller } from "./controller"
import { domReady, nextFrame } from "./utils"

class LocalTime {
  declare started: boolean
  declare controller: Controller

  constructor() {
    this.controller = new Controller()
    this.started = false
  }

  run() {
    return this.controller.processElements()
  }

  startController() {
    this.controller.start()
  }

  start() {
    if (!this.started) {
      this.started = true

      if (domReady()) {
        return this.startController()
      } else {
        return nextFrame(this.startController)
      }
    }
  }

  process(...elements: Element[]) {
    for (let element of Array.from(elements)) {
      this.controller.processElement(element)
    }

    return elements.length
  }

  // TODO: deprecate
  getController(): Controller {
    console.warn("`LocalTime.getController()` is deprecated. Please use `LocalTime.controller` instead.")

    return this.controller
  }

  get config() {
    return config
  }

  get helpers() {
    return helpers
  }
}

const localTime = new LocalTime()

declare global {
  interface Window {
    LocalTime: LocalTime
  }
}

window.LocalTime = localTime

export default localTime
