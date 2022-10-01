import config from "./config"

import { RelativeTime } from "./relative_time"
import { PageObserver } from "./page_observer"
import { parseDate, strftime, getI18nValue } from "./helpers"

const SELECTOR = "time[data-local]:not([data-localized])"
const markAsLocalized = (element: Element) => element.setAttribute("data-localized", "")
const relative = (time: Date) => new RelativeTime(time)

class Controller {
  declare started: boolean
  declare pageObserver: PageObserver
  declare timer: ReturnType<typeof setInterval>

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

  get interval() {
    return config.timerInterval
  }

  startTimer() {
    if (this.timer) return this.timer

    if (this.interval) {
      this.timer = setInterval(this.processElements, this.interval)
    }

    return this.timer
  }

  processElements(elements: Element[] | NodeListOf<Element> = []) {
    if (elements == null || elements.length == 0) {
      elements = document.querySelectorAll(SELECTOR)
    }

    for (let element of Array.from(elements)) {
      this.processElement(element)
    }

    return elements.length
  }

  processElement(element: Element) {
    const datetime = element.getAttribute("datetime")
    const format = element.getAttribute("data-format") || ""
    const local = element.getAttribute("data-local")

    if (!datetime) return
    if (element.localName !== "time") return

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
    if (!time) return

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
