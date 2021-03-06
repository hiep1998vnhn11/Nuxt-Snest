import Vue from 'vue'
import moment from 'moment'

window.moment = moment

moment.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: 'a few s',
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

Vue.filter('relativeTime', function(value, context) {
  if (!value) return 'User not login!'
  else if (moment(value) < moment().subtract(7, 'days')) {
    return moment.utc(value).calendar()
  } else return moment.utc(value).fromNow(true)
})

Vue.filter('offlineTime', function(value, context) {
  if (!value) return 'null'
  else return moment.utc(value).fromNow(true)
})

Vue.filter('messageTime', function(value, context) {
  if (!value) return 'just a second'
  return moment(value).calendar()
})

Vue.filter('onlyName', function(username) {
  let names = username.split(' ')
  return names[0].length <= 5 ? names[0] : names[0].substring(0, 5) + '...'
})

Vue.filter('reverse', function(value) {
  return value.slice().reverse()
})
