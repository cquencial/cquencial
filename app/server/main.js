import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Random } from 'meteor/random';
import { Bpmn } from 'meteor/cquencial:bpmn-engine';
import { ServiceContext } from "../imports/context/ServiceContext";
import camundaBpmnModdle from 'camunda-bpmn-moddle/resources/camunda';

const EventEmitter = require('events').EventEmitter;
const fs = require('fs');


Bpmn.persistence.on();
Bpmn.instances.on();
Bpmn.history.on();
Bpmn.tasklist.on();

Meteor.publish(null, () => {
  Bpmn.processes.collection.find();
});

Meteor.publish(null, () => {
  return Bpmn.persistence.collection.find();
});

Meteor.publish(null, () => {
  return Bpmn.instances.collection.find();
});

Meteor.publish(null, () => {
  return Bpmn.history.collection.find();
});


const processXml = `
<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <process id="theProcess" isExecutable="true">
    <startEvent id="theStart" />
    <userTask id="userTask" />
    <endEvent id="theEnd" />
    <sequenceFlow id="flow1" sourceRef="theStart" targetRef="userTask" />
    <sequenceFlow id="flow2" sourceRef="userTask" targetRef="theEnd" />
  </process>
</definitions>`;


Meteor.methods({
  // code to run on server at startup
  'startProcess'({ source }) {

    try {
      console.log(source);

      const engine = new Bpmn.Engine({
        source,
        moddleOptions: {
          camunda: camundaBpmnModdle
        }
      }, (err)=>{console.log(err)});

      const listener = new EventEmitter();
      listener.on('error', (err, displayErr) => {
        console.error(err);
        console.log(displayErr);
      });

      listener.on('wait', (element, instance) => {
        console.log(element.form);
      });

      engine.on('error', (err, displayErr) => {
        console.error(err);
        console.log(displayErr);
      });

      engine.execute({
        userId: this.userId,
        listener,
        variables: {
          startedBy: this.userId,
        },
        services: ServiceContext
      }, (err)=>{console.log(err)});

    } catch (errrr) {
      console.error(errrr);
    }
  },

  getState({ instanceId }) {
    if (!Bpmn.instances.has(instanceId))
      throw new Error("no instance");
    const instance = Bpmn.instances.get(instanceId);
    return JSON.stringify(instance.getState(), null, 2);
  },

  resumeProcess: function (queryDoc) {

    const { instanceId } = queryDoc;
    const processInstanceDoc = Bpmn.persistence.collection.findOne({ instanceId });
    const persistenceDoc = Bpmn.persistence.load(processInstanceDoc._id);

    console.log(persistenceDoc.state);

    Bpmn.Engine.resume(persistenceDoc.state, {
      instanceId: persistenceDoc.instanceId,
      persistenceId: persistenceDoc.persistenceId,
    });

  },

  stopInstance(queryDoc) {
    check(queryDoc, {
      instanceId: String,
    });
    const { instanceId } = queryDoc;
    const instance = Bpmn.instances.get(instanceId);
    instance.stop();
    console.log(instanceId, Bpmn.instances.collection.findOne({ instanceId }), !!Bpmn.instances.get(instanceId));
  },

  continue(queryDoc) {
    check(queryDoc, {
      instanceId: String,
      elementId: String
    });
    const { instanceId } = queryDoc;
    const { elementId } = queryDoc;

    if (!Bpmn.instances.has(instanceId))
      throw new Error("no instance");

    const instance = Bpmn.instances.get(instanceId);
    return instance.signal(elementId);
  },

  deletePersistentEntry({ instanceId }) {
    check(instanceId, String);
    const instance = Bpmn.instances.get(instanceId);
    if (instance) instance.stop();
    Bpmn.processes.collection.remove({ instanceId });
    Bpmn.persistence.collection.remove({ instanceId });
    Bpmn.history.collection.remove({ instanceId });
  },

  deleteAll() {
    Bpmn.instances.clear();
    Bpmn.processes.collection.remove({});
    Bpmn.persistence.collection.remove({});
    Bpmn.history.collection.remove({});
  },

  getPending({ instanceId }) {
    check(instanceId, String);
    if (!Bpmn.instances.has(instanceId))
      throw new Error("no instance");

    const instance = Bpmn.instances.get(instanceId);
    return instance.getPendingActivities();
  },
});

