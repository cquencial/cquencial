import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import { hasUsers, isRegisteredUser } from '../accounts/accountUtils'
import { UserUtils } from '../accounts/UserUtils';

/**
 * Mixin tomake every validated method automatically check if the running user is registered.
 * @param options
 */
const PermissionsMixin = function (options) {
  const runFct = options.run;
  options.run = function run(...args) {
    const { userId } = this;
    const exception = options.permission && options.permission(...args);

    // user permission
    if (hasUsers() && !isRegisteredUser(userId)) {
      if (!exception) throw new Meteor.Error('403', `${options.name}: ${CommonErrors.noPermission}`);
    }

    return runFct.call(this, ...args);
  };
  return options;
};

/**
 * Mixin to check permissions of execution by given roles.
 * @param options
 */
const RoleMixin = function (options) {
  if (options.role) {
    const runFct = options.run;
    options.run = function run(...args) {
      const { userId } = this;
      const { role } = options;

      // CHECK ROLES
      if (!UserUtils.hasAtLeastRole(this.userId, role)) {
        throw new Meteor.Error('403', CommonErrors.notInRole);
      }

      return runFct.call(this, ...args);
    };
  }

  return options;
};

/**
 * Mixin to allow injecing an error logger before rethrowing the original error.
 * @param methodDefinition
 */
const ErrorLogMixin = function (methodDefinition) {
  // OVERRIDE RUN
  const originalRun = methodDefinition.run;
  methodDefinition.run = function (...args) {
    try {
      return originalRun.call(this, ...args);
    } catch (error) {
      if (this.userId) {
        const errorLogObj = {
          userId: this.userId,
          isClient: false,
          code: error.code || 'undefined',
          level: LogLevel.error.name,
          errorInstance: error,
        };
        logAndReturnError(errorLogObj);
      }
      throw error;
    }
  };
  return methodDefinition;
};

/**
 * Extend validated method and inject mixins.
 */
export default ExtendedValidatedMethod = class ExtendedValidatedMethod extends ValidatedMethod {
  constructor(methodDefinition) {
    // ADD DEFAULT MIXINS
    if (Array.isArray(methodDefinition.mixins)) {
      methodDefinition.mixins = methodDefinition.mixins.concat(PermissionsMixin, RoleMixin, ErrorLogMixin);
    } else {
      methodDefinition.mixins = [PermissionsMixin, RoleMixin, ErrorLogMixin];
    }

    super(methodDefinition);
  }
};