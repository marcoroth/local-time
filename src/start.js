let started = false

const domReady = function() {
  if (document.attachEvent) {
    return document.readyState === "complete"
  } else {
    return document.readyState !== "loading"
  }
}

const nextFrame = function(fn) {
  let left
  return (left = (typeof requestAnimationFrame === 'function' ? requestAnimationFrame(fn) : undefined)) != null ? left : setTimeout(fn, 17)
}

const startController = function() {
  const controller = LocalTime.getController()
  return controller.start()
}

function start() {
  if (!started) {
    started = true

    if ((typeof MutationObserver !== 'undefined' && MutationObserver !== null) || domReady()) {
      return startController()
    } else {
      return nextFrame(startController)
    }
  }
}

export {
  domReady,
  nextFrame,
  startController,
  start
}
