import sinon from "sinon"
import moment from "https://cdn.skypack.dev/moment"
import { getText } from "./test_helpers"

import LocalTime from "../../../"

import { fixture, assert } from "@open-wc/testing"

describe("time ago", () => {
  beforeEach(async () => {
    await fixture(`<time id="ago"></time>`)
  })

  it("a second ago", () => {
    assertTimeAgo("a second ago", "seconds", 9)
  })

  it("seconds ago", () => {
    assertTimeAgo("44 seconds ago", "seconds", 44)
  })

  it("a minute ago", () => {
    assertTimeAgo("a minute ago", "seconds", 89)
  })

  it("minutes ago", () => {
    assertTimeAgo("44 minutes ago", "minutes", 44)
  })

  it("an hour ago", () => {
    assertTimeAgo("an hour ago", "minutes", 89)
  })

  it("hours ago", () => {
    assertTimeAgo("23 hours ago", "hours", 23)
  })

  it("yesterday", () => {
    const time = moment().subtract(1, "days").format("h:mma")

    assertTimeAgo(`yesterday at ${time}`, "days", 1)
  })

  it("tomorrow", () => {
    const time = moment().add(1, "days").format("h:mma")

    assertTimeAgo(`tomorrow at ${time}`, "days", -1)
  })

  it("last week", () => {
    const ago  = moment().subtract(5, "days")
    const day  = ago.format("dddd")
    const time = ago.format("h:mma")

    assertTimeAgo(`${day} at ${time}`, "days", 5)
  })

  it("this year", () => {
    const clock = sinon.useFakeTimers(new Date(2013,11,11,11,11).getTime(), "Date")
    const date = moment().subtract(7, "days").format("MMM D")
    assertTimeAgo(`on ${date}`, "days", 7)

    clock.restore()
  })

  it("last year", () => {
    const date = moment().subtract(366, "days").format("MMM D, YYYY")

    assertTimeAgo(`on ${date}`, "days", 366)
  })

  it("next year", () => {
    const date = moment().add(366, "days").format("MMM D, YYYY")

    assertTimeAgo(`on ${date}`, "days", -366)
  })
})

function assertTimeAgo(string, unit, amount) {
  const el = document.getElementById("ago")
  el.setAttribute("data-local", "time-ago")
  el.setAttribute("datetime", moment().subtract(amount, unit).utc().toISOString())

  LocalTime.run()

  return assert.equal(getText(el), string)
}
