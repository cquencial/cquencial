import { Meteor } from 'meteor/meteor'
import { Cquencial } from '../../api/cquencial/Cquencial'
import { Routes } from '../../api/routes/Routes'

function login () {
  if (!Meteor.user() && !Meteor.userId()) {
    Routes.to.login.go({}, {redirect: global.encodeURIComponent(Routes.location())})
  }
}

function loggedIn () {
  if (Meteor.user() || Meteor.userId()) {
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
    enter: [login]
  },
  {
    name: 'root',
    label: 'Welcome',
    path: '/',
    template () {
      return import('/imports/ui/pages/root/root.js')
    },
    enter: [login]
  },
  {
    name: 'login',
    label: 'Login',
    path: '/login',
    template () {
      return import('/imports/ui/pages/root/root.js')
    },
    enter: [loggedIn]
  },
  {
    name: 'setup',
    label: 'Setup Cquencial',
    path: '/setup',
    template() {
      return import('/imports/ui/pages/setup/setup.js')
    }
  }
]

allRoutes.forEach(route => Routes.define(route.name, route))

Meteor.startup(() => {
  Meteor.call(Cquencial.methods.setupRequired.name, (err, res) => {
    if (res === true) {
      Routes.to.setup.go()
    }
  })
})