import BaseProperty from "./BaseProperty";

import { registElement } from "el/base/registerElement";
import { SUBSCRIBE } from "el/base/Event";

export default class SVGTextProperty extends BaseProperty {

  getTitle() {
    return this.$i18n('svg.text.property.title');
  }

  [SUBSCRIBE('refreshSelection')]() {
    this.refreshShow(['svg-textpath', 'svg-text', 'svg-tspan']);
  }

  refresh() {
    var current = this.$selection.current;
    if (current) {

      this.setAllValue([
        'lengthAdjust',
        'textLength',
        'startOffset',
        'text-anchor',
        'text'
      ])   
    }

  }

  setAllValue(list = []) {
    var current = this.$selection.current;
    if (!current) return; 

    list.forEach(key => {
      this.children[`$${key}`].setValue(current[key])          
    })
  }

  getBody() {
    return /*html*/`
      <div class='property-item animation-property-item'>
        <div class='group'>
          <span class='add-timeline-property' data-property='text'></span>
        </div>
        <object refClass="TextAreaEditor" 
          ref='$text' 
          label='${this.$i18n('svg.text.property.textarea')}' 
          key="text"
          onchange="changeTextValue" />
      </div>        
      <div class='property-item'>
        <object refClass="SelectIconEditor" 
          ref='$text-anchor' 
          label='${this.$i18n('svg.text.property.anchor')}' 
          key="text-anchor" 
          options="start,middle,end" 
          onchange="changeTextValue" />
      </div>            
      <div class='property-item animation-property-item'>
        <div class='group'>
          <span class='add-timeline-property' data-property='lengthAdjust'></span>
        </div>
        <object refClass="SelectEditor"  
          ref='$lengthAdjust' 
          label='${this.$i18n('svg.text.property.length.adjust')}' 
          key='lengthAdjust' 
          value='spacing' 
          options="spacing,spacingAndGlyphs" 
          onchange='changeTextValue' />        
      </div>        
      <div class='property-item animation-property-item'>
        <div class='group'>
          <span class='add-timeline-property' data-property='textLength'></span>
        </div>
        <object refClass="RangeEditor"  
          ref='$textLength' 
          label='${this.$i18n('svg.text.property.text.length')}' 
          key='textLength'
          min="0"
          max='1000'
          step="0.1"
          onchange='changeTextValue' />                
      </div>        
      <div class='property-item animation-property-item'>
        <div class='group'>
          <span class='add-timeline-property' data-property='startOffset'></span>
        </div>
        <object refClass="RangeEditor"  
          ref='$startOffset' 
          label='${this.$i18n('svg.text.property.start.offset')}' 
          key='startOffset' 
          min="0"
          max='1000'
          step="0.1"          
          onchange='changeTextValue' />        
      </div>                    
    `
  }

  [SUBSCRIBE('changeTextValue')] (key, value) {

    this.command('setAttribute', `change svg text property: ${key}`, { 
      [key]: value
    }, null, true)
  }

}

registElement({ SVGTextProperty })