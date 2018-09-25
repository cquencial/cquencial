import { Bpmn } from 'meteor/cquencial:bpmn-engine'

import './tasklist.html'

Template.tasklist.helpers({
  entries () {
    return Bpmn.tasklist.collection.find({})
  }
})
