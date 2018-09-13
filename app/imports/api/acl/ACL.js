import { Mongo } from 'meteor/mongo'
import { Meteor } from 'meteor/meteor'

export const ACL = {}

const roles = {
  name: 'aclRoles',
  collection: new Mongo.Collection('aclRoles'),
  schema: {
    name: String
  }
}

const groups = {
  name: 'aclGroups',
  collection: new Mongo.Collection('aclGroups'),
  schema: {
    name: String
  }
}

ACL.roles = roles
ACL.groups = groups

const defaults = {}
defaults.roles = {
  readRoles: 'readRoles',
  manageRoles: 'manageRoles',
  readSettings: 'readSettings',
  manageSettings: 'manageSettings'
}

defaults.groups = {
  admins: 'manage'
}

ACL.defaults = defaults

const methods = {}
methods.get = {
  name: 'cquencial.acl.methods.get',
  roles: [defaults.roles.manageRoles, defaults.roles.readRoles],
  schema: roles.schema,
  run (role) {
    const existingRole = roles.collection.findOne({name: role})
    if (existingRole) {
      return existingRole._id
    }
    return roles.collection.insert({name: role})
  }
}
methods.add = {
  name: 'cquencial.acl.methods.add',
  roles: [defaults.roles.manageRoles],
  schema: roles.schema,
  run (role) {
    const existingRole = roles.collection.findOne({name: role})
    if (existingRole) {
      return existingRole._id
    }
    return roles.collection.insert({name: role})
  }
}
methods.update = {
  name: 'cquencial.acl.methods.update',
  roles: [defaults.roles.manageRoles],
  schema: {
    _id: String,
    name: String
  },
  run (role) {
    const existingRole = roles.collection.findOne(_id)
    if (!existingRole) {
      throw new Meteor.Error(500, 'Expected role to exist')
    }
    return roles.collection.update(_id, {$set: {name}})
  }
}
methods.remove = {
  name: 'cquencial.acl.methods.remove',
  roles: [defaults.roles.manageRoles],
  schema: {
    _id: String
  },
  run (_id) {
    return roles.collection.remove({_id})
  }
}
ACL.methods = methods

const publications = {}

publications.allRoles = {
  name: 'cquencial.acl.publications.allRoles',
  roles: [defaults.roles.manageRoles, defaults.roles.readRoles],
  run() {
    return roles.collection.find()
  }
}

publications.allGroups = {
  name: 'cquencial.acl.publications.allGroups',
  roles: [defaults.roles.manageRoles, defaults.roles.readRoles],
  run() {
    return groups.collection.find()
  }
}

ACL.publications = publications