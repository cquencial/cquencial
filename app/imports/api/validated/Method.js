import { Meteor } from 'meteor/meteor'
import { ValidatedMethod } from 'meteor/mdg:validated-method'

import { hasUsers, isRegisteredUser, hasRole } from '../accounts/accountUtils'
import { CommonErrors } from '../errors/Errors'

/**
 * Mixin tomake every validated method automatically check if the running user is registered.
 * @param options
 */
const PermissionsMixin = function (options) {
  const runFct = options.run
  options.run = function run (...args) {
    const {userId} = this
    const permission = options.permission && options.permission(...args)

    // user is not a registered user and there is no
    // exeptional permission, throw a permission denied error
    if (hasUsers() && !isRegisteredUser(userId) && !permission) {
      throw new Meteor.Error(...CommonErrors.permissionDenied())
    }

    return runFct.call(this, ...args)
  }
  return options
}

/**
 * Mixin to check permissions of execution by given roles.
 * If no role is defined on the methos, no checks will be performed.
 * @param options
 */
const RoleMixin = function (options) {
  if (options.role) {
    const runFct = options.run
    options.run = function run (...args) {
      const {userId} = this
      const {roles} = options

      // CHECK ROLES
      if (!hasRole(userId, roles)) {
        throw new Meteor.Error(...CommonErrors.permissionDenied())
      }

      return runFct.call(this, ...args)
    }
  }

  return options
}

/**
 * Mixin to allow injecing an error logger before rethrowing the original error.
 * @param options
 */
const ErrorLogMixin = function (options) {
  // OVERRIDE RUN
  const originalRun = options.run
  options.run = function (...args) {
    try {
      return originalRun.call(this, ...args)
    } catch (error) {
      if (options.log) {
        options.log({
          userId: this.userId,
          client: Meteor.isClient,
          server: Meteor.isServer,
          errorInstance: error
        })
      }
      throw error
    }
  }
  return options
}

/**
 * Extend validated method and inject mixins.
 */
export default class ExtendedValidatedMethod extends ValidatedMethod {
  constructor (methodDefinition) {
    // ADD DEFAULT MIXINS
    if (Array.isArray(methodDefinition.mixins)) {
      methodDefinition.mixins = methodDefinition.mixins.concat(PermissionsMixin, RoleMixin, ErrorLogMixin)
    } else {
      methodDefinition.mixins = [PermissionsMixin, RoleMixin, ErrorLogMixin]
    }

    super(methodDefinition)
  }
}
