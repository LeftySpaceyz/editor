
import { Length } from "el/editor/unit/Length";
import { LOAD, INPUT, CLICK, FOCUS, BLUR, POINTERSTART, MOVE, END, THROTTLE, SUBSCRIBE } from "el/base/Event";
import icon from "el/editor/icon/icon";
import { registElement } from "el/base/registerElement";
import { EditorElement } from "../common/EditorElement";

export default class NumberRangeEditor extends EditorElement {

    initState() {
        var value = Length.parse(this.props.value || Length.number(0));
        value = value.toUnit('number');
        return {
            removable: this.props.removable === 'true',
            clamp: this.props.clamp === 'true',
            label: this.props.label || '',
            min: +this.props.min || 0,
            max: +this.props.max || 100,
            step: +this.props.step || 1,
            key: this.props.key,
            params: this.props.params || '',
            layout: this.props.layout || '',
            value
        }
    }

    template () {
        return `<div class='small-editor' ref='$body'></div>`
    }

    [LOAD('$body')] () {

        var { min, max, step, label, type, removable, layout } = this.state

        var value = +this.state.value.value.toString()

        if (isNaN(value)) {
            value = 0
        }

        var hasLabel = !!label ? 'has-label' : ''
        var isRemovable = removable ? 'is-removable' : '';
        var layoutClass = layout;

        var realValue = (+value).toString();
        
        return /*html*/`
        <div class='number-range-editor ${hasLabel} ${isRemovable} ${layoutClass}' data-selected-type='${type}'>
            ${label ? `<label title="${label}">${label}</label>` : '' }
            <div class='range-editor-type' data-type='range'>
                <div class='area'>
                    <input type='range' ref='$property' value="${realValue}" min="${min}" max="${max}" step="${step}" />
                    <input type='number' ref='$propertyNumber' value="${realValue}" min="${min}" max="${max}" step="${step}" tabIndex="1" />
                </div>
            </div>
            <button type='button' class='remove' ref='$remove' title='Remove'>${icon.remove}</button>
        </div>
    `
    }

    setMin (value) {
        this.setState({
            min: Length.parse(value)
        })
    }

    setMax (value) {
        this.setState({
            max: Length.parse(value)
        })
    }    

    getValue() {

        if (this.state.clamp) {
            return this.state.value.clamp(this.state.min, this.state.max);
        }
        
        return this.state.value; 
    }

    setValue (value) {
        this.setState({
            value: Length.parse(value)
        })
    }

    [FOCUS('$propertyNumber')] (e) {
        this.refs.$propertyNumber.addClass('focused');
    } 

    [BLUR('$propertyNumber')] (e) {
        this.refs.$propertyNumber.removeClass('focused');
    }

    [CLICK('$remove')] (e) {
        this.updateData({
            value: ''
        })
    }

    updateData (data) {
        this.setState(data, false)
        this.parent.trigger(this.props.onchange, this.props.key, this.getValue(), this.props.params)
    }

    [INPUT('$propertyNumber')] (e) {

        var value = +this.getRef('$propertyNumber').value; 
        this.getRef('$property').val(value);

        this.updateData({ 
            value: this.state.value.set(value)
        });

    }


    [POINTERSTART('$property') + MOVE('moveRange') + END('moveRange')] () {

    }

    moveRange () {
        this.trigger('changeValue');
    }

    [SUBSCRIBE('changeValue') + THROTTLE(100)] () {
        var value = +this.getRef('$property').value; 
        this.getRef('$propertyNumber').val(value);

        if (this.state.value === '') {
            this.state.value = Length.number(0)
        }

        this.updateData({ 
            value: this.state.value.set(value)
        });
    }    
}

registElement({ NumberRangeEditor })