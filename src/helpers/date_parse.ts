function parseDate(dateString: string): Date {
  dateString = dateString.toString()

  return new Date(Date.parse(dateString))
}

export {
  parseDate
}
