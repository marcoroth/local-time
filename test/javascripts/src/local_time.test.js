import moment from "https://cdn.skypack.dev/moment"
import { addTimeEl, getText, setText } from "./test_helpers"

import LocalTime from "../../../"
import { fixture, assert } from "@open-wc/testing"

describe("localized", () => {
  beforeEach(() => {
    LocalTime.start()
  })

  it("tests", async () => {
    await fixture(`
      <time id="one" data-format="%B %e, %Y %l:%M%P" data-local="time" datetime="2013-11-12T12:13:00Z"></time>
      <time id="two" data-format="%B %e, %Y %l:%M%P" data-local="time" datetime="2013-01-02T02:04:00Z"></time>
      <time id="past" data-format="%B %e, %Y %l:%M%P" data-local="time" datetime="1805-05-15T01:01:00Z"></time>
      <time id="future" data-format="%B %e, %Y %l:%M%P" data-local="time" datetime="3333-02-14T23:55:00Z"></time>
    `)

    assertLocalized("one")
    assertLocalized("two")
    assertLocalized("past")
    assertLocalized("future")
  })

  it("date", async () => {
    await fixture(`
      <time id="date" data-format="%B %e, %Y" data-local="time" datetime="2013-11-12T12:13:00Z"></time>
    `)

    assertLocalized("date", "date")
  })

  it("unparseable time", () => {
    const element = addTimeEl({ format: "%Y", datetime: ":(" })
    setText(element, "2022")
    assert.equal(getText(element), "2022")
  })
})

function assertLocalized(id, type) {
  let compare, datetime, local, momentFormat

  if (type == null) type = "time"

  switch (type) {
    case "time":
      momentFormat = "MMMM D, YYYY h:mma"
      compare = "toString"
      break
    case "date":
      momentFormat = "MMMM D, YYYY"
      compare = "dayOfYear"
      break
  }

  const element = document.getElementById(id)

  assert.ok(datetime = element.getAttribute("datetime"))
  assert.ok(local = getText(element))
  assert.equal(element.getAttribute("aria-label"), local)

  const datetimeParsed = moment(datetime)
  const localParsed = moment(local, momentFormat)

  assert.ok(datetimeParsed.isValid())
  assert.ok(localParsed.isValid())

  return assert.equal(datetimeParsed[compare](), localParsed[compare]())
}
