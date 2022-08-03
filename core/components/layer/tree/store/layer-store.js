export default class LayerStore {
  constructor(storeKey, options = {}) {
    this.storeKey = storeKey;
    this.options = options;
  }

  get() {
    return new Promise((resolve) => {
      let ids = localStorage.getItem(this.storeKey) || '';
      resolve(ids.split(';'));
    });
  }

  add(id) {
    return this.get().then((ids) => {
      if (ids.indexOf(id) > -1) {
        ids.splice(ids.indexOf(id), 1);
      }
      ids.unshift(id);
      if (this.options.max) {
        ids = ids.slice(0, this.options.max);
      }
      localStorage.setItem(this.storeKey, ids.join(';'));
    });
  }

  remove(id) {
    return this.get().then((ids) => {
      ids.splice(ids.indexOf(id), 1);

      localStorage.setItem(this.storeKey, ids.join(';'));
    });
  }
}
