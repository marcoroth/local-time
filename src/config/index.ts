import { i18n, I18nConfig } from "./i18n"

export class Config {
  declare locale: string
  declare defaultLocale: string
  declare i18n: I18nConfig
  declare timerInterval: number

  constructor() {
    this.locale = "en"
    this.defaultLocale = "en"
    this.i18n = i18n
    this.timerInterval = 60 * 1000
  }
}

export default new Config()
