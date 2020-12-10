import Dom from '@core/Dom';
import { Item } from '@items/Item';
import ArtBoardRender from './ArtBoardRender';
import CircleRender from './CircleRender';
import ImageRender from './ImageRender';
import ProjectRender from './ProjectRender';
import RectRender from './RectRender';
import SVGPathRender from './SVGPathRender';
import SVGTextPathRender from './SVGTextPathRender';
import SVGTextRender from './SVGTextRender';
import TextRender from './TextRender';
import VideoRender from './VideoRender';

const renderers = {
    'project': new ProjectRender(),
    'artboard': new ArtBoardRender(),
    'rect': new RectRender(),
    'circle': new CircleRender(),
    'image': new ImageRender(),
    'video': new VideoRender(),
    'text': new TextRender(),
    'svg-path': new SVGPathRender(),
    'svg-text': new SVGTextRender(),
    'svg-textpath': new SVGTextPathRender(),
}

export default {
    /**
     * 
     * @param {Item} item 
     */
    render (item, renderer, encoding = false) {
        const currentRenderer = renderers[item.itemType];

        if (currentRenderer) {
            return currentRenderer.render(item, renderer || this, encoding);
        }
    },

    /**
     * 
     * @param {Item} item 
     */
    toCSS (item) {
        const currentRenderer = renderers[item.itemType];

        if (currentRenderer) {
            return currentRenderer.toCSS(item);
        }
    },

    /**
     * 
     * @param {Item} item 
     */
    toTransformCSS (item) {
        const currentRenderer = renderers[item.itemType];

        if (currentRenderer) {
            return currentRenderer.toTransformCSS(item);
        }
    },    

    /**
     * 
     * 렌더링 될 style 태그를 리턴한다. 
     * 
     * @param {Item} item 
     */
    toStyle (item, renderer) {
        const currentRenderer = renderers[item.itemType];

        if (currentRenderer) {
            return currentRenderer.toStyle(item, renderer || this);
        }
    },

    /**
     * 
     * @param {Item} item 
     * @param {Dom} currentElement
     */
    update (item, currentElement) {
        const currentRenderer = renderers[item.itemType];

        if (currentRenderer) {
            return currentRenderer.update(item, currentElement);
        }
    },    

    /**
     * 코드 뷰용 HTML 코드를 렌더링 한다. 
     * @param {Item} item 
     */
    codeview (item) {

        if (!item) {
            return '';
        }

        let svgCode = this.render(item);
        svgCode = svgCode.replace(/\</g, '&lt;').replace(/\>/g, '&gt;') 
    
        return /*html*/`
          <div class='svg-code'>
            ${svgCode && /*html*/`<div><pre title='SVG'>${svgCode}</pre></div>`}
          </div>
        `
    
    }    
}