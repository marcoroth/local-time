/* LocalTime 3.0.0-beta.1 */

let i18n = {
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
};

class Config {
    constructor() {
        this.locale = "en";
        this.defaultLocale = "en";
        this.i18n = i18n;
        this.timerInterval = 60 * 1000;
    }
}
var config = new Config();

function parseDate(dateString) {
    dateString = dateString.toString();
    return new Date(Date.parse(dateString));
}

function getI18nValue(keyPath, param = config) {
    const { locale } = param;
    const value = getValue(i18n[locale], keyPath);
    if (value != null) {
        return value;
    }
    else if (locale !== config.defaultLocale) {
        return getI18nValue(keyPath, Object.assign(Object.assign({}, config), { locale: config.defaultLocale }));
    }
}
function translate(keyPath, interpolations = {}, options = config) {
    let string = getI18nValue(keyPath, options);
    for (let key in interpolations) {
        const replacement = interpolations[key];
        string = string.replace(`{${key}}`, replacement);
    }
    return string;
}
function getValue(object, keyPath) {
    let value = object;
    for (let key of Array.from(keyPath.split("."))) {
        if (value[key] != null) {
            value = value[key];
        }
        else {
            return null;
        }
    }
    return value;
}

function strftime(time, formatString) {
    const day = time.getDay();
    const date = time.getDate();
    const month = time.getMonth();
    const year = time.getFullYear();
    const hour = time.getHours();
    const minute = time.getMinutes();
    const second = time.getSeconds();
    return formatString.replace(/%(-?)([%aAbBcdeHIlmMpPSwyYZ])/g, function (_match, flag, modifier) {
        switch (modifier) {
            case "%": return "%";
            case "a": return getI18nValue("date.abbrDayNames")[day];
            case "A": return getI18nValue("date.dayNames")[day];
            case "b": return getI18nValue("date.abbrMonthNames")[month];
            case "B": return getI18nValue("date.monthNames")[month];
            case "c": return time.toString();
            case "d": return pad(date, flag);
            case "e": return date;
            case "H": return pad(hour, flag);
            case "I": return pad(strftime(time, "%l"), flag);
            case "l": if ((hour === 0) || (hour === 12)) {
                return 12;
            }
            else {
                return (hour + 12) % 12;
            }
            case "m": return pad(month + 1, flag);
            case "M": return pad(minute, flag);
            case "p": return translate(`time.${(hour > 11 ? "pm" : "am")}`).toUpperCase();
            case "P": return translate(`time.${(hour > 11 ? "pm" : "am")}`);
            case "S": return pad(second, flag);
            case "w": return day;
            case "y": return pad(year % 100, flag);
            case "Y": return year;
            case "Z": return parseTimeZone(time);
        }
    });
}
function pad(num, flag) {
    switch (flag) {
        case "-": return num;
        default: return (`0${num}`).slice(-2);
    }
}
function parseTimeZone(time) {
    let name;
    const string = time.toString();
    if ((name = __guard__(string.match(/\(([\w\s]+)\)$/), (x) => x[1]))) {
        if (/\s/.test(name)) {
            return name.match(/\b(\w)/g).join("");
        }
        else {
            return name;
        }
    }
    else if ((name = __guard__(string.match(/(\w{3,4})\s\d{4}$/), (x1) => x1[1]))) {
        return name;
    }
    else if ((name = __guard__(string.match(/(UTC[\+\-]\d+)/), (x2) => x2[1]))) {
        return name;
    }
    else {
        return "";
    }
}
function __guard__(value, transform) {
    const defined = typeof value !== 'undefined' && value !== null;
    if (defined)
        return transform(value);
}

var helpers = /*#__PURE__*/Object.freeze({
    __proto__: null,
    parseDate: parseDate,
    getI18nValue: getI18nValue,
    translate: translate,
    getValue: getValue,
    strftime: strftime,
    pad: pad,
    parseTimeZone: parseTimeZone,
    __guard__: __guard__
});

