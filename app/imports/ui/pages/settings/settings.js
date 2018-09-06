import './settings.html'
import { Routes } from '../../../api/routes/Routes'

Template.settings.onCreated(function onSettingsCreated() {
  const instance = this
  instance.state.set('current', null)
  instance.autorun(() => {

    const query = Routes.queryParam('section')
    instance.state.set('current', query)
  })
})

Template.settings.helpers({
  current(key) {
    return Template.getState('current') === key
  }
})
