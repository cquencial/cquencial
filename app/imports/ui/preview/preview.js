import Viewer from 'bpmn-js/lib/Viewer'

import './preview.css'
import './preview.html'

const refs = {
  viewer: null,
  container: null
}

Template.preview.onCreated(function () {
  const instance = this
  instance.state = new ReactiveDict()

  instance.autorun(function () {
    const data = Template.currentData()

    const { instanceId } = data
    const processDoc = Bpmn.processes.collection.findOne({instanceId})
    const loaded = instance.state.get('loaded')

    if (loaded) {
      const history = Bpmn.history.collection.find({instanceId}).fetch()
      const waiting = history.filter(e => e.eventName === 'wait')
      const ended = history.filter(e => e.eventName === 'end')
      const taken = history.filter(e => e.eventName === 'taken')

      refs.viewer.importXML(processDoc.source, function (err, res) {
        const canvas = refs.viewer.get('canvas')

        waiting.forEach((entry) => {
          const {elementId} = entry
          canvas.addMarker(elementId, 'waiting-element')
        })

        taken.forEach((entry) => {
          const {elementId} = entry
          canvas.addMarker(elementId, 'taken-element')
        })

        ended.forEach((entry) => {
          const {elementId} = entry
          canvas.addMarker(elementId, 'completed-element')
        })
      })
    }
  })
})

Template.preview.helpers({
  loaded () {
    return Template.instance().state.get('loaded')
  }
})

Template.preview.onRendered(function () {
  if (!refs.container) {
    refs.container = $('#viewer-target')
    refs.viewer = new Viewer({
      container: refs.container
    })
    this.state.set('loaded', true)
  }
})

Template.preview.onDestroyed(function () {
  refs.container = null
  refs.viewer = null
  this.state.set('loaded', false)
})
