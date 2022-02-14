function formatFromData(data, format) {
  // 统一替换的不包含毫秒数
  var dict = {
    "y+": data.year,
    "q+": data.quarter,
    "M+": data.month,
    "d+": data.date,
    "D+": data.day,
    "h+": data.hour,
    "m+": data.minute,
    "s+": data.second,
  };
  for (var key in dict) {
    var value = dict[key];
    // 负数不替换
    if (value >= 0) {
      var reg = new RegExp("(" + key + ")", "g");
      if (reg.test(format)) {
        format = format.replace(reg, numToStr(value, RegExp.$1.length));
      }
    }
  }
  // 替换毫秒数
  if (data.millisecond >= 0) {
    format = format.replace(/S+/g, data.millisecond + "");
  }
  return format;
}
function numToStr(num, len) {
  if (len === void 0) {
    len = 1;
  }
  var numStr = num + "";
  // 如果长度不大于1，则该多长就多长
  if (len <= 1) return numStr;
  // 否则截短或者在前面补0
  var numLen = numStr.length;
  if (len <= numLen) {
    return numStr.substr(numLen - len);
  } else {
    for (var i = 0, lenI = len - numLen; i < lenI; i++) {
      numStr = "0" + numStr;
    }
    return numStr;
  }
}
var date = new Date();
console.log(
  formatFromData(
    {
      year: date.getFullYear(),
      quarter: Math.floor(date.getMonth() / 3) + 1,
      month: date.getMonth() + 1,
      date: date.getDate(),
      day: date.getDay(),
      hour: date.getHours(),
      minute: date.getMinutes(),
      second: date.getSeconds(),
      millisecond: date.getMilliseconds(),
    },
    "yyyy-MM-dd hh:mm:ss.S"
  )
);
