import { Template } from 'meteor/templating'
import { Notifications } from '../../../api/notifications/Notifications'
import { Navigation } from '../../../api/navigation/Navigation'

import './nav.html'

Template.nav.onCreated(function onNavCreated () {
  const instance = this
  instance.autorun(() => {

  })
})

Template.nav.helpers({
  homeEntries () {
    return Navigation.getAll(Navigation.targets.home)
  },
  leftEntries () {
    return Navigation.getAll(Navigation.targets.left)
  },
  rightEntries () {
    return Navigation.getAll(Navigation.targets.right)
  },
  showRoute (route) {
    return route.navigation()
  },
  notificationsCount () {
    return Notifications.find().count()
  },
  notifications () {
    const notifications = Notifications.find({userId: Meteor.userId()}, {sort: {createdAt: -1}})
    return notifications.count() > 0 ? notifications : null
  }
})
