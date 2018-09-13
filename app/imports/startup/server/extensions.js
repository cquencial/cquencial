import { Bpmn } from 'meteor/cquencial:bpmn-engine'

Bpmn.persistence.on()
Bpmn.instances.on()
Bpmn.history.on()

// keep off for now
Bpmn.tasklist.off()

