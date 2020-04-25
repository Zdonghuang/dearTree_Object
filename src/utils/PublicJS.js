const PublicJS = {
  money(s, n) {
    n = n > 0 && n <= 20 ? n : 2
    s = parseFloat((s + '').replace(/[^\d\.-]/g, '')).toFixed(n) + ''
    const numArry = s.split('.')
    const l = numArry[0].split('').reverse()
    let t = ''
    for (var i = 0; i < l.length; i++) {
      t += l[i] + ((i + 1) % 3 === 0 && i + 1 !== l.length ? ',' : '')
    }
    return (
      t.split('').reverse().join('') +
      '.' +
      numArry[1]
    )
  },
  nowDate() {
    var date = new Date()
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    if (month >= 1 && month <= 9) {
      month = '0' + month
    }
    if (day >= 0 && day <= 9) {
      day = '0' + day
    }
    return `${year}${month}${day}`
  }
}

export default PublicJS
