
import { LOAD, CLICK, SUBSCRIBE } from "el/base/Event";
import icon from "el/editor/icon/icon";
import "./SelectEditor";
import "./NumberInputEditor";
import "./InputRangeEditor";
import { registElement } from "el/base/registerElement";
import { EditorElement } from "../common/EditorElement";

const REG_CSS_UNIT = /(auto)|(repeat\([^\)]*\))|(([\d.]+)(px|pt|fr|r?em|deg|vh|vw|%))/gi;


export default class GridBoxEditor extends EditorElement {


    getLayoutItemOptions () {
        return 'none,auto,repeat,length'.split(',').map(it => {
            return `${it}:${this.$i18n(`grid.box.editor.${it}`)}`
        }).join(',');
    }

    initState() {
        return {
            label: this.props.label,
            list: this.parseValue(this.props.value)
        }
    }

    setValue (value) {
        this.setState({
            list: this.parseValue(value)
        })
    }

    parseValue (value) {
        let arr = null; 

        var target = [] 

        while ((arr = REG_CSS_UNIT.exec(value)) !== null) {
            var text = arr[0];
            if (text === 'auto') {
                target.push({ type: 'auto', count:  0, value: '0px' })
            } else  if (text.includes('repeat'))  { 
                var tempArray = text.split('repeat(')[1].split(')')
                tempArray.pop();

                let [count, ...size] = tempArray.join('').split(',');

                target.push({ type: 'repeat', count, value: size.join(', ')  })
            } else {
                target.push({ type: 'length', count: 1, value: text })
            }
        }

        return target; 
    }

    getValue () {
        return this.state.list.map(it => {
            if (it.type === 'repeat') {
                return `repeat(${it.count}, ${it.value})`
            } else if (it.type === 'auto' || it.type === 'none') {
                return it.type;
            } else {
                return it.value
            }

        }).join(' ');
    }

    modifyData() {
        this.parent.trigger(this.props.onchange, this.props.key, this.getValue())
    }

    makeItem (it, index) {
        return /*html*/`
            <div class='item' data-repeat-type='${it.type}' data-index='${index}' >
                <div class='repeat'>
                    <object refClass="SelectEditor" 
                        ref='$${index}-type' 
                        options="${this.getLayoutItemOptions()}" 
                        key="type" 
                        value="${it.type || 'auto'}" 
                        params="${index}" 
                        onchange="changeKeyValue" />
                </div>
                <div class='count'>
                    <object refClass="NumberInputEditor" 
                        ref='$${index}-count' 
                        key="count" 
                        value="${it.count}" 
                        params="${index}" 
                        max='1000'
                        onchange="changeKeyValue" />
                </div>                
                <div class='value'>
                    <object refClass="InputRangeEditor" 
                        ref='$${index}-value' 
                        key="value" 
                        value="${it.value}" 
                        params="${index}" 
                        units='auto,fr,px,em,%'
                        onchange="changeKeyValue" />
                </div>
                <div class='tools'>
                    <button type="button" class='copy'>${icon.copy}</button>                
                    <button type="button" class='remove'>${icon.remove2}</button>
                </div>
            </div>
        `
    }

    [LOAD('$list')] () {
        return this.state.list.map( (it, index) => {
            return this.makeItem(it, index);
        })
    }

    template () {
        return /*html*/`
            <div class='grid-box-editor' ref='$body' >
                <div class='grid-box-editor-item'>
                    <div class='item header'>
                        <div class='repeat'>
                            <label>${this.state.label} </label>
                            <button type='button' ref='$add'>${icon.add}</button>
                        </div>
                        <div class='count'>${this.$i18n('grid.box.editor.count')}</div>
                        <div class='value'>${this.$i18n('grid.box.editor.value')}</div>
                        <div class='tools'></div>
                    </div>
                    <div ref='$list'></div>
                </div>
            </div>
        `
    }

    [CLICK('$list .remove')] (e) {
        var index = +e.$dt.closest('item').attr('data-index')
        this.state.list.splice(index, 1);

        this.refresh();

        this.modifyData()        
    }

    [CLICK('$list .copy')] (e) {
        var index = +e.$dt.closest('item').attr('data-index')

        var newObj = clone(this.state.list[index]);
        this.state.list.splice(index, 0, newObj);

        this.refresh();

        this.modifyData()        
    }    

    [CLICK('$add')] () {
        this.trigger('add');
    }

    [SUBSCRIBE('add')] () {
        this.state.list.push({ type: 'auto', count: 0, value: '0px'}) 
        this.refresh();
        
        this.modifyData()                
    }


    [SUBSCRIBE('changeKeyValue')] (key, value, params) {

        var index = +params

        var item = this.state.list[index]

        if (item) {
            if (key ===  'type') {
                this.refs.$list.$(`[data-index="${index}"]`).attr('data-repeat-type', value)
            }
            item[key] = value; 
        }

        this.modifyData();
    }
}

registElement({ GridBoxEditor })