export default function(context) {
  // Add the userAgent property to the context
  if (
    context.store.getters['user/isLoggedIn'] &&
    !context.store.getters['user/currentUser']
  ) {
    context.store.dispatch('user/getUser')
  }
}
