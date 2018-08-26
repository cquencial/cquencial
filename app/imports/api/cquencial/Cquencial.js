import {check} from 'meteor/check'

export const Cquencial = {}
const internal = {}

internal._debug = false

Cquencial.debug = function debug(value) {
  check(value, Boolean)
  internal._debug = value
}
