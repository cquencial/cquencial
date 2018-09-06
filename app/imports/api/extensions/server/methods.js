import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import Events from 'events'

// BPMN
import { Bpmn } from 'meteor/cquencial:bpmn-engine'
import camundaBpmnModdle from 'camunda-bpmn-moddle/resources/camunda'

// API IMPORTS
import { ServiceContext } from '../../context/ServiceContext'

const EventEmitter = Events.EventEmitter

Meteor.methods({
  // code to run on server at startup
  'startProcess' ({source}) {
    try {
      console.log(source)

      const engine = new Bpmn.Engine({
        source,
        moddleOptions: {
          camunda: camundaBpmnModdle
        }
      }, (err) => { console.log(err) })

      const listener = new EventEmitter()
      listener.on('error', (err, displayErr) => {
        console.error(err)
        console.log(displayErr)
      })

      listener.on('wait', (element, instance) => {
        console.log(element.form)
      })

      engine.on('error', (err, displayErr) => {
        console.error(err)
        console.log(displayErr)
      })

      engine.execute({
        userId: this.userId,
        listener,
        variables: {
          startedBy: this.userId
        },
        services: ServiceContext
      }, (err) => { console.log(err) })
    } catch (errrr) {
      console.error(errrr)
    }
  },

  getState ({instanceId}) {
    if (!Bpmn.instances.has(instanceId)) { throw new Error('no instance') }
    const instance = Bpmn.instances.get(instanceId)
    return JSON.stringify(instance.getState(), null, 2)
  },

  resumeProcess: function (queryDoc) {
    const {instanceId} = queryDoc
    const processInstanceDoc = Bpmn.persistence.collection.findOne({instanceId})
    const persistenceDoc = Bpmn.persistence.load(processInstanceDoc._id)

    console.log(persistenceDoc.state)

    Bpmn.Engine.resume(persistenceDoc.state, {
      instanceId: persistenceDoc.instanceId,
      persistenceId: persistenceDoc.persistenceId
    })
  },

  stopInstance (queryDoc) {
    check(queryDoc, {
      instanceId: String
    })
    const {instanceId} = queryDoc
    const instance = Bpmn.instances.get(instanceId)
    instance.stop()
    console.log(instanceId, Bpmn.instances.collection.findOne({instanceId}), !!Bpmn.instances.get(instanceId))
  },

  continue (queryDoc) {
    check(queryDoc, {
      instanceId: String,
      elementId: String
    })
    const {instanceId} = queryDoc
    const {elementId} = queryDoc

    if (!Bpmn.instances.has(instanceId)) { throw new Error('no instance') }

    const instance = Bpmn.instances.get(instanceId)
    return instance.signal(elementId)
  },

  deletePersistentEntry ({instanceId}) {
    check(instanceId, String)
    const instance = Bpmn.instances.get(instanceId)
    if (instance) instance.stop()
    Bpmn.processes.collection.remove({instanceId})
    Bpmn.persistence.collection.remove({instanceId})
    Bpmn.history.collection.remove({instanceId})
  },

  deleteAll () {
    Bpmn.instances.clear()
    Bpmn.processes.collection.remove({})
    Bpmn.persistence.collection.remove({})
    Bpmn.history.collection.remove({})
  },

  getPending ({instanceId}) {
    check(instanceId, String)
    if (!Bpmn.instances.has(instanceId)) {
      throw new Error('no instance')
    }

    const instance = Bpmn.instances.get(instanceId)
    return instance.getPendingActivities()
  }
})