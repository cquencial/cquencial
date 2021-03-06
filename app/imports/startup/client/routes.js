import { Meteor } from 'meteor/meteor'
import { Routes } from '../../api/routes/Routes'
import { Navigation } from '../../api/navigation/Navigation'
import {loggedIn, loggedOut, toLogin, toRoot} from '../../ui/utils/routeTriggers'

/**
 * This is the minimal set of route definitions
 */
export const allRoutes = [
  {
    name: 'pageNotFound',
    label: 'Page not found',
    path: '*',
    template () {
      import '/imports/ui/pages/pageNotFound/pageNotFound.js'
    },
    enter: [toLogin]
  },
  {
    name: 'root',
    label: 'CQUENCIAL',
    path: '/',
    template () {
      import '/imports/ui/pages/root/root.js'
    },
    enter: [toLogin],
    navigation: () => true,
    target: Navigation.targets.home,
    icon: 'home'
  },
  {
    name: 'settings',
    label: 'Settings',
    path: '/settings',
    template() {
      import '/imports/ui/pages/settings/settings.js'
    },
    enter: [toLogin],
    navigation: loggedIn,
    icon: 'wrench',
    target: Navigation.targets.right,
  },
  {
    name: 'login',
    label: 'Login',
    path: '/login',
    icon: 'sign-in',
    template () {
      import '/imports/ui/pages/login/login.js'
    },
    enter: [toRoot],
    navigation: loggedOut,
    target: Navigation.targets.right,
  },
  {
    name: 'logout',
    label: 'Logout',
    path: '/logout',
    icon: 'sign-out',
    template () {
      import '/imports/ui/pages/logout/logout.js'
    },
    navigation: loggedIn,
    target: Navigation.targets.right,
  },
  {
    name: 'setup',
    label: 'Setup Cquencial',
    path: '/setup',
    template () {
      import '/imports/ui/pages/setup/setup.js'
    },
  }
]

allRoutes.forEach(route => Routes.define(route.name, route))

const navRoutes = allRoutes.filter(route => typeof route.navigation === 'function')
navRoutes.forEach(navRoute => Navigation.register(navRoute.target, navRoute))
