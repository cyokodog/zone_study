'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = require('events');

exports.default = {
  properties: {
    state: {
      changedPossibility: false
    },
    emitter: new _events.EventEmitter()
  },
  onHasTask: function onHasTask(parent, current, target, hasTask) {
    var state = Zone.current.get('state');
    var emitter = Zone.current.get('emitter');
    state.changedPossibility = !hasTask.macroTask && !hasTask.microTask;
    if (state.changedPossibility) {
      emitter.emit('checkDataChanged');
    }
  },
  onScheduleTask: function onScheduleTask(parentZoneDelegate, currentZone, targetZone, task) {
    console.log('onScheduleTask ' + task.source);
    parentZoneDelegate.scheduleTask(targetZone, task);
  },
  onInvokeTask: function onInvokeTask(parentZoneDelegate, currentZone, targetZone, task, applyThis, applyArgs) {
    console.log('onInvokeTask ' + task.source);
    var state = Zone.current.get('state');
    var emitter = Zone.current.get('emitter');
    emitter.emit('checkDataChanged');
    parentZoneDelegate.invokeTask(targetZone, task, applyThis, applyArgs);
  }
};