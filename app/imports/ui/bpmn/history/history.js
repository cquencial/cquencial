import { Bpmn } from 'meteor/cquencial:bpmn-engine'

import './history.html'

Template.history.helpers({
  instances (instanceId) {
    return Bpmn.history.collection.find({instanceId})
  },
  isUnended (instanceId, elementId, eventName) {
    return eventName === 'wait' && Bpmn.history.collection.findOne({
      instanceId,
      elementId,
      eventName
    }) && !Bpmn.history.collection.findOne({
      instanceId,
      elementId,
      eventName: 'end'
    })
  },
  type (entry) {
    if (entry.eventName === 'resume' || entry.eventName === 'stop') return 'warning'
    if (entry.eventName === 'wait') return 'info'

    const processContext = entry.elementId === entry.processId
    if (processContext && (entry.eventName === 'start' || entry.eventName === 'end')) {
      return 'success'
    }
  }
})

Template.history.events({
  'click .continue' (event) {
    event.preventDefault()
    const current = $(event.currentTarget)
    const elementId = current.attr('data-target')
    const instanceId = current.attr('data-instance')
    Meteor.call('continue', {elementId, instanceId})
  }
})
