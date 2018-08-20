import {Bpmn} from 'meteor/cquencial:bpmn-engine'

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
