import BaseProperty from "./BaseProperty";
import {
  LOAD, DEBOUNCE, CLICK,
} from "@core/Event";
import { EVENT } from "@core/UIElement";
import icon from "@icon/icon";
import { filter_list } from "@util/Resource";

export default class BackdropFilterProperty extends BaseProperty {

  getTitle() {
    return this.$i18n('backdrop.filter.property.title');
  }


  hasKeyframe () {
    return true; 
  }


  getTitleClassName() {
    return 'filter'
  }


  getKeyframeProperty () {
    return 'backdrop-filter';
  }


  getBody() {
    return /*html*/`<div class='full filter-property' ref='$body'></div>`;
  }

  getTools() {
    return /*html*/`
      <select ref="$filterSelect"></select>
      <button type="button" ref="$add" title="add Filter">${icon.add}</button>
    `
  }
  

  [CLICK("$add")]() {
    var filterType = this.refs.$filterSelect.value;

    this.children.$filterEditor.trigger('add', filterType)
  }

  [LOAD('$filterSelect')] () {
    var list = filter_list.map(it => { 
      return {title: this.$i18n(`filter.property.${it}`), value: it}
    })

    var svgFilterList = this.getSVGFilterList()

    var totalList = []

    if (svgFilterList.length) {
      totalList = [
        ...list,
        { title: '-------' , value: ''},
        ...svgFilterList
      ]
    } else {
      totalList = [
        ...list
      ]
    }

    return totalList.map(it => {
      var {title, value} = it;
      
      return `<option value='${value}'>${title}</option>`
    })
  }


  getSVGFilterList () {
     
    var current = this.$selection.currentProject;
    var arr = [] 

    if (current) {
      arr = current.svgfilters
        .map(it => {
          return {
            title : `svg - #${it.id}`,
            value: it.id
          }
        })
    }

    return arr
  }  


  [LOAD('$body')] () {
    var current = this.$selection.current || {} 
    var value = current['backdrop-filter'];

    return /*html*/`<object refClass="FilterEditor" ref='$filterEditor' value='${value}' hide-label="true" onchange='changeFilterEditor' />`
  }

  [EVENT('changeFilterEditor')] (filter) {

    this.command("setAttribute", "change backdrop filter", {
      'backdrop-filter': filter
    })

  }


  [EVENT('refreshSelection')] () {
    this.refreshShowIsNot(['project', 'artboard'])
  }  
}
