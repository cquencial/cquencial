import { Meteor } from 'meteor/meteor'
import { Tracker } from 'meteor/tracker'
import { Bpmn } from 'meteor/cquencial:bpmn-engine'
import { Cquencial } from '../../api/cquencial/Cquencial'
import { Routes } from '../../api/routes/Routes'
import { Navigation } from '../../api/navigation/Navigation'
import {loggedIn, toLogin} from '../../ui/utils/routeTriggers'

const extensions = Bpmn.extensions.getAll()
extensions.forEach(entry => {
  const extension = entry.ref
  // subscribe
  Tracker.autorun(() => {
    const pubname = Cquencial.to.publicationName(extension.ns)
    const handle = Meteor.subscribe(pubname)
    if (handle.ready()) {
      console.info(`ready [${pubname}]`)
    }
    return handle.ready()
  })

  // create routes
  const extRoute = {
    name: extension.name,
    label: extension.label || extension.name,
    path: Cquencial.to.pathName(extension.ns),
    icon: extension.icon || 'code-fork',
    template () {
      import '/imports/ui/pages/extension/extension.js'
    },
    enter: [toLogin],
    navigation: () => loggedIn() && Cquencial.is.active(extension.ns),
    target: Navigation.targets.left,
  }
  Routes.define(extension.ns,  extRoute)
  Navigation.register(extRoute.target, extRoute)
})
