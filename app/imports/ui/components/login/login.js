/* global AutoForm */
import { Tracker } from 'meteor/tracker'
import {Meteor} from 'meteor/meteor'
import {Template} from 'meteor/templating'
import SimpleSchema from 'simpl-schema'
import './login.html'

const loginSchema = new SimpleSchema({
  username: {
    type: String
  },
  password: {
    type: String,
    autoform: {
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
      console.log(err, res)
    })
  }
})
