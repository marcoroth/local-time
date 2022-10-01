import config, { Config } from "../config"
import { i18n } from "../config/i18n"

type TranlateInterpolations = { [key: string]: string }

function getI18nValue(keyPath: string, param: Config = config): any {
  const { locale } = param
  const value = getValue(i18n[locale], keyPath)

  if (value != null) {
    return value
  } else if (locale !== config.defaultLocale) {
    return getI18nValue(keyPath, {  ...config, locale: config.defaultLocale, })
  }
}


function translate(keyPath: string, interpolations: TranlateInterpolations = {}, options: Config = config) {
  let string = getI18nValue(keyPath, options)

  for (let key in interpolations) {
    const replacement = interpolations[key]
    string = string.replace(`{${key}}`, replacement)
  }

  return string
}

function getValue(object: any, keyPath: string) {
  let value = object

  for (let key of Array.from(keyPath.split("."))) {
    if (value[key] != null) {
      value = value[key]
    } else {
      return null
    }
  }

  return value
}

export {
  getI18nValue,
  translate,
  getValue
}
