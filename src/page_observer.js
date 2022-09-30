import { elementMatchesSelector } from "./helpers"

class PageObserver {
  constructor(selector, callback) {
    this.processMutations = this.processMutations.bind(this)
    this.processInsertion = this.processInsertion.bind(this)
    this.selector = selector
    this.callback = callback
  }

  start() {
    if (!this.started) {
      this.observeWithMutationObserver() || this.observeWithMutationEvent()
      return this.started = true
    }
  }

  observeWithMutationObserver() {
    if (typeof MutationObserver !== 'undefined' && MutationObserver !== null) {
      const observer = new MutationObserver(this.processMutations)
      observer.observe(document.documentElement, {childList: true, subtree: true})
      return true
    }
  }

  observeWithMutationEvent() {
    addEventListener("DOMNodeInserted", this.processInsertion, false)
    return true
  }

  findSignificantElements(element) {
    const elements = []
    if ((element != null ? element.nodeType : undefined) === Node.ELEMENT_NODE) {
      if (elementMatchesSelector(element, this.selector)) { elements.push(element) }
      elements.push(...Array.from(element.querySelectorAll(this.selector) || []))
    }
    return elements
  }

  processMutations(mutations) {
    const elements = []
    for (let mutation of Array.from(mutations)) {
      switch (mutation.type) {
        case "childList":
          for (let node of Array.from(mutation.addedNodes)) {
            elements.push(...Array.from(this.findSignificantElements(node) || []))
          }
          break
      }
    }
    return this.notify(elements)
  }

  processInsertion(event) {
    const elements = this.findSignificantElements(event.target)
    return this.notify(elements)
  }

  notify(elements) {
    if (elements != null ? elements.length : undefined) {
      return (typeof this.callback === 'function' ? this.callback(elements) : undefined)
    }
  }
}

export { PageObserver }
