export default function(context) {
  // Add the userAgent property to the context
  if (!context.store.getters['user/isLoggedIn'])
    return context.redirect('/login')
}
