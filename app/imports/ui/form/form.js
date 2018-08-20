import {Tracker} from 'meteor/tracker'
import SimpleSchema from 'simpl-schema'
import './form.css'
import './form.html'

SimpleSchema.extendOptions(['autoform'])

const hooks = {}

const workflowFormSchema = new SimpleSchema({
  data: {
    type: String,
    autoform: {
      type: 'bpmn'
    }
  }
})

Template.form.onCreated(function () {
  this.autorun(function () {
    // console.log(Template.currentData())
    const {onCreated} = Template.currentData()
    hooks['onCreated'] = onCreated
  })
})

Template.form.helpers({
  schema () {
    console.log('get schema')
    return workflowFormSchema
  }
})

Template.form.events({
  'submit #workflowForm' (event) {
    event.preventDefault()
    const wfForm = AutoForm.getFormValues('workflowForm')
    console.log(wfForm)
    hooks.onCreated.call(null, wfForm.insertDoc.data)
  }
})
