import UIElement, { EVENT } from "@core/UIElement";

import { CLICK, PREVENT, STOP, DEBOUNCE } from "@core/Event";

import icon from "@icon/icon";
import { round } from "@core/functions/math";
import NumberInputEditor from "../property-editor/NumberInputEditor";

export default class PageTools extends UIElement {

  components() {
    return {
      NumberInputEditor
    }
  }

  template() {
    return /*html*/`     
      <div class='page-tools'>
        <button type='button' ref='$minus'>${icon.remove2}</button>
        <div class='select'>
          <NumberInputEditor ref='$scale' min='10' max='240' step="1" key="scale" value="${this.$editor.scale*100}" onchange="changeRangeEditor" />
        </div>
        <label>%</label>
        <button type='button' ref='$plus'>${icon.add}</button>        
      </div>

    `;
  }  

  [EVENT('changeScaleValue')] (scale, oldScale) {

    if (scale <= 0) {
      scale = 0.01;
    }

    scale = round(scale * 100, 100)

    this.children.$scale.setValue(scale);
    this.emit('updateScale', scale/100);
  }

  [EVENT('changeRangeEditor') + DEBOUNCE(1000)] (key, scale) {
    this.trigger('changeScaleValue', Math.floor(scale/100), this.$editor.scale);
  }

  [CLICK('$plus') + PREVENT + STOP] () {

    this.trigger('changeScaleValue', this.$editor.scale + 0.25, this.$editor.scale);
  }

  [CLICK('$minus') + PREVENT + STOP] () {
    this.trigger('changeScaleValue', this.$editor.scale - 0.25, this.$editor.scale);    
  }

}
