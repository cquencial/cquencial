import { Meteor } from 'meteor/meteor'
import { Bpmn } from 'meteor/cquencial:bpmn-engine'
import { isRegisteredUser } from '../../api/accounts/server/accountUtils'
import { Cquencial } from '../../api/cquencial/Cquencial'

const allExtensions = Bpmn.extensions.getAll()
allExtensions.forEach(extension => {
  const pubname = Cquencial.to.publicationName(extension.ref.ns)
  Meteor.publish(pubname, function () {
    if (!isRegisteredUser(this.userId)) {
      throw new Meteor.Error(403, 'Permission denied to subscribe.')
    }
    // abort here if extension is
    // deactivated / off
    if (!extension.isActive) {
      this.ready()
      return
    }
    const {collection} = extension.ref
    return collection.find()
  })
})
