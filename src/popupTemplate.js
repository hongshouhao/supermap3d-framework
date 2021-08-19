export const popupTemplateWithCustomUI = {
  getHeader: function(data) {
    return data.object.layerName + 'test'
  },
  getContent: function(data) {
    let div = document.createElement('div')
    div.innerHTML = data.object.layerName
    return div
  },
}

export const popupTemplateWithDefaultUI = {
  getHeader: function(data) {
    return data.object.layerName + ' - ' + data.object.id
  },
  getContent: function(data) {
    let arr = []
    arr.push({
      key: '对象',
      value: data.object.layerName,
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
