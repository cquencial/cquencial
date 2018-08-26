import {Meteor} from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { Session } from 'meteor/session'
import { ReactiveDict } from 'meteor/reactive-dict'
import { Bpmn } from 'meteor/cquencial:bpmn-engine'
import {Tracker} from 'meteor/tracker'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css'

// STARTUP IMPORTS
import '../imports/startup/both'
import '../imports/startup/client'

import '../imports/ui/processes/processes'
import '../imports/ui/form/form'
import '../imports/ui/tasklist/tasklist'

import '../imports/ui/components/login/login'

import './main.html'
import { Notifications } from '../imports/api/notifications/Notifications'
import { Cquencial } from '../imports/api/cquencial/Cquencial'


const extensions = Bpmn.extensions.getAll()
console.log(extensions)
extensions.forEach(extension => {
  Tracker.autorun(() => {
    const pubname = Cquencial.to.publicationName(extension.ref.ns)
    const handle = Meteor.subscribe(pubname)
    if (handle.ready()) {
      console.info(`ready [${pubname}]`)
    }
    return handle.ready()
  })
})



Template.body.onCreated(function () {
  const instance = this
  instance.state = new ReactiveDict()
})

Template.body.helpers({
  instanceId () {
    return Session.get('instanceId')
  },
  createNew () {
    return Template.instance().state.get('createNew')
  },
  onCreated () {
    return function onCreated (source) {
      Meteor.call('startProcess', {source})
      this.state.set('createNew', false)
    }.bind(Template.instance())
  },
  notificationsCount () {
    return Notifications.find().count()
  },
  notifications () {
    const notifications = Notifications.find({userId: Meteor.userId()}, {sort: {createdAt: -1}})
    return notifications.count() > 0 ? notifications : null
  },
  shortDate (date) {
    const dt = new Date(date)
    const toLocaleDate = dt.toLocaleDateString()
    const toLocaleTime = dt.toLocaleTimeString()
    if (new Date().toLocaleDateString() === toLocaleDate) { return toLocaleTime } else { return toLocaleDate }
  },
  shortMessage (message) {
    return message.substr(0, 12) + '...'
  },
  showTasklist () {
    return Template.instance().state.get('showTasklist')
  }
})

Template.body.events({
  'click #createProcess' (event, templateInstance) {
    event.preventDefault()
    templateInstance.state.set('createNew', true)
  },
  'click .history' (event, templateInstance) {
    event.preventDefault()
    const instanceId = $(event.currentTarget).attr('data-instance')
    Session.set('instanceId', instanceId)
  },

  'click #delete-all-button' (event) {
    event.preventDefault()
    Meteor.call('deleteAll')
  },

  'click #tasklistToggleButton' (event, templateInstance) {
    event.preventDefault()
    const showTasklist = templateInstance.state.get('showTasklist')
    templateInstance.state.set('showTasklist', !showTasklist)
  }
})
