/* global AutoForm */
import { Tracker } from 'meteor/tracker'
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import SimpleSchema from 'simpl-schema'
import { Routes } from '../../../api/routes/Routes'
import './login.html'
import { Connection } from '../../../api/connection/Connection'
import { resultHandler } from '../../utils/resultHandlers'

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

    Connection.login(insertDoc.username, insertDoc.password, resultHandler({
      expectRes: false,
      onRes: (res) => {
        console.log('connected:', res, Meteor.user())
        const redirect = Routes.queryParam('redirect')
        if (redirect) {
          Routes.go(decodeURIComponent(redirect))
        } else {
          Routes.to.root.go()
        }
      }
    }))
  }
})