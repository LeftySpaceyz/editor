import { getVertiesCenterY } from "el/base/functions/math";
import Sort from "el/editor/manager/Sort";

export default {
    command : 'sort.middle',
    execute: function (editor) {

        if (editor.selection.isOne) {

            const current = editor.selection.current; 

            if (current.parent.is('project')) {
                // 상위 객체가 project 이면 움직이지 않는다. 
            } else if (current.artboard) {
                // 선택된 객체가 하나이고 artboard 가 존재하면 artboard 를 기준으로 잡는다. 
                const distY = getVertiesCenterY(current.artboard.verties()) - getVertiesCenterY(editor.selection.verties);
                editor.emit('moveLayer', 0, distY);
            }

        } else if (editor.selection.isMany) {
            let maxRightY = getVertiesCenterY(editor.selection.verties);

            editor.emit('moveLayerForItems', editor.selection.map(item => {
                let itemRightY = getVertiesCenterY(item.verties());

                return { item, dist: [0, maxRightY - itemRightY, 0, 0]}

            }));            

        }
    }
}