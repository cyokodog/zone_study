import {EventEmitter} from 'events';

export default {
  properties: {
    state: {
      changedPossibility: false,
    },
    emitter: new EventEmitter
  },
  onHasTask: function(parent, current, target, hasTask) {
    const state = Zone.current.get('state');
    const emitter = Zone.current.get('emitter');
    state.changedPossibility = !hasTask.macroTask && !hasTask.microTask;
    if(state.changedPossibility){
      emitter.emit('checkDataChanged');
    }
  },
  onScheduleTask: function(parentZoneDelegate, currentZone, targetZone, task) {
    console.log(`onScheduleTask ${task.source}`);
    parentZoneDelegate.scheduleTask(targetZone, task);
  },
  onInvokeTask: function(parentZoneDelegate, currentZone, targetZone, task, applyThis, applyArgs) {
    console.log(`onInvokeTask ${task.source}`);
    const state = Zone.current.get('state');
    const emitter = Zone.current.get('emitter');
    emitter.emit('checkDataChanged');
    parentZoneDelegate.invokeTask(targetZone, task, applyThis, applyArgs);
  }
}
