import $ from 'jquery';
export default class Toolbar {
  constructor() {
    this.resetActions = [];
  }

  insertButtonGroup(index) {
    let dom = $('.top-left-bar');

    if (dom[0].children.length < index) {
      throw '参数错误';
    }

    const div = this.createButtonGroup();
    dom[0].insertBefore(div, dom[0].children[index]);
  }

  // /插入主工具条按钮
  // /coords[0]:component索引
  // /coords[1]:button索引
  insertButton(coords, options) {
    let doms = $('.top-left-bar .esri-component');
    if (doms.length <= coords[0]) {
      throw '参数错误';
    }

    if (doms[coords[0]].children.length < coords[1]) {
      throw '参数错误';
    }

    const div = this.createButton(options);
    doms[coords[0]].insertBefore(div, doms[coords[0]].children[coords[1]]);

    if (options.reset && typeof options.reset === 'function') {
      this.resetActions.push(options.reset);
    }
  }

  // hideButton(coords) {
  //   let doms = $('.top-left-bar .esri-component')
  //   if (doms.length <= coords[0]) {
  //     throw '参数错误'
  //   }

  //   if (doms[coords[0]].children.length < coords[1]) {
  //     throw '参数错误'
  //   }
  //   $(doms[coords[0]].children[coords[1]]).hide()
  // }

  // /插入二级工具条按钮
  // /coords[0]:toolbar索引
  // /coords[1]:component索引
  // /coords[2]:button索引
  insertSubButton(coords, options) {
    let bars = $('.top-left-popover-toolbar');
    if (bars.length <= coords[0]) {
      throw '参数错误';
    }

    let coms = $(bars[coords[0]]).find('.esri-component');
    if (coms.length <= coords[1]) {
      throw '参数错误';
    }

    if (coms[coords[1]].children.length < coords[2]) {
      throw '参数错误';
    }

    const div = this.createButton(options);
    coms[coords[1]].insertBefore(div, coms[coords[1]].children[coords[2]]);

    if (options.reset && typeof options.reset === 'function') {
      this.viewWrapper.resetActions.push(options.reset);
    }
  }

  createButton(options) {
    const div = document.createElement('div');
    div.classList.add('esri-widget--button');
    div.classList.add('esri-widget');
    div.title = options.title;
    div.addEventListener('click', options.click);
    const span = document.createElement('span');
    span.setAttribute('aria-hidden', true);
    span.classList.add('esri-icon');
    span.classList.add(options.icon);
    div.appendChild(span);
    return div;
  }

  createButtonGroup() {
    const div = document.createElement('div');
    div.classList.add('esri-component');
    div.classList.add('esri-widget');
    return div;
  }
}
