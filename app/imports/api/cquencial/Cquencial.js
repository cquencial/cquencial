import { check } from 'meteor/check'
import { Meteor } from 'meteor/meteor'
import { Extensions } from '../extensions/Extensions'
import { Routes } from '../routes/Routes'
import { Bpmn } from 'meteor/cquencial:bpmn-engine'
import { Tracker } from 'meteor/tracker'
import { ACL } from '../acl/ACL'

export const Cquencial = {}
const internal = {}

internal._debug = false

Cquencial.debug = function debug (value) {
  check(value, Boolean)
  internal._debug = value
}

const publications = {}

publications.allExtensions = {
  name: 'cquencial.publications.extensions.all',
  schema: null
}

Cquencial.publications = publications

const to = {}

to.publicationName = function toPublicationName (value) {
  check(value, String)
  return `cquencial.publications.${value}`
}

to.methodName = function toMethodName (value) {
  check(value, String)
  return `cquencial.methods.${value}`
}

to.extMethodName = function toExtMethodName (extension, name) {
  const suffix = `${extension.ref.ns}.${name}`
  return to.methodName(suffix)
}

to.pathName = function toExtPathName (ns) {
  const path = ns.replace(/\./g, '/').replace(/\s+/g, '')
  return `/${path}`
}

Cquencial.to = to

const methods = {}

methods.setupRequired = {
  name: 'cquencial.methods.setupRequired',
  schema: null,
}

methods.update = {}
methods.update.extension = {
  name: 'cquencial.methods.update.extension',
  schema: {
    docId: String,
    key: {
      type:String,
      optional: true,
    },
    type: String,
  },
  roles: [ACL.defaults.manageSettings],
  group: ACL.defaults.groups.admins,
  types: {
    extension: 'extensions',
    hooks: 'hooks',
    methods: 'methods',
    publications: 'publications'
  }
}

Cquencial.methods = methods

const get = {}

get.extensions = function getExtensions (query = {}) {
  return Extensions.collection.find(query).fetch()
}

get.route = function getRoute (value) {
  if (!value) return '/undefined'
  try {
    const route = Routes.to[value]
    return route.route()
  } catch (e) {
    console.error(e)
    return '/undefined'
  }
}

Cquencial.get = get

const is = {}

is.active = function isActive (nameSpace) {
  return Extensions.collection.findOne({ns: nameSpace, isActive: true})
}

Cquencial.is = is

if (Meteor.isClient) {
import
  { SubsManager }
  from
  '../subscriptions/client/Subsmanager'
  const globalSubs = {}

  Meteor.startup(() => {

    // subscribe
    Tracker.autorun(() => {
      const allExtensions = SubsManager.subscribe(publications.allExtensions.name)
      globalSubs[publications.allExtensions.name] = allExtensions

      if (allExtensions.ready()) {
        console.log(`ready [${publications.allExtensions.name}]`)
      }
    })
  })

}