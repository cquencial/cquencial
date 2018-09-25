import { Template } from 'meteor/templating'
import { Cquencial } from '../../api/cquencial/Cquencial'

Template.registerHelper('toDate', function (date) {
  return new Date(date).toLocaleString()
})

Template.registerHelper('print', function (obj) {
  return JSON.stringify(obj)
})

Template.registerHelper('log', function (obj) {
  return console.log(obj)
})

Template.registerHelper('activeExtensions', function () {
  return Cquencial.get.extensions({onlyActive: true})
})

Template.registerHelper('route', function (value) {
  return Cquencial.get.route(value)
})
