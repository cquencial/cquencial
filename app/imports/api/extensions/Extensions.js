import {Mongo} from 'meteor/mongo'

export const Extensions = {}

const collectionName = 'BpmnEngineExtensions'
const collection = new Mongo.Collection(collectionName)
Extensions.collectionName = collectionName
Extensions.collection = collection

const publications = {}
publications.all = {
  name: 'extensions.collection.all',
  validate() {

  },
  run(...args) {
    return collection.find({})
  },
  roles: []
}