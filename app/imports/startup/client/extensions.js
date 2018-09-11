import { Meteor } from 'meteor/meteor'
import { Tracker } from 'meteor/tracker'
import { Bpmn } from 'meteor/cquencial:bpmn-engine'
import { Cquencial } from '../../api/cquencial/Cquencial'

const extensions = Bpmn.extensions.getAll()

extensions.forEach(extension => {
  // subscribe
  Tracker.autorun(() => {
    const pubname = Cquencial.to.publicationName(extension.ref.ns)
    const handle = Meteor.subscribe(pubname)
    if (handle.ready()) {
      console.info(`ready [${pubname}]`)
    }
    return handle.ready()
  })
})
