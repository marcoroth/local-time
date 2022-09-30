import { i18n } from "./i18n"

let _i18n = i18n
let _locale = "en"
let _defaultLocale = "en"
let _timerInterval = 60 * 1000

export default {
  get locale() {
    return _locale
  },
  set locale (value) {
    _locale = value
  },
  get defaultLocale() {
    return _defaultLocale
  },
  set defaultLocale(value) {
    _defaultLocale = value
  },
  get i18n() {
    return _i18n
  },
  set i18n(value) {
    _i18n = value
  },
  get timerInterval() {
    return _timerInterval
  },
  set timerInterval(value) {
    _timerInterval = value
  }
}
