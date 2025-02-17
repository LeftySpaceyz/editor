import { CSS_TO_STRING, isFunction } from "el/base/functions/func";
import { Item } from "el/editor/items/Item";
import DomRender from "el/editor/renderer/HTMLRenderer/DomRender";

export default class SVGRender extends DomRender {


    toDefaultCSS(item) {
        return {
            overflow: 'visible',
            ...this.toKeyListCSS(item, [
                'font-size', 
                'font-stretch', 
                'line-height', 
                'font-weight', 
                'font-family', 
                'font-style',
                'text-align', 
                'text-transform', 
                'text-decoration',
                'letter-spacing', 
                'word-spacing', 
                'text-indent',
                'background-color', 
                'border-radius',
                'transform-style',
            ])
        }
    
    }
    
    /**
     * SVG 가 CSS 로써 가질 수 있는 값들을 정의한다. 
     * 
     * @param {Item} item 
     */
    toCSS(item) {

        const css = Object.assign(
            {},
            this.toVariableCSS(item),
            this.toDefaultCSS(item),
            this.toClipPathCSS(item),
            this.toWebkitCSS(item), 
            this.toTextClipCSS(item),      
            this.toTransformCSS(item),            
            this.toLayoutItemCSS(item),
            this.toBackgroundImageCSS(item),
        );

        delete css.left;
        delete css.top;
        delete css.width;
        delete css.height;
        delete css.position;

        return css; 
    }


    /**
     * css 속성 중에  svg attribute 로 전환되는 리스트를 객체로 리턴
     * 
     * @param {Item} item 
     */
    toSVGAttribute (item) {
        return {
            ...this.toDefaultCSS(item),
            ...this.toKeyListCSS(item, [
                'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'stroke-dasharray', 'stroke-dashoffset',
                'fill-opacity', 'fill-rule', 'text-anchor'
            ])
        }
    }

    /**
     * 
     * @param {Item} item 
     * @param {Function} callback 
     */
    wrappedRender (item, callback) {

        const {id, x, y, width, height, itemType} = item;

        return /*html*/`

            <svg class='svg-element-item ${itemType}'
                xmlns="http://www.w3.org/2000/svg"
                data-id="${id}"
                x="${x.value}"
                y="${y.value}"
                width="${width.value}"
                height="${height.value}"
                overflow="visible"
            >
                ${this.toDefString(item)}
                ${isFunction(callback) && callback()}
            </svg>
        `       
    }

    /**
     * 
     * @param {Item} item 
     * @param {SVGRenderer} renderer 
     */
    render (item, renderer) {

        const {width, height, elementType} = item;
        const tagName = elementType || 'div'
        let css = this.toCSS(item);

        return this.wrappedRender(item, ()=> {
            return /*html*/`
                <foreignObject 
                    width="${width.value}"
                    height="${height.value}"
                    overflow="visible"
                >
                    <${tagName} xmlns="http://www.w3.org/1999/xhtml" style="${CSS_TO_STRING(css)};width:100%;height:100%;"></${tagName}>
                </foreignObject>    
                ${item.layers.map(it => {
                    return renderer.render(it, renderer)
                }).join('')}
            `            
        })

    }
}