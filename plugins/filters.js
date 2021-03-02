import Vue from 'vue'
import moment from 'moment'
Vue.filter('relativeTime', function(value) {
  if (!value) return 'User not login!'
  return moment(value).fromNow(true)
})

Vue.filter('onlyName', function(username) {
  let names = username.split(' ')
  return names[0].length <= 5 ? names[0] : names[0].substring(0, 5) + '...'
})

Vue.filter('reverse', function(value) {
  return value.slice().reverse()
})
