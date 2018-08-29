import { Template } from 'meteor/templating'
import {Bpmn} from 'meteor/cquencial:bpmn-engine'
import './instances.html'

Template.instances.helpers({

  instances () {
    return Bpmn.instances.collection.find()
  }
})

Template.instances.events({
  'click .stop-instance' (event, templateInstance) {
    event.preventDefault()
    const instanceId = $(event.currentTarget).attr('data-instance')
    Meteor.call('stopInstance', {instanceId})
  }
})
