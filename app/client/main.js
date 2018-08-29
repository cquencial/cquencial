import { Bpmn } from 'meteor/cquencial:bpmn-engine'
import {Tracker} from 'meteor/tracker'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css'

// STARTUP IMPORTS
import '../imports/startup/both'
import '../imports/startup/client'

// TEMPLATE IMPORTS
import '../imports/ui/layout/nav/nav'
import './main.html'

import { Cquencial } from '../imports/api/cquencial/Cquencial'


const extensions = Bpmn.extensions.getAll()
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
