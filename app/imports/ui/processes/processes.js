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
    return Bpmn.processes.collection.find({})
  },

  isRunning (instanceId) {
    return Bpmn.instances.collection.findOne({ instanceId })
  },
  isComplete (instanceId) {
    return false
  },
  hasTarget () {
    return !!Template.instance().state.get('target')
  },
  getTarget () {
    return Template.instance().state.get('target')
  },
  isTarget (instanceId) {
    return Template.instance().state.get('target') === instanceId
  },
  tab (name) {
    return Template.instance().state.get('tab') === name
  },
  historyCount (instanceId) {
    return Bpmn.history.collection.find({ instanceId }).count()
  },
  persistenceCount (instanceId) {
    return Bpmn.persistence.collection.find({ instanceId }).count()
  },
  pendingCount (instanceId) {
    return Bpmn.history.collection.find({ instanceId }).count()
  }
})

Template.processes.events({

  'click .resumeButton' (event) {
    event.preventDefault()
    const instanceId = $(event.currentTarget).attr('data-id')
    Meteor.call('resumeProcess', { instanceId })
  },
  'click .stopButton' (event) {
    event.preventDefault()
    const instanceId = $(event.currentTarget).attr('data-id')
    Meteor.call('stopInstance', { instanceId })
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
    Meteor.call('deletePersistentEntry', { instanceId })
  }
})
