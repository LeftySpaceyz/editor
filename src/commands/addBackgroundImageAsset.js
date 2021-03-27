import { BackgroundImage } from "@property-parser/BackgroundImage";
import { STRING_TO_CSS, CSS_TO_STRING } from "@sapa/functions/func";
import { URLImageResource } from "@property-parser/image-resource/URLImageResource";

export default {
    command: 'addBackgroundImageAsset',
    execute: function (editor, url, id = null) {
        
        var items = editor.selection.itemsByIds(id);
        let itemsMap = {} 
        items.forEach(item => {
            let images = BackgroundImage.parseStyle(STRING_TO_CSS(item['background-image']));

            images.unshift(new BackgroundImage({
                image: new URLImageResource({ url })
            }))

            itemsMap[item.id] = {
                'background-image': BackgroundImage.join(images)
            }
        })

        editor.emit('history.setAttributeForMulti', 'add background image', itemsMap);        

    }
}