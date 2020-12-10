import Dom from "@core/Dom";
import { CSS_TO_STRING } from "@core/functions/func";
import SVGLayerRender from "./SVGLayerRender";

export default class ImageRender extends SVGLayerRender {
    

    /**
     * 
     * @param {Item} item 
     */
    getUrl (item) {
        var {src} = item;     
        var project = item.top;
        
        return project.getImageValueById(src);
    }


    /**
     * 
     * @param {*} item 
     */
    render (item) {

        const {width, height} = item;
        let css = this.toCSS(item);

        return this.wrappedRender(item, () => {
          return /*html*/`
            <foreignObject ${OBJECT_TO_PROPERTY({  width: width.value, height: height.value})}>
                <div xmlns="http://www.w3.org/1999/xhtml">
                    <img src='${this.getUrl(item)}' style="width:100%;height:100%; ${CSS_TO_STRING(css)}"  />
                </div>
            </foreignObject>              
          `  
            
        })      

    }

    /**
     * 
     * @param {Item} item 
     * @param {Dom} currentElement 
     */
    update(item, currentElement) {

        const $image = currentElement.$('img')
        if ($image) {
            $image.attr('src', this.getUrl(item));
        }

        super.update(item, currentElement);
    } 
}