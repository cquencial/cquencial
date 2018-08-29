import { Bpmn } from 'meteor/cquencial:bpmn-engine'
import { Tracker } from 'meteor/tracker'

import SimpleSchema from 'simpl-schema'

import '../components/modal/modal'
import './pending.html'

let currentSchema

function getFieldType (t) {
  if (t === 'string') return String
  if (t === 'long') return Number
  return String
}

function toSchema (form) {
  const schema = {}

  if (form.fields) {
    form.fields.forEach(field => {
      schema[field.id] = {
        type: getFieldType(field.type),
        label: field.label || field.id
      }
    })
  }

  if (form.key) {
    schema['someId'] = {
      type: String,
      label: `Some String input for form ${form.key}`
    }
  }
  return new SimpleSchema(schema, { tracker: Tracker })
}

Template.pending.onCreated(function () {
  const instance = this
  instance.state = new ReactiveDict()
  instance.autorun(function () {
    const data = Template.currentData()

    const { instanceId } = data

    // TODO IMPLEMENT A SUBSCRIPTIONS INSTEAD
    Meteor.call('getPending', { instanceId }, (err, res) => {
      console.log(res)
      if (!res) return
      const filtered = []
      res.definitions.forEach(definition => {
        definition.children.forEach(child => {
          filtered.push(child)
        })
      })
      instance.state.set('pending', filtered)
    })
  })
})

Template.pending.helpers({
  entries () {
    return Template.instance().state.get('pending')
  },
  formSchemaReady () {
    return Template.instance().state.get('formSchemaReady')
  },
  formSchema () {
    return currentSchema
  }
})

Template.pending.events({
  'click .signal-button' (event) {
    event.preventDefault()
    const current = $(event.currentTarget)
    const elementId = current.attr('data-target')
    const instanceId = current.attr('data-instance')
    Meteor.call('continue', { elementId, instanceId })
  },

  'click .form-button' (event, templateInstance) {
    event.preventDefault()
    templateInstance.state.set('formSchemaReady', false)
    const targetId = $(event.currentTarget).attr('data-target')
    const pending = templateInstance.state.get('pending')
    const formTask = pending.find(el => el.id === targetId)
    currentSchema = toSchema(formTask.form)
    templateInstance.state.set('formSchemaReady', true)
    $('#formModal').modal('show')
  }
})
