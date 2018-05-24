const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const changeNum = i => {
  var chineseNum = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
  if (i <= 10) {
    return chineseNum[i];
  } else if (i > 10 && i < 100) {
    var decade = Math.floor(i / 10);
    var result;
    if (decade === 1) {
      return '十' + chineseNum[i - decade * 10];
    } else {
      return chineseNum[decade + 1] + '十' + chineseNum[i - decade * 10]
    }
  } 
}

module.exports = {
  changeNum: changeNum
}
