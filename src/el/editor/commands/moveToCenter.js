import { Editor } from "el/editor/manager/Editor";
import { vec3 } from "gl-matrix";

export default {
    command: 'moveToCenter',

    description: 'Move Layer to Center on Viewport',

    /**
     * 
     * @param {Editor} editor 
     * @param {vec3[]} areaVerties 
     * @param {boolean} withScale    scale 도 같이 조절 할지 정리 
     */
    execute: function (editor, areaVerties, withScale = false) {
        editor.viewport.moveLayerToCenter(areaVerties);
    }

}