import socketService from '@/services/socket'
export default async function(context) {
  // Add the userAgent property to the context
  if (
    context.store.getters['user/isLoggedIn'] &&
    !context.store.getters['user/currentUser'] &&
    (!window.socket || window.socket.disconnected)
  ) {
    await context.store.dispatch('user/getUser')
    socketService.connectSocket(context)
  }
  // if (!window.socket || window.socket.disconnected)
  //   socketService.connectSocket(context)
}
