import MenuItem from "./MenuItem";

import { registElement } from "el/base/registerElement";
import { SUBSCRIBE } from "el/base/Event";
 
export default class AddRect extends MenuItem {
  getIconString() {
    return 'rect';
  }
  getTitle() {
    return this.props.title || "Rect";
  }

  clickButton(e) {
    this.emit('addLayerView', 'rect');
  }

  [SUBSCRIBE('addLayerView')] (type) {
    this.setSelected(type === 'rect');
  }
}

registElement({ AddRect })