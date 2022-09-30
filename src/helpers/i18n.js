import config from "../config"
const { i18n } = config

function getI18nValue(keyPath, param) {
  if (keyPath == null) { keyPath = "" }
  if (param == null) { param = { locale: config.locale } }

  const { locale } = param
  const value = getValue(i18n[locale], keyPath)

  if (value != null) {
    return value
  } else if (locale !== config.defaultLocale) {
    return getI18nValue(keyPath, {locale: config.defaultLocale})
  }
}

function translate(keyPath, interpolations, options) {
  if (interpolations == null) { interpolations = {} }
  let string = getI18nValue(keyPath, options)

  for (let key in interpolations) {
    const replacement = interpolations[key]
    string = string.replace(`{${key}}`, replacement)
  }

  return string
}

function getValue(object, keyPath) {
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
