/* global Roles */
import { Meteor } from 'meteor/meteor'
import { Tracker } from 'meteor/tracker'
import { FlowRouter } from 'meteor/ostrio:flow-router-extra'
import { check, Match } from 'meteor/check'

const isObj = x => x ? typeof x === 'object' && !typeof x === 'function' : true

const internal = {}
internal.instances = {}

export const triggers = {}

export const Routes = {}
Routes.templatePath = '/imports/ui/pages/'
Routes.defaultTarget = 'main'

function create ({path, name, label, template, roles, group, enter = []}) {
  return {
    label,
    path,
    name,
    roles,
    group,
    template,
    route (params, queryParams) {
      if (!params && !queryParams) {
        return path
      }
      let _route = path
      Object.keys(params).forEach(key => {
        const re = new RegExp(`:${key}`)
        _route = _route.replace(re, params[key])
      })
      if (queryParams) {
        let qp = '?'
        Object.keys(queryParams).forEach(key => {
          qp += `${key}=${queryParams[key]}`
        })
        _route += qp
      }
      return _route
    },
    permission () {
      if (!roles && !group) {
        return true
      }
      const user = Meteor.user()
      return user && Roles.userIsInRole(user._id, roles, group)
    },
    go (params, queryParams) {
      const route = this.route(params, queryParams)
      FlowRouter.go(route)
    },
    triggersEnter () { return enter }
  }
}

function add (route) {
  const path = route.route()
  return FlowRouter.route(path, {
    triggersEnter: route.triggersEnter(),
    name: route.name,
    whileWaiting () {
      import '../../ui/components/login/login'
      this.render(route.target || Routes.defaultTarget, 'loginForm', {title: route.label})
    },
    waitOn () {
      return route.template()
    },
    action (params, queryParams) {
      Tracker.autorun(() => {
        if (route.roles && Roles.subscription.ready()) {
          route.permission()
        }
      })
      const data = route.data || {}
      data.params = params
      data.queryParams = queryParams
      this.render(route.target || Routes.defaultTarget, route.name, data)
    },
  })
}

// -------------------------------------------
// define

const isRoute = def => {
  if (!def) return false
  check(def.path, String)
  check(def.name, String)
  check(def.label, String)
  check(def.template, Function)
  check(def.roles, Match.Maybe([String]))
  check(def.group, Match.Maybe(String))
  check(def.enter, Match.Maybe([Function]))
  return true
}

function define (key, def) {
  check(def, Match.Where(isRoute))
  const route = create(def)
  internal.instances[key] = add(route)
  internal[key] = route
}

Routes.define = define

// -------------------------------------------
// to
Routes.to = new Proxy(internal, {
  get: function (obj, prop) {
    if (!obj[prop]) {
      throw new Error(`Could not find route by key [${prop}]`)
    }
    return obj[prop]
  }
})

Routes.location = function location () {
  return FlowRouter.current().path
}

Routes.go = function go (fullpath) {
  FlowRouter.go(fullpath)
}

Routes.queryParams = function queryParams () {
  return FlowRouter.current().queryParams
}

Routes.queryParam = function (key) {
  const methoda = FlowRouter.getQueryParam(key)
  if (methoda) return methoda

  const methodb = FlowRouter.current().queryParams
  return methodb && methodb[key]
}