class CalendarDate {
    static fromDate(date) {
        return new (this)(date.getFullYear(), date.getMonth() + 1, date.getDate());
    }
    static today() {
        return this.fromDate(new Date);
    }
    constructor(year, month, day) {
        this.date = new Date(Date.UTC(year, month - 1));
        this.date.setUTCDate(day);
        this.year = this.date.getUTCFullYear();
        this.month = this.date.getUTCMonth() + 1;
        this.day = this.date.getUTCDate();
        this.value = this.date.getTime();
    }
    equals(calendarDate) {
        if (calendarDate) {
            return calendarDate.value === this.value;
        }
    }
    is(calendarDate) {
        return this.equals(calendarDate);
    }
    isToday() {
        return this.is(CalendarDate.today());
    }
    occursOnSameYearAs(date) {
        if (date) {
            return this.year === date.year;
        }
    }
    occursThisYear() {
        return this.occursOnSameYearAs(CalendarDate.today());
    }
    daysSince(date) {
        if (date) {
            return (this.date.getTime() - date.date.getTime()) / (1000 * 60 * 60 * 24);
        }
    }
    daysPassed() {
        return CalendarDate.today().daysSince(this);
    }
}

class RelativeTime {
    constructor(date) {
        this.date = date;
        this.calendarDate = CalendarDate.fromDate(this.date);
    }
    toString() {
        let date;
        let time;
        if (time = this.toTimeElapsedString()) {
            return translate("time.elapsed", { time });
        }
        else if (date = this.toWeekdayString()) {
            time = this.toTimeString();
            return translate("datetime.at", { date, time });
        }
        else {
            return translate("date.on", { date: this.toDateString() });
        }
    }
    toTimeOrDateString() {
        if (this.calendarDate.isToday()) {
            return this.toTimeString();
        }
        else {
            return this.toDateString();
        }
    }
    toTimeElapsedString() {
        let time;
        const ms = new Date().getTime() - this.date.getTime();
        const seconds = Math.round(ms / 1000);
        const minutes = Math.round(seconds / 60);
        const hours = Math.round(minutes / 60);
        if (ms < 0) {
            return null;
        }
        else if (seconds < 10) {
            time = translate("time.second");
            return translate("time.singular", { time });
        }
        else if (seconds < 45) {
            return `${seconds} ${translate("time.seconds")}`;
        }
        else if (seconds < 90) {
            time = translate("time.minute");
            return translate("time.singular", { time });
        }
        else if (minutes < 45) {
            return `${minutes} ${translate("time.minutes")}`;
        }
        else if (minutes < 90) {
            time = translate("time.hour");
            return translate("time.singularAn", { time });
        }
        else if (hours < 24) {
            return `${hours} ${translate("time.hours")}`;
        }
        else {
            return "";
        }
    }
    toWeekdayString() {
        switch (this.calendarDate.daysPassed()) {
            case 0:
                return translate("date.today");
            case 1:
                return translate("date.yesterday");
            case -1:
                return translate("date.tomorrow");
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
                return strftime(this.date, "%A");
            default:
                return "";
        }
    }
    toDateString() {
        const format = this.calendarDate.occursThisYear() ? getI18nValue("date.formats.thisYear") : getI18nValue("date.formats.default");
        return strftime(this.date, format);
    }
    toTimeString() {
        return strftime(this.date, getI18nValue("time.formats.default"));
    }
}

