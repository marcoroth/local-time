class PageObserver {
  declare selector: string
  declare callback: Function
  declare started: boolean

  constructor(selector: string, callback: Function) {
    this.processMutations = this.processMutations.bind(this)
    this.selector = selector
    this.callback = callback
  }

  start() {
    if (!this.started) {
      this.observeWithMutationObserver()
      return this.started = true
    }
  }

  observeWithMutationObserver() {
    const observer = new MutationObserver(this.processMutations)
    observer.observe(document.documentElement, { childList: true, subtree: true })

    return true
  }

  findSignificantElements(element: Element) {
    const elements = []

    if (element) {
      if (element.matches && element.matches(this.selector)) {
        elements.push(element)
      } else {
        // console.log(element)
      }

      if (element.querySelectorAll) {
        elements.push(...Array.from(element.querySelectorAll(this.selector) || []))
      }
    }

    return elements
  }

  processMutations(mutations: MutationRecord[]) {
    const elements = []

    for (let mutation of Array.from(mutations)) {
      switch (mutation.type) {
        case "childList":
          for (let node of Array.from(mutation.addedNodes)) {
            elements.push(...Array.from(this.findSignificantElements(node as Element) || []))
          }
          break
      }
    }

    return this.notify(elements)
  }

  notify(elements: Element[]) {
    const isFunction = typeof this.callback === 'function'

    if (isFunction && elements?.length) {
      return this.callback(elements)
    }
  }
}

export { PageObserver }
