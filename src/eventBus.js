import Vue from 'vue'
let EventBus = new Vue()

Object.defineProperties(Vue.prototype, {
  $eventBus: {
    get: function() {
      return EventBus
    },
  },
})
