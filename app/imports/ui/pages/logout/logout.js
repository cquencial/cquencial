import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { Routes } from '../../../api/routes/Routes'
import './logout.html'

Template.logout.onCreated(function onLogoutCreated () {
  Meteor.logout((err) => {
    if (err) {
      console.error(err)
      // TODO show modal
    } else {
      Routes.to.login.go()
    }
  })
})