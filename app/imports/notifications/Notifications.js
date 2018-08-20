import {Mongo} from 'meteor/mongo';


const collectionName = 'notifications';
export const Notifications = new Mongo.Collection(collectionName);
Notifications.name = collectionName;

if (Meteor.isServer) {
  Meteor.publish('notifications', function () {
    return Notifications.find({userId: this.userId});
  })
}