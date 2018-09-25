import { check, Match } from 'meteor/check'

export const Navigation = {}

// -------------------------------------------
// match helpers
// -------------------------------------------

const isTarget = t => !!targets[t]

const isNavigationRoute = route => {
  if (!route) return false
  check(route.name, String)
  check(route.path, String)
  check(route.label, Match.Maybe(String))
  check(route.icon, Match.Maybe(String))
  return true
}
// -------------------------------------------
// internals
// -------------------------------------------

const internal = {}
const targets = {
  left: 'left',
  right: 'right',
  home: 'home'
}

Navigation.targets = Object.assign({}, targets)

Object.values(targets).forEach(targetKey => {
  internal[targetKey] = {}
})

// -------------------------------------------
// register
// -------------------------------------------

function register (target, def) {
  check(target, Match.Where(isTarget))
  check(def, Match.Where(isNavigationRoute))
  internal[target][def.name] = def
}

Navigation.register = register

// -------------------------------------------
// get
// -------------------------------------------

function get (target, key) {
  check(target, Match.Where(isTarget))
  check(key, String)
  return internal[target][key]
}

Navigation.get = get

// -------------------------------------------
// getall
// -------------------------------------------

function getAll (target) {
  check(target, Match.Where(isTarget))
  return Object.values(internal[target])
}

Navigation.getAll = getAll
