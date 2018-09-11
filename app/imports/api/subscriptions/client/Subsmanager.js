import { Meteor } from 'meteor/meteor'
import { ReactiveVar } from 'meteor/reactive-var'
import { SubsCache } from 'meteor/ccorcos:subs-cache'

export const SubsManager = {

  connection: null,

  remotePubs: {},

  remotePublication (pubName) {
    return this.remotePubs[pubName]
  },

  remotesLoaded: new ReactiveVar(false),

  // ////////////////////////////////////////////////////////////////
  //
  // SUBSCRIPTION MANAGEMENT
  //
  // ////////////////////////////////////////////////////////////////

  subs: {},

  subsCache: null,

  _users: {},

  addUsers (userIds) {
    if (!this._userSub) {
      throw new Error('invalid call to addUsers, add first a subscription to a user publication to use this function')
    }
    let changed = false
    userIds.forEach(userId => {
      if (!this._users[userId]) {
        this._users[userId] = true
        changed = true
      }
    })
    if (changed) {
      // re-subscribe with new users array
      const userIds = Object.keys(this._users)
      return this.subscribe(this._userSub, {userIds})
    } else {
      return this.getSubscriptionHandle(this._userSub).handle
    }
  },

  _userSub: null,

  addUserSub (name, options) {
    this._userSub = name
    return this.subscribe(name, options)
  },

  getSubsCache () {
    if (!this.subsCache) {
      this.subsCache = new SubsCache(50, 50, false)
    }
    return this.subsCache
  },

  subscribe (publicationName, options = {}) {
    if (!Meteor.isClient) throw new Meteor.Error(this.errors.EXECUTION_CLIENT_ONLY)

    if (this.hasSubscribedTo(publicationName)) {
      const existingSub = this.getSubscriptionHandle(publicationName)
      if (JSON.stringify(existingSub.options) === JSON.stringify(options)) {
        return existingSub.handle
      }
    }

    return this.createHandle(publicationName, options)
  },

  createHandle (publicationName, opts) {
    const options = opts || {}
    if (this.connection) {
      options.remotesLoaded = this.remotesLoaded.get()
      options.isRemote = this.remotePublication(publicationName)
    }

    const callbacks = {
      onStop (e) {
        if (e) {
          console.error(e)
          window.alertbox('danger', `${i18n.get(e.reason || e.message)} ${i18n.get(e.details || '')}`)
        }
      },
    }

    const handle = options.isRemote
      ? this.connection.subscribe(publicationName, options)
      : this.getSubsCache().subscribe(publicationName, options, callbacks)

    this.subs[publicationName] = {
      handle,
      options,
    }

    return handle
  },

  unsubscribe (publicationName) {
    if (!Meteor.isClient) {
      throw new Meteor.Error(this.errors.EXECUTION_CLIENT_ONLY)
    }
    if (!this.hasSubscribedTo(publicationName)) { return false }

    const {handle} = this.getSubscriptionHandle(publicationName)
    handle.stopNow()
    delete this.subs[publicationName]

    return !this.hasSubscribedTo(publicationName)
  },

  stopAll () {
    const allSubs = Object.values(this.subs)
    for (const sub of allSubs) {
      sub.handle.stop()
    }
    this.subs = {}
  },

  hasSubscribedTo (publicationName) {
    return !!(this.subs[publicationName])
  },

  getSubscriptionHandle (publicationName) {
    return this.subs[publicationName]
  },
}