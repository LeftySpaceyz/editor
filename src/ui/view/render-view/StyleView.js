import UIElement, { EVENT } from "@core/UIElement";

import { LOAD, VDOM } from "@core/Event";
import Dom from "@core/Dom";
import { CSS_TO_STRING, isArray, isString } from "@core/functions/func";
import { Project } from "@items/Project";
import HTMLRenderer from "@renderer/HTMLRenderer";


export default class StyleView extends UIElement {

  template() {
    return /*html*/`
    <div class='style-view' style='pointer-events: none; position: absolute;display:inline-block;left:-1000px;'>
      <div ref='$svgArea'></div>
      <svg width="0" height="0">
        <defs>
          <marker id="start" markerWidth="8" markerHeight="8" refX="5" refY="5">
              <circle cx="5" cy="5" r="3" style="stroke: none; fill:#000000;"/>
          </marker>
          <marker id="head" orient="auto" markerWidth="10" markerHeight="10" refX=".5" refY="3">
            <path d="M0,0 V6 L5,3 Z" fill="red"></path>
          </marker>
        </defs>
      </svg>
    </div>
    `;
  }

  initialize() {
    super.initialize()

    this.refs.$head = Dom.create(document.head)
  }

  makeStyle (item) {
    return HTMLRenderer.toStyle(item);
  }

  refreshStyleHead () {
    var project = this.$selection.currentProject || new Project()

    this.refs.$head.$$(`style`).forEach($style => $style.remove())

    // project setting 
    this.changeStyleHead(project)

    // artboard setting 
    project.artboards.forEach(item => this.changeStyleHead(item))
  }

  changeStyleHead (item) {
    var $temp = Dom.create('div')        

    const styleTag = this.makeStyle(item)

    $temp.html(styleTag).children().forEach($item => {
      this.refs.$head.append($item);
    })

  }

  refreshStyleHeadOne (item, isOnlyOne = false) {
    var list = [item]
    if (!isOnlyOne) {
      list = item.allLayers
    }

    var selector = list.map(it => {
      return `style[data-id="${it.id}"]`
    }).join(',');

    let isChanged = false; 
    this.refs.$head.$$(selector).forEach(it => {
      if (item.isChanged(it.attr('data-timestamp'))) {
        isChanged = true;       
        it.remove();
      }
    })

    if (isChanged) {
      this.changeStyleHead(item)
    }

  }

  [LOAD('$svgArea') + VDOM] () {

    var project = this.$selection.currentProject || {  }

    return HTMLRenderer.renderSVG(project);
  }   

  // timeline 에서 테스트 할 때 이걸 활용할 수 있다. 
  // 움직이기 원하는 객체가 타임라인 전체라 
  // 전체를 리프레쉬 하는걸로 한다. 
  // 애니메이션이 진행되는 동안 임의의 객체는 없는 것으로 하자. 
  [EVENT('refreshStyleView', 'moveTimeline', 'playTimeline')] (current,  isOnlyOne = false) {   
    if (current) {
      this.load();
      this.refreshStyleHeadOne(current, isOnlyOne);
    } else {
      this.refresh()
    }
  }

  [EVENT('refreshSVGArea')] () {
    this.load('$svgArea');
  }

  /**
   * 
   * @param {String|Object|Array<string>|Array<object>} obj  ,  id 리스트를 만들기 위한 객체, 없으면 selection에 있는 객체 전체
   */
  [EVENT('refreshSelectionStyleView')] (obj = null) {
    var ids = obj; 

    if (isArray(obj)) {
      ids = obj
    } else if (obj !== null) {
      ids = [obj]
    }

    let items = [] 

    if (!ids) {
      items = this.$selection.items
    } else if (isString(ids[0])) {
      items = this.$selection.itemsByIds(ids);
    } else {
      items = ids; 
    }

    const styleTags = [] 
    const removeStyleSelector = []

    items.forEach(item => {
      var selector = item.allLayers.map(it => {
        return `style[data-id="${it.id}"],style[data-id="${it.id}-drag"]`
      }).join(',');

      removeStyleSelector.push(selector);
      styleTags.push(this.makeStyle(item))
    })

    if (removeStyleSelector.length) {
      this.refs.$head.$$(removeStyleSelector).forEach(it => {
        it.remove();
      })  
    }

    var $temp = Dom.create('div')        

    var $fragment = $temp.html(styleTags.join('')).createChildrenFragment()

    this.refs.$head.append($fragment);
  }  

  refresh() {
    this.load();
    this.refreshStyleHead();
  }
}
