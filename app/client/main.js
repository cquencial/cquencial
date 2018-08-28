import {Meteor} from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { Session } from 'meteor/session'
import { ReactiveDict } from 'meteor/reactive-dict'
import { Bpmn } from 'meteor/cquencial:bpmn-engine'
import {Tracker} from 'meteor/tracker'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css'

// STARTUP IMPORTS
import '../imports/startup/both'
import '../imports/startup/client'

import '../imports/ui/processes/processes'
import '../imports/ui/tasklist/tasklist'

import '../imports/ui/components/form/form'
import '../imports/ui/components/login/login'

import './main.html'
import { Notifications } from '../imports/api/notifications/Notifications'
import { Cquencial } from '../imports/api/cquencial/Cquencial'


const extensions = Bpmn.extensions.getAll()
console.log(extensions)
extensions.forEach(extension => {
  Tracker.autorun(() => {
    const pubname = Cquencial.to.publicationName(extension.ref.ns)
    const handle = Meteor.subscribe(pubname)
    if (handle.ready()) {
      console.info(`ready [${pubname}]`)
    }
    return handle.ready()
  })
})
