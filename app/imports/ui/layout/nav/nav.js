import { Template } from 'meteor/templating'
import { Notifications } from '../../../api/notifications/Notifications'

import './nav.html'

Template.nav.onCreated(function onCreated () {

})

Template.nav.helpers({
  notificationsCount () {
    return Notifications.find().count()
  },
  notifications () {
    const notifications = Notifications.find({userId: Meteor.userId()}, {sort: {createdAt: -1}})
    return notifications.count() > 0 ? notifications : null
  },

})