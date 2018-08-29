import { Meteor } from 'meteor/meteor'
import { Cquencial } from '../../api/cquencial/Cquencial'
import { Routes } from '../../api/routes/Routes'
import { Navigation } from '../../api/navigation/Navigation'

const loggedIn = () =>  Meteor.user() || Meteor.userId()
const loggedOut = () => !Meteor.user() && !Meteor.userId()

function toLogin () {
  if (loggedOut()) {
    Routes.to.login.go({}, {redirect: global.encodeURIComponent(Routes.location())})
  }
}

function toRoot () {
  if (loggedIn()) {
    Routes.to.root.go()
  }
}

/**
 * All routes exported to be testable
 * @type {[null,null]}
 */
export const allRoutes = [
  {
    name: 'pageNotFound',
    label: 'Page not found',
    path: '*',
    template () {
      return import('/imports/ui/pages/pageNotFound/pageNotFound.js')
    },
    enter: [toLogin]
  },
  {
    name: 'root',
    label: 'CQUENCIAL',
    path: '/',
    template () {
      return import('/imports/ui/pages/root/root.js')
    },
    enter: [toLogin],
    navigation: () => true,
    target: Navigation.home,
    icon: 'home'
  },
  {
    name: 'login',
    label: 'Login',
    path: '/login',
    template () {
      return import('/imports/ui/pages/root/root.js')
    },
    enter: [toRoot],
    navigation: loggedOut,
    target: Navigation.right,
  },
  {
    name: 'logout',
    label: 'Logout',
    path: '/logout',
    template () {
      return import('/imports/ui/pages/logout/logout.js')
    },
    enter: [toLogin],
    navigation: loggedIn,
    target: Navigation.right,
  },
  {
    name: 'setup',
    label: 'Setup Cquencial',
    path: '/setup',
    template () {
      return import('/imports/ui/pages/setup/setup.js')
    },
  },
  {
    name: 'settings',
    label: 'Settings',
    path: '/settings',
    template() {
      return import('/imports/ui/pages/settings/settings.js')
    },
    navigation: loggedIn,
    icon: 'wrench',
    target: Navigation.right,
  }
]


allRoutes.forEach(route => Routes.define(route.name, route))

const navRoutes = allRoutes.filter(route => !!route.navigation)
navRoutes.forEach(navRoute => Navigation.register(navRoute.target, navRoute))

Meteor.startup(() => {
  Meteor.call(Cquencial.methods.setupRequired.name, (err, res) => {
    if (res === true) {
      Routes.to.setup.go()
    }
  })
})