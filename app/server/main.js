import '../imports/startup/both'
import '../imports/startup/server/'

import {WebApp} from 'meteor/webapp'

WebApp.connectHandlers.use('/hello', (req, res, next) => {
  res.writeHead(200);
  res.end('hello from ' + Meteor.release)
})

WebApp.connectHandlers.use('/', (req, res, next) => {
  res.writeHead(400)
  res.end()
})