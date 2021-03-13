import { v4 as uuidv4, validate as validateV4 } from 'uuid'
export default function({ store, route, redirect, app }) {
  // Add the userAgent property to the context
  if (!validateV4(route.params.call_id)) {
    return redirect(app.localePath({ name: 'index' }))
  }
}
