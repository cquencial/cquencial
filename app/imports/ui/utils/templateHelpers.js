import { Template } from 'meteor/templating'
import { Cquencial } from '../../api/cquencial/Cquencial'

Template.registerHelper('toDate', function (date) {
  return new Date(date).toLocaleString()
})

Template.registerHelper('print', function (obj) {
  return JSON.stringify(obj)
})

Template.registerHelper('log', function (...args) {
  return console.log(...args)
})

Template.registerHelper('activeExtensions', function () {
  return Cquencial.get.extensions({isActive: true})
})

Template.registerHelper('allExtensions', function () {
  return Cquencial.get.extensions()
})

Template.registerHelper('route', function (value) {
  return Cquencial.get.route(value)
})

Template.registerHelper('fields', function (doc) {
  return doc ? Object.keys(doc).map(key => ({key, value: doc[key]})) : []
})
