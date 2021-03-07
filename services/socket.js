import { io } from 'socket.io-client'

const socketService = {
  connectSocket(context) {
    console.log(context)
    window.socket = io(process.env.NUXT_ENV_SOCKET_URL)
    // an user had send an message
    window.socket.on(
      'receiptMessage',
      ({ userId, roomId, message, userName }) => {
        context.store.commit('message/RECEIVED_MESSAGE', message, {
          root: true
        })
        context.store.commit(
          'thresh/RECEIVED_MESSAGE',
          { message, userName },
          { root: true }
        )
      }
    )

    // An user had requested a friend request
    window.socket.on('responseAddFriend', data => {
      context.store.commit('notification/ADD_NOTIFICATION', data, {
        root: true
      })
    })

    // An user had accepted a friend request
    window.socket.on('acceptFriendNotification', data => {
      console.log(data)
    })

    // An user had logged in
    window.socket.on('userLoggedIn', userId => {
      context.store.commit('user/USER_LOGGED_IN', userId, {
        root: true
      })
    })

    // An user had logged out
    window.socket.on('userLoggedOut', userId => {
      context.store.commit('user/USER_LOGGED_OUT', userId, {
        root: true
      })
    })
  }
}

export default socketService
