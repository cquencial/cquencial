import {Meteor} from 'meteor/meteor'
import { Template } from 'meteor/templating'

import {Cquencial} from '../../../api/cquencial/Cquencial'
import {Routes} from '../../../api/routes/Routes'
import './setup.html'

Template.setup.onCreated(function onSetupCreated () {
  const instance = this
  instance.autorun(() => {

    Meteor.call(Cquencial.methods.setupRequired.name, (err, res) => {
      if (!res === true) {
        Routes.to.root.go()
      }
    })
  })
})