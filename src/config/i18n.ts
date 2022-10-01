export interface I18nDayNames {
  0: string;
  1: string;
  2: string;
  3: string;
}

export interface I18nMonthNames {
  0: string;
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  7: string;
  8: string;
  9: string;
  10: string;
  11: string;
}

export type I18nDateConfig = {
  dayNames: I18nDayNames,
  abbrDayNames: I18nDayNames,
  monthNames: I18nMonthNames,
  abbrMonthNames: I18nMonthNames,
  yesterday: string,
  today: string,
  tomorrow: string,
  on: string,
  formats: {
    default: string,
    thisYear: string
  },
}

export type I18nTimeConfig = {
  am: string,
  pm: string,
  singular: string,
  singularAn: string,
  elapsed: string,
  second: string,
  seconds: string,
  minute: string,
  minutes: string,
  hour: string,
  hours: string,
  formats: {
    default: string
  }
}

export type I18nDateTimeConfig = {
  at: string,
  formats: {
    default: string
  }
}

export type I18nLanguageConfig = {
  date: I18nDateConfig
  time: I18nTimeConfig,
  datetime: I18nDateTimeConfig
}

export type I18nConfig = {
  [key: string]: I18nLanguageConfig
}

let i18n: I18nConfig = {
  en: {
    date: {
      dayNames: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      abbrDayNames: [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat"
      ],
      monthNames: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ],
      abbrMonthNames: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ],
      yesterday: "yesterday",
      today: "today",
      tomorrow: "tomorrow",
      on: "on {date}",
      formats: {
        default: "%b %e, %Y",
        thisYear: "%b %e"
      }
    },
    time: {
      am: "am",
      pm: "pm",
      singular: "a {time}",
      singularAn: "an {time}",
      elapsed: "{time} ago",
      second: "second",
      seconds: "seconds",
      minute: "minute",
      minutes: "minutes",
      hour: "hour",
      hours: "hours",
      formats: {
        default: "%l:%M%P"
      }
    },
    datetime: {
      at: "{date} at {time}",
      formats: {
        default: "%B %e, %Y at %l:%M%P %Z"
      }
    }
  }
}

export { i18n }
