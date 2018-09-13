import { check } from 'meteor/check'

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