class PageObserver {
    constructor(selector, callback) {
        this.processMutations = this.processMutations.bind(this);
        this.selector = selector;
        this.callback = callback;
    }
    start() {
        if (!this.started) {
            this.observeWithMutationObserver();
            return this.started = true;
        }
    }
    observeWithMutationObserver() {
        const observer = new MutationObserver(this.processMutations);
        observer.observe(document.documentElement, { childList: true, subtree: true });
        return true;
    }
    findSignificantElements(element) {
        const elements = [];
        if (element) {
            if (element.matches && element.matches(this.selector)) {
                elements.push(element);
            }
            if (element.querySelectorAll) {
                elements.push(...Array.from(element.querySelectorAll(this.selector) || []));
            }
        }
        return elements;
    }
    processMutations(mutations) {
        const elements = [];
        for (let mutation of Array.from(mutations)) {
            switch (mutation.type) {
                case "childList":
                    for (let node of Array.from(mutation.addedNodes)) {
                        elements.push(...Array.from(this.findSignificantElements(node) || []));
                    }
                    break;
            }
        }
        return this.notify(elements);
    }
    notify(elements) {
        const isFunction = typeof this.callback === 'function';
        if (isFunction && (elements === null || elements === void 0 ? void 0 : elements.length)) {
            return this.callback(elements);
        }
    }
}

const SELECTOR = "time[data-local]:not([data-localized])";
const markAsLocalized = (element) => element.setAttribute("data-localized", "");
const relative = (time) => new RelativeTime(time);
class Controller {
    constructor() {
        this.processElements = this.processElements.bind(this);
        this.pageObserver = new PageObserver(SELECTOR, this.processElements);
    }
    start() {
        if (!this.started) {
            this.processElements();
            this.startTimer();
            this.pageObserver.start();
            return this.started = true;
        }
    }
    get interval() {
        return config.timerInterval;
    }
    startTimer() {
        if (this.timer)
            return this.timer;
        if (this.interval) {
            this.timer = setInterval(this.processElements, this.interval);
        }
        return this.timer;
    }
    processElements(elements = []) {
        if (elements == null || elements.length == 0) {
            elements = document.querySelectorAll(SELECTOR);
        }
        for (let element of Array.from(elements)) {
            this.processElement(element);
        }
        return elements.length;
    }
    processElement(element) {
        const datetime = element.getAttribute("datetime");
        const format = element.getAttribute("data-format") || "";
        const local = element.getAttribute("data-local");
        if (!datetime)
            return;
        if (element.localName !== "time")
            return;
        const getContent = () => {
            switch (local) {
                case "time":
                    markAsLocalized(element);
                    return strftime(time, format);
                case "date":
                    markAsLocalized(element);
                    return relative(time).toDateString();
                case "time-ago":
                    return relative(time).toString();
                case "time-or-date":
                    return relative(time).toTimeOrDateString();
                case "weekday":
                    return relative(time).toWeekdayString();
                case "weekday-or-date":
                    return relative(time).toWeekdayString() || relative(time).toDateString();
            }
        };
        const time = parseDate(datetime);
        if (!time)
            return;
        if (!element.hasAttribute("title")) {
            const title = strftime(time, getI18nValue("datetime.formats.default"));
            element.setAttribute("title", title);
        }
        const content = getContent();
        element.textContent = content;
        if (!element.hasAttribute("aria-label")) {
            return element.setAttribute("aria-label", content);
        }
    }
}

const domReady = function () {
    return document.readyState !== "loading";
};
const nextFrame = function (fn) {
    return requestAnimationFrame(fn);
};

class LocalTime {
    constructor() {
        this.controller = new Controller();
        this.started = false;
    }
    run() {
        return this.controller.processElements();
    }
    startController() {
        this.controller.start();
    }
    start() {
        if (!this.started) {
            this.started = true;
            if (domReady()) {
                return this.startController();
            }
            else {
                return nextFrame(this.startController);
            }
        }
    }
    process(...elements) {
        for (let element of Array.from(elements)) {
            this.controller.processElement(element);
        }
        return elements.length;
    }
    getController() {
        console.warn("`LocalTime.getController()` is deprecated. Please use `LocalTime.controller` instead.");
        return this.controller;
    }
    get config() {
        return config;
    }
    get helpers() {
        return helpers;
    }
}
const localTime = new LocalTime();
window.LocalTime = localTime;

export { localTime as default };
