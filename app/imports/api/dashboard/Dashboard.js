import {Mongo} from 'meteor/mongo'

export const Dashboard = {}
const internal = {}
const collection = new Mongo.Collection('')
Dashboard.collection = collection

function register () {
  // register a dashboard definition here
}

Dashboard.register = register
