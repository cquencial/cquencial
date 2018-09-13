import { SubsManager } from './Subsmanager'

class AdditiveSub {
  constructor (name) {
    this.name = name
    this.entries = {}
  }

  add (ids) {
    let changed = false
    ids.forEach(_id => {
      if (!this.entries[_id]) {
        this.entries[_id] = true
        changed = true
      }
    })
    if (changed) {
      // re-subscribe with new users array
      const allIds = Object.keys(this.entries)
      return SubsManager.subscribe(this.name, {allIds})
    } else {
      return SubsManager.handle(this.name).handle
    }
  }
}

export const AdditiveSubscriptions = {
  create ({publicationName}) {
    return new AdditiveSub(publicationName)
  }
}
