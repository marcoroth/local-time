import moment from 'https://cdn.skypack.dev/moment'
import { addTimeEl, getText } from "./test_helpers"

import LocalTime from '../../../'

import { assert, nextFrame } from '@open-wc/testing'

const momentMap = {
  "%a": "ddd",
  "%A": "dddd",
  "%b": "MMM",
  "%B": "MMMM",
  "%c": "toString()",
  "%d": "DD",
  "%-d": "D",
  "%e": "D",
  "%H": "HH",
  "%-H": "H",
  "%I": "hh",
  "%-I": "h",
  "%l": "h",
  "%m": "MM",
  "%-m": "M",
  "%M": "mm",
  "%-M": "m",
  "%p": "A",
  "%P": "a",
  "%S": "ss",
  "%-S": "s",
  "%w": "e",
  "%y": "YY",
  "%Y": "YYYY"
};

describe("strftime", () => (() => {
  beforeEach(() => {
    LocalTime.start()
  })

  const result = [];
  for (let day = 0; day <= 30; day += 6) {
    result.push(((day => (() => {
      const result1 = [];

      for (let hour = 0; hour <= 24; hour += 6) {
        result1.push((function(hour) {

          let format;
          for (format in momentMap) {
            const momentFormat = momentMap[format];
            (((format, momentFormat) => it(`${format} (+${day} days, ${hour} hours)`, function() {
              let func;
              const now = moment().add(day, "days").add(hour, "hours");
              const el  = addTimeEl({format, datetime: now.toISOString()});
              LocalTime.process(el);

              return assert.equal(getText(el),
              (func = __guard__(momentFormat.match(/(\w+)\(\)/), x => x[1])) ?
              now.toDate()[func]()
              :
              now.format(momentFormat)
            );
          })))(format, momentFormat);
        }

        return it(`%Z Timezone (+${day} days, ${hour} hours)`, function() {
          const now = moment().add(day, "days").add(hour, "hours");
          const el  = addTimeEl({format: "%Z", datetime: now.toISOString()});
          LocalTime.process(el);

          const text = getText(el);
          return assert.ok(/^(\w{3,4}|UTC[\+\-]\d+)$/.test(text), `'${text}' doesn't look like a timezone. System date: '${new Date}'`);
        });
      })(hour));
    }
    return result1;
  })()))(day));
}
return result;
})());

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}
