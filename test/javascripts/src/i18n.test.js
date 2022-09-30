import moment from 'https://cdn.skypack.dev/moment'
import { addTimeEl, getText } from "./test_helpers"

import LocalTime from '../../../'
const { config } = LocalTime
const { i18n } = config

import { assert, nextFrame } from '@open-wc/testing'

describe("i18n", () => {
  beforeEach(() => {
    LocalTime.start()
  })

  it("updating a value", async () => {
    const now = moment()
    const values = i18n[config.defaultLocale].date

    const originalValue = values.today
    values.today = "2day"

    const el = addTimeEl({ type: "weekday", datetime: now.toISOString() })

    await nextFrame()

    assert.equal(getText(el), "2day")
    assert.equal(getText(el), "2day")
    values.today = originalValue
  })

  it("adding a new locale", async () => {
    const now = moment()

    const originalLocale = config.locale
    config.locale = "es"
    i18n.es = {date: {today: "hoy"}}

    const el = addTimeEl({type: "weekday", datetime: now.toISOString()})
    await nextFrame()

    assert.equal(getText(el), "hoy")
    config.locale = originalLocale
  })

  it("falling back to the default locale", async () => {
    const now = moment()
    const yesterday = moment().subtract(1, "days")

    const originalLocale = config.locale
    config.locale = "es"
    i18n.es = { date: { yesterday: "ayer" } }

    const elWithTranslation = addTimeEl({ type: "weekday", datetime: yesterday.toISOString() })
    const elWithoutTranslation = addTimeEl({ type: "weekday", datetime: now.toISOString() })

    await nextFrame()

    assert.equal(getText(elWithTranslation), "ayer")
    assert.equal(getText(elWithoutTranslation), "today")
    config.locale = originalLocale
  })
})
