import { DDP } from 'meteor/ddp-client'
import { Meteor } from 'meteor/meteor'

let _connection = Meteor.connection

export const Connection = {

  set (url, callback) {
    _connection = DDP.connect(url)
    console.log(_connection)
  },

  get () {
    return _connection
  },

  call (...args) {
    _connection.call(...args)
  },

  userId () {
    if (_connection === Meteor.connection) {
      return Meteor.userId()
    } else {
      return _connection._userId
    }
  },

  login (username, password, callback) {
    function _callback (error) {
      if (!error) {
        callback.call(this, null, _connection)
      } else {
        callback.call(this, error, null)
      }
    }

    if (_connection === Meteor.connection) {
      Meteor.loginWithPassword(username, password, _callback)
    } else {
      DDP.loginWithPassword(_connection, {username}, password, _callback)
    }
  }
}
