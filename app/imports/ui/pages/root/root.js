import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { ReactiveDict } from 'meteor/reactive-dict'
import './root.html'

Template.root.onCreated(function () {
  const instance = this
  instance.state = new ReactiveDict()
})

Template.root.helpers({
  instanceId () {
    return Template.getState('instanceId')
  },
  createNew () {
    return Template.getState('createNew')
  },
  onCreated () {
    return function onCreated (source) {
      Meteor.call('startProcess', {source})
      this.state.set('createNew', false)
    }.bind(Template.instance())
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

Template.root.events({
  'click #createProcess' (event, templateInstance) {
    event.preventDefault()
    templateInstance.state.set('createNew', true)
  },
  'click .history' (event, templateInstance) {
    event.preventDefault()
    const instanceId = templateInstance.$(event.currentTarget).attr('data-instance')
    templateInstance.state.set('instanceId', instanceId)
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
