import { ReactiveDict } from 'meteor/reactive-dict'
import { Bpmn } from 'meteor/cquencial:bpmn-engine'

import './persistence.html'

Template.persistence.onCreated(function () {
  const instance = this
  instance.state = new ReactiveDict()
  instance.autorun(function () {

  })
})

Template.persistence.helpers({
  entries (instanceId) {
    return Bpmn.persistence.collection.find({ instanceId })
  }
})

Template.persistence.events({})
