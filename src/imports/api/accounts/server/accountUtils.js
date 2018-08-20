import {Meteor} from 'meteor/meteor'

export const hasUsers = () => Meteor.users.find().count() > 0

export const isRegisteredUser = userId => userId && Meteor.users.findOne(userId)

export const hasRole = (userId, role, group) => Roles.userIsInRole(userId, role, group)