import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { Bpmn } from 'meteor/cquencial:bpmn-engine'
import Events from 'events'
import camundaBpmnModdle from 'camunda-bpmn-moddle/resources/camunda'
import SimpleSchema from 'simpl-schema'

// API IMPORTS
import { ServiceContext } from '../../context/ServiceContext'
import ValidatedMethod from '../../validated/Method'
import { Cquencial } from '../../cquencial/Cquencial'
import { CommonErrors } from '../../errors/Errors'
import { Extensions } from '../Extensions'

const EventEmitter = Events.EventEmitter

// GLOBAL EXTENSION METHODS
const updateExt = Cquencial.methods.update.extension
const updateExtSchema = new SimpleSchema(updateExt.schema)
export const updateExtension = new ValidatedMethod({
  name: updateExt.name,
  roles: updateExt.roles,
  validate (args) {
    updateExtSchema.validate(args)
  },
  run (args) {
    const {docId} = args
    const {key} = args
    const {type} = args
    const doc = Extensions.collection.findOne(docId)

    switch (type) {
      case updateExt.types.extension:
        const {isActive} = doc
        return Extensions.collection.update(docId, {$set: {isActive: !isActive}})
      default:
        throw new Meteor.Error(...CommonErrors.internalServerError(`type [${type}] is not recognized`))
    }
  }
})

// REGISTER EXTENSION METHODS
const _allExtensionMethods = []
const allExtensions = Bpmn.extensions.getAll()
allExtensions.forEach(extension => {
  const {methods} = extension.ref

  Object.keys(methods).forEach(key => {
    // register method here
    const methodDef = methods[key]
    const name = Cquencial.to.extMethodName(extension, methodDef.name)

    let validate
    if (methodDef.schema) {
      const schema = new SimpleSchema(methodDef.schema)
      validate = function validate (...args) {
        schema.validate(...args)
      }
    } else {
      validate = function validate () {
        return void 0
      }
    }

    const run = methodDef.run
    const validatedMethod = new ValidatedMethod({name, validate, run})
    console.info(`[method created] - ${validatedMethod.name}`)
    _allExtensionMethods.push(validatedMethod)
  })
})
export const allExtensionMethods = _allExtensionMethods

Meteor.methods({
  'startProcess' ({source, variables}) {
    try {
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

      engine.on('error', (err, displayErr) => {
        console.error(err)
        console.log(displayErr)
      })

      engine.execute({
        userId: this.userId,
        listener,
        variables: Object.assign({}, {
          startedBy: this.userId
        }, variables),
        services: ServiceContext
      }, (err) => { console.log(err) })
    } catch (startProcessException) {
      console.error(startProcessException)
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