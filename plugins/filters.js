import Vue from 'vue'
import moment from 'moment'
window.test = moment
moment.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: function(number, withoutSuffix, key, isFuture) {
      return '00:' + (number < 10 ? '0' : '') + number + ' minutes'
    },
    m: '1m',
    mm: '%dm',
    h: '1h',
    hh: '%dh',
    d: '1d',
    dd: '%dd',
    M: '1mo',
    MM: '%dmo',
    y: '1y',
    yy: '%dy'
  }
})

Vue.filter('relativeTime', function(value) {
  if (!value) return 'User not login!'
  else if (moment(value) < moment().subtract(7, 'days')) {
    return moment(value).calendar()
  } else return moment(value).fromNow(true)
})

Vue.filter('offlineTime', function(value) {
  if (!value) return 'null'
  else return moment(value).fromNow(true)
})

Vue.filter('onlyName', function(username) {
  let names = username.split(' ')
  return names[0].length <= 5 ? names[0] : names[0].substring(0, 5) + '...'
})

Vue.filter('reverse', function(value) {
  return value.slice().reverse()
})
