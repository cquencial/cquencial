/* global AutoForm */
import { Tracker } from 'meteor/tracker'
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import SimpleSchema from 'simpl-schema'
import { Routes } from '../../../api/routes/Routes'
import './login.html'

const loginSchema = new SimpleSchema({
  username: {
    type: String,
    autoform: {
      name: 'name'
    }
  },
  password: {
    type: String,
    autoform: {
      name: 'current-password',
      type: 'password'
    }
  }
}, {tracker: Tracker})

Template.login.helpers({
  loginSchema () {
    return loginSchema
  }
})

Template.login.events({
  'submit #loginForm' (event) {
    event.preventDefault()

    const {insertDoc} = AutoForm.getFormValues('loginForm')
    Meteor.loginWithPassword(insertDoc.username, insertDoc.password, (err, res) => {
      if (err) {
        console.error(err)
      }
      const redirect = Routes.queryParam('redirect')
      if (redirect) {
        Routes.go(decodeURIComponent(redirect))
      } else {
        Routes.to.root.go()
      }
    })
  }
})