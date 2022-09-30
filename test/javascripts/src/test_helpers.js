function addTimeEl(param) {
  if (param == null) { param = {} }

  let { format, type, datetime } = param

  if (format == null) { format = "%Y" }
  if (type == null) { type = "time" }
  if (datetime == null) { datetime = "2013-11-12T12:13:00Z" }

  const element = document.createElement("time")
  element.setAttribute("data-local", type)
  element.setAttribute("data-format", format)
  element.setAttribute("datetime", datetime)

  document.body.appendChild(element)

  return element
}

function setText(element, text) {
  return element.textContent = text
}

function getText(element) {
  // innerHTML works in all browsers so using it ensures we're
  // reading the text content, not a potentially arbitrary property.
  return element.innerHTML
}

export { addTimeEl, setText, getText }
