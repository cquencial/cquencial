import { Template } from 'meteor/templating'

Template.registerHelper('toDate', function (date) {
  return new Date(date).toLocaleString()
})

Template.registerHelper('print', function (obj) {
  return JSON.stringify(obj)
})

Template.registerHelper('log', function (obj) {
  return console.log(obj)
})
