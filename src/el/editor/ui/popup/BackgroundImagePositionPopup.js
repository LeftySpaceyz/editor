
import { CLICK, LOAD, SUBSCRIBE } from "el/base/Event";

import { Length } from "el/editor/unit/Length";
import BasePopup from "./BasePopup";
import "../property-editor/GradientEditor";
import "../property-editor/RangeEditor";
import "../property-editor/SelectEditor";

import "../property-editor/EmbedColorPicker";
import { blend_list } from "el/editor/util/Resource";
import { registElement } from "el/base/registerElement";


export default class BackgroundImagePositionPopup extends BasePopup {

  getTitle() {
    return this.$i18n('background.image.position.popup.title')
  }

  initState() {

    return {
      size: this.props.size || 'auto',
      repeat: this.props.repeat || 'repeat',
      x: this.props.x || Length.z(),
      y: this.props.y || Length.z(),
      width: this.props.width || Length.z(),
      height: this.props.height || Length.z(),
      blendMode: this.props.blendMode,
    }
  }

  updateData(opt = {}) {
    this.setState(opt, false);

    this.emit(this.state.changeEvent, opt, this.state.params);
  }

 
  templateForSize() {
    return /*html*/`
      <div class='popup-item'>
        <object refClass="SelectEditor"  label="${this.$i18n('background.image.position.popup.size')}" ref='$size' key='size' value="${this.state.size}" options="contain,cover,auto" onchange="changeRangeEditor" />      
      </div>
    `;
  }

  [SUBSCRIBE('changeRangeEditor')] (key, value) {
    this.updateData({ [key]: value });
  }

  templateForX() {
    return /*html*/`
      <div class='popup-item'>
        <object refClass="RangeEditor"  
            label="X"
            calc="false"            
            ref="$x" 
            key="x"
            value="${this.state.x}"
            min="-1000" max="1000" step="1"
            onchange="changeRangeEditor"
        />
      </div>
    `;
  }

  templateForY() {
    return /*html*/`
      <div class='popup-item'>
        <object refClass="RangeEditor"  
            label="Y" 
            calc="false"       
            ref="$y" 
            key="y"
            value="${this.state.y}"            
            min="-1000" max="1000" step="1"
            onchange="changeRangeEditor"
        />
      </div>
    `;
  }

  templateForWidth() {
    return /*html*/`
    <div class='popup-item'>
      <object refClass="RangeEditor"  
          label="${this.$i18n('background.image.position.popup.width')}"   
          calc="false"             
          ref="$width" 
          key="width"
          value="${this.state.width}"          
          min="0" max="500" step="1" 
          onchange="changeRangeEditor"
      />
    </div>
    `;
  }

  templateForHeight() {
    return /*html*/`
    <div class='popup-item'>
      <object refClass="RangeEditor"  
          label="${this.$i18n('background.image.position.popup.height')}"
          calc="false"          
          ref="$height" 
          key="height"
          value="${this.state.height}"          
          min="0" max="500" step="1" onchange="changeRangeEditor"
      />
    </div>
    `;
  }

  templateForRepeat() {
    return /*html*/`
    <div class='popup-item grid-2'>
      <label>${this.$i18n('background.image.position.popup.repeat')}</label>
      <div class='repeat-list' ref="$repeat" data-value='${this.state.repeat}'>
          <button type="button" value='no-repeat' title="${this.$i18n('background.image.position.popup.type.no-repeat')}"></button>
          <button type="button" value='repeat' title="${this.$i18n('background.image.position.popup.type.repeat')}"></button>
          <button type="button" value='repeat-x' title="${this.$i18n('background.image.position.popup.type.repeat-x')}"></button>
          <button type="button" value='repeat-y' title="${this.$i18n('background.image.position.popup.type.repeat-y')}"></button>
          <button type="button" value='space' title="${this.$i18n('background.image.position.popup.type.space')}"></button>
          <button type="button" value='round' title="${this.$i18n('background.image.position.popup.type.round')}"></button>
      </div>
    </div>
    `;
  }

  [CLICK("$repeat button")]({ $dt: $t }) {
    this.refs.$repeat.attr("data-value", $t.value);
    this.updateData({ repeat: $t.value });
  }

  templateForBlendMode() {
    return /*html*/`
    <div class='popup-item'>
      <object refClass="SelectEditor"  label="${this.$i18n('background.image.position.popup.blend')}" ref='$blend' key='blendMode' value="${this.state.blendMode}" options="${blend_list}" onchange="changeRangeEditor" />
    </div>
    `;
  }


  getBody() {
    return /*html*/`
      <div class="background-image-position-picker" ref='$picker'></div>
    `;
  }

  [LOAD('$picker')] () {
    return /*html*/`
      
      <div class='box'>

        <div class='background-property'>
          ${this.templateForSize()}        
          ${this.templateForX()}
          ${this.templateForY()}
          ${this.templateForWidth()}
          ${this.templateForHeight()}
          ${this.templateForRepeat()}
        </div>
      </div>
    `
  }


  [SUBSCRIBE("showBackgroundImagePositionPopup")](data, params) {
    this.state.changeEvent = data.changeEvent || 'changeFillPopup'
    this.state.params = params; 

    this.setState(data.data);

    this.show(460);
  }


}

registElement({ BackgroundImagePositionPopup })