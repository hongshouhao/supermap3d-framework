/*
 * @Author: zhangbo
 * @Date: 2022-04-02 13:47:15
 * @LastEditors: zhangbo
 * @LastEditTime: 2022-04-14 08:53:07
 * @FilePath: \supermap3d-framework\examples\popupTemplate.js
 * @Description: 
 * 
 * Copyright (c) 2022 by zhangbo/sipsd, All Rights Reserved. 
 */
export const popupTemplateWithCustomUI = {
  getHeader: function(data) {
    return data.object.layer + 'test'
  },
  getContent: function(data) {
    let div = document.createElement('div')
    div.innerHTML = data.object.layer
    return div
  },
}

export const popupTemplateWithDefaultUI = {
  getHeader: function(data) {
    return data.object.layer + ' - ' + data.object.id
  },
  getContent: function(data) {
    let arr = []
    arr.push({
      key: '对象',
      value: data.object.layer,
    })
    arr.push({
      key: '标识',
      value: data.object.id,
    })
    arr.push({
      key: '经度',
      value: data.position.longitude,
    })
    arr.push({
      key: '纬度',
      value: data.position.latitude,
    })
    arr.push({
      key: '高度',
      value: data.position.height,
    })

    for (let p in data.object.attributes) {
      arr.push({
        key: p,
        value: data.object.attributes[p],
      })
    }
    return arr
  },
}
