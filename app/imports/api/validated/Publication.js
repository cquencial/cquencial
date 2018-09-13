import { Meteor } from 'meteor/meteor'
import { check, Match } from 'meteor/check'
import { isRegisteredUser, hasRole } from '../accounts/server/accountUtils'

const itExists = x => !!x
const itHasRoles = r => {
  if (!r) return true
  check(r, [String])
  return true
}
/**
 * Simple validated publication. Not a full generic solution such as ValidatedMethod.
 * @type {ValidatedPublication}
 */
export const ValidatedPublication = class ValidatedPublication {
  constructor (definitions) {
    check(definitions, Match.Where(itExists))
    check(definitions.name, String)
    check(definitions.run, Function)
    check(definitions.validate, Function)
    check(definitions.isPublic, Match.Maybe(Boolean))
    check(definitions.roles, Match.Where(itHasRoles))
    check(definitions.group, Match.Maybe(String))
    const def = Object.assign({}, definitions)

    const validatedFunc = function validatedPublication (...args) {
      check(args, Match.Any()) // prevent audit all arguments error
      const self = this
      if (def.validate.call(self, ...args) !== void 0) {
        throw new Error('Did you mean to throw an error?')
      }
      if (!def.isPublic) {
        const {userId} = self
        if (!isRegisteredUser(userId)) {
          throw new Meteor.Error(403, 'Permission denied, please login or register.')
        }
        if (def.roles && !hasRole(userId, def.roles, def.group)) {
          throw new Meteor.Error(403, 'Permission denied, not in role/group.')
        }
      }
      const cursor = def.run.call(self, ...args)
      if (cursor && cursor.count && cursor.count() >= 0) {
        return cursor
      } else {
        this.ready()
      }
    }
    Meteor.publish(defs.name, validatedFunc)
    return validatedFunc
  }
}
