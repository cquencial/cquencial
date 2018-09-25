import { check } from 'meteor/check'
import { Extensions } from '../extensions/Extensions'
import { Routes } from '../routes/Routes'

export const Cquencial = {}
const internal = {}

internal._debug = false

Cquencial.debug = function debug (value) {
  check(value, Boolean)
  internal._debug = value
}

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

Cquencial.to = to

const methods = {}

methods.setupRequired = {
  name: 'cquencial.methods.setupRequired',
  schema: null,
}

Cquencial.methods = methods

const get = {}

get.extensions = function getExtensions ({onlyActive = false}) {
  return Extensions.collection.find({}).fetch()
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
