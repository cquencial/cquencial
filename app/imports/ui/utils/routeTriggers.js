import { Connection } from '../../api/connection/Connection'
import { Routes } from '../../api/routes/Routes'

export const loggedIn = () => Connection.userId()
export const loggedOut = () => !Connection.userId()

export function toLogin () {
  if (loggedOut()) {
    Routes.to.login.go({}, {redirect: global.encodeURIComponent(Routes.location())})
  }
}

export function toRoot () {
  if (loggedIn()) {
    const redirect = Routes.queryParam('redirect')
    if (redirect) {
      Routes.go(global.decodeURIComponent(redirect))
    } else {
      Routes.to.root.go()
    }
  }
}