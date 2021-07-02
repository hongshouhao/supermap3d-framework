// import FloatInfoPanel from './WidgetDataPanel.vue'

// class WidgetDataPanelManager {
//   constructor() {
//     this.panelId = 'widget-info-panel-' + Date.parse(new Date())
//   }

//   getRoot(title) {
//     let props = {}
//     if (title) {
//       props.title = title
//     }
//     let theDiv = document.getElementById(this.panelId)
//     if (theDiv) {
//       document.body.removeChild(theDiv)
//     }

//     const tempDiv = document.createElement('div')
//     const app = createApp(FloatInfoPanel, props)
//     app.mount(tempDiv)
//     tempDiv.firstChild.id = this.panelId
//     let contentDiv = tempDiv.firstChild.lastChild
//     document.body.appendChild(tempDiv.firstChild)
//     return contentDiv
//   }

//   setContent(dom, title, width, height) {
//     let theDiv = this.getRoot(title)
//     theDiv.innerHTML = ''
//     theDiv.appendChild(dom)

//     if (width) {
//       theDiv.style.minWidth = width
//       theDiv.style.maxWidth = width
//     }
//     if (height) {
//       theDiv.style.minHeight = dom.style.height
//       theDiv.style.maxHeight = dom.style.height
//     }
//   }
//   clearContent() {
//     let theDiv = this.getRoot()
//     theDiv.innerHTML = ''
//   }
//   hide() {
//     let theDiv = this.getRoot()
//     theDiv.innerHTML = ''
//   }
// }

// export default new WidgetDataPanelManager()
