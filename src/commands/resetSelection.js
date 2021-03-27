import { isFunction } from "@sapa/functions/func";

/**
 * reset selecdtion command 
 * 
 * @param {Editor} editor 
 */
export default function resetSelection (editor) {
    editor.emit('setAttribute');
    editor.nextTick(() => {
        editor.emit('refreshSelectionTool');
    })

}