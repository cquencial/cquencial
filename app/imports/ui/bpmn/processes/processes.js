import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { ReactiveDict } from 'meteor/reactive-dict'
import { Bpmn } from 'meteor/cquencial:bpmn-engine'

import '../preview/preview'
import '../history/history'
import '../persistence/persistence'
import '../pending/pending'
import '../components/toggle/toggle'
import './processes.html'

const Tabs = {
  preview: 'preview',
  persistence: 'persistence',
  pending: 'pending',
  history: 'history'
}

Template.processes.onCreated(function () {
  const instance = this
  instance.state = new ReactiveDict()
  instance.state.set('target', null)
  instance.autorun(function () {

  })
})

Template.processes.helpers({
  hasProcesses () {
    return Bpmn.processes.collection.find({}).count() > 0
  },
  processes () {
    const postFilter = Template.getState('postFilter')
    return Bpmn.processes.collection.find(postFilter || {})
  },

  isRunning (instanceId) {
    return Bpmn.instances.collection.findOne({instanceId})
  },
  isComplete (instanceId, processId) {
    console.log(instanceId, processId)
    return Bpmn.history.collection.findOne({instanceId, elementId: processId, eventName: 'end'})
  },
  hasTarget () {
    return !!Template.getState('target')
  },
  getTarget () {
    return Template.getState('target')
  },
  isTarget (instanceId) {
    return Template.getState('target') === instanceId
  },
  tab (name) {
    return Template.getState('tab') === name
  },
  historyCount (instanceId) {
    return Bpmn.history.collection.find({instanceId}).count()
  },
  persistenceCount (instanceId) {
    return Bpmn.persistence.collection.find({instanceId}).count()
  },
  pendingCount (instanceId) {
    return 0
  },
  processState (state) {
    switch (state) {
      case Bpmn.States.running:
        return {icon: 'play', color: 'primary', label: 'Running'}
      case Bpmn.States.waiting:
        return {icon: 'bolt', color: 'info', label: 'Waiting'}
      case Bpmn.States.complete:
        return {icon: 'check', color: 'success', label: 'Complete'}
      case Bpmn.States.stopped:
        return {icon: 'stop', color: 'default', label: 'Stopped'}
      case Bpmn.States.cancelled:
        return {icon: 'times', color: 'warning', label: 'Cancelled'}
      case Bpmn.States.error:
        return {icon: 'excalamtion-triangle', color: 'danger', label: 'Error'}
      default:
        return {icon: 'question', color: 'default', label: 'Unknown'}
    }
  }
})

Template.processes.events({

  'click .resumeButton' (event) {
    event.preventDefault()
    const instanceId = $(event.currentTarget).attr('data-id')
    Meteor.call('resumeProcess', {instanceId})
  },
  'click .stopButton' (event) {
    event.preventDefault()
    const instanceId = $(event.currentTarget).attr('data-id')
    Meteor.call('stopInstance', {instanceId})
  },

  'click .set-target' (event, templateInstance) {
    event.preventDefault()
    const target = $(event.currentTarget).attr('data-target')

    if (templateInstance.state.get('target') === target) {
      templateInstance.state.set('target', null)
    } else {
      templateInstance.state.set('tab', Tabs.preview)
      templateInstance.state.set('target', target)
    }
  },

  'click .tab-target' (event, templateInstance) {
    event.preventDefault()

    const target = $(event.currentTarget).attr('data-target')
    if (templateInstance.state.get('tab') !== target) {
      templateInstance.state.set('tab', target)
    }
  },

  'click .delete-persistent-entry' (event) {
    event.preventDefault()
    const instanceId = $(event.currentTarget).attr('data-target')
    Meteor.call('deletePersistentEntry', {instanceId})
  }
})
