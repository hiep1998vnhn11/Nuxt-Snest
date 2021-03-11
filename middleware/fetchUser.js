import socketService from '@/services/socket'
export default async function(context) {
  console.log(context.route)
  if (
    context.store.getters['user/isLoggedIn'] &&
    !context.store.getters['user/currentUser'] &&
    (!window.socket || window.socket.disconnected)
  ) {
    await context.store.dispatch('user/getUser')
    socketService.connectSocket(context)
  }
}
