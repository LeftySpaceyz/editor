import BaseProperty from "./BaseProperty";
import { LOAD, DEBOUNCE, DRAGSTART, CLICK, SUBSCRIBE } from "el/base/Event";

import patterns from "el/editor/preset/patterns";
import { Pattern } from "el/editor/property-parser/Pattern";
import { CSS_TO_STRING } from "el/base/functions/func";
import { registElement } from "el/base/registerElement";

export default class PatternAssetsProperty extends BaseProperty {

  getTitle() {
    return this.$i18n('pattern.asset.property.title');
  }

  initState() {
    return {
      mode: 'grid',
      preset: 'check'      
    }
  }


  getTools() {

    const options = patterns.map(it => `${it.key}:${it.title}`)

    return /*html*/`
      <object refClass="SelectEditor"  key="preset" value="${this.state.preset}" options="${options}" onchange="changePreset"  />
    `
  }  


  [SUBSCRIBE('changePreset')] (key, value) {

    this.setState({
      [key]: value
    })
  }

  getClassName() {
    return 'pattern-assets-property'
  }


  [SUBSCRIBE('refreshSelection') + DEBOUNCE(100)] () {
    this.show();
  }

  getBody() {
    return /*html*/`
      <div class='property-item pattern-assets'>
        <div class='pattern-list' ref='$patternList' data-view-mode='${this.state.mode}'></div>
      </div>
    `;
  }

  [DRAGSTART('$patternList .pattern-item')] (e) {
    const pattern = e.$dt.attr('data-pattern');
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("text/pattern", pattern);
  }

  [LOAD("$patternList")]() {
    var preset = patterns.find(it => it.key === this.state.preset);

    if (!preset) {
      return '';
    }

    var results = preset.execute().map( (item, index) => { 
      const cssText = CSS_TO_STRING(Pattern.toCSS(item.pattern));

      return /*html*/`
        <div class='pattern-item' data-index="${index}" data-pattern="${item.pattern}">
          <div class='preview' title="${item.title}" draggable="true">
            <div class='pattern-view' style='${cssText}'></div>
          </div>
        </div>
      `
    })

    return results
  }


  [CLICK("$patternList .pattern-item")](e) {

    const pattern = e.$dt.attr('data-pattern')

    // view 에 따라 다른 속성을 가진다. 
    if (this.$editor.modeView === 'CanvasView') { 
      this.emit('addBackgroundImagePattern', pattern);
    } else {
      this.emit('setPatternAsset', pattern)
    }
  }  

}

registElement({ PatternAssetsProperty })