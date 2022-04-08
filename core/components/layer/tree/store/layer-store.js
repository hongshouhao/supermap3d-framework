/*
 * @Author: zhangbo
 * @Date: 2022-04-07 13:45:48
 * @LastEditors: zhangbo
 * @LastEditTime: 2022-04-08 18:35:08
 * @FilePath: \supermap3d-framework\core\components\layer\tree\store\layer-store.js
 * @Description: 前端缓存图层
 *
 * Copyright (c) 2022 by zhangbo/sipsd, All Rights Reserved.
 */

export default class LayerStore {
  constructor(storeKey, options = {}) {
    this.storeKey = storeKey;
    this.options = options;
  }

  set(id) {
    return this.get().then(ids=>{
      let test =""
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

  get() {
    return new Promise((resolve) => {
      let ids = localStorage.getItem(this.storeKey) || '';
      resolve(ids.split(';'));
    });
  }

  remove(id) {

    return this.get().then(ids=>{
      ids.splice(ids.indexOf(id), 1);

      localStorage.setItem(this.storeKey, ids.join(';'));
    });
  }
}
