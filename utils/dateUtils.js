// src/utils/dateUtils.js
const dayjs = require("dayjs");

const DateUtils = {
  now: () => dayjs().format("YYYY-MM-DD HH:mm:ss"),
  today: () => dayjs().format("YYYY-MM-DD"),
  format: (date, format = "YYYY-MM-DD HH:mm:ss") => dayjs(date).format(format),
  addDays: (date, days) => dayjs(date).add(days, "day").toDate(),
  subtractDays: (date, days) => dayjs(date).subtract(days, "day").toDate(),
  diffInDays: (start, end) => dayjs(end).diff(dayjs(start), "day"),
  isBefore: (a, b) => dayjs(a).isBefore(dayjs(b)),
  isAfter: (a, b) => dayjs(a).isAfter(dayjs(b)),
};

module.exports = DateUtils;
