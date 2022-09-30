import config from "./config"

import { RelativeTime } from "./relative_time"
import { PageObserver } from "./page_observer"
import { parseDate, strftime, getI18nValue } from "./helpers"

const SELECTOR = "time[data-local]:not([data-localized])"
const markAsLocalized = (element) => element.setAttribute("data-localized", "")
const relative = (time) => new RelativeTime(time)

class Controller {
  constructor() {
    this.processElements = this.processElements.bind(this)
    this.pageObserver = new PageObserver(SELECTOR, this.processElements)
  }

  start() {
    if (!this.started) {
      this.processElements()
      this.startTimer()
      this.pageObserver.start()
      return this.started = true
    }
  }

  startTimer() {
    let interval

    if (interval = config.timerInterval) {
      return this.timer != null ? this.timer : (this.timer = setInterval(this.processElements, interval))
    }
  }

  processElements(elements) {
    if (elements == null) {
      elements = document.querySelectorAll(SELECTOR)
    }

    for (let element of Array.from(elements)) {
      this.processElement(element)
    }

    return elements.length
  }

  processElement(element) {
    const datetime = element.getAttribute("datetime")
    const format = element.getAttribute("data-format")
    const local = element.getAttribute("data-local")

    if (!element instanceof HTMLTimeElement) return
    if (!datetime) return

    const getContent = () => {
      switch (local) {
        case "time":
          markAsLocalized(element)
          return strftime(time, format)
        case "date":
          markAsLocalized(element)
          return relative(time).toDateString()
        case "time-ago":
          return relative(time).toString()
        case "time-or-date":
          return relative(time).toTimeOrDateString()
        case "weekday":
          return relative(time).toWeekdayString()
        case "weekday-or-date":
          return relative(time).toWeekdayString() || relative(time).toDateString()
      }
    }

    const time = parseDate(datetime)
    if (isNaN(time)) return

    if (!element.hasAttribute("title")) {
      const title = strftime(time, getI18nValue("datetime.formats.default"))
      element.setAttribute("title", title)
    }

    const content = getContent()
    element.textContent = content

    if (!element.hasAttribute("aria-label")) {
      return element.setAttribute("aria-label", content)
    }
  }
}

export { Controller }
