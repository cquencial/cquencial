import { check, Match } from 'meteor/check'

export const Navigation = {}

// -------------------------------------------
// match helpers
const isTarget = t => !!targets[t]

// -------------------------------------------
// internals
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
function register (target, def) {
  check(target, Match.Where(isTarget))
  check(def, {
    name: String,
    path: String,
    label: Match.Maybe(String),
    icon: Match.Maybe(String),
  })
  internal[target][target.name] = def
}

Navigation.register = register

// -------------------------------------------
// get
function get (target, key) {
  check(target, Match.Where(isTarget))
  check(key, String)
  return internal[target][key]
}

Navigation.get = get

// -------------------------------------------
// getall
function getAll (target) {
  check(target, Match.Where(isTarget))
  return Object.values(internal[target])
}

Navigation.getAll = getAll
