
// 引入 moment 时间插件
import moment from 'moment'
// 获取今日/昨日/本周/上周/本月/上月 时间
export default {
  // 获取今日的开始结束时间
  getToday() {
    const obj = {
      starttime: '',
      endtime: ''
    }
    obj.starttime = moment(moment().startOf('day').valueOf()).format('YYYY-MM-DD')
    obj.nowTime = moment().format('YYYY-MM-DD HH:mm:ss')
    obj.endtime = moment(moment().valueOf()).format('YYYY-MM-DD')
    return obj
  },
  // 获取昨日的开始结束时间
  getYesterday() {
    const obj = {
      starttime: '',
      endtime: ''
    }
    obj.starttime = moment(moment().add(-1, 'days').startOf('day').valueOf()).format('YYYY-MM-DD')
    obj.endtime = moment(moment().add(-1, 'days').endOf('day').valueOf()).format('YYYY-MM-DD')
    return obj
  },
  // 获取当前周的开始结束时间
  getCurrWeekDays() {
    const obj = {
      starttime: '',
      endtime: ''
    }
    let weekOfday = moment().format('E');//计算今天是这周第几天
    if (weekOfday == 7) {
      obj.starttime = moment().week(moment().week() - 1).startOf('week').add(1, 'days').format('YYYY-MM-DD')
    } else {
      obj.starttime = moment().week(moment().week()).startOf('week').add(1, 'days').format('YYYY-MM-DD')
    }
    obj.endtime = moment(moment().valueOf()).format('YYYY-MM-DD')
    return obj
  },
  // 获取上一周的开始结束时间
  getLastWeekDays() {
    const obj = {
      starttime: '',
      endtime: ''
    }
    let weekOfday = moment().format('E');//计算今天是这周第几天
    if (weekOfday == 7) {
      obj.starttime = moment().week(moment().week() - 2).startOf('week').add(1, 'days').format('YYYY-MM-DD')
      obj.endtime = moment().week(moment().week() - 2).endOf('week').add(1, 'days').format('YYYY-MM-DD')
    } else {
      obj.starttime = moment().week(moment().week() - 1).startOf('week').add(1, 'days').format('YYYY-MM-DD')
      obj.endtime = moment().week(moment().week() - 1).endOf('week').add(1, 'days').format('YYYY-MM-DD')
    }
    return obj
  },
  // 获取当前月的开始结束时间
  getCurrMonthDays() {
    const obj = {
      starttime: '',
      endtime: ''
    }
    obj.starttime = moment(moment().month(moment().month()).startOf('month').valueOf()).format('YYYY-MM-DD')
    // obj.endtime = moment(moment().month(moment().month()).endOf('month').valueOf()).format('YYYY-MM-DD')
    obj.endtime = moment(moment().valueOf()).format('YYYY-MM-DD')
    return obj
  },
  // 获取上一个月的开始结束时间
  getLastMonthDays() {
    const obj = {
      starttime: '',
      endtime: ''
    }
    obj.starttime = moment(moment().month(moment().month() - 1).startOf('month').valueOf()).format('YYYY-MM-DD')
    obj.endtime = moment(moment().month(moment().month() - 1).endOf('month').valueOf()).format('YYYY-MM-DD')
    return obj
  },
  // 获取最近三个月的开始结束时间
  getThreeMonthDays() {
    const obj = {
      starttime: '',
      endtime: ''
    }
    obj.starttime = moment(moment().month(moment().month() - 3).startOf('month').valueOf()).format('YYYY-MM-DD')
    // obj.endtime = moment(moment().month(moment().month()).endOf('month').valueOf()).format('YYYY-MM-DD')
    obj.endtime = moment(moment().valueOf()).format('YYYY-MM-DD')
    return obj
  },
  // 获取本季度的开始结束时间
  getThisSeason() {
    const obj = {
      starttime: '',
      endtime: ''
    }
    const currentQuarter = moment().quarter() // 当前是第几季度
    const currentYear = moment().year() // 当前年
    obj.starttime = moment(moment(currentYear + '-01-01').format('YYYY-MM-DD')).quarter(currentQuarter).format('YYYY-MM-DD')
    let endMonth = 3 * parseInt(currentQuarter) // 当季度最后一个月
    /* 对月数进行格式化 */
    if (endMonth < 10) {
      endMonth = '0' + endMonth
    } else {
      endMonth += ''
    }
    // const endMonthDays = moment(currentYear + '-' + endMonth).daysInMonth() // 末尾月天数
    // let endDays = currentYear + '-' + endMonth + '-' + endMonthDays // 完整年月日整合
    // obj.endtime = moment(endDays).format('YYYY-MM-DD')
    obj.endtime = moment(moment().valueOf()).format('YYYY-MM-DD')
    return obj
  },
  // 获取本年的开始结束时间
  getThisYearDays() {
    const obj = {
      starttime: '',
      endtime: ''
    }
    obj.starttime = moment(moment().year(moment().year()).startOf('year').valueOf()).format('YYYY-MM-DD')
    // obj.endtime = moment(moment().year(moment().year()).endOf('year').valueOf()).format('YYYY-MM-DD')
    obj.endtime = moment(moment().valueOf()).format('YYYY-MM-DD')
    return obj
  }
}
