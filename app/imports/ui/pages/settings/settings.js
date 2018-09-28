import { Meteor } from 'meteor/meteor'
import {Template} from 'meteor/templating'
import { Routes } from '../../../api/routes/Routes'
import { Cquencial } from '../../../api/cquencial/Cquencial'

import './settings.html'
import { resultHandler } from '../../utils/resultHandlers'

Template.settings.onCreated(function onSettingsCreated () {
  const instance = this
  instance.state.set('current', null)
  instance.autorun(() => {

    const query = Routes.queryParam('section')
    instance.state.set('current', query)
  })
})

Template.settings.helpers({
  current (key) {
    return Template.getState('current') === key
  }
})

Template.settings.events({
  'click .toggle-button' (event, templateInstance) {
    event.preventDefault()
    const target = templateInstance.$(event.currentTarget)
    const docId = target.data('doc')
    const key = target.data('target')
    const type = target.data('type')

    Meteor.call(Cquencial.methods.update.extension.name, {docId, key, type}, resultHandler({}))
  }
})
