// Older browsers do not support ISO8601 (JSON) timestamps in Date.parse
const supportsISO8601 = !isNaN(Date.parse("2011-01-01T12:00:00-05:00"))
const iso8601Pattern = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(Z|[-+]?[\d:]+)$/

function parseDate(dateString) {
  dateString = dateString.toString()
  if (!supportsISO8601) dateString = reformatDateString(dateString)

  return new Date(Date.parse(dateString))
}

function reformatDateString(dateString) {
  let matches

  if (matches = dateString.match(iso8601Pattern)) {
    let offset
    const [_, year, month, day, hour, minute, second, zone] = Array.from(matches)
    if (zone !== "Z") { offset = zone.replace(":", "") }
    return `${year}/${month}/${day} ${hour}:${minute}:${second} GMT${[offset]}`
  }
}

export {
  supportsISO8601,
  parseDate,
  iso8601Pattern,
  reformatDateString
}
