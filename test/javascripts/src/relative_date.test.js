import moment from 'https://cdn.skypack.dev/moment'
import { addTimeEl, getText } from "./test_helpers"

import LocalTime from '../../../'

import { assert, nextFrame } from '@open-wc/testing'

describe("relative date", function() {
  beforeEach(() => {
    LocalTime.start()
  })

  it("this year", async () => {
    const now = moment()
    const element = addTimeEl({ type: "date", datetime: now.toISOString() })

    await nextFrame()

    assert.equal(getText(element), now.format("MMM D"))
  })

  it("last year", async () => {
    const before = moment().subtract(1, "years").subtract(1, "days")
    const element = addTimeEl({ type: "date", datetime: before.toISOString() })

    await nextFrame()

    assert.equal(getText(element), before.format("MMM D, YYYY"))
  })
})

describe("relative time or date", () => {
  it("today", async () => {
    const now = moment()
    const element = addTimeEl({ type: "time-or-date", datetime: now.toISOString() })

    await nextFrame()

    assert.equal(getText(element), now.format("h:mma"))
  })

  it("before today", async () => {
    const before = moment().subtract(1, "days")
    const element = addTimeEl({ type: "time-or-date", datetime: before.toISOString() })

    await nextFrame()

    assert.equal(getText(element), before.format("MMM D"))
  })
})

describe("relative weekday", () => {
  it("today", async () => {
    const now = moment()
    const element = addTimeEl({ type: "weekday", datetime: now.toISOString() })

    await nextFrame()

    assert.equal(getText(element), "today")
  })

  it("yesterday", async () => {
    const yesterday = moment().subtract(1, "days")
    const element = addTimeEl({ type: "weekday", datetime: yesterday.toISOString() })

    await nextFrame()

    assert.equal(getText(element), "yesterday")
  })

  it("this week", async () => {
    const recent = moment().subtract(3, "days")
    const element = addTimeEl({ type: "weekday", datetime: recent.toISOString() })

    await nextFrame()

    assert.equal(getText(element), recent.format("dddd"))
  })

  it("before this week", async () => {
    const before = moment().subtract(8, "days")
    const element = addTimeEl({ type: "weekday", datetime: before.toISOString() })

    await nextFrame()

    assert.equal(getText(element), "")
  })
})

describe("relative weekday or date", () => {
  it("today", async () => {
    const now = moment()
    const element = addTimeEl({ type: "weekday-or-date", datetime: now.toISOString() })

    await nextFrame()

    assert.equal(getText(element), "today")
  })

  it("yesterday", async () => {
    const yesterday = moment().subtract(1, "days")
    const element = addTimeEl({ type: "weekday-or-date", datetime: yesterday.toISOString() })

    await nextFrame()

    assert.equal(getText(element), "yesterday")
  })

  it("this week", async () => {
    const recent = moment().subtract(3, "days")
    const element = addTimeEl({ type: "weekday-or-date", datetime: recent.toISOString() })

    await nextFrame()

    assert.equal(getText(element), recent.format("dddd"))
  })

  it("before this week", async () => {
    const before = moment().subtract(8, "days")
    const element = addTimeEl({ type: "weekday-or-date", datetime: before.toISOString() })

    await nextFrame()

    assert.equal(getText(element), before.format("MMM D"))
  })
})
