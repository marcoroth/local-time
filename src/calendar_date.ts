class CalendarDate {
  declare date: Date
  declare year: number
  declare month: number
  declare day: number
  declare value: number

  static fromDate(date: Date) {
    return new (this)(date.getFullYear(), date.getMonth() + 1, date.getDate())
  }

  static today() {
    return this.fromDate(new Date)
  }

  constructor(year: number, month: number, day: number) {
    this.date = new Date(Date.UTC(year, month - 1))
    this.date.setUTCDate(day)

    this.year = this.date.getUTCFullYear()
    this.month = this.date.getUTCMonth() + 1
    this.day = this.date.getUTCDate()
    this.value = this.date.getTime()
  }

  equals(calendarDate: CalendarDate) {
    if (calendarDate) {
      return calendarDate.value === this.value
    }
  }

  is(calendarDate: CalendarDate) {
    return this.equals(calendarDate)
  }

  isToday() {
    return this.is(CalendarDate.today())
  }

  occursOnSameYearAs(date: CalendarDate) {
    if (date) {
      return this.year === date.year
    }
  }

  occursThisYear() {
    return this.occursOnSameYearAs(CalendarDate.today())
  }

  daysSince(date: CalendarDate) {
    if (date) {
      return (this.date.getTime() - date.date.getTime()) / (1000 * 60 * 60 * 24)
    }
  }

  daysPassed() {
    return CalendarDate.today().daysSince(this)
  }
}

export { CalendarDate }
