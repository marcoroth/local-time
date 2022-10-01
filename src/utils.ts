const domReady = function() {
  return document.readyState !== "loading"
}

const nextFrame = function(fn: any) {
  return requestAnimationFrame(fn)
}

export {
  domReady,
  nextFrame
}
