import { LOAD, CLICK, SUBSCRIBE } from "el/base/Event";
import UIElement, { EVENT } from "el/base/UIElement";
import "./NumberRangeEditor";
import { isArray } from "el/base/functions/func";
import icon from "el/editor/icon/icon";
import { registElement } from "el/base/registerElement";
import { EditorElement } from "../common/EditorElement";

export default class StrokeDashArrayEditor extends EditorElement {

  initState() {

    var value = this.generateValue(this.props.value || '')
    
    return {
      value
    }
  }

  template() {
    return /*html*/`
      <div class='stroke-dasharray-editor'>
        <div ref='$body'></div>
        <div class='tools'>
          <label ref='$add'>${icon.add} ${this.$i18n('stroke.dasharray.editor.add')}</label>
        </div>
      </div>
    `
  }

  toStringValue () {
    return this.state.value.join(' ');
  }

  getValue () {
    return this.toStringValue()
  }

  generateValue (value) {
    return value.split(" ").filter(Boolean).map(it => +it);
  }

  setValue (value) {

    if (isArray(value)) {

    } else {
      value = this.generateValue(value);
    }

    this.setState({
      value
    })

  }

  [LOAD('$body')] () {

    return this.state.value.map( (it, index) =>  {
      var num = index + 1; 
      return /*html*/`
        <div class='dasharray-item'>
          <object refClass="NumberRangeEditor"  
            ref='$${num}' 
            label='${num}'
            key='${index}' 
            value="0" 
            min="0"
            max="1000"
            step="1"
            onchange="changeRangeEditor" 
          />
          <button type="button" data-index="${index}" class='delete'>${icon.remove2}</button>
        </div>
      `
    });
  }

  [SUBSCRIBE('changeRangeEditor')] (key, value) {
    var index = +key
    this.state.value[index] = value 

    this.modifyStrokeDashArray();
  }

  [CLICK('$add')] () {
    this.state.value.push(0);

    this.refresh();
  }

  [CLICK('$body .delete')] (e) {
    const index = +e.$dt.attr('data-index');

    this.state.value.splice(index, 1);

    this.refresh();
    this.modifyStrokeDashArray();    
  }


  modifyStrokeDashArray () {
    this.parent.trigger(this.props.onchange, this.props.key,  this.toStringValue(), this.props.params);
  }


}

registElement({ StrokeDashArrayEditor })